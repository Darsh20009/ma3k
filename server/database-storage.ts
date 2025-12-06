import { eq, and, sql, count, sum, desc } from "drizzle-orm";
import { db, pool } from "./db";
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
  type Lesson, type LessonProgress, type Quiz, type QuizAttempt, type InsertQuizAttempt,
  type Review, type InsertReview, type Notification, type InsertNotification,
  type ChatConversation, type InsertChatConversation, type ChatMessage, type InsertChatMessage,
  type ModificationRequest, type InsertModificationRequest, type FeatureRequest, type InsertFeatureRequest,
  type ProjectFile, type InsertProjectFile, type ProjectQuestion, type InsertProjectQuestion,
  type Meeting, type InsertMeeting
} from "@shared/schema";
import type { IStorage } from "./storage";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  private initPromise: Promise<void> | null = null;
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ pool: pool!, createTableIfMissing: true });
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
    
    // Check if service exists, if not set serviceId to null
    let validServiceId = null;
    if (order.serviceId) {
      const service = await this.getService(order.serviceId);
      if (service) {
        validServiceId = order.serviceId;
      }
    }
    
    const result = await db.insert(schema.orders).values({
      ...order,
      serviceId: validServiceId,
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
      clientId: order.clientId || null,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || null,
      serviceName: order.serviceName,
      subtotal: order.price,
      discountAmount: 0,
      amount: order.price,
      taxAmount: 0,
      paymentMethod: order.paymentMethod || null,
      paymentStatus: order.paymentStatus || "paid",
    }).returning();
    return result[0];
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const result = await db.select().from(schema.invoices).where(eq(schema.invoices.id, id));
    return result[0];
  }

  async getInvoicesByClientId(clientId: string): Promise<Invoice[]> {
    const result = await db.select().from(schema.invoices).where(eq(schema.invoices.clientId, clientId));
    return result;
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

  async getClients(): Promise<Client[]> {
    return await db.select().from(schema.clients);
  }

  async getClient(id: string): Promise<Client | undefined> {
    const result = await db.select().from(schema.clients).where(eq(schema.clients.id, id));
    return result[0];
  }

  async getClientOrders(clientId: string): Promise<Order[]> {
    const client = await this.getClient(clientId);
    if (!client) return [];
    return await db.select().from(schema.orders)
      .where(eq(schema.orders.customerEmail, client.email));
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const result = await db.select().from(schema.clients).where(eq(schema.clients.email, email));
    return result[0];
  }

  async createClient(client: InsertClient): Promise<Client> {
    const result = await db.insert(schema.clients).values(client).returning();
    return result[0];
  }

  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(schema.employees);
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

  // Reviews
  async getReviews(targetId: string, targetType: string): Promise<Review[]> {
    return await db.select().from(schema.reviews)
      .where(and(
        eq(schema.reviews.targetId, targetId),
        eq(schema.reviews.targetType, targetType),
        eq(schema.reviews.isApproved, true)
      ));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(schema.reviews).values({
      ...review,
      isApproved: false,
    }).returning();
    return result[0];
  }

  async approveReview(id: string): Promise<Review | undefined> {
    const result = await db.update(schema.reviews)
      .set({ isApproved: true })
      .where(eq(schema.reviews.id, id))
      .returning();
    return result[0];
  }

  async getAverageRating(targetId: string, targetType: string): Promise<number> {
    const reviews = await this.getReviews(targetId, targetType);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  // Notifications
  async getUserNotifications(userId: string, userType: string): Promise<Notification[]> {
    return await db.select().from(schema.notifications)
      .where(and(
        eq(schema.notifications.userId, userId),
        eq(schema.notifications.userType, userType)
      ))
      .orderBy(desc(schema.notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const result = await db.insert(schema.notifications).values({
      ...notification,
      isRead: false,
    }).returning();
    return result[0];
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const result = await db.update(schema.notifications)
      .set({ isRead: true })
      .where(eq(schema.notifications.id, id))
      .returning();
    return result[0];
  }

  async markAllNotificationsAsRead(userId: string, userType: string): Promise<void> {
    await db.update(schema.notifications)
      .set({ isRead: true })
      .where(and(
        eq(schema.notifications.userId, userId),
        eq(schema.notifications.userType, userType)
      ));
  }

  async getUnreadNotificationCount(userId: string, userType: string): Promise<number> {
    const result = await db.select({ count: count() }).from(schema.notifications)
      .where(and(
        eq(schema.notifications.userId, userId),
        eq(schema.notifications.userType, userType),
        eq(schema.notifications.isRead, false)
      ));
    return result[0]?.count || 0;
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{
    totalOrders: number;
    totalStudents: number;
    totalClients: number;
    totalProjects: number;
    totalRevenue: number;
    pendingOrders: number;
    activeProjects: number;
    completedCourses: number;
  }> {
    const [ordersResult] = await db.select({ count: count() }).from(schema.orders);
    const [studentsResult] = await db.select({ count: count() }).from(schema.students);
    const [clientsResult] = await db.select({ count: count() }).from(schema.clients);
    const [projectsResult] = await db.select({ count: count() }).from(schema.projects);
    
    const [revenueResult] = await db.select({ total: sum(schema.orders.price) })
      .from(schema.orders)
      .where(eq(schema.orders.paymentStatus, 'completed'));
    
    const [pendingOrdersResult] = await db.select({ count: count() })
      .from(schema.orders)
      .where(eq(schema.orders.status, 'pending'));
    
    const [activeProjectsResult] = await db.select({ count: count() })
      .from(schema.projects)
      .where(sql`${schema.projects.status} != 'completed'`);
    
    const [completedCoursesResult] = await db.select({ count: count() })
      .from(schema.enrollments)
      .where(eq(schema.enrollments.status, 'completed'));

    return {
      totalOrders: ordersResult?.count || 0,
      totalStudents: studentsResult?.count || 0,
      totalClients: clientsResult?.count || 0,
      totalProjects: projectsResult?.count || 0,
      totalRevenue: Number(revenueResult?.total) || 0,
      pendingOrders: pendingOrdersResult?.count || 0,
      activeProjects: activeProjectsResult?.count || 0,
      completedCourses: completedCoursesResult?.count || 0,
    };
  }

  // Chat Conversations
  async createChatConversation(data: InsertChatConversation): Promise<ChatConversation> {
    const result = await db.insert(schema.chatConversations).values(data).returning();
    return result[0];
  }

  async getChatConversation(id: string): Promise<ChatConversation | undefined> {
    const result = await db.select().from(schema.chatConversations).where(eq(schema.chatConversations.id, id));
    return result[0];
  }

  async getClientConversations(clientId: string): Promise<ChatConversation[]> {
    return await db.select().from(schema.chatConversations)
      .where(eq(schema.chatConversations.clientId, clientId))
      .orderBy(desc(schema.chatConversations.lastMessageAt));
  }

  async getEmployeeConversations(employeeId: string): Promise<ChatConversation[]> {
    return await db.select().from(schema.chatConversations)
      .where(eq(schema.chatConversations.employeeId, employeeId))
      .orderBy(desc(schema.chatConversations.lastMessageAt));
  }

  async getAllConversations(): Promise<ChatConversation[]> {
    return await db.select().from(schema.chatConversations)
      .orderBy(desc(schema.chatConversations.lastMessageAt));
  }

  async getProjectConversation(projectId: string): Promise<ChatConversation | undefined> {
    const result = await db.select().from(schema.chatConversations)
      .where(eq(schema.chatConversations.projectId, projectId));
    return result[0];
  }

  async updateConversationLastMessage(id: string): Promise<void> {
    await db.update(schema.chatConversations)
      .set({ lastMessageAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(schema.chatConversations.id, id));
  }

  // Chat Messages
  async createChatMessage(data: InsertChatMessage): Promise<ChatMessage> {
    const result = await db.insert(schema.chatMessages).values(data).returning();
    await this.updateConversationLastMessage(data.conversationId);
    return result[0];
  }

  async getChatMessages(conversationId: string): Promise<ChatMessage[]> {
    return await db.select().from(schema.chatMessages)
      .where(eq(schema.chatMessages.conversationId, conversationId))
      .orderBy(schema.chatMessages.createdAt);
  }

  async markMessagesAsRead(conversationId: string, recipientId: string): Promise<void> {
    await db.update(schema.chatMessages)
      .set({ isRead: true })
      .where(and(
        eq(schema.chatMessages.conversationId, conversationId),
        sql`${schema.chatMessages.senderId} != ${recipientId}`
      ));
  }

  async getUnreadMessagesCount(userId: string, userType: string): Promise<number> {
    let conversations: ChatConversation[] = [];
    if (userType === 'client') {
      conversations = await this.getClientConversations(userId);
    } else if (userType === 'employee') {
      conversations = await this.getEmployeeConversations(userId);
    }
    
    let totalUnread = 0;
    for (const conv of conversations) {
      const result = await db.select({ count: count() }).from(schema.chatMessages)
        .where(and(
          eq(schema.chatMessages.conversationId, conv.id),
          eq(schema.chatMessages.isRead, false),
          sql`${schema.chatMessages.senderId} != ${userId}`
        ));
      totalUnread += result[0]?.count || 0;
    }
    return totalUnread;
  }

  // Modification Requests
  async createModificationRequest(data: InsertModificationRequest): Promise<ModificationRequest> {
    const result = await db.insert(schema.modificationRequests).values(data).returning();
    return result[0];
  }

  async getModificationRequest(id: string): Promise<ModificationRequest | undefined> {
    const result = await db.select().from(schema.modificationRequests)
      .where(eq(schema.modificationRequests.id, id));
    return result[0];
  }

  async getProjectModificationRequests(projectId: string): Promise<ModificationRequest[]> {
    return await db.select().from(schema.modificationRequests)
      .where(eq(schema.modificationRequests.projectId, projectId))
      .orderBy(desc(schema.modificationRequests.createdAt));
  }

  async getClientModificationRequests(clientId: string): Promise<ModificationRequest[]> {
    return await db.select().from(schema.modificationRequests)
      .where(eq(schema.modificationRequests.clientId, clientId))
      .orderBy(desc(schema.modificationRequests.createdAt));
  }

  async getAllModificationRequests(): Promise<ModificationRequest[]> {
    return await db.select().from(schema.modificationRequests)
      .orderBy(desc(schema.modificationRequests.createdAt));
  }

  async updateModificationRequestStatus(id: string, status: string, assignedTo?: string): Promise<ModificationRequest | undefined> {
    const updateData: any = { status, updatedAt: sql`CURRENT_TIMESTAMP` };
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (status === 'completed') updateData.completedAt = sql`CURRENT_TIMESTAMP`;
    
    const result = await db.update(schema.modificationRequests)
      .set(updateData)
      .where(eq(schema.modificationRequests.id, id))
      .returning();
    return result[0];
  }

  // Feature Requests
  async createFeatureRequest(data: InsertFeatureRequest): Promise<FeatureRequest> {
    const result = await db.insert(schema.featureRequests).values(data).returning();
    return result[0];
  }

  async getFeatureRequest(id: string): Promise<FeatureRequest | undefined> {
    const result = await db.select().from(schema.featureRequests)
      .where(eq(schema.featureRequests.id, id));
    return result[0];
  }

  async getProjectFeatureRequests(projectId: string): Promise<FeatureRequest[]> {
    return await db.select().from(schema.featureRequests)
      .where(eq(schema.featureRequests.projectId, projectId))
      .orderBy(desc(schema.featureRequests.createdAt));
  }

  async getClientFeatureRequests(clientId: string): Promise<FeatureRequest[]> {
    return await db.select().from(schema.featureRequests)
      .where(eq(schema.featureRequests.clientId, clientId))
      .orderBy(desc(schema.featureRequests.createdAt));
  }

  async getAllFeatureRequests(): Promise<FeatureRequest[]> {
    return await db.select().from(schema.featureRequests)
      .orderBy(desc(schema.featureRequests.createdAt));
  }

  async updateFeatureRequestStatus(id: string, status: string, adminNotes?: string, estimatedCost?: number, estimatedDays?: number): Promise<FeatureRequest | undefined> {
    const updateData: any = { status, updatedAt: sql`CURRENT_TIMESTAMP` };
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (estimatedCost !== undefined) updateData.estimatedCost = estimatedCost;
    if (estimatedDays !== undefined) updateData.estimatedDays = estimatedDays;
    
    const result = await db.update(schema.featureRequests)
      .set(updateData)
      .where(eq(schema.featureRequests.id, id))
      .returning();
    return result[0];
  }

  // Project Files
  async createProjectFile(data: InsertProjectFile): Promise<ProjectFile> {
    const result = await db.insert(schema.projectFiles).values(data).returning();
    return result[0];
  }

  async getProjectFiles(projectId: string): Promise<ProjectFile[]> {
    return await db.select().from(schema.projectFiles)
      .where(eq(schema.projectFiles.projectId, projectId))
      .orderBy(desc(schema.projectFiles.createdAt));
  }

  async deleteProjectFile(id: string): Promise<void> {
    await db.delete(schema.projectFiles).where(eq(schema.projectFiles.id, id));
  }

  // Project Questions
  async createProjectQuestion(data: InsertProjectQuestion): Promise<ProjectQuestion> {
    const result = await db.insert(schema.projectQuestions).values(data).returning();
    return result[0];
  }

  async getProjectQuestions(projectId: string): Promise<ProjectQuestion[]> {
    return await db.select().from(schema.projectQuestions)
      .where(eq(schema.projectQuestions.projectId, projectId))
      .orderBy(schema.projectQuestions.order);
  }

  async answerProjectQuestion(id: string, answer: string): Promise<ProjectQuestion | undefined> {
    const result = await db.update(schema.projectQuestions)
      .set({ answer, answeredAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(schema.projectQuestions.id, id))
      .returning();
    return result[0];
  }

  async initializeProjectQuestions(projectId: string): Promise<void> {
    const defaultQuestions = [
      { question: "ما هو اسم الموقع أو المشروع؟", category: "general", isRequired: true, order: 1 },
      { question: "ما هي فكرة الموقع بالتفصيل؟", category: "general", isRequired: true, order: 2 },
      { question: "ما هي الألوان المفضلة للتصميم؟", category: "design", isRequired: false, order: 3 },
      { question: "هل لديك أمثلة لمواقع تعجبك؟", category: "design", isRequired: false, order: 4 },
      { question: "ما هي المميزات الأساسية المطلوبة؟", category: "features", isRequired: true, order: 5 },
      { question: "هل تحتاج لوحة تحكم؟", category: "features", isRequired: false, order: 6 },
      { question: "هل لديك محتوى جاهز (نصوص، صور)؟", category: "content", isRequired: false, order: 7 },
      { question: "هل تحتاج ربط مع خدمات خارجية؟", category: "technical", isRequired: false, order: 8 },
    ];

    for (const q of defaultQuestions) {
      await this.createProjectQuestion({ ...q, projectId });
    }
  }

  // Get all pending modification/feature requests for admin
  async getAllPendingRequests(): Promise<{ modifications: ModificationRequest[], features: FeatureRequest[] }> {
    const modifications = await db.select().from(schema.modificationRequests)
      .where(eq(schema.modificationRequests.status, 'pending'))
      .orderBy(desc(schema.modificationRequests.createdAt));
    
    const features = await db.select().from(schema.featureRequests)
      .where(eq(schema.featureRequests.status, 'pending'))
      .orderBy(desc(schema.featureRequests.createdAt));
    
    return { modifications, features };
  }

  // Meetings
  async createMeeting(data: InsertMeeting): Promise<Meeting> {
    const result = await db.insert(schema.meetings).values({
      ...data,
      status: data.status || 'scheduled'
    }).returning();
    return result[0];
  }

  async getMeeting(id: string): Promise<Meeting | undefined> {
    const result = await db.select().from(schema.meetings).where(eq(schema.meetings.id, id));
    return result[0];
  }

  async getMeetings(): Promise<Meeting[]> {
    return await db.select().from(schema.meetings).orderBy(desc(schema.meetings.scheduledAt));
  }

  async updateMeeting(id: string, data: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const result = await db.update(schema.meetings)
      .set({ ...data, updatedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(schema.meetings.id, id))
      .returning();
    return result[0];
  }

  async deleteMeeting(id: string): Promise<void> {
    await db.delete(schema.meetings).where(eq(schema.meetings.id, id));
  }

  async getUpcomingMeetings(): Promise<Meeting[]> {
    return await db.select().from(schema.meetings)
      .where(and(
        sql`${schema.meetings.scheduledAt} >= CURRENT_TIMESTAMP`,
        eq(schema.meetings.status, 'scheduled')
      ))
      .orderBy(schema.meetings.scheduledAt);
  }

  // Enhanced Dashboard Stats
  async getEnhancedDashboardStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
    totalStudents: number;
    activeStudents: number;
    totalClients: number;
    totalEmployees: number;
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalCourses: number;
    totalEnrollments: number;
    completedEnrollments: number;
    averageProjectDuration: number;
    upcomingMeetings: number;
  }> {
    const [ordersResult] = await db.select({
      total: count(),
      pending: sql<number>`COUNT(CASE WHEN status = 'pending' THEN 1 END)`,
      completed: sql<number>`COUNT(CASE WHEN status = 'completed' THEN 1 END)`,
      totalRevenue: sql<number>`COALESCE(SUM(price), 0)`,
      monthlyRevenue: sql<number>`COALESCE(SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN price ELSE 0 END), 0)`
    }).from(schema.orders);

    const [studentsResult] = await db.select({
      total: count(),
      active: sql<number>`COUNT(CASE WHEN free_courses_taken > 0 THEN 1 END)`
    }).from(schema.students);

    const [clientsResult] = await db.select({ total: count() }).from(schema.clients);
    const [employeesResult] = await db.select({ total: count() }).from(schema.employees);

    const [projectsResult] = await db.select({
      total: count(),
      active: sql<number>`COUNT(CASE WHEN status != 'completed' THEN 1 END)`,
      completed: sql<number>`COUNT(CASE WHEN status = 'completed' THEN 1 END)`
    }).from(schema.projects);

    const [coursesResult] = await db.select({ total: count() }).from(schema.courses);

    const [enrollmentsResult] = await db.select({
      total: count(),
      completed: sql<number>`COUNT(CASE WHEN status = 'completed' THEN 1 END)`
    }).from(schema.enrollments);

    const [meetingsResult] = await db.select({
      upcoming: sql<number>`COUNT(CASE WHEN scheduled_at >= CURRENT_TIMESTAMP AND status = 'scheduled' THEN 1 END)`
    }).from(schema.meetings);

    return {
      totalOrders: ordersResult?.total || 0,
      pendingOrders: Number(ordersResult?.pending) || 0,
      completedOrders: Number(ordersResult?.completed) || 0,
      totalRevenue: Number(ordersResult?.totalRevenue) || 0,
      monthlyRevenue: Number(ordersResult?.monthlyRevenue) || 0,
      totalStudents: studentsResult?.total || 0,
      activeStudents: Number(studentsResult?.active) || 0,
      totalClients: clientsResult?.total || 0,
      totalEmployees: employeesResult?.total || 0,
      totalProjects: projectsResult?.total || 0,
      activeProjects: Number(projectsResult?.active) || 0,
      completedProjects: Number(projectsResult?.completed) || 0,
      totalCourses: coursesResult?.total || 0,
      totalEnrollments: enrollmentsResult?.total || 0,
      completedEnrollments: Number(enrollmentsResult?.completed) || 0,
      averageProjectDuration: 14,
      upcomingMeetings: Number(meetingsResult?.upcoming) || 0
    };
  }

  // Reports
  async getEmployeeProductivityReport(): Promise<Array<{
    employeeId: string;
    employeeName: string;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionRate: number;
    totalHoursWorked: number;
  }>> {
    const employees = await this.getEmployees();
    const reports = [];

    for (const emp of employees) {
      const tasks = await this.getEmployeeTasks(emp.id);
      const completedTasks = tasks.filter(t => t.isCompleted).length;
      const pendingTasks = tasks.filter(t => !t.isCompleted).length;
      const totalHours = tasks.reduce((sum, t) => sum + (t.hoursRemaining || 0), 0);

      reports.push({
        employeeId: emp.id,
        employeeName: emp.fullName,
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
        completionRate: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
        totalHoursWorked: totalHours
      });
    }

    return reports;
  }

  async getProjectsReport(): Promise<Array<{
    projectId: string;
    projectName: string;
    clientName: string;
    status: string;
    daysRemaining: number;
    totalTasks: number;
    completedTasks: number;
    progress: number;
  }>> {
    const projects = await this.getAllProjects();
    const clients = await this.getClients();
    const reports = [];

    for (const project of projects) {
      const client = clients.find(c => c.id === project.clientId);
      const tasks = await db.select().from(schema.employeeTasks)
        .where(eq(schema.employeeTasks.projectId, project.id));
      const completedTasks = tasks.filter(t => t.isCompleted).length;

      reports.push({
        projectId: project.id,
        projectName: project.projectName,
        clientName: client?.fullName || 'غير معروف',
        status: project.status,
        daysRemaining: project.daysRemaining || 0,
        totalTasks: tasks.length,
        completedTasks,
        progress: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
      });
    }

    return reports;
  }

  async getFinancialReport(): Promise<{
    totalRevenue: number;
    monthlyRevenue: number;
    weeklyRevenue: number;
    averageOrderValue: number;
    topServices: Array<{ serviceName: string; count: number; revenue: number }>;
    revenueByMonth: Array<{ month: string; revenue: number }>;
  }> {
    const orders = await this.getOrders();
    const completedOrders = orders.filter(o => o.paymentStatus === 'completed');
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const monthlyOrders = completedOrders.filter(o => new Date(o.createdAt) >= startOfMonth);
    const weeklyOrders = completedOrders.filter(o => new Date(o.createdAt) >= startOfWeek);

    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.price, 0);
    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.price, 0);
    const weeklyRevenue = weeklyOrders.reduce((sum, o) => sum + o.price, 0);
    const averageOrderValue = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;

    const serviceMap = new Map<string, { count: number; revenue: number }>();
    for (const order of completedOrders) {
      const existing = serviceMap.get(order.serviceName) || { count: 0, revenue: 0 };
      serviceMap.set(order.serviceName, {
        count: existing.count + 1,
        revenue: existing.revenue + order.price
      });
    }

    const topServices = Array.from(serviceMap.entries())
      .map(([serviceName, data]) => ({ serviceName, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const revenueByMonth: Array<{ month: string; revenue: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthOrders = completedOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
      });
      revenueByMonth.push({
        month: date.toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' }),
        revenue: monthOrders.reduce((sum, o) => sum + o.price, 0)
      });
    }

    return {
      totalRevenue,
      monthlyRevenue,
      weeklyRevenue,
      averageOrderValue,
      topServices,
      revenueByMonth
    };
  }
}
