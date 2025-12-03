import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertOrderSchema, 
  insertConsultationSchema, 
  insertMessageSchema,
  insertStudentSchema,
  insertClientSchema,
  insertEnrollmentSchema,
  insertCertificateSchema,
  insertProjectSchema,
  insertEmployeeTaskSchema,
  insertReviewSchema,
  insertNotificationSchema
} from "@shared/schema";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { sendOrderNotificationEmail } from "./email";
import { generateInvoiceHTML, generateInvoicePDF } from "./invoice-generator";
import { setupAuth, hashPassword } from "./auth";
import passport from "passport";

const connectedClients = new Map<string, WebSocket>();

export function broadcastNotification(userId: string, userType: string, notification: any) {
  const clientKey = `${userType}:${userId}`;
  const client = connectedClients.get(clientKey);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({ type: 'notification', data: notification }));
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // PayPal routes
  app.get("/api/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.get("/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/api/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  app.post("/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  // Website specifications submission route removed

  // Website form submission route
  app.post("/api/website-form", async (req, res) => {
    try {
      const formData = req.body;
      
      // Generate HTML/CSS export based on form data
      const htmlContent = generateHtmlFromForm(formData);
      const cssContent = generateCssFromForm(formData);
      
      // Create a comprehensive specification document
      const specification = {
        ...formData,
        htmlTemplate: htmlContent,
        cssTemplate: cssContent,
        timestamp: new Date().toISOString(),
        exportId: `WEB-${Date.now()}`
      };
      
      res.status(201).json({
        success: true,
        specification,
        downloadLinks: {
          html: `/api/download/html/${specification.exportId}`,
          css: `/api/download/css/${specification.exportId}`,
          complete: `/api/download/complete/${specification.exportId}`
        }
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid form data" });
    }
  });



  // Download routes for HTML/CSS exports
  app.get("/api/download/html/:exportId", (req, res) => {
    const { exportId } = req.params;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="website-${exportId}.html"`);
    res.send(generateSampleHtml(exportId));
  });

  app.get("/api/download/css/:exportId", (req, res) => {
    const { exportId } = req.params;
    res.setHeader('Content-Type', 'text/css');
    res.setHeader('Content-Disposition', `attachment; filename="styles-${exportId}.css"`);
    res.send(generateSampleCss(exportId));
  });

  // Orders routes with email notification
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Send email notification to ma3k.2025@gmail.com
      if (orderData.customerEmail && orderData.customerName) {
        const websiteSpecs = req.body.websiteSpecs || null;
        
        await sendOrderNotificationEmail({
          orderNumber: order.id,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone || 'غير متوفر',
          serviceName: orderData.serviceName,
          price: orderData.price,
          paymentStatus: 'pending',
          paymentMethod: orderData.paymentMethod || 'غير محدد',
          websiteSpecs: websiteSpecs
        });
      }
      
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.put("/api/orders/:id/payment", async (req, res) => {
    try {
      const { paymentMethod, paymentStatus } = req.body;
      const order = await storage.updateOrderPayment(req.params.id, paymentMethod, paymentStatus);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Create invoice and send email if payment is completed
      if (paymentStatus === "completed") {
        await storage.createInvoice(req.params.id);
        
        // Send order notification email to ma3k.2025@gmail.com
        try {
          const websiteSpecs = req.body.websiteSpecs;
          await sendOrderNotificationEmail({
            orderNumber: order.id,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            serviceName: order.serviceName,
            price: order.price,
            paymentStatus: "completed",
            paymentMethod: paymentMethod,
            websiteSpecs: websiteSpecs
          });
          console.log('✅ Email notification sent successfully to ma3k.2025@gmail.com');
        } catch (emailError) {
          console.error('❌ Failed to send order notification email:', emailError);
        }
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update payment" });
    }
  });

  // Consultations routes
  app.post("/api/consultations", async (req, res) => {
    try {
      const consultationData = insertConsultationSchema.parse(req.body);
      const consultation = await storage.createConsultation(consultationData);
      res.status(201).json(consultation);
    } catch (error) {
      res.status(400).json({ error: "Invalid consultation data" });
    }
  });

  // Messages routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  // Invoice routes
  app.post("/api/invoices", async (req, res) => {
    try {
      const { orderId, customerName, customerEmail, serviceName, amount } = req.body;
      const invoice = await storage.createInvoice(orderId);
      res.status(201).json(invoice);
    } catch (error) {
      console.error("Invoice creation error:", error);
      res.status(500).json({ error: "Failed to create invoice" });
    }
  });

  app.get("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoice" });
    }
  });

  // Generate and download invoice route
  app.post("/api/generate-invoice", async (req, res) => {
    try {
      const { orderId } = req.body;
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const service = order.serviceId ? await storage.getService(order.serviceId) : undefined;
      const invoiceHTML = generateInvoiceHTML(order, service);
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.html`);
      res.send(invoiceHTML);
    } catch (error) {
      console.error("Invoice generation error:", error);
      res.status(500).json({ error: "Failed to generate invoice" });
    }
  });

  // Invoice download route  
  app.get("/api/invoices/:id/download", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      
      const order = invoice.orderId ? await storage.getOrder(invoice.orderId) : null;
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const invoiceHtml = generateInvoiceHtml(invoice, order);
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.html"`);
      res.send(invoiceHtml);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate invoice download" });
    }
  });

  // Auth routes
  app.post("/api/auth/register-student", async (req, res) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      
      const existingStudent = await storage.getStudentByEmail(studentData.email);
      if (existingStudent) {
        return res.status(400).json({ error: "البريد الإلكتروني مسجل مسبقاً" });
      }
      
      // Hash the password before storing
      const hashedPassword = await hashPassword(studentData.password);
      const studentWithHashedPassword = { ...studentData, password: hashedPassword };
      
      const student = await storage.createStudent(studentWithHashedPassword);
      const { password: _, ...studentWithoutPassword } = student;
      res.status(201).json(studentWithoutPassword);
    } catch (error) {
      console.error('Error registering student:', error);
      res.status(400).json({ error: "بيانات الطالب غير صالحة" });
    }
  });

  app.post("/api/auth/register-client", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      
      const existingClient = await storage.getClientByEmail(clientData.email);
      if (existingClient) {
        return res.status(400).json({ error: "البريد الإلكتروني مسجل مسبقاً" });
      }
      
      // Hash the password before storing
      const hashedPassword = await hashPassword(clientData.password);
      const clientWithHashedPassword = { ...clientData, password: hashedPassword };
      
      const client = await storage.createClient(clientWithHashedPassword);
      const { password: _, ...clientWithoutPassword } = client;
      res.status(201).json(clientWithoutPassword);
    } catch (error) {
      console.error('Error registering client:', error);
      res.status(400).json({ error: "بيانات العميل غير صالحة" });
    }
  });

  // توليد رقم موظف فريد
  async function generateEmployeeNumber(): Promise<string> {
    const employees = await storage.getEmployees();
    const year = new Date().getFullYear();
    const nextNum = employees.length + 1;
    return `EMP-${year}-${String(nextNum).padStart(4, '0')}`;
  }

  // Employee registration endpoint
  app.post("/api/auth/register-employee", async (req, res) => {
    try {
      const { fullName, email, password, position, jobTitle, employeeCode, isAdmin } = req.body;
      
      // التحقق من رمز الموظف (للأمان) - يتم تخزينه في متغير بيئة
      const validEmployeeCode = process.env.EMPLOYEE_REGISTRATION_CODE || "MA3K2024";
      if (!employeeCode || employeeCode !== validEmployeeCode) {
        return res.status(403).json({ error: "رمز الموظف غير صحيح" });
      }
      
      // التحقق من البيانات المطلوبة
      if (!fullName || !email || !password) {
        return res.status(400).json({ error: "جميع الحقول مطلوبة" });
      }
      
      const existingEmployee = await storage.getEmployeeByEmail(email);
      if (existingEmployee) {
        return res.status(400).json({ error: "البريد الإلكتروني مسجل مسبقاً" });
      }
      
      // توليد رقم موظف فريد
      const employeeNumber = await generateEmployeeNumber();
      
      // Hash the password before storing
      const hashedPassword = await hashPassword(password);
      
      const employee = await storage.createEmployee({
        fullName,
        email,
        password: hashedPassword,
        position: position || "موظف",
        jobTitle: jobTitle || "مطور",
        employeeNumber,
        isAdmin: isAdmin || false
      });
      
      const { password: _, ...employeeWithoutPassword } = employee;
      res.status(201).json(employeeWithoutPassword);
    } catch (error) {
      console.error('Error registering employee:', error);
      res.status(400).json({ error: "بيانات الموظف غير صالحة" });
    }
  });

  // مسار إضافة موظف من قبل المدير
  app.post("/api/admin/employees", async (req, res) => {
    try {
      const { adminEmail, fullName, email, password, position, jobTitle, isAdmin } = req.body;
      
      // التحقق من صلاحية المدير
      const admin = await storage.getEmployeeByEmail(adminEmail);
      if (!admin || !admin.isAdmin) {
        return res.status(403).json({ error: "غير مصرح لك بإضافة موظفين" });
      }
      
      // التحقق من البيانات المطلوبة
      if (!fullName || !email || !password) {
        return res.status(400).json({ error: "جميع الحقول مطلوبة" });
      }
      
      const existingEmployee = await storage.getEmployeeByEmail(email);
      if (existingEmployee) {
        return res.status(400).json({ error: "البريد الإلكتروني مسجل مسبقاً" });
      }
      
      // توليد رقم موظف فريد
      const employeeNumber = await generateEmployeeNumber();
      
      // Hash the password before storing
      const hashedPassword = await hashPassword(password);
      
      const employee = await storage.createEmployee({
        fullName,
        email,
        password: hashedPassword,
        position: position || "موظف",
        jobTitle: jobTitle || "مطور",
        employeeNumber,
        isAdmin: isAdmin || false
      });
      
      const { password: _, ...employeeWithoutPassword } = employee;
      res.status(201).json(employeeWithoutPassword);
    } catch (error) {
      console.error('Error adding employee by admin:', error);
      res.status(400).json({ error: "فشل إضافة الموظف" });
    }
  });

  // مسار الحصول على جميع الموظفين (للمدير فقط)
  app.get("/api/admin/employees", async (req, res) => {
    try {
      const adminEmail = req.query.adminEmail as string;
      
      if (!adminEmail) {
        return res.status(400).json({ error: "البريد الإلكتروني للمدير مطلوب" });
      }
      
      const admin = await storage.getEmployeeByEmail(adminEmail);
      if (!admin || !admin.isAdmin) {
        return res.status(403).json({ error: "غير مصرح لك بعرض الموظفين" });
      }
      
      const employees = await storage.getEmployees();
      const employeesWithoutPasswords = employees.map(emp => {
        const { password: _, ...empWithoutPassword } = emp;
        return empWithoutPassword;
      });
      
      res.json(employeesWithoutPasswords);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ error: "فشل جلب الموظفين" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" });
      }

      // Check student
      const student = await storage.getStudentByEmail(email);
      if (student) {
        const isValidPassword = await import('./auth').then(m => m.comparePasswords(password, student.password));
        if (isValidPassword) {
          const { password: _, ...userWithoutPassword } = student;
          return res.json({ user: userWithoutPassword, type: "student" });
        }
      }

      // Check client
      const client = await storage.getClientByEmail(email);
      if (client) {
        const isValidPassword = await import('./auth').then(m => m.comparePasswords(password, client.password));
        if (isValidPassword) {
          const { password: _, ...userWithoutPassword } = client;
          return res.json({ user: userWithoutPassword, type: "client" });
        }
      }

      // Check employee
      const employee = await storage.getEmployeeByEmail(email);
      if (employee) {
        const isValidPassword = await import('./auth').then(m => m.comparePasswords(password, employee.password));
        if (isValidPassword) {
          const { password: _, ...userWithoutPassword } = employee;
          return res.json({ user: userWithoutPassword, type: "employee" });
        }
      }

      res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: "فشل تسجيل الدخول" });
    }
  });

  // Students routes
  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });

  app.get("/api/students/email/:email", async (req, res) => {
    try {
      const student = await storage.getStudentByEmail(req.params.email);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });

  // Clients routes
  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.get("/api/clients/:id/projects", async (req, res) => {
    try {
      const projects = await storage.getClientProjects(req.params.id);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client projects" });
    }
  });

  app.get("/api/clients/:id/orders", async (req, res) => {
    try {
      const orders = await storage.getClientOrders(req.params.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client orders" });
    }
  });

  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  // Employees routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  app.get("/api/employees/:id/tasks", async (req, res) => {
    try {
      const tasks = await storage.getEmployeeTasks(req.params.id);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee tasks" });
    }
  });

  app.put("/api/employees/:id/photo", async (req, res) => {
    try {
      const { photoUrl } = req.body;
      if (!photoUrl) {
        return res.status(400).json({ error: "Photo URL is required" });
      }
      
      const employee = await storage.updateEmployeePhoto(req.params.id, photoUrl);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to update employee photo" });
    }
  });

  // Tasks routes
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { isCompleted, hoursRemaining } = req.body;
      const task = await storage.updateEmployeeTask(req.params.id, isCompleted, hoursRemaining);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  // Courses routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  app.post("/api/courses/enroll", async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error('Error enrolling student:', error);
      res.status(400).json({ error: "Invalid enrollment data" });
    }
  });

  app.get("/api/enrollments/student/:studentId", async (req, res) => {
    try {
      const enrollments = await storage.getStudentEnrollments(req.params.studentId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student enrollments" });
    }
  });

  app.put("/api/enrollments/:id/progress", async (req, res) => {
    try {
      const { progress } = req.body;
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ error: "Invalid progress value (must be 0-100)" });
      }
      const enrollment = await storage.updateEnrollmentProgress(req.params.id, progress);
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update enrollment progress" });
    }
  });

  app.put("/api/enrollments/:id/exam-score", async (req, res) => {
    try {
      const { score } = req.body;
      if (typeof score !== 'number' || score < 0 || score > 100) {
        return res.status(400).json({ error: "Invalid score value (must be 0-100)" });
      }
      const enrollment = await storage.updateEnrollmentExamScore(req.params.id, score);
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update exam score" });
    }
  });

  app.put("/api/enrollments/:id/complete", async (req, res) => {
    try {
      const enrollment = await storage.completeEnrollment(req.params.id);
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: "Failed to complete enrollment" });
    }
  });

  // Certificates routes
  app.get("/api/certificates/number/:certificateNumber", async (req, res) => {
    try {
      const certificate = await storage.getCertificateByNumber(req.params.certificateNumber);
      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }
      res.json(certificate);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch certificate" });
    }
  });

  app.get("/api/certificates/student/:studentId", async (req, res) => {
    try {
      const certificates = await storage.getStudentCertificates(req.params.studentId);
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student certificates" });
    }
  });

  app.post("/api/certificates", async (req, res) => {
    try {
      const certificateData = insertCertificateSchema.parse(req.body);
      const certificate = await storage.createCertificate(certificateData);
      res.status(201).json(certificate);
    } catch (error) {
      console.error('Error creating certificate:', error);
      res.status(400).json({ error: "Invalid certificate data" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.put("/api/projects/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const project = await storage.updateProjectStatus(req.params.id, status);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project status" });
    }
  });

  app.put("/api/projects/:id/idea", async (req, res) => {
    try {
      const { idea } = req.body;
      if (!idea) {
        return res.status(400).json({ error: "Idea is required" });
      }
      
      const project = await storage.updateProjectIdea(req.params.id, idea);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project idea" });
    }
  });

  // Discount codes routes
  app.post("/api/discount-codes/validate", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Discount code is required" });
      }
      
      const discountCode = await storage.validateDiscountCode(code);
      if (!discountCode) {
        return res.status(404).json({ error: "Invalid or expired discount code" });
      }
      res.json(discountCode);
    } catch (error) {
      res.status(500).json({ error: "Failed to validate discount code" });
    }
  });

  // Lessons routes
  app.get("/api/courses/:courseId/lessons", async (req, res) => {
    try {
      const lessons = await storage.getCourseLessons(req.params.courseId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lesson" });
    }
  });

  // Lesson progress routes
  app.post("/api/lesson-progress", async (req, res) => {
    try {
      const { enrollmentId, lessonId, isCompleted } = req.body;
      const progress = await storage.updateLessonProgress(enrollmentId, lessonId, isCompleted);
      res.status(201).json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to update lesson progress" });
    }
  });

  app.get("/api/enrollments/:enrollmentId/progress", async (req, res) => {
    try {
      const progress = await storage.getEnrollmentProgress(req.params.enrollmentId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch enrollment progress" });
    }
  });

  // Quizzes routes
  app.get("/api/lessons/:lessonId/quiz", async (req, res) => {
    try {
      const quiz = await storage.getLessonQuiz(req.params.lessonId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz" });
    }
  });

  app.get("/api/courses/:courseId/final-exam", async (req, res) => {
    try {
      const exam = await storage.getCourseFinalExam(req.params.courseId);
      if (!exam) {
        return res.status(404).json({ error: "Final exam not found" });
      }
      res.json(exam);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch final exam" });
    }
  });

  // Quiz attempts routes
  app.post("/api/quiz-attempts", async (req, res) => {
    try {
      const { enrollmentId, quizId, answers, score, passed } = req.body;
      const attempt = await storage.createQuizAttempt({
        enrollmentId,
        quizId,
        answers,
        score,
        passed
      });
      res.status(201).json(attempt);
    } catch (error) {
      res.status(500).json({ error: "Failed to create quiz attempt" });
    }
  });

  app.get("/api/enrollments/:enrollmentId/quiz-attempts", async (req, res) => {
    try {
      const attempts = await storage.getEnrollmentQuizAttempts(req.params.enrollmentId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz attempts" });
    }
  });

  // Employee Tasks routes
  app.post("/api/employee-tasks", async (req, res) => {
    try {
      const taskData = insertEmployeeTaskSchema.parse(req.body);
      const task = await storage.createEmployeeTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating employee task:', error);
      res.status(400).json({ error: "Invalid employee task data" });
    }
  });

  app.put("/api/employee-tasks/:id", async (req, res) => {
    try {
      const { isCompleted, hoursRemaining } = req.body;
      if (typeof isCompleted !== 'boolean') {
        return res.status(400).json({ error: "isCompleted must be a boolean" });
      }
      
      const task = await storage.updateEmployeeTask(req.params.id, isCompleted, hoursRemaining);
      if (!task) {
        return res.status(404).json({ error: "Employee task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update employee task" });
    }
  });

  // Authentication Routes
  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Student login
  app.post("/api/auth/student/login", (req, res, next) => {
    passport.authenticate('student', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ error: "خطأ في تسجيل الدخول" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "بيانات الدخول غير صحيحة" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "خطأ في إنشاء الجلسة" });
        }
        return res.json({ success: true, user });
      });
    })(req, res, next);
  });

  // Client login
  app.post("/api/auth/client/login", (req, res, next) => {
    passport.authenticate('client', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ error: "خطأ في تسجيل الدخول" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "بيانات الدخول غير صحيحة" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "خطأ في إنشاء الجلسة" });
        }
        return res.json({ success: true, user });
      });
    })(req, res, next);
  });

  // Employee login
  app.post("/api/auth/employee/login", (req, res, next) => {
    passport.authenticate('employee', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ error: "خطأ في تسجيل الدخول" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "بيانات الدخول غير صحيحة" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "خطأ في إنشاء الجلسة" });
        }
        return res.json({ success: true, user });
      });
    })(req, res, next);
  });

  // Reviews Routes
  app.get("/api/reviews/:targetType/:targetId", async (req, res) => {
    try {
      const { targetType, targetId } = req.params;
      const reviews = await storage.getReviews(targetId, targetType);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(400).json({ error: "Invalid review data" });
    }
  });

  app.put("/api/reviews/:id/approve", async (req, res) => {
    try {
      const review = await storage.approveReview(req.params.id);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve review" });
    }
  });

  app.get("/api/reviews/:targetType/:targetId/average", async (req, res) => {
    try {
      const { targetType, targetId } = req.params;
      const average = await storage.getAverageRating(targetId, targetType);
      res.json({ average });
    } catch (error) {
      res.status(500).json({ error: "Failed to get average rating" });
    }
  });

  // Notifications Routes
  app.get("/api/notifications/:userType/:userId", async (req, res) => {
    try {
      const { userType, userId } = req.params;
      const notifications = await storage.getUserNotifications(userId, userType);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      broadcastNotification(notificationData.userId, notificationData.userType, notification);
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(400).json({ error: "Invalid notification data" });
    }
  });

  app.put("/api/notifications/:id/read", async (req, res) => {
    try {
      const notification = await storage.markNotificationAsRead(req.params.id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.put("/api/notifications/:userType/:userId/read-all", async (req, res) => {
    try {
      const { userType, userId } = req.params;
      await storage.markAllNotificationsAsRead(userId, userType);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  app.get("/api/notifications/:userType/:userId/unread-count", async (req, res) => {
    try {
      const { userType, userId } = req.params;
      const count = await storage.getUnreadNotificationCount(userId, userType);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to get unread count" });
    }
  });

  // Dashboard Stats Route
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Invoice PDF Route
  app.get("/api/invoices/:id/pdf", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      if (!invoice.orderId) {
        return res.status(400).json({ error: "Invoice has no associated order" });
      }
      const order = await storage.getOrder(invoice.orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const pdfBuffer = await generateInvoicePDF(invoice, order);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  const httpServer = createServer(app);

  // Setup WebSocket server with noServer to avoid conflicts with Vite HMR
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected');

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'register') {
          const { userId, userType } = message;
          if (userId && userType) {
            connectedClients.set(`${userType}:${userId}`, ws);
            ws.send(JSON.stringify({ type: 'registered', success: true }));
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      connectedClients.forEach((client, key) => {
        if (client === ws) {
          connectedClients.delete(key);
        }
      });
    });
  });

  // Handle WebSocket upgrades only for /ws path
  httpServer.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url || '', 'http://localhost').pathname;
    if (pathname === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
    // Other upgrade requests (like Vite HMR) will be handled by their own handlers
  });

  return httpServer;
}

function generateSpecsEmailContent(specs: any): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; direction: rtl;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 24px;">📋 طلب مواصفات موقع جديد</h1>
        <h2 style="margin: 10px 0; font-size: 20px;">${specs.websiteName}</h2>
        <p style="margin: 5px 0;">رقم الطلب: ${specs.specId}</p>
        <p style="margin: 5px 0;">التاريخ: ${new Date(specs.timestamp).toLocaleDateString('ar-SA')}</p>
      </div>

      <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; border-right: 4px solid #667eea; margin: 20px 0;">
        <h3 style="color: #667eea; margin-top: 0;">🎯 المعلومات الأساسية</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; width: 30%;">اسم الموقع:</td><td style="padding: 8px;">${specs.websiteName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">الغرض:</td><td style="padding: 8px;">${specs.purpose}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">الفكرة:</td><td style="padding: 8px;">${specs.idea}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">الجمهور المستهدف:</td><td style="padding: 8px;">${specs.targetAudience}</td></tr>
        </table>
      </div>

      <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; border-right: 4px solid #667eea; margin: 20px 0;">
        <h3 style="color: #667eea; margin-top: 0;">🎨 التصميم والمظهر</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; width: 30%;">نوع التصميم:</td><td style="padding: 8px;">${specs.designType || 'غير محدد'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">نظام الألوان:</td><td style="padding: 8px;">${specs.colorScheme || 'غير محدد'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">اللغات:</td><td style="padding: 8px;">${specs.languages || 'غير محدد'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">الأجهزة المدعومة:</td><td style="padding: 8px;">${specs.deviceSupport || 'غير محدد'}</td></tr>
        </table>
      </div>

      ${specs.mainSection1 ? `
      <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; border-right: 4px solid #667eea; margin: 20px 0;">
        <h3 style="color: #667eea; margin-top: 0;">📑 الأقسام الرئيسية</h3>
        <ul style="list-style: none; padding: 0;">
          ${specs.mainSection1 ? `<li style="padding: 5px 0;">📄 ${specs.mainSection1}</li>` : ''}
          ${specs.mainSection2 ? `<li style="padding: 5px 0;">📄 ${specs.mainSection2}</li>` : ''}
          ${specs.mainSection3 ? `<li style="padding: 5px 0;">📄 ${specs.mainSection3}</li>` : ''}
          ${specs.mainSection4 ? `<li style="padding: 5px 0;">📄 ${specs.mainSection4}</li>` : ''}
          ${specs.mainSection5 ? `<li style="padding: 5px 0;">📄 ${specs.mainSection5}</li>` : ''}
        </ul>
      </div>
      ` : ''}

      ${specs.mainFunction1 ? `
      <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; border-right: 4px solid #667eea; margin: 20px 0;">
        <h3 style="color: #667eea; margin-top: 0;">⚙️ الوظائف الأساسية</h3>
        <ul style="list-style: none; padding: 0;">
          ${specs.mainFunction1 ? `<li style="padding: 5px 0;">🔧 ${specs.mainFunction1}</li>` : ''}
          ${specs.mainFunction2 ? `<li style="padding: 5px 0;">🔧 ${specs.mainFunction2}</li>` : ''}
          ${specs.mainFunction3 ? `<li style="padding: 5px 0;">🔧 ${specs.mainFunction3}</li>` : ''}
          ${specs.mainFunction4 ? `<li style="padding: 5px 0;">🔧 ${specs.mainFunction4}</li>` : ''}
        </ul>
      </div>
      ` : ''}

      <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; border-right: 4px solid #667eea; margin: 20px 0;">
        <h3 style="color: #667eea; margin-top: 0;">🎯 الأهداف والمتطلبات</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; width: 30%;">الهدف الأساسي:</td><td style="padding: 8px;">${specs.mainGoal1 || 'غير محدد'}</td></tr>
          ${specs.mainGoal2 ? `<tr><td style="padding: 8px; font-weight: bold;">الهدف الثاني:</td><td style="padding: 8px;">${specs.mainGoal2}</td></tr>` : ''}
          ${specs.mainGoal3 ? `<tr><td style="padding: 8px; font-weight: bold;">الهدف الثالث:</td><td style="padding: 8px;">${specs.mainGoal3}</td></tr>` : ''}
          <tr><td style="padding: 8px; font-weight: bold;">الميزانية:</td><td style="padding: 8px;">${specs.budget || 'غير محدد'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">إدارة المحتوى:</td><td style="padding: 8px;">${specs.contentManagement || 'غير محدد'}</td></tr>
        </table>
      </div>

      ${(specs.specialRequirements || specs.competitorWebsites || specs.inspirationSites || specs.additionalNotes) ? `
      <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; border-right: 4px solid #667eea; margin: 20px 0;">
        <h3 style="color: #667eea; margin-top: 0;">📝 معلومات إضافية</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${specs.specialRequirements ? `<tr><td style="padding: 8px; font-weight: bold; width: 30%;">متطلبات خاصة:</td><td style="padding: 8px;">${specs.specialRequirements}</td></tr>` : ''}
          ${specs.competitorWebsites ? `<tr><td style="padding: 8px; font-weight: bold;">مواقع منافسة:</td><td style="padding: 8px;">${specs.competitorWebsites}</td></tr>` : ''}
          ${specs.inspirationSites ? `<tr><td style="padding: 8px; font-weight: bold;">مواقع إلهام:</td><td style="padding: 8px;">${specs.inspirationSites}</td></tr>` : ''}
          ${specs.additionalNotes ? `<tr><td style="padding: 8px; font-weight: bold;">ملاحظات إضافية:</td><td style="padding: 8px;">${specs.additionalNotes}</td></tr>` : ''}
        </table>
      </div>
      ` : ''}

      <div style="background: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 10px; margin-top: 30px;">
        <p style="margin: 5px 0;"><strong>منصة معك للخدمات الرقمية</strong></p>
        <p style="margin: 5px 0;">للتواصل: ma3k.2025@gmail.com | 966532441566</p>
        <p style="margin: 5px 0;">يرجى متابعة الطلب والتواصل مع العميل لبدء العمل</p>
      </div>
    </div>
  `;
}

// Helper functions for HTML/CSS generation
function generateHtmlFromForm(formData: any): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.websiteName || 'موقع جديد'}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>${formData.websiteName || 'اسم الموقع'}</h1>
        <nav>
            <ul>
                <li><a href="#${formData.mainSection1 || 'section1'}">${formData.mainSection1 || 'القسم الأول'}</a></li>
                <li><a href="#${formData.mainSection2 || 'section2'}">${formData.mainSection2 || 'القسم الثاني'}</a></li>
                <li><a href="#${formData.mainSection3 || 'section3'}">${formData.mainSection3 || 'القسم الثالث'}</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="hero">
            <h2>مرحباً بك في ${formData.websiteName || 'موقعنا'}</h2>
            <p>${formData.purpose || 'هدف الموقع'}</p>
        </section>
        
        <section id="${formData.mainSection1 || 'section1'}">
            <h2>${formData.mainSection1 || 'القسم الأول'}</h2>
            <p>محتوى ${formData.mainSection1 || 'القسم الأول'}</p>
        </section>
        
        <section id="${formData.mainSection2 || 'section2'}">
            <h2>${formData.mainSection2 || 'القسم الثاني'}</h2>
            <p>محتوى ${formData.mainSection2 || 'القسم الثاني'}</p>
        </section>
        
        <section id="${formData.mainSection3 || 'section3'}">
            <h2>${formData.mainSection3 || 'القسم الثالث'}</h2>
            <p>محتوى ${formData.mainSection3 || 'القسم الثالث'}</p>
        </section>
    </main>
    
    <footer>
        <p>© 2025 ${formData.websiteName || 'اسم الموقع'}. جميع الحقوق محفوظة.</p>
    </footer>
</body>
</html>`;
}

function generateCssFromForm(formData: any): string {
  const designType = formData.designType || 'modern';
  const primaryColor = designType === 'classic' ? '#2c3e50' : '#3498db';
  
  return `/* تصميم ${formData.websiteName || 'الموقع'} */
/* نوع التصميم: ${designType} */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Tajawal', 'Arial', sans-serif;
    direction: rtl;
    text-align: right;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
}

header {
    background: ${primaryColor};
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

header h1 {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

nav ul {
    display: flex;
    justify-content: center;
    list-style: none;
    gap: 2rem;
}

nav a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: background-color 0.3s;
}

nav a:hover {
    background-color: rgba(255,255,255,0.2);
}

main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

section {
    margin-bottom: 3rem;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

#hero {
    text-align: center;
    background: linear-gradient(135deg, ${primaryColor}, #2980b9);
    color: white;
}

h2 {
    margin-bottom: 1rem;
    color: ${primaryColor};
    font-size: 2rem;
}

#hero h2 {
    color: white;
}

p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
}

footer {
    background: #34495e;
    color: white;
    text-align: center;
    padding: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    nav ul {
        flex-direction: column;
        gap: 1rem;
    }
    
    main {
        padding: 1rem;
    }
    
    header h1 {
        font-size: 2rem;
    }
}

/* ${formData.additionalFeature1 || 'ميزة إضافية'} styles */
.feature-highlight {
    border-right: 4px solid ${primaryColor};
    padding-right: 1rem;
}

/* Target audience: ${formData.targetAudience || 'الجمهور المستهدف'} */
/* Budget range: ${formData.budget || 'الميزانية المحددة'} */
/* Content type: ${formData.contentType || 'نوع المحتوى'} */`;
}

function generateSampleHtml(exportId: string): string {
  return generateHtmlFromForm({ 
    websiteName: `موقع-${exportId}`,
    mainSection1: 'الرئيسية',
    mainSection2: 'الخدمات', 
    mainSection3: 'تواصل معنا',
    purpose: 'موقع احترافي'
  });
}

function generateSampleCss(exportId: string): string {
  return generateCssFromForm({ 
    designType: 'modern',
    websiteName: `موقع-${exportId}`
  });
}

function generateInvoiceHtml(invoice: any, order: any): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة رقم ${invoice.invoiceNumber}</title>
    <style>
        body {
            font-family: 'Tajawal', Arial, sans-serif;
            direction: rtl;
            text-align: right;
            margin: 0;
            padding: 20px;
            background: #f8f9fa;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .logo {
            font-size: 2rem;
            font-weight: bold;
            color: #f59e0b;
            margin-bottom: 10px;
        }
        .invoice-title {
            font-size: 1.8rem;
            color: #333;
            margin: 20px 0;
        }
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .info-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            flex: 1;
            margin: 0 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: right;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f59e0b;
            color: white;
        }
        .total-row {
            font-weight: bold;
            background-color: #f8f9fa;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="logo">معك</div>
            <h1 class="invoice-title">فاتورة ضريبية</h1>
            <p>رقم الفاتورة: ${invoice.invoiceNumber}</p>
            <p>تاريخ الإصدار: ${new Date(invoice.createdAt).toLocaleDateString('ar-SA')}</p>
        </div>
        
        <div class="info-section">
            <div class="info-box">
                <h3>معلومات العميل</h3>
                <p><strong>الاسم:</strong> ${order.customerName}</p>
                <p><strong>البريد الإلكتروني:</strong> ${order.customerEmail}</p>
                <p><strong>الهاتف:</strong> ${order.customerPhone || 'غير محدد'}</p>
            </div>
            <div class="info-box">
                <h3>معلومات الشركة</h3>
                <p><strong>معك للخدمات الرقمية</strong></p>
                <p>البريد: ma3k.2025@gmail.com</p>
                <p>الهاتف: 966532441566</p>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>الخدمة</th>
                    <th>الوصف</th>
                    <th>السعر</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${order.serviceName}</td>
                    <td>${order.description || 'خدمات رقمية متخصصة'}</td>
                    <td>${order.price} ر.س</td>
                </tr>
                <tr class="total-row">
                    <td colspan="2"><strong>المجموع الكلي</strong></td>
                    <td><strong>${invoice.amount} ر.س</strong></td>
                </tr>
            </tbody>
        </table>
        
        <div class="footer">
            <p>شكراً لاختياركم خدماتنا</p>
            <p>معك - نُصمم أحلامك الرقمية</p>
            <p>رقم الطلب: ${order.orderNumber}</p>
        </div>
    </div>
</body>
</html>`;
}
