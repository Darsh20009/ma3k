import {
  type User, type InsertUser, type Service, type InsertService,
  type Order, type InsertOrder, type Consultation, type InsertConsultation,
  type Message, type InsertMessage, type Invoice,
  type Student, type InsertStudent, type Client, type InsertClient,
  type Employee, type InsertEmployee, type Course, type InsertCourse,
  type Enrollment, type InsertEnrollment, type Certificate, type InsertCertificate,
  type Project, type InsertProject, type DiscountCode, type InsertDiscountCode,
  type EmployeeTask, type InsertEmployeeTask,
  type Lesson, type LessonProgress, type Quiz, type QuizAttempt, type InsertQuizAttempt
} from "@shared/schema";
import { randomUUID } from "crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  updateOrderPayment(id: string, paymentMethod: string, paymentStatus: string): Promise<Order | undefined>;

  // Invoices
  createInvoice(orderId: string): Promise<Invoice>;
  getInvoice(id: string): Promise<Invoice | undefined>;

  // Consultations
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  getConsultations(): Promise<Consultation[]>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;

  // Students
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByEmail(email: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudentFreeCourses(id: string, count: number): Promise<Student | undefined>;

  // Clients
  getClient(id: string): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;

  // Employees
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployeeByEmail(email: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployeePhoto(id: string, photoUrl: string): Promise<Employee | undefined>;

  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Lessons
  getCourseLessons(courseId: string): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;

  // Lesson Progress
  updateLessonProgress(enrollmentId: string, lessonId: string, isCompleted: boolean): Promise<LessonProgress>;
  getEnrollmentProgress(enrollmentId: string): Promise<LessonProgress[]>;

  // Quizzes
  getLessonQuiz(lessonId: string): Promise<Quiz | undefined>;
  getCourseFinalExam(courseId: string): Promise<Quiz | undefined>;

  // Quiz Attempts
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getEnrollmentQuizAttempts(enrollmentId: string): Promise<QuizAttempt[]>;

  // Enrollments
  getEnrollment(id: string): Promise<Enrollment | undefined>;
  getStudentEnrollments(studentId: string): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentProgress(id: string, progress: number): Promise<Enrollment | undefined>;
  updateEnrollmentExamScore(id: string, score: number): Promise<Enrollment | undefined>;
  completeEnrollment(id: string): Promise<Enrollment | undefined>;

  // Certificates
  getCertificate(id: string): Promise<Certificate | undefined>;
  getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined>;
  getStudentCertificates(studentId: string): Promise<Certificate[]>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  approveCertificate(id: string, approvedBy: string): Promise<Certificate | undefined>;

  // Projects
  getProject(id: string): Promise<Project | undefined>;
  getClientProjects(clientId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProjectStatus(id: string, status: string): Promise<Project | undefined>;
  updateProjectIdea(id: string, idea: string): Promise<Project | undefined>;

  // Discount Codes
  getDiscountCode(code: string): Promise<DiscountCode | undefined>;
  validateDiscountCode(code: string): Promise<DiscountCode | undefined>;

  // Employee Tasks
  getEmployeeTasks(employeeId: string): Promise<EmployeeTask[]>;
  createEmployeeTask(task: InsertEmployeeTask): Promise<EmployeeTask>;
  updateEmployeeTask(id: string, isCompleted: boolean, hoursRemaining?: number): Promise<EmployeeTask | undefined>;
}

export class JsonStorage implements IStorage {
  private dataDir = join(process.cwd(), 'data');
  private users: Map<string, User> = new Map();
  private services: Map<string, Service> = new Map();
  private orders: Map<string, Order> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private consultations: Map<string, Consultation> = new Map();
  private messages: Map<string, Message> = new Map();
  private students: Map<string, Student> = new Map();
  private clients: Map<string, Client> = new Map();
  private employees: Map<string, Employee> = new Map();
  private courses: Map<string, Course> = new Map();
  private enrollments: Map<string, Enrollment> = new Map();
  private certificates: Map<string, Certificate> = new Map();
  private projects: Map<string, Project> = new Map();
  private discountCodes: Map<string, DiscountCode> = new Map();
  private employeeTasks: Map<string, EmployeeTask> = new Map();
  private lessons: Map<string, Lesson> = new Map();
  private lessonProgress: Map<string, LessonProgress> = new Map();
  private quizzes: Map<string, Quiz> = new Map();
  private quizAttempts: Map<string, QuizAttempt> = new Map();

  constructor() {
    this.ensureDataDir();
    this.loadData();
    this.initializeServices();
    this.initializeDiscountCodes();
    this.initializeYoussefStudent();
    this.initializeQodratakClient();
  }

  private initializeQodratakClient() {
    // إنشاء حساب العميل
    const clientId = "client-qodratak";
    const clientEmail = "qoudratak@gmail.com";

    // التحقق من عدم وجود العميل مسبقاً
    const existingClient = Array.from(this.clients.values()).find(
      c => c.email === clientEmail
    );

    if (!existingClient) {
      const client: Client = {
        id: clientId,
        fullName: "قدراتك",
        email: clientEmail,
        phone: null,
        password: "182009",
        websiteType: "منصة تعليمية",
        budget: "2999",
        websiteIdea: "منصة تعليمية تفاعلية",
        createdAt: new Date(),
      };
      this.clients.set(clientId, client);
      this.saveClients();
      console.log('✅ Client account created for Qodratak');
    }

    // إنشاء طلب المنصة التعليمية
    const existingOrder = Array.from(this.orders.values()).find(
      o => o.customerEmail === clientEmail && o.serviceName.includes("منصة تعليمية")
    );

    let orderId = existingOrder?.id;

    if (!existingOrder) {
      orderId = randomUUID();
      const orderNumber = `ORD-${Date.now()}`;
      const order = {
        id: orderId,
        orderNumber: orderNumber,
        customerName: "قدراتك",
        customerEmail: clientEmail,
        customerPhone: "+966532441566",
        serviceId: "comp-5",
        serviceName: "منصة تعليمية تفاعلية",
        price: 2999,
        description: "منصة تعليمية متكاملة - قدراتك",
        paymentMethod: "bank_transfer",
        status: "completed",
        paymentStatus: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.orders.set(orderId, order);
      this.saveOrders();
      console.log('✅ Order created for Qodratak platform');
    }

    // إنشاء مشروع المنصة
    const existingProject = Array.from(this.projects.values()).find(
      p => p.clientId === clientId
    );

    if (!existingProject && orderId) {
      const projectId = randomUUID();
      const project: Project = {
        id: projectId,
        clientId: clientId,
        orderId: orderId,
        projectName: "منصة قدراتك التعليمية",
        websiteIdea: "منصة تعليمية تفاعلية متكاملة مع كورسات وامتحانات وشهادات",
        status: "completed",
        daysRemaining: 0,
        targetDate: new Date(),
        domain: "www.qodratak.site",
        email: clientEmail,
        toolsUsed: ["React", "TypeScript", "Node.js", "Express"],
        assignedEmployees: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.projects.set(projectId, project);
      this.saveProjects();
      console.log('✅ Project created for Qodratak platform');
    }
  }

  private initializeYoussefStudent() {
    // إنشاء حساب الطالب
    const studentId = "student-youssef-darwish";
    const studentEmail = "youssefdarwish20009@gmail.com";

    // التحقق من عدم وجود الطالب مسبقاً
    const existingStudent = Array.from(this.students.values()).find(
      s => s.email === studentEmail
    );

    if (!existingStudent) {
      const student: Student = {
        id: studentId,
        fullName: "Youssef Darwish",
        email: studentEmail,
        phone: "",
        password: "182009",
        age: 16,
        selectedLanguage: "java",
        learningGoal: null,
        freeCoursesTaken: 0,
        createdAt: new Date(),
      };
      this.students.set(studentId, student);
      this.saveStudents();
      console.log('✅ Student account created for Youssef Darwish');
    }

    // إيجاد كورسات Java و Back-End
    const javaCourse = Array.from(this.courses.values()).find(
      c => c.name.toLowerCase().includes('java') || c.language?.toLowerCase() === 'java'
    );

    const backendCourse = Array.from(this.courses.values()).find(
      c => c.name.toLowerCase().includes('back') || c.name.toLowerCase().includes('backend')
    );

    // تسجيل الطالب في كورس Java
    if (javaCourse) {
      const javaEnrollmentId = `enrollment-${studentId}-java`;
      const existingJavaEnrollment = this.enrollments.get(javaEnrollmentId);

      if (!existingJavaEnrollment) {
        const javaEnrollment = {
          id: javaEnrollmentId,
          studentId: studentId,
          courseId: javaCourse.id,
          progress: 0,
          status: "active" as const,
          quizScores: null,
          finalExamScore: null,
          enrolledAt: new Date(),
          completedAt: null,
        };
        this.enrollments.set(javaEnrollmentId, javaEnrollment);
        console.log('✅ Enrolled in Java course');
      }
    }

    // تسجيل الطالب في كورس Back-End
    if (backendCourse) {
      const backendEnrollmentId = `enrollment-${studentId}-backend`;
      const existingBackendEnrollment = this.enrollments.get(backendEnrollmentId);

      if (!existingBackendEnrollment) {
        const backendEnrollment = {
          id: backendEnrollmentId,
          studentId: studentId,
          courseId: backendCourse.id,
          progress: 0,
          status: "active" as const,
          quizScores: null,
          finalExamScore: null,
          enrolledAt: new Date(),
          completedAt: null,
        };
        this.enrollments.set(backendEnrollmentId, backendEnrollment);
        console.log('✅ Enrolled in Back-End course');
      }
    }

    this.saveEnrollments();
  }

  private ensureDataDir() {
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private loadData() {
    this.loadUsers();
    this.loadServices();
    this.loadOrders();
    this.loadInvoices();
    this.loadConsultations();
    this.loadMessages();
    this.loadStudents();
    this.loadClients();
    this.loadEmployees();
    this.loadCourses();
    this.loadEnrollments();
    this.loadCertificates();
    this.loadProjects();
    this.loadDiscountCodes();
    this.loadEmployeeTasks();
    this.loadLessons();
    this.loadLessonProgress();
    this.loadQuizzes();
    this.loadQuizAttempts();
  }

  private loadUsers() {
    const filePath = join(this.dataDir, 'users.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((user: User) => this.users.set(user.id, user));
    }
  }

  private loadServices() {
    const filePath = join(this.dataDir, 'services.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((service: Service) => this.services.set(service.id, service));
    }
  }

  private loadOrders() {
    const filePath = join(this.dataDir, 'orders.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((order: Order) => {
        if (order.createdAt) order.createdAt = new Date(order.createdAt);
        if (order.updatedAt) order.updatedAt = new Date(order.updatedAt);
        this.orders.set(order.id, order);
      });
    }
  }

  private loadInvoices() {
    const filePath = join(this.dataDir, 'invoices.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((invoice: Invoice) => {
        if (invoice.createdAt) invoice.createdAt = new Date(invoice.createdAt);
        this.invoices.set(invoice.id, invoice);
      });
    }
  }

  private loadConsultations() {
    const filePath = join(this.dataDir, 'consultations.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((consultation: Consultation) => {
        if (consultation.createdAt) consultation.createdAt = new Date(consultation.createdAt);
        this.consultations.set(consultation.id, consultation);
      });
    }
  }

  private loadMessages() {
    const filePath = join(this.dataDir, 'messages.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((message: Message) => {
        if (message.createdAt) message.createdAt = new Date(message.createdAt);
        this.messages.set(message.id, message);
      });
    }
  }

  private loadStudents() {
    const filePath = join(this.dataDir, 'students.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((student: Student) => {
        if (student.createdAt) student.createdAt = new Date(student.createdAt);
        this.students.set(student.id, student);
      });
    }
  }

  private loadClients() {
    const filePath = join(this.dataDir, 'clients.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((client: Client) => {
        if (client.createdAt) client.createdAt = new Date(client.createdAt);
        this.clients.set(client.id, client);
      });
    }
  }

  private loadEmployees() {
    const filePath = join(this.dataDir, 'employees.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((employee: Employee) => {
        if (employee.createdAt) employee.createdAt = new Date(employee.createdAt);
        this.employees.set(employee.id, employee);
      });
    }
  }

  private loadCourses() {
    const filePath = join(this.dataDir, 'courses.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((course: Course) => {
        if (course.createdAt) course.createdAt = new Date(course.createdAt);
        this.courses.set(course.id, course);
      });
    }
  }

  private loadEnrollments() {
    const filePath = join(this.dataDir, 'enrollments.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((enrollment: Enrollment) => {
        if (enrollment.enrolledAt) enrollment.enrolledAt = new Date(enrollment.enrolledAt);
        if (enrollment.completedAt) enrollment.completedAt = new Date(enrollment.completedAt);
        this.enrollments.set(enrollment.id, enrollment);
      });
    }
  }

  private loadCertificates() {
    const filePath = join(this.dataDir, 'certificates.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((certificate: Certificate) => {
        if (certificate.issuedAt) certificate.issuedAt = new Date(certificate.issuedAt);
        if (certificate.approvedAt) certificate.approvedAt = new Date(certificate.approvedAt);
        this.certificates.set(certificate.id, certificate);
      });
    }
  }

  private loadProjects() {
    const filePath = join(this.dataDir, 'projects.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((project: Project) => {
        if (project.createdAt) project.createdAt = new Date(project.createdAt);
        if (project.updatedAt) project.updatedAt = new Date(project.updatedAt);
        if (project.targetDate) project.targetDate = new Date(project.targetDate);
        this.projects.set(project.id, project);
      });
    }
  }

  private loadDiscountCodes() {
    const filePath = join(this.dataDir, 'discountCodes.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((discountCode: DiscountCode) => {
        if (discountCode.createdAt) discountCode.createdAt = new Date(discountCode.createdAt);
        if (discountCode.expiresAt) discountCode.expiresAt = new Date(discountCode.expiresAt);
        this.discountCodes.set(discountCode.id, discountCode);
      });
    }
  }

  private loadEmployeeTasks() {
    const filePath = join(this.dataDir, 'employeeTasks.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((task: EmployeeTask) => {
        if (task.createdAt) task.createdAt = new Date(task.createdAt);
        if (task.updatedAt) task.updatedAt = new Date(task.updatedAt);
        this.employeeTasks.set(task.id, task);
      });
    }
  }

  private loadLessons() {
    const filePath = join(this.dataDir, 'lessons.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((lesson: Lesson) => {
        if (lesson.createdAt) lesson.createdAt = new Date(lesson.createdAt);
        this.lessons.set(lesson.id, lesson);
      });
    }
  }

  private loadLessonProgress() {
    const filePath = join(this.dataDir, 'lessonProgress.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((progress: LessonProgress) => {
        if (progress.createdAt) progress.createdAt = new Date(progress.createdAt);
        if (progress.completedAt) progress.completedAt = new Date(progress.completedAt);
        this.lessonProgress.set(progress.id, progress);
      });
    }
  }

  private loadQuizzes() {
    const filePath = join(this.dataDir, 'quizzes.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((quiz: Quiz) => {
        if (quiz.createdAt) quiz.createdAt = new Date(quiz.createdAt);
        this.quizzes.set(quiz.id, quiz);
      });
    }
  }

  private loadQuizAttempts() {
    const filePath = join(this.dataDir, 'quizAttempts.json');
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      data.forEach((attempt: QuizAttempt) => {
        if (attempt.completedAt) attempt.completedAt = new Date(attempt.completedAt);
        this.quizAttempts.set(attempt.id, attempt);
      });
    }
  }

  private saveUsers() {
    const data = Array.from(this.users.values());
    writeFileSync(join(this.dataDir, 'users.json'), JSON.stringify(data, null, 2));
  }

  private saveServices() {
    const data = Array.from(this.services.values());
    writeFileSync(join(this.dataDir, 'services.json'), JSON.stringify(data, null, 2));
  }

  private saveOrders() {
    const data = Array.from(this.orders.values());
    writeFileSync(join(this.dataDir, 'orders.json'), JSON.stringify(data, null, 2));
  }

  private saveInvoices() {
    const data = Array.from(this.invoices.values());
    writeFileSync(join(this.dataDir, 'invoices.json'), JSON.stringify(data, null, 2));
  }

  private saveConsultations() {
    const data = Array.from(this.consultations.values());
    writeFileSync(join(this.dataDir, 'consultations.json'), JSON.stringify(data, null, 2));
  }

  private saveMessages() {
    const data = Array.from(this.messages.values());
    writeFileSync(join(this.dataDir, 'messages.json'), JSON.stringify(data, null, 2));
  }

  private saveStudents() {
    const data = Array.from(this.students.values());
    writeFileSync(join(this.dataDir, 'students.json'), JSON.stringify(data, null, 2));
  }

  private saveClients() {
    const data = Array.from(this.clients.values());
    writeFileSync(join(this.dataDir, 'clients.json'), JSON.stringify(data, null, 2));
  }

  private saveEmployees() {
    const data = Array.from(this.employees.values());
    writeFileSync(join(this.dataDir, 'employees.json'), JSON.stringify(data, null, 2));
  }

  private saveCourses() {
    const data = Array.from(this.courses.values());
    writeFileSync(join(this.dataDir, 'courses.json'), JSON.stringify(data, null, 2));
  }

  private saveEnrollments() {
    const data = Array.from(this.enrollments.values());
    writeFileSync(join(this.dataDir, 'enrollments.json'), JSON.stringify(data, null, 2));
  }

  private saveCertificates() {
    const data = Array.from(this.certificates.values());
    writeFileSync(join(this.dataDir, 'certificates.json'), JSON.stringify(data, null, 2));
  }

  private saveProjects() {
    const data = Array.from(this.projects.values());
    writeFileSync(join(this.dataDir, 'projects.json'), JSON.stringify(data, null, 2));
  }

  private saveDiscountCodes() {
    const data = Array.from(this.discountCodes.values());
    writeFileSync(join(this.dataDir, 'discountCodes.json'), JSON.stringify(data, null, 2));
  }

  private saveEmployeeTasks() {
    const data = Array.from(this.employeeTasks.values());
    writeFileSync(join(this.dataDir, 'employeeTasks.json'), JSON.stringify(data, null, 2));
  }

  private saveLessons() {
    const data = Array.from(this.lessons.values());
    writeFileSync(join(this.dataDir, 'lessons.json'), JSON.stringify(data, null, 2));
  }

  private saveLessonProgress() {
    const data = Array.from(this.lessonProgress.values());
    writeFileSync(join(this.dataDir, 'lessonProgress.json'), JSON.stringify(data, null, 2));
  }

  private saveQuizzes() {
    const data = Array.from(this.quizzes.values());
    writeFileSync(join(this.dataDir, 'quizzes.json'), JSON.stringify(data, null, 2));
  }

  private saveQuizAttempts() {
    const data = Array.from(this.quizAttempts.values());
    writeFileSync(join(this.dataDir, 'quizAttempts.json'), JSON.stringify(data, null, 2));
  }

  private initializeServices() {
    const defaultServices: Service[] = [
      // خدمات الأفراد
      {
        id: "ind-1",
        name: "موقع شخصي أساسي",
        description: "موقع شخصي بسيط مع تصميم نظيف وسهل الاستخدام - مثالي لعرض السيرة الذاتية والأعمال الشخصية",
        price: 299,
        originalPrice: 500,
        category: "individuals",
        subcategory: "personal-websites",
        features: ["تصميم متجاوب", "5 صفحات أساسية", "دعم لمدة شهر", "سهولة التحديث"],
        isActive: true,
        isFeatured: true,
      },
      {
        id: "ind-2",
        name: "تطبيق شخصي محترف",
        description: "تطبيق شخصي محترف مع خصائص متقدمة وتصميم عصري للمحترفين والفنانين",
        price: 599,
        originalPrice: 900,
        category: "individuals",
        subcategory: "personal-apps",
        features: ["تطبيق ويب كامل", "لوحة تحكم شخصية", "معرض أعمال", "دعم لـ 3 أشهر"],
        isActive: true,
        isFeatured: false,
      },
      {
        id: "ind-3",
        name: "متجر شخصي بسيط",
        description: "متجر إلكتروني بسيط لبيع المنتجات الشخصية أو الحرفية بأسعار منافسة",
        price: 449,
        originalPrice: 700,
        category: "individuals",
        subcategory: "personal-store",
        features: ["نظام دفع مدمج", "إدارة المنتجات", "تتبع الطلبات", "دعم لمدة شهرين"],
        isActive: true,
        isFeatured: true,
      },

      // خدمات المطاعم
      {
        id: "rest-1",
        name: "منيو احترافي مع الدفع",
        description: "منيو إلكتروني احترافي للمطاعم يشمل نظام الطلبات والدفع الإلكتروني",
        price: 300,
        originalPrice: 1230,
        category: "restaurants",
        subcategory: "menu-with-payment",
        features: ["منيو تفاعلي", "نظام طلبات", "دفع إلكتروني", "تتبع الطلبات", "تقارير المبيعات"],
        isActive: true,
        isFeatured: true,
      },
      {
        id: "rest-2", 
        name: "منيو احترافي بدون دفع",
        description: "منيو إلكتروني أنيق وبسيط لعرض قائمة الطعام والأسعار فقط",
        price: 50,
        originalPrice: 199,
        category: "restaurants",
        subcategory: "menu-only",
        features: ["منيو تفاعلي", "تصميم أنيق", "متجاوب مع الجوال", "سهل التحديث"],
        isActive: true,
        isFeatured: true,
      },
      {
        id: "rest-3",
        name: "موقع متكامل للمطعم أو كافيه",
        description: "موقع شامل للمطاعم والكافيهات يشمل التوصيل والدفع وجميع الخدمات",
        price: 2999,
        originalPrice: 5000,
        category: "restaurants",
        subcategory: "full-restaurant",
        features: ["منيو كامل", "نظام توصيل", "إدارة الطاولات", "نظام الولاء", "تطبيق جوال", "لوحة تحكم إدارية", "دعم لمدة 6 أشهر"],
        isActive: true,
        isFeatured: true,
      },
      {
        id: "rest-4",
        name: "نظام حجز الطاولات",
        description: "نظام ذكي لحجز الطاولات مع إدارة المواعيد والإشعارات",
        price: 399,
        originalPrice: 600,
        category: "restaurants",
        subcategory: "reservations",
        features: ["حجز الطاولات", "تقويم المواعيد", "إشعارات SMS", "دعم لمدة شهرين"],
        isActive: true,
        isFeatured: false,
      },

      // خدمات الشركات  
      {
        id: "comp-1",
        name: "موقع شركة احترافي",
        description: "موقع شركة احترافي بتصميم عصري ومتجاوب مع جميع المزايا التجارية",
        price: 799,
        originalPrice: 1200,
        category: "companies",
        subcategory: "corporate-website",
        features: ["تصميم احترافي", "10+ صفحات", "نموذج اتصال", "تحسين SEO", "دعم لـ 3 أشهر"],
        isActive: true,
        isFeatured: true,
      },
      {
        id: "comp-2",
        name: "متجر إلكتروني شامل",
        description: "متجر إلكتروني متكامل للشركات مع جميع المزايا التجارية المتقدمة",
        price: 1499,
        originalPrice: 2500,
        category: "companies",
        subcategory: "ecommerce",
        features: ["متجر كامل", "إدارة المخزون", "أنظمة دفع متعددة", "تقارير مفصلة", "دعم لـ 6 أشهر"],
        isActive: true,
        isFeatured: true,
      },
      {
        id: "comp-3",
        name: "نظام إدارة العملاء CRM",
        description: "نظام متكامل لإدارة علاقات العملاء مع تتبع المبيعات والمتابعة",
        price: 999,
        originalPrice: 1800,
        category: "companies",
        subcategory: "crm-system",
        features: ["إدارة العملاء", "تتبع المبيعات", "تقارير تحليلية", "نظام المهام", "دعم لـ 4 أشهر"],
        isActive: true,
        isFeatured: false,
      },
      {
        id: "comp-4",
        name: "تطبيق أعمال متقدم",
        description: "تطبيق أعمال متقدم مع خصائص إدارية شاملة ولوحة تحكم متطورة",
        price: 1999,
        originalPrice: 3500,
        category: "companies",
        subcategory: "business-app",
        features: ["تطبيق ويب متقدم", "لوحة إدارية", "نظام المستخدمين", "تقارير شاملة", "دعم لـ 6 أشهر"],
        isActive: true,
        isFeatured: false,
      },
      {
        id: "comp-5",
        name: "منصة تعليمية تفاعلية",
        description: "منصة تعليمية متكاملة مع كورسات وامتحانات وشهادات",
        price: 2299,
        originalPrice: 4000,
        category: "companies",
        subcategory: "learning-platform",
        features: ["منصة تعليمية", "إدارة الكورسات", "نظام امتحانات", "شهادات", "دعم لـ 6 أشهر"],
        isActive: true,
        isFeatured: true,
      },

      // خدمات تقنية إضافية
      {
        id: "tech-1",
        name: "تصميم شعار احترافي",
        description: "تصميم شعار احترافي مميز مع ملفات متعددة الصيغ",
        price: 99,
        originalPrice: 200,
        category: "companies",
        subcategory: "branding",
        features: ["3 تصاميم مختلفة", "ملفات عالية الجودة", "جميع الصيغ", "دعم لمدة شهر"],
        isActive: true,
        isFeatured: false,
      },
      {
        id: "tech-2",
        name: "خدمة تحسين الأداء والسرعة",
        description: "تحسين سرعة المواقع وتحسين الأداء لتجربة مستخدم أفضل",
        price: 199,
        originalPrice: 400,
        category: "companies",
        subcategory: "optimization",
        features: ["تحسين السرعة", "ضغط الصور", "تحسين الكود", "تقرير شامل"],
        isActive: true,
        isFeatured: false,
      },
    ];

    defaultServices.forEach(service => {
      this.services.set(service.id, service);
    });
  }

  private initializeDiscountCodes() {
    if (this.discountCodes.size === 0) {
      const defaultDiscountCode: DiscountCode = {
        id: randomUUID(),
        code: "MA3K2030",
        discountPercentage: 100,
        isActive: true,
        expiresAt: null,
        createdAt: new Date(),
      };
      this.discountCodes.set(defaultDiscountCode.id, defaultDiscountCode);
      this.saveDiscountCodes();
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    this.saveUsers();
    return user;
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.isActive);
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { ...insertService, id, originalPrice: insertService.originalPrice || null, subcategory: insertService.subcategory || null, features: insertService.features || null, isActive: insertService.isActive !== undefined ? insertService.isActive : true, isFeatured: insertService.isFeatured !== undefined ? insertService.isFeatured : false };
    this.services.set(id, service);
    this.saveServices();
    return service;
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(order => order.orderNumber === orderNumber);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const orderNumber = `ORD-${Date.now()}`;
    const order: Order = {
      ...insertOrder,
      id,
      orderNumber,
      serviceId: insertOrder.serviceId || null,
      description: insertOrder.description || null,
      paymentMethod: insertOrder.paymentMethod || null,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    this.saveOrders();
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status, updatedAt: new Date() };
      this.orders.set(id, updatedOrder);
      this.saveOrders();
      return updatedOrder;
    }
    return undefined;
  }

  async updateOrderPayment(id: string, paymentMethod: string, paymentStatus: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, paymentMethod, paymentStatus, updatedAt: new Date() };
      this.orders.set(id, updatedOrder);
      this.saveOrders();
      return updatedOrder;
    }
    return undefined;
  }

  async createInvoice(orderId: string): Promise<Invoice> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const id = randomUUID();
    const invoiceNumber = `INV-${Date.now()}`;
    const invoice: Invoice = {
      id,
      invoiceNumber,
      orderId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      serviceName: order.serviceName,
      amount: order.price,
      createdAt: new Date(),
    };
    this.invoices.set(id, invoice);
    this.saveInvoices();
    return invoice;
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = randomUUID();
    const consultation: Consultation = {
      ...insertConsultation,
      id,
      projectType: insertConsultation.projectType || null,
      status: "pending",
      createdAt: new Date(),
    };
    this.consultations.set(id, consultation);
    this.saveConsultations();
    return consultation;
  }

  async getConsultations(): Promise<Consultation[]> {
    return Array.from(this.consultations.values());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = { ...insertMessage, id, phone: insertMessage.phone || null, status: "pending", createdAt: new Date() };
    this.messages.set(id, message);
    this.saveMessages();
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async getStudent(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(
      (student) => student.email === email,
    );
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const student: Student = {
      ...insertStudent,
      id,
      learningGoal: insertStudent.learningGoal || null,
      freeCoursesTaken: 0,
      createdAt: new Date(),
    };
    this.students.set(id, student);
    this.saveStudents();
    return student;
  }

  async updateStudentFreeCourses(id: string, count: number): Promise<Student | undefined> {
    const student = this.students.get(id);
    if (student) {
      const updatedStudent = { ...student, freeCoursesTaken: count };
      this.students.set(id, updatedStudent);
      this.saveStudents();
      return updatedStudent;
    }
    return undefined;
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find(
      (client) => client.email === email,
    );
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = {
      ...insertClient,
      id,
      phone: insertClient.phone || null,
      websiteType: insertClient.websiteType || null,
      budget: insertClient.budget || null,
      websiteIdea: insertClient.websiteIdea || null,
      createdAt: new Date(),
    };
    this.clients.set(id, client);
    this.saveClients();
    return client;
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeByEmail(email: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(
      (employee) => employee.email === email,
    );
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = randomUUID();
    const employee: Employee = {
      ...insertEmployee,
      id,
      photoUrl: insertEmployee.photoUrl || null,
      createdAt: new Date(),
    };
    this.employees.set(id, employee);
    this.saveEmployees();
    return employee;
  }

  async updateEmployeePhoto(id: string, photoUrl: string): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (employee) {
      const updatedEmployee = { ...employee, photoUrl };
      this.employees.set(id, updatedEmployee);
      this.saveEmployees();
      return updatedEmployee;
    }
    return undefined;
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.isActive);
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = {
      ...insertCourse,
      id,
      price: insertCourse.price !== undefined ? insertCourse.price : 0,
      originalPrice: insertCourse.originalPrice || null,
      isFree: insertCourse.isFree !== undefined ? insertCourse.isFree : true,
      content: insertCourse.content || null,
      isActive: insertCourse.isActive !== undefined ? insertCourse.isActive : true,
      createdAt: new Date(),
    };
    this.courses.set(id, course);
    this.saveCourses();
    return course;
  }

  async getEnrollment(id: string): Promise<Enrollment | undefined> {
    return this.enrollments.get(id);
  }

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.studentId === studentId,
    );
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = randomUUID();
    const enrollment: Enrollment = {
      ...insertEnrollment,
      id,
      progress: 0,
      status: "active",
      quizScores: null,
      finalExamScore: null,
      enrolledAt: new Date(),
      completedAt: null,
    };
    this.enrollments.set(id, enrollment);
    this.saveEnrollments();
    return enrollment;
  }

  async updateEnrollmentProgress(id: string, progress: number): Promise<Enrollment | undefined> {
    const enrollment = this.enrollments.get(id);
    if (enrollment) {
      const updatedEnrollment = { ...enrollment, progress };
      this.enrollments.set(id, updatedEnrollment);
      this.saveEnrollments();
      return updatedEnrollment;
    }
    return undefined;
  }

  async updateEnrollmentExamScore(id: string, score: number): Promise<Enrollment | undefined> {
    const enrollment = this.enrollments.get(id);
    if (enrollment) {
      const updatedEnrollment = { ...enrollment, finalExamScore: score };
      this.enrollments.set(id, updatedEnrollment);
      this.saveEnrollments();
      return updatedEnrollment;
    }
    return undefined;
  }

  async completeEnrollment(id: string): Promise<Enrollment | undefined> {
    const enrollment = this.enrollments.get(id);
    if (enrollment) {
      const updatedEnrollment = {
        ...enrollment,
        status: "completed",
        progress: 100,
        completedAt: new Date(),
      };
      this.enrollments.set(id, updatedEnrollment);
      this.saveEnrollments();
      return updatedEnrollment;
    }
    return undefined;
  }

  async getCertificate(id: string): Promise<Certificate | undefined> {
    return this.certificates.get(id);
  }

  async getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined> {
    return Array.from(this.certificates.values()).find(
      (certificate) => certificate.certificateNumber === certificateNumber,
    );
  }

  async getStudentCertificates(studentId: string): Promise<Certificate[]> {
    return Array.from(this.certificates.values()).filter(
      (certificate) => certificate.studentId === studentId,
    );
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const id = randomUUID();
    const certificate: Certificate = {
      ...insertCertificate,
      id,
      status: "pending",
      approvedBy: null,
      issuedAt: new Date(),
      approvedAt: null,
    };
    this.certificates.set(id, certificate);
    this.saveCertificates();
    return certificate;
  }

  async approveCertificate(id: string, approvedBy: string): Promise<Certificate | undefined> {
    const certificate = this.certificates.get(id);
    if (certificate) {
      const updatedCertificate = {
        ...certificate,
        status: "approved",
        approvedBy,
        approvedAt: new Date(),
      };
      this.certificates.set(id, updatedCertificate);
      this.saveCertificates();
      return updatedCertificate;
    }
    return undefined;
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getClientProjects(clientId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.clientId === clientId,
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      orderId: insertProject.orderId || null,
      status: insertProject.status || "analysis",
      daysRemaining: insertProject.daysRemaining || null,
      targetDate: insertProject.targetDate || null,
      domain: insertProject.domain || null,
      email: insertProject.email || null,
      toolsUsed: insertProject.toolsUsed || null,
      assignedEmployees: insertProject.assignedEmployees || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    this.saveProjects();
    return project;
  }

  async updateProjectStatus(id: string, status: string): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (project) {
      const updatedProject = { ...project, status, updatedAt: new Date() };
      this.projects.set(id, updatedProject);
      this.saveProjects();
      return updatedProject;
    }
    return undefined;
  }

  async updateProjectIdea(id: string, idea: string): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (project) {
      const updatedProject = { ...project, websiteIdea: idea, updatedAt: new Date() };
      this.projects.set(id, updatedProject);
      this.saveProjects();
      return updatedProject;
    }
    return undefined;
  }

  async getDiscountCode(code: string): Promise<DiscountCode | undefined> {
    return Array.from(this.discountCodes.values()).find(
      (discountCode) => discountCode.code === code,
    );
  }

  async validateDiscountCode(code: string): Promise<DiscountCode | undefined> {
    const discountCode = await this.getDiscountCode(code);
    if (!discountCode) {
      return undefined;
    }
    if (!discountCode.isActive) {
      return undefined;
    }
    if (discountCode.expiresAt && new Date() > discountCode.expiresAt) {
      return undefined;
    }
    return discountCode;
  }

  async getEmployeeTasks(employeeId: string): Promise<EmployeeTask[]> {
    return Array.from(this.employeeTasks.values()).filter(
      (task) => task.employeeId === employeeId,
    );
  }

  async createEmployeeTask(insertTask: InsertEmployeeTask): Promise<EmployeeTask> {
    const id = randomUUID();
    const task: EmployeeTask = {
      ...insertTask,
      id,
      isCompleted: insertTask.isCompleted !== undefined ? insertTask.isCompleted : false,
      hoursRemaining: insertTask.hoursRemaining || null,
      notes: insertTask.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.employeeTasks.set(id, task);
    this.saveEmployeeTasks();
    return task;
  }

  async updateEmployeeTask(id: string, isCompleted: boolean, hoursRemaining?: number): Promise<EmployeeTask | undefined> {
    const task = this.employeeTasks.get(id);
    if (task) {
      const updatedTask = {
        ...task,
        isCompleted,
        hoursRemaining: hoursRemaining !== undefined ? hoursRemaining : task.hoursRemaining,
        updatedAt: new Date(),
      };
      this.employeeTasks.set(id, updatedTask);
      this.saveEmployeeTasks();
      return updatedTask;
    }
    return undefined;
  }

  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(
      (lesson) => lesson.courseId === courseId
    );
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async updateLessonProgress(enrollmentId: string, lessonId: string, isCompleted: boolean): Promise<LessonProgress> {
    const existing = Array.from(this.lessonProgress.values()).find(
      (p) => p.enrollmentId === enrollmentId && p.lessonId === lessonId
    );

    if (existing) {
      const updated: LessonProgress = {
        ...existing,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      };
      this.lessonProgress.set(existing.id, updated);
      this.saveLessonProgress();
      return updated;
    }

    const id = randomUUID();
    const progress: LessonProgress = {
      id,
      enrollmentId,
      lessonId,
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
      createdAt: new Date(),
    };
    this.lessonProgress.set(id, progress);
    this.saveLessonProgress();
    return progress;
  }

  async getEnrollmentProgress(enrollmentId: string): Promise<LessonProgress[]> {
    return Array.from(this.lessonProgress.values()).filter(
      (progress) => progress.enrollmentId === enrollmentId
    );
  }

  async getLessonQuiz(lessonId: string): Promise<Quiz | undefined> {
    return Array.from(this.quizzes.values()).find(
      (quiz) => quiz.lessonId === lessonId && !quiz.isFinalExam
    );
  }

  async getCourseFinalExam(courseId: string): Promise<Quiz | undefined> {
    return Array.from(this.quizzes.values()).find(
      (quiz) => quiz.courseId === courseId && quiz.isFinalExam
    );
  }

  async createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const id = randomUUID();
    const quizAttempt: QuizAttempt = {
      ...attempt,
      id,
      passed: attempt.passed !== undefined ? attempt.passed : false,
      attemptNumber: attempt.attemptNumber !== undefined ? attempt.attemptNumber : 1,
      completedAt: new Date(),
    };
    this.quizAttempts.set(id, quizAttempt);
    this.saveQuizAttempts();
    return quizAttempt;
  }

  async getEnrollmentQuizAttempts(enrollmentId: string): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttempts.values()).filter(
      (attempt) => attempt.enrollmentId === enrollmentId
    );
  }
}

export const storage = new JsonStorage();