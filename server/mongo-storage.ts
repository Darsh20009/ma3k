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
  type Review, type InsertReview, type Notification, type InsertNotification
} from "@shared/schema";
import type { IStorage } from "./storage";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import * as Models from "./mongo-models";

function toPlainObject<T>(doc: any): T {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj as T;
}

function toPlainArray<T>(docs: any[]): T[] {
  return docs.map(doc => toPlainObject<T>(doc));
}

export class MongoStorage implements IStorage {
  sessionStore: session.Store;
  private initPromise: Promise<void> | null = null;

  constructor() {
    const mongoUri = process.env.MONGODB_URI!;
    this.sessionStore = MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: 'sessions',
      ttl: 86400,
    });
    this.initPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.initializeDefaultData();
    } catch (error) {
      console.error('MongoDB initialization failed:', error);
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  private async initializeDefaultData(): Promise<void> {
    try {
      const existingServices = await Models.Service.findOne();
      if (!existingServices) {
        await this.initializeServices();
        await this.initializeDiscountCodes();
        await this.initializeCourses();
        console.log('MongoDB initialized with default data');
      }
    } catch (error) {
      console.error('Error initializing MongoDB:', error);
    }
  }

  private async initializeServices() {
    const defaultServices = [
      {
        _id: "ind-1",
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
        _id: "ind-2",
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
        _id: "rest-1",
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
        _id: "comp-1",
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
        _id: "comp-2",
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
      await Models.Service.findOneAndUpdate(
        { _id: service._id },
        service,
        { upsert: true }
      );
    }
  }

  private async initializeDiscountCodes() {
    const defaultCodes = [
      { _id: "dc-1", code: "WELCOME10", discountPercentage: 10, isActive: true },
      { _id: "dc-2", code: "MA3K20", discountPercentage: 20, isActive: true },
      { _id: "dc-3", code: "SPECIAL25", discountPercentage: 25, isActive: true },
    ];

    for (const code of defaultCodes) {
      await Models.DiscountCode.findOneAndUpdate(
        { _id: code._id },
        code,
        { upsert: true }
      );
    }
  }

  private async initializeCourses() {
    const defaultCourses = [
      {
        _id: "course-python",
        name: "أساسيات Python",
        language: "python",
        description: "تعلم البرمجة بلغة Python من الصفر",
        price: 0,
        isFree: true,
        isActive: true,
      },
      {
        _id: "course-java",
        name: "برمجة Java",
        language: "java",
        description: "تعلم البرمجة بلغة Java للمبتدئين",
        price: 0,
        isFree: true,
        isActive: true,
      },
      {
        _id: "course-frontend",
        name: "تطوير الواجهات Front-End",
        language: "frontend",
        description: "HTML, CSS, JavaScript وReact",
        price: 0,
        isFree: true,
        isActive: true,
      },
      {
        _id: "course-backend",
        name: "تطوير الخوادم Back-End",
        language: "backend",
        description: "Node.js, Express, وقواعد البيانات",
        price: 0,
        isFree: true,
        isActive: true,
      },
    ];

    for (const course of defaultCourses) {
      await Models.Course.findOneAndUpdate(
        { _id: course._id },
        course,
        { upsert: true }
      );
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const user = await Models.User.findById(id);
    return user ? toPlainObject<User>(user) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const user = await Models.User.findOne({ username });
    return user ? toPlainObject<User>(user) : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    await this.ensureInitialized();
    const newUser = new Models.User(user);
    await newUser.save();
    return toPlainObject<User>(newUser);
  }

  async getServices(): Promise<Service[]> {
    await this.ensureInitialized();
    const services = await Models.Service.find({ isActive: true });
    return toPlainArray<Service>(services);
  }

  async getService(id: string): Promise<Service | undefined> {
    await this.ensureInitialized();
    const service = await Models.Service.findById(id);
    return service ? toPlainObject<Service>(service) : undefined;
  }

  async createService(service: InsertService): Promise<Service> {
    await this.ensureInitialized();
    const newService = new Models.Service(service);
    await newService.save();
    return toPlainObject<Service>(newService);
  }

  async getOrders(): Promise<Order[]> {
    await this.ensureInitialized();
    const orders = await Models.Order.find().sort({ createdAt: -1 });
    return toPlainArray<Order>(orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    await this.ensureInitialized();
    const order = await Models.Order.findById(id);
    return order ? toPlainObject<Order>(order) : undefined;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    await this.ensureInitialized();
    const order = await Models.Order.findOne({ orderNumber });
    return order ? toPlainObject<Order>(order) : undefined;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    await this.ensureInitialized();
    const orderNumber = `ORD-${Date.now()}`;
    const newOrder = new Models.Order({
      ...order,
      orderNumber,
      status: "pending",
      paymentStatus: "pending",
    });
    await newOrder.save();
    return toPlainObject<Order>(newOrder);
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    await this.ensureInitialized();
    const order = await Models.Order.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    return order ? toPlainObject<Order>(order) : undefined;
  }

  async updateOrderPayment(id: string, paymentMethod: string, paymentStatus: string): Promise<Order | undefined> {
    await this.ensureInitialized();
    const order = await Models.Order.findByIdAndUpdate(
      id,
      { paymentMethod, paymentStatus, updatedAt: new Date() },
      { new: true }
    );
    return order ? toPlainObject<Order>(order) : undefined;
  }

  async createInvoice(orderId: string): Promise<Invoice> {
    await this.ensureInitialized();
    const order = await this.getOrder(orderId);
    if (!order) throw new Error("Order not found");

    const invoiceNumber = `INV-${Date.now()}`;
    const newInvoice = new Models.Invoice({
      invoiceNumber,
      orderId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      serviceName: order.serviceName,
      subtotal: order.price,
      amount: order.price,
    });
    await newInvoice.save();
    return toPlainObject<Invoice>(newInvoice);
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    await this.ensureInitialized();
    const invoice = await Models.Invoice.findById(id);
    return invoice ? toPlainObject<Invoice>(invoice) : undefined;
  }

  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    await this.ensureInitialized();
    const newConsultation = new Models.Consultation({
      ...consultation,
      status: "pending",
    });
    await newConsultation.save();
    return toPlainObject<Consultation>(newConsultation);
  }

  async getConsultations(): Promise<Consultation[]> {
    await this.ensureInitialized();
    const consultations = await Models.Consultation.find().sort({ createdAt: -1 });
    return toPlainArray<Consultation>(consultations);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    await this.ensureInitialized();
    const newMessage = new Models.Message({
      ...message,
      status: "pending",
    });
    await newMessage.save();
    return toPlainObject<Message>(newMessage);
  }

  async getMessages(): Promise<Message[]> {
    await this.ensureInitialized();
    const messages = await Models.Message.find().sort({ createdAt: -1 });
    return toPlainArray<Message>(messages);
  }

  async getStudent(id: string): Promise<Student | undefined> {
    await this.ensureInitialized();
    const student = await Models.Student.findById(id);
    return student ? toPlainObject<Student>(student) : undefined;
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    await this.ensureInitialized();
    const student = await Models.Student.findOne({ email });
    return student ? toPlainObject<Student>(student) : undefined;
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    await this.ensureInitialized();
    const newStudent = new Models.Student({
      ...student,
      freeCoursesTaken: 0,
    });
    await newStudent.save();
    return toPlainObject<Student>(newStudent);
  }

  async updateStudentFreeCourses(id: string, count: number): Promise<Student | undefined> {
    await this.ensureInitialized();
    const student = await Models.Student.findByIdAndUpdate(
      id,
      { freeCoursesTaken: count },
      { new: true }
    );
    return student ? toPlainObject<Student>(student) : undefined;
  }

  async getClients(): Promise<Client[]> {
    await this.ensureInitialized();
    const clients = await Models.Client.find().sort({ createdAt: -1 });
    return toPlainArray<Client>(clients);
  }

  async getClient(id: string): Promise<Client | undefined> {
    await this.ensureInitialized();
    const client = await Models.Client.findById(id);
    return client ? toPlainObject<Client>(client) : undefined;
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    await this.ensureInitialized();
    const client = await Models.Client.findOne({ email });
    return client ? toPlainObject<Client>(client) : undefined;
  }

  async createClient(client: InsertClient): Promise<Client> {
    await this.ensureInitialized();
    const newClient = new Models.Client(client);
    await newClient.save();
    return toPlainObject<Client>(newClient);
  }

  async getClientOrders(clientId: string): Promise<Order[]> {
    await this.ensureInitialized();
    const client = await this.getClient(clientId);
    if (!client) return [];
    const orders = await Models.Order.find({ customerEmail: client.email }).sort({ createdAt: -1 });
    return toPlainArray<Order>(orders);
  }

  async getEmployees(): Promise<Employee[]> {
    await this.ensureInitialized();
    const employees = await Models.Employee.find().sort({ createdAt: -1 });
    return toPlainArray<Employee>(employees);
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    await this.ensureInitialized();
    const employee = await Models.Employee.findById(id);
    return employee ? toPlainObject<Employee>(employee) : undefined;
  }

  async getEmployeeByEmail(email: string): Promise<Employee | undefined> {
    await this.ensureInitialized();
    const employee = await Models.Employee.findOne({ email });
    return employee ? toPlainObject<Employee>(employee) : undefined;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    await this.ensureInitialized();
    const newEmployee = new Models.Employee(employee);
    await newEmployee.save();
    return toPlainObject<Employee>(newEmployee);
  }

  async updateEmployeePhoto(id: string, photoUrl: string): Promise<Employee | undefined> {
    await this.ensureInitialized();
    const employee = await Models.Employee.findByIdAndUpdate(
      id,
      { photoUrl },
      { new: true }
    );
    return employee ? toPlainObject<Employee>(employee) : undefined;
  }

  async getCourses(): Promise<Course[]> {
    await this.ensureInitialized();
    const courses = await Models.Course.find({ isActive: true });
    return toPlainArray<Course>(courses);
  }

  async getCourse(id: string): Promise<Course | undefined> {
    await this.ensureInitialized();
    const course = await Models.Course.findById(id);
    return course ? toPlainObject<Course>(course) : undefined;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    await this.ensureInitialized();
    const newCourse = new Models.Course(course);
    await newCourse.save();
    return toPlainObject<Course>(newCourse);
  }

  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    await this.ensureInitialized();
    const lessons = await Models.Lesson.find({ courseId }).sort({ order: 1 });
    return toPlainArray<Lesson>(lessons);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    await this.ensureInitialized();
    const lesson = await Models.Lesson.findById(id);
    return lesson ? toPlainObject<Lesson>(lesson) : undefined;
  }

  async updateLessonProgress(enrollmentId: string, lessonId: string, isCompleted: boolean): Promise<LessonProgress> {
    await this.ensureInitialized();
    const existing = await Models.LessonProgress.findOne({ enrollmentId, lessonId });
    
    if (existing) {
      existing.isCompleted = isCompleted;
      existing.completedAt = isCompleted ? new Date() : undefined;
      await existing.save();
      return toPlainObject<LessonProgress>(existing);
    }

    const newProgress = new Models.LessonProgress({
      enrollmentId,
      lessonId,
      isCompleted,
      completedAt: isCompleted ? new Date() : undefined,
    });
    await newProgress.save();
    return toPlainObject<LessonProgress>(newProgress);
  }

  async getEnrollmentProgress(enrollmentId: string): Promise<LessonProgress[]> {
    await this.ensureInitialized();
    const progress = await Models.LessonProgress.find({ enrollmentId });
    return toPlainArray<LessonProgress>(progress);
  }

  async getLessonQuiz(lessonId: string): Promise<Quiz | undefined> {
    await this.ensureInitialized();
    const quiz = await Models.Quiz.findOne({ lessonId, isFinalExam: false });
    return quiz ? toPlainObject<Quiz>(quiz) : undefined;
  }

  async getCourseFinalExam(courseId: string): Promise<Quiz | undefined> {
    await this.ensureInitialized();
    const quiz = await Models.Quiz.findOne({ courseId, isFinalExam: true });
    return quiz ? toPlainObject<Quiz>(quiz) : undefined;
  }

  async createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    await this.ensureInitialized();
    const newAttempt = new Models.QuizAttempt(attempt);
    await newAttempt.save();
    return toPlainObject<QuizAttempt>(newAttempt);
  }

  async getEnrollmentQuizAttempts(enrollmentId: string): Promise<QuizAttempt[]> {
    await this.ensureInitialized();
    const attempts = await Models.QuizAttempt.find({ enrollmentId });
    return toPlainArray<QuizAttempt>(attempts);
  }

  async getEnrollment(id: string): Promise<Enrollment | undefined> {
    await this.ensureInitialized();
    const enrollment = await Models.Enrollment.findById(id);
    return enrollment ? toPlainObject<Enrollment>(enrollment) : undefined;
  }

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    await this.ensureInitialized();
    const enrollments = await Models.Enrollment.find({ studentId });
    return toPlainArray<Enrollment>(enrollments);
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    await this.ensureInitialized();
    const newEnrollment = new Models.Enrollment({
      ...enrollment,
      progress: 0,
      status: "active",
    });
    await newEnrollment.save();
    return toPlainObject<Enrollment>(newEnrollment);
  }

  async updateEnrollmentProgress(id: string, progress: number): Promise<Enrollment | undefined> {
    await this.ensureInitialized();
    const enrollment = await Models.Enrollment.findByIdAndUpdate(
      id,
      { progress },
      { new: true }
    );
    return enrollment ? toPlainObject<Enrollment>(enrollment) : undefined;
  }

  async updateEnrollmentExamScore(id: string, score: number): Promise<Enrollment | undefined> {
    await this.ensureInitialized();
    const enrollment = await Models.Enrollment.findByIdAndUpdate(
      id,
      { finalExamScore: score },
      { new: true }
    );
    return enrollment ? toPlainObject<Enrollment>(enrollment) : undefined;
  }

  async completeEnrollment(id: string): Promise<Enrollment | undefined> {
    await this.ensureInitialized();
    const enrollment = await Models.Enrollment.findByIdAndUpdate(
      id,
      { status: "completed", progress: 100, completedAt: new Date() },
      { new: true }
    );
    return enrollment ? toPlainObject<Enrollment>(enrollment) : undefined;
  }

  async getCertificate(id: string): Promise<Certificate | undefined> {
    await this.ensureInitialized();
    const certificate = await Models.Certificate.findById(id);
    return certificate ? toPlainObject<Certificate>(certificate) : undefined;
  }

  async getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined> {
    await this.ensureInitialized();
    const certificate = await Models.Certificate.findOne({ certificateNumber });
    return certificate ? toPlainObject<Certificate>(certificate) : undefined;
  }

  async getStudentCertificates(studentId: string): Promise<Certificate[]> {
    await this.ensureInitialized();
    const certificates = await Models.Certificate.find({ studentId });
    return toPlainArray<Certificate>(certificates);
  }

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    await this.ensureInitialized();
    const newCertificate = new Models.Certificate({
      ...certificate,
      status: "pending",
    });
    await newCertificate.save();
    return toPlainObject<Certificate>(newCertificate);
  }

  async approveCertificate(id: string, approvedBy: string): Promise<Certificate | undefined> {
    await this.ensureInitialized();
    const certificate = await Models.Certificate.findByIdAndUpdate(
      id,
      { status: "approved", approvedBy, approvedAt: new Date() },
      { new: true }
    );
    return certificate ? toPlainObject<Certificate>(certificate) : undefined;
  }

  async getProject(id: string): Promise<Project | undefined> {
    await this.ensureInitialized();
    const project = await Models.Project.findById(id);
    return project ? toPlainObject<Project>(project) : undefined;
  }

  async getAllProjects(): Promise<Project[]> {
    await this.ensureInitialized();
    const projects = await Models.Project.find().sort({ createdAt: -1 });
    return toPlainArray<Project>(projects);
  }

  async getClientProjects(clientId: string): Promise<Project[]> {
    await this.ensureInitialized();
    const projects = await Models.Project.find({ clientId }).sort({ createdAt: -1 });
    return toPlainArray<Project>(projects);
  }

  async createProject(project: InsertProject): Promise<Project> {
    await this.ensureInitialized();
    const newProject = new Models.Project({
      ...project,
      status: project.status || "analysis",
    });
    await newProject.save();
    return toPlainObject<Project>(newProject);
  }

  async updateProjectStatus(id: string, status: string): Promise<Project | undefined> {
    await this.ensureInitialized();
    const project = await Models.Project.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    return project ? toPlainObject<Project>(project) : undefined;
  }

  async updateProjectIdea(id: string, idea: string): Promise<Project | undefined> {
    await this.ensureInitialized();
    const project = await Models.Project.findByIdAndUpdate(
      id,
      { websiteIdea: idea, updatedAt: new Date() },
      { new: true }
    );
    return project ? toPlainObject<Project>(project) : undefined;
  }

  async getDiscountCode(code: string): Promise<DiscountCode | undefined> {
    await this.ensureInitialized();
    const discountCode = await Models.DiscountCode.findOne({ code });
    return discountCode ? toPlainObject<DiscountCode>(discountCode) : undefined;
  }

  async validateDiscountCode(code: string): Promise<DiscountCode | undefined> {
    await this.ensureInitialized();
    const discountCode = await this.getDiscountCode(code);
    if (!discountCode) return undefined;
    if (!discountCode.isActive) return undefined;
    if (discountCode.expiresAt && new Date() > discountCode.expiresAt) return undefined;
    return discountCode;
  }

  async getEmployeeTasks(employeeId: string): Promise<EmployeeTask[]> {
    await this.ensureInitialized();
    const tasks = await Models.EmployeeTask.find({ employeeId });
    return toPlainArray<EmployeeTask>(tasks);
  }

  async createEmployeeTask(task: InsertEmployeeTask): Promise<EmployeeTask> {
    await this.ensureInitialized();
    const newTask = new Models.EmployeeTask(task);
    await newTask.save();
    return toPlainObject<EmployeeTask>(newTask);
  }

  async updateEmployeeTask(id: string, isCompleted: boolean, hoursRemaining?: number): Promise<EmployeeTask | undefined> {
    await this.ensureInitialized();
    const updateData: any = { isCompleted, updatedAt: new Date() };
    if (hoursRemaining !== undefined) {
      updateData.hoursRemaining = hoursRemaining;
    }
    const task = await Models.EmployeeTask.findByIdAndUpdate(id, updateData, { new: true });
    return task ? toPlainObject<EmployeeTask>(task) : undefined;
  }

  async getReviews(targetId: string, targetType: string): Promise<Review[]> {
    await this.ensureInitialized();
    const reviews = await Models.Review.find({ targetId, targetType, isApproved: true });
    return toPlainArray<Review>(reviews);
  }

  async createReview(review: InsertReview): Promise<Review> {
    await this.ensureInitialized();
    const newReview = new Models.Review({
      ...review,
      isApproved: false,
    });
    await newReview.save();
    return toPlainObject<Review>(newReview);
  }

  async approveReview(id: string): Promise<Review | undefined> {
    await this.ensureInitialized();
    const review = await Models.Review.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    return review ? toPlainObject<Review>(review) : undefined;
  }

  async getAverageRating(targetId: string, targetType: string): Promise<number> {
    await this.ensureInitialized();
    const reviews = await this.getReviews(targetId, targetType);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  async getUserNotifications(userId: string, userType: string): Promise<Notification[]> {
    await this.ensureInitialized();
    const notifications = await Models.Notification.find({ userId, userType }).sort({ createdAt: -1 });
    return toPlainArray<Notification>(notifications);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    await this.ensureInitialized();
    const newNotification = new Models.Notification({
      ...notification,
      isRead: false,
    });
    await newNotification.save();
    return toPlainObject<Notification>(newNotification);
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    await this.ensureInitialized();
    const notification = await Models.Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    return notification ? toPlainObject<Notification>(notification) : undefined;
  }

  async markAllNotificationsAsRead(userId: string, userType: string): Promise<void> {
    await this.ensureInitialized();
    await Models.Notification.updateMany({ userId, userType }, { isRead: true });
  }

  async getUnreadNotificationCount(userId: string, userType: string): Promise<number> {
    await this.ensureInitialized();
    return await Models.Notification.countDocuments({ userId, userType, isRead: false });
  }

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
    await this.ensureInitialized();
    
    const [
      totalOrders,
      totalStudents,
      totalClients,
      totalProjects,
      pendingOrders,
      activeProjects,
      completedCourses,
      completedOrders
    ] = await Promise.all([
      Models.Order.countDocuments(),
      Models.Student.countDocuments(),
      Models.Client.countDocuments(),
      Models.Project.countDocuments(),
      Models.Order.countDocuments({ status: 'pending' }),
      Models.Project.countDocuments({ status: { $ne: 'completed' } }),
      Models.Enrollment.countDocuments({ status: 'completed' }),
      Models.Order.find({ paymentStatus: 'completed' }).select('price')
    ]);

    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.price || 0), 0);

    return {
      totalOrders,
      totalStudents,
      totalClients,
      totalProjects,
      totalRevenue,
      pendingOrders,
      activeProjects,
      completedCourses,
    };
  }

  // Chat Conversations - Stub implementations for MongoDB
  async createChatConversation(data: any): Promise<any> {
    throw new Error("Chat not supported in MongoDB storage. Use PostgreSQL database.");
  }

  async getChatConversation(id: string): Promise<any | undefined> {
    return undefined;
  }

  async getClientConversations(clientId: string): Promise<any[]> {
    return [];
  }

  async getEmployeeConversations(employeeId: string): Promise<any[]> {
    return [];
  }

  async getProjectConversation(projectId: string): Promise<any | undefined> {
    return undefined;
  }

  async updateConversationLastMessage(id: string): Promise<void> {}

  // Chat Messages
  async createChatMessage(data: any): Promise<any> {
    throw new Error("Chat not supported in MongoDB storage. Use PostgreSQL database.");
  }

  async getChatMessages(conversationId: string): Promise<any[]> {
    return [];
  }

  async markMessagesAsRead(conversationId: string, recipientId: string): Promise<void> {}

  async getUnreadMessagesCount(userId: string, userType: string): Promise<number> {
    return 0;
  }

  // Modification Requests
  async createModificationRequest(data: any): Promise<any> {
    throw new Error("Modification requests not supported in MongoDB storage. Use PostgreSQL database.");
  }

  async getModificationRequest(id: string): Promise<any | undefined> {
    return undefined;
  }

  async getProjectModificationRequests(projectId: string): Promise<any[]> {
    return [];
  }

  async getClientModificationRequests(clientId: string): Promise<any[]> {
    return [];
  }

  async getAllModificationRequests(): Promise<any[]> {
    return [];
  }

  async updateModificationRequestStatus(id: string, status: string, assignedTo?: string): Promise<any | undefined> {
    return undefined;
  }

  // Feature Requests
  async createFeatureRequest(data: any): Promise<any> {
    throw new Error("Feature requests not supported in MongoDB storage. Use PostgreSQL database.");
  }

  async getFeatureRequest(id: string): Promise<any | undefined> {
    return undefined;
  }

  async getProjectFeatureRequests(projectId: string): Promise<any[]> {
    return [];
  }

  async getClientFeatureRequests(clientId: string): Promise<any[]> {
    return [];
  }

  async getAllFeatureRequests(): Promise<any[]> {
    return [];
  }

  async updateFeatureRequestStatus(id: string, status: string, adminNotes?: string, estimatedCost?: number, estimatedDays?: number): Promise<any | undefined> {
    return undefined;
  }

  // Project Files
  async createProjectFile(data: any): Promise<any> {
    throw new Error("Project files not supported in MongoDB storage. Use PostgreSQL database.");
  }

  async getProjectFiles(projectId: string): Promise<any[]> {
    return [];
  }

  async deleteProjectFile(id: string): Promise<void> {}

  // Project Questions
  async createProjectQuestion(data: any): Promise<any> {
    throw new Error("Project questions not supported in MongoDB storage. Use PostgreSQL database.");
  }

  async getProjectQuestions(projectId: string): Promise<any[]> {
    return [];
  }

  async answerProjectQuestion(id: string, answer: string): Promise<any | undefined> {
    return undefined;
  }

  async initializeProjectQuestions(projectId: string): Promise<void> {}

  // Admin
  async getAllPendingRequests(): Promise<{ modifications: any[], features: any[] }> {
    return { modifications: [], features: [] };
  }
}
