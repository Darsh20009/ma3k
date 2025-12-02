import { eq, and, sql } from "drizzle-orm";
import { db } from "./db";
import * as schema from "@shared/schema";
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
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.initializeDefaultData();
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  private async initializeDefaultData(): Promise<void> {
    try {
      const existingServices = await db.select().from(schema.services).limit(1);
      if (existingServices.length === 0) {
        await this.initializeServices();
        await this.initializeDiscountCodes();
        await this.initializeCourses();
        console.log('✅ Database initialized with default data');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async initializeServices() {
    const defaultServices = [
      {
        id: "ind-1",
        name: "موقع شخصي أساسي",
        description: "موقع شخصي بسيط مع تصميم نظيف وسهل الاستخدام",
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
        description: "تطبيق شخصي محترف مع خصائص متقدمة وتصميم عصري",
        price: 599,
        originalPrice: 900,
        category: "individuals",
        subcategory: "personal-apps",
        features: ["تطبيق ويب كامل", "لوحة تحكم شخصية", "معرض أعمال", "دعم لـ 3 أشهر"],
        isActive: true,
        isFeatured: false,
      },
      {
        id: "rest-1",
        name: "منيو احترافي مع الدفع",
        description: "منيو إلكتروني احترافي للمطاعم يشمل نظام الطلبات والدفع",
        price: 300,
        originalPrice: 1230,
        category: "restaurants",
        subcategory: "menu",
        features: ["منيو ديجيتال", "نظام طلبات", "دفع إلكتروني", "إدارة المنتجات"],
        isActive: true,
        isFeatured: true,
      },
      {
        id: "comp-1",
        name: "موقع شركة احترافي",
        description: "موقع شركة متكامل مع تصميم عصري واحترافي",
        price: 899,
        originalPrice: 1500,
        category: "companies",
        subcategory: "corporate",
        features: ["تصميم مخصص", "10 صفحات", "SEO محسن", "دعم 6 أشهر"],
        isActive: true,
        isFeatured: true,
      },
      {
        id: "comp-2",
        name: "متجر إلكتروني متكامل",
        description: "متجر إلكتروني كامل مع نظام الدفع والشحن",
        price: 1299,
        originalPrice: 2000,
        category: "companies",
        subcategory: "ecommerce",
        features: ["نظام دفع متعدد", "إدارة المخزون", "تتبع الشحن", "تقارير المبيعات"],
        isActive: true,
        isFeatured: true,
      },
    ];

    for (const service of defaultServices) {
      await db.insert(schema.services).values(service).onConflictDoNothing();
    }
  }

  private async initializeDiscountCodes() {
    const defaultCodes = [
      { id: "dc-1", code: "WELCOME10", discountPercentage: 10, isActive: true, expiresAt: null },
      { id: "dc-2", code: "MA3K20", discountPercentage: 20, isActive: true, expiresAt: null },
      { id: "dc-3", code: "SPECIAL25", discountPercentage: 25, isActive: true, expiresAt: null },
    ];

    for (const code of defaultCodes) {
      await db.insert(schema.discountCodes).values(code).onConflictDoNothing();
    }
  }

  private async initializeCourses() {
    const defaultCourses = [
      {
        id: "course-python",
        name: "أساسيات Python",
        language: "python",
        description: "تعلم البرمجة بلغة Python من الصفر",
        price: 0,
        isFree: true,
        isActive: true,
      },
      {
        id: "course-java",
        name: "برمجة Java",
        language: "java",
        description: "تعلم البرمجة بلغة Java للمبتدئين",
        price: 0,
        isFree: true,
        isActive: true,
      },
      {
        id: "course-frontend",
        name: "تطوير الواجهات Front-End",
        language: "frontend",
        description: "HTML, CSS, JavaScript وReact",
        price: 0,
        isFree: true,
        isActive: true,
      },
      {
        id: "course-backend",
        name: "تطوير الخوادم Back-End",
        language: "backend",
        description: "Node.js, Express, وقواعد البيانات",
        price: 0,
        isFree: true,
        isActive: true,
      },
    ];

    for (const course of defaultCourses) {
      await db.insert(schema.courses).values(course).onConflictDoNothing();
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values(user).returning();
    return result[0];
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(schema.services).where(eq(schema.services.isActive, true));
  }

  async getService(id: string): Promise<Service | undefined> {
    const result = await db.select().from(schema.services).where(eq(schema.services.id, id));
    return result[0];
  }

  async createService(service: InsertService): Promise<Service> {
    const result = await db.insert(schema.services).values(service).returning();
    return result[0];
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(schema.orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
    return result[0];
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const result = await db.select().from(schema.orders).where(eq(schema.orders.orderNumber, orderNumber));
    return result[0];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const orderNumber = `ORD-${Date.now()}`;
    const result = await db.insert(schema.orders).values({
      ...order,
      orderNumber,
      status: "pending",
      paymentStatus: "pending",
    }).returning();
    return result[0];
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const result = await db.update(schema.orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.orders.id, id))
      .returning();
    return result[0];
  }

  async updateOrderPayment(id: string, paymentMethod: string, paymentStatus: string): Promise<Order | undefined> {
    const result = await db.update(schema.orders)
      .set({ paymentMethod, paymentStatus, updatedAt: new Date() })
      .where(eq(schema.orders.id, id))
      .returning();
    return result[0];
  }

  async createInvoice(orderId: string): Promise<Invoice> {
    const order = await this.getOrder(orderId);
    if (!order) throw new Error("Order not found");

    const invoiceNumber = `INV-${Date.now()}`;
    const result = await db.insert(schema.invoices).values({
      invoiceNumber,
      orderId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      serviceName: order.serviceName,
      amount: order.price,
    }).returning();
    return result[0];
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const result = await db.select().from(schema.invoices).where(eq(schema.invoices.id, id));
    return result[0];
  }

  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const result = await db.insert(schema.consultations).values({
      ...consultation,
      status: "pending",
    }).returning();
    return result[0];
  }

  async getConsultations(): Promise<Consultation[]> {
    return await db.select().from(schema.consultations);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(schema.messages).values({
      ...message,
      status: "pending",
    }).returning();
    return result[0];
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(schema.messages);
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const result = await db.select().from(schema.students).where(eq(schema.students.id, id));
    return result[0];
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    const result = await db.select().from(schema.students).where(eq(schema.students.email, email));
    return result[0];
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const result = await db.insert(schema.students).values({
      ...student,
      freeCoursesTaken: 0,
    }).returning();
    return result[0];
  }

  async updateStudentFreeCourses(id: string, count: number): Promise<Student | undefined> {
    const result = await db.update(schema.students)
      .set({ freeCoursesTaken: count })
      .where(eq(schema.students.id, id))
      .returning();
    return result[0];
  }

  async getClient(id: string): Promise<Client | undefined> {
    const result = await db.select().from(schema.clients).where(eq(schema.clients.id, id));
    return result[0];
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const result = await db.select().from(schema.clients).where(eq(schema.clients.email, email));
    return result[0];
  }

  async createClient(client: InsertClient): Promise<Client> {
    const result = await db.insert(schema.clients).values(client).returning();
    return result[0];
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const result = await db.select().from(schema.employees).where(eq(schema.employees.id, id));
    return result[0];
  }

  async getEmployeeByEmail(email: string): Promise<Employee | undefined> {
    const result = await db.select().from(schema.employees).where(eq(schema.employees.email, email));
    return result[0];
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const result = await db.insert(schema.employees).values(employee).returning();
    return result[0];
  }

  async updateEmployeePhoto(id: string, photoUrl: string): Promise<Employee | undefined> {
    const result = await db.update(schema.employees)
      .set({ photoUrl })
      .where(eq(schema.employees.id, id))
      .returning();
    return result[0];
  }

  async getCourses(): Promise<Course[]> {
    return await db.select().from(schema.courses).where(eq(schema.courses.isActive, true));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const result = await db.select().from(schema.courses).where(eq(schema.courses.id, id));
    return result[0];
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const result = await db.insert(schema.courses).values(course).returning();
    return result[0];
  }

  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    return await db.select().from(schema.lessons).where(eq(schema.lessons.courseId, courseId));
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const result = await db.select().from(schema.lessons).where(eq(schema.lessons.id, id));
    return result[0];
  }

  async updateLessonProgress(enrollmentId: string, lessonId: string, isCompleted: boolean): Promise<LessonProgress> {
    const existing = await db.select().from(schema.lessonProgress)
      .where(and(
        eq(schema.lessonProgress.enrollmentId, enrollmentId),
        eq(schema.lessonProgress.lessonId, lessonId)
      ));

    if (existing.length > 0) {
      const result = await db.update(schema.lessonProgress)
        .set({ isCompleted, completedAt: isCompleted ? new Date() : null })
        .where(eq(schema.lessonProgress.id, existing[0].id))
        .returning();
      return result[0];
    }

    const result = await db.insert(schema.lessonProgress).values({
      enrollmentId,
      lessonId,
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    }).returning();
    return result[0];
  }

  async getEnrollmentProgress(enrollmentId: string): Promise<LessonProgress[]> {
    return await db.select().from(schema.lessonProgress)
      .where(eq(schema.lessonProgress.enrollmentId, enrollmentId));
  }

  async getLessonQuiz(lessonId: string): Promise<Quiz | undefined> {
    const result = await db.select().from(schema.quizzes)
      .where(and(
        eq(schema.quizzes.lessonId, lessonId),
        eq(schema.quizzes.isFinalExam, false)
      ));
    return result[0];
  }

  async getCourseFinalExam(courseId: string): Promise<Quiz | undefined> {
    const result = await db.select().from(schema.quizzes)
      .where(and(
        eq(schema.quizzes.courseId, courseId),
        eq(schema.quizzes.isFinalExam, true)
      ));
    return result[0];
  }

  async createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const result = await db.insert(schema.quizAttempts).values(attempt).returning();
    return result[0];
  }

  async getEnrollmentQuizAttempts(enrollmentId: string): Promise<QuizAttempt[]> {
    return await db.select().from(schema.quizAttempts)
      .where(eq(schema.quizAttempts.enrollmentId, enrollmentId));
  }

  async getEnrollment(id: string): Promise<Enrollment | undefined> {
    const result = await db.select().from(schema.enrollments).where(eq(schema.enrollments.id, id));
    return result[0];
  }

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    return await db.select().from(schema.enrollments)
      .where(eq(schema.enrollments.studentId, studentId));
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const result = await db.insert(schema.enrollments).values({
      ...enrollment,
      progress: 0,
      status: "active",
    }).returning();
    return result[0];
  }

  async updateEnrollmentProgress(id: string, progress: number): Promise<Enrollment | undefined> {
    const result = await db.update(schema.enrollments)
      .set({ progress })
      .where(eq(schema.enrollments.id, id))
      .returning();
    return result[0];
  }

  async updateEnrollmentExamScore(id: string, score: number): Promise<Enrollment | undefined> {
    const result = await db.update(schema.enrollments)
      .set({ finalExamScore: score })
      .where(eq(schema.enrollments.id, id))
      .returning();
    return result[0];
  }

  async completeEnrollment(id: string): Promise<Enrollment | undefined> {
    const result = await db.update(schema.enrollments)
      .set({ status: "completed", progress: 100, completedAt: new Date() })
      .where(eq(schema.enrollments.id, id))
      .returning();
    return result[0];
  }

  async getCertificate(id: string): Promise<Certificate | undefined> {
    const result = await db.select().from(schema.certificates).where(eq(schema.certificates.id, id));
    return result[0];
  }

  async getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined> {
    const result = await db.select().from(schema.certificates)
      .where(eq(schema.certificates.certificateNumber, certificateNumber));
    return result[0];
  }

  async getStudentCertificates(studentId: string): Promise<Certificate[]> {
    return await db.select().from(schema.certificates)
      .where(eq(schema.certificates.studentId, studentId));
  }

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const result = await db.insert(schema.certificates).values({
      ...certificate,
      status: "pending",
    }).returning();
    return result[0];
  }

  async approveCertificate(id: string, approvedBy: string): Promise<Certificate | undefined> {
    const result = await db.update(schema.certificates)
      .set({ status: "approved", approvedBy, approvedAt: new Date() })
      .where(eq(schema.certificates.id, id))
      .returning();
    return result[0];
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
    return result[0];
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(schema.projects);
  }

  async getClientProjects(clientId: string): Promise<Project[]> {
    return await db.select().from(schema.projects)
      .where(eq(schema.projects.clientId, clientId));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(schema.projects).values({
      ...project,
      status: project.status || "analysis",
    }).returning();
    return result[0];
  }

  async updateProjectStatus(id: string, status: string): Promise<Project | undefined> {
    const result = await db.update(schema.projects)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.projects.id, id))
      .returning();
    return result[0];
  }

  async updateProjectIdea(id: string, idea: string): Promise<Project | undefined> {
    const result = await db.update(schema.projects)
      .set({ websiteIdea: idea, updatedAt: new Date() })
      .where(eq(schema.projects.id, id))
      .returning();
    return result[0];
  }

  async getDiscountCode(code: string): Promise<DiscountCode | undefined> {
    const result = await db.select().from(schema.discountCodes)
      .where(eq(schema.discountCodes.code, code));
    return result[0];
  }

  async validateDiscountCode(code: string): Promise<DiscountCode | undefined> {
    const discountCode = await this.getDiscountCode(code);
    if (!discountCode) return undefined;
    if (!discountCode.isActive) return undefined;
    if (discountCode.expiresAt && new Date() > discountCode.expiresAt) return undefined;
    return discountCode;
  }

  async getEmployeeTasks(employeeId: string): Promise<EmployeeTask[]> {
    return await db.select().from(schema.employeeTasks)
      .where(eq(schema.employeeTasks.employeeId, employeeId));
  }

  async createEmployeeTask(task: InsertEmployeeTask): Promise<EmployeeTask> {
    const result = await db.insert(schema.employeeTasks).values(task).returning();
    return result[0];
  }

  async updateEmployeeTask(id: string, isCompleted: boolean, hoursRemaining?: number): Promise<EmployeeTask | undefined> {
    const updateData: any = { isCompleted, updatedAt: new Date() };
    if (hoursRemaining !== undefined) {
      updateData.hoursRemaining = hoursRemaining;
    }
    const result = await db.update(schema.employeeTasks)
      .set(updateData)
      .where(eq(schema.employeeTasks.id, id))
      .returning();
    return result[0];
  }
}
