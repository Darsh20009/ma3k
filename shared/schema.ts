import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in SAR
  originalPrice: integer("original_price"), // Original price before discount
  category: text("category").notNull(), // 'individuals', 'restaurants', 'companies'
  subcategory: text("subcategory"), // More specific categorization
  features: text("features").array(),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  clientId: varchar("client_id").references(() => clients.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  serviceId: varchar("service_id").references(() => services.id),
  serviceName: text("service_name").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  status: text("status").default("pending"), // pending, awaiting_payment, paid, in_progress, completed, cancelled
  paymentMethod: text("payment_method"), // bank_transfer, paypal, etisalat_cash
  paymentStatus: text("payment_status").default("pending"), // pending, awaiting_verification, completed, failed
  paymentReceiptUrl: text("payment_receipt_url"),
  paymentReceiptFileName: text("payment_receipt_file_name"),
  paymentNotes: text("payment_notes"),
  discountCode: text("discount_code"),
  discountAmount: integer("discount_amount").default(0),
  finalAmount: integer("final_amount"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull().unique(),
  orderId: varchar("order_id").references(() => orders.id),
  clientId: varchar("client_id").references(() => clients.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  serviceName: text("service_name").notNull(),
  serviceDescription: text("service_description"),
  subtotal: integer("subtotal").notNull(),
  discountAmount: integer("discount_amount").default(0),
  amount: integer("amount").notNull(),
  taxAmount: integer("tax_amount").default(0),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, cancelled, refunded
  paidAt: timestamp("paid_at"),
  dueDate: timestamp("due_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const consultations = pgTable("consultations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  projectType: text("project_type"),
  description: text("description").notNull(),
  status: text("status").default("pending"), // pending, contacted, completed
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status").default("pending"), // pending, replied, closed
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone").notNull(),
  age: integer("age").notNull(),
  selectedLanguage: text("selected_language").notNull(),
  learningGoal: text("learning_goal"),
  freeCoursesTaken: integer("free_courses_taken").default(0),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  websiteType: text("website_type"),
  budget: text("budget"),
  websiteIdea: text("website_idea"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeNumber: text("employee_number").unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  position: text("position").notNull(),
  jobTitle: text("job_title").notNull(),
  photoUrl: text("photo_url"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  language: text("language").notNull(), // Python, Java, Front-End, Back-End, etc.
  description: text("description").notNull(),
  price: integer("price").default(0), // 0 for free courses
  originalPrice: integer("original_price"), // Original price before discount
  isFree: boolean("is_free").default(true),
  content: jsonb("content"), // Course content, lessons, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  progress: integer("progress").default(0), // Progress percentage
  status: text("status").default("active"), // active, completed, dropped
  quizScores: jsonb("quiz_scores"), // Scores for quizzes
  finalExamScore: integer("final_exam_score"),
  enrolledAt: timestamp("enrolled_at").default(sql`CURRENT_TIMESTAMP`),
  completedAt: timestamp("completed_at"),
});

export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  certificateNumber: text("certificate_number").notNull().unique(),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  studentName: text("student_name").notNull(),
  courseName: text("course_name").notNull(),
  finalScore: integer("final_score").notNull(),
  status: text("status").default("pending"), // pending, approved, rejected
  approvedBy: text("approved_by"),
  issuedAt: timestamp("issued_at").default(sql`CURRENT_TIMESTAMP`),
  approvedAt: timestamp("approved_at"),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => clients.id).notNull(),
  orderId: varchar("order_id").references(() => orders.id),
  projectName: text("project_name").notNull(),
  websiteIdea: text("website_idea").notNull(),
  status: text("status").default("analysis"), // analysis, design, backend, deployment, completed
  daysRemaining: integer("days_remaining"),
  targetDate: timestamp("target_date"),
  domain: text("domain"),
  email: text("email"),
  toolsUsed: text("tools_used").array(),
  assignedEmployees: text("assigned_employees").array(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const discountCodes = pgTable("discount_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  discountPercentage: integer("discount_percentage").notNull(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const employeeTasks = pgTable("employee_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  isCompleted: boolean("is_completed").default(false),
  hoursRemaining: integer("hours_remaining"),
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  videoUrl: text("video_url"),
  content: text("content"),
  materials: text("materials").array(),
  duration: integer("duration"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const lessonProgress = pgTable("lesson_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  enrollmentId: varchar("enrollment_id").references(() => enrollments.id).notNull(),
  lessonId: varchar("lesson_id").references(() => lessons.id).notNull(),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  courseId: varchar("course_id").references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  questions: jsonb("questions").notNull(),
  passingScore: integer("passing_score").default(70),
  isFinalExam: boolean("is_final_exam").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  enrollmentId: varchar("enrollment_id").references(() => enrollments.id).notNull(),
  quizId: varchar("quiz_id").references(() => quizzes.id).notNull(),
  answers: jsonb("answers").notNull(),
  score: integer("score").notNull(),
  passed: boolean("passed").default(false),
  attemptNumber: integer("attempt_number").default(1),
  completedAt: timestamp("completed_at").default(sql`CURRENT_TIMESTAMP`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  description: true,
  price: true,
  originalPrice: true,
  category: true,
  subcategory: true,
  features: true,
  isActive: true,
  isFeatured: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  clientId: true,
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  serviceId: true,
  serviceName: true,
  price: true,
  description: true,
  paymentMethod: true,
  paymentReceiptUrl: true,
  paymentReceiptFileName: true,
  paymentNotes: true,
  discountCode: true,
  discountAmount: true,
  finalAmount: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).pick({
  name: true,
  email: true,
  phone: true,
  projectType: true,
  description: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  name: true,
  email: true,
  phone: true,
  message: true,
});

export const insertStudentSchema = createInsertSchema(students).pick({
  fullName: true,
  email: true,
  password: true,
  phone: true,
  age: true,
  selectedLanguage: true,
  learningGoal: true,
});

export const insertClientSchema = createInsertSchema(clients).pick({
  fullName: true,
  email: true,
  password: true,
  phone: true,
  websiteType: true,
  budget: true,
  websiteIdea: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).pick({
  fullName: true,
  email: true,
  password: true,
  position: true,
  jobTitle: true,
  photoUrl: true,
  employeeNumber: true,
  isAdmin: true,
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  name: true,
  language: true,
  description: true,
  price: true,
  originalPrice: true,
  isFree: true,
  content: true,
  isActive: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).pick({
  studentId: true,
  courseId: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).pick({
  certificateNumber: true,
  studentId: true,
  courseId: true,
  studentName: true,
  courseName: true,
  finalScore: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  clientId: true,
  orderId: true,
  projectName: true,
  websiteIdea: true,
  status: true,
  daysRemaining: true,
  targetDate: true,
  domain: true,
  email: true,
  toolsUsed: true,
  assignedEmployees: true,
});

export const insertDiscountCodeSchema = createInsertSchema(discountCodes).pick({
  code: true,
  discountPercentage: true,
  isActive: true,
  expiresAt: true,
});

export const insertEmployeeTaskSchema = createInsertSchema(employeeTasks).pick({
  employeeId: true,
  projectId: true,
  isCompleted: true,
  hoursRemaining: true,
  notes: true,
});

export const insertLessonSchema = createInsertSchema(lessons).pick({
  courseId: true,
  title: true,
  description: true,
  order: true,
  videoUrl: true,
  content: true,
  materials: true,
  duration: true,
  isActive: true,
});

export const insertLessonProgressSchema = createInsertSchema(lessonProgress).pick({
  enrollmentId: true,
  lessonId: true,
  isCompleted: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  lessonId: true,
  courseId: true,
  title: true,
  description: true,
  questions: true,
  passingScore: true,
  isFinalExam: true,
  isActive: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).pick({
  enrollmentId: true,
  quizId: true,
  answers: true,
  score: true,
  passed: true,
  attemptNumber: true,
});

// Chat Conversations table
export const chatConversations = pgTable("chat_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id),
  clientId: varchar("client_id").references(() => clients.id),
  employeeId: varchar("employee_id").references(() => employees.id),
  type: text("type").notNull(), // 'project', 'support', 'general'
  status: text("status").default("active"), // 'active', 'closed', 'archived'
  lastMessageAt: timestamp("last_message_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Chat Messages table
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => chatConversations.id).notNull(),
  senderId: varchar("sender_id").notNull(),
  senderType: text("sender_type").notNull(), // 'client', 'employee', 'admin'
  senderName: text("sender_name").notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").default("text"), // 'text', 'file', 'image', 'audio'
  fileUrl: text("file_url"),
  fileName: text("file_name"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Modification Requests table
export const modificationRequests = pgTable("modification_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  clientId: varchar("client_id").references(() => clients.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").default("medium"), // 'low', 'medium', 'high', 'urgent'
  status: text("status").default("pending"), // 'pending', 'in_progress', 'completed', 'rejected'
  assignedTo: varchar("assigned_to").references(() => employees.id),
  attachments: text("attachments").array(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Feature Requests table
export const featureRequests = pgTable("feature_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  clientId: varchar("client_id").references(() => clients.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category"), // 'ui', 'functionality', 'integration', 'other'
  priority: text("priority").default("medium"),
  status: text("status").default("pending"), // 'pending', 'approved', 'in_progress', 'completed', 'rejected'
  estimatedCost: integer("estimated_cost"),
  estimatedDays: integer("estimated_days"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Project Files table
export const projectFiles = pgTable("project_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  uploadedBy: varchar("uploaded_by").notNull(),
  uploaderType: text("uploader_type").notNull(), // 'client', 'employee'
  uploaderName: text("uploader_name").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type"), // 'image', 'document', 'logo', 'design', 'other'
  fileSize: integer("file_size"),
  description: text("description"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Project Questions/Answers table (for project requirements)
export const projectQuestions = pgTable("project_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  category: text("category"), // 'general', 'design', 'features', 'content', 'technical'
  isRequired: boolean("is_required").default(false),
  order: integer("order").default(0),
  answeredAt: timestamp("answered_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Reviews and Ratings table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  userType: text("user_type").notNull(), // 'student', 'client'
  userName: text("user_name").notNull(),
  targetId: varchar("target_id").notNull(), // courseId or serviceId
  targetType: text("target_type").notNull(), // 'course', 'service'
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Notifications table for real-time updates
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  userType: text("user_type").notNull(), // 'student', 'client', 'employee'
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'order', 'course', 'project', 'certificate', 'payment', 'general'
  isRead: boolean("is_read").default(false),
  link: text("link"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Insert schemas for new tables
export const insertReviewSchema = createInsertSchema(reviews).pick({
  userId: true,
  userType: true,
  userName: true,
  targetId: true,
  targetType: true,
  rating: true,
  comment: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  userType: true,
  title: true,
  message: true,
  type: true,
  link: true,
});

// Types
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type DiscountCode = typeof discountCodes.$inferSelect;
export type InsertDiscountCode = z.infer<typeof insertDiscountCodeSchema>;
export type EmployeeTask = typeof employeeTasks.$inferSelect;
export type InsertEmployeeTask = z.infer<typeof insertEmployeeTaskSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;

// Insert schemas for chat and new tables
export const insertChatConversationSchema = createInsertSchema(chatConversations).pick({
  projectId: true,
  clientId: true,
  employeeId: true,
  type: true,
  status: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  conversationId: true,
  senderId: true,
  senderType: true,
  senderName: true,
  content: true,
  messageType: true,
  fileUrl: true,
  fileName: true,
});

export const insertModificationRequestSchema = createInsertSchema(modificationRequests).pick({
  projectId: true,
  clientId: true,
  title: true,
  description: true,
  priority: true,
  attachments: true,
});

export const insertFeatureRequestSchema = createInsertSchema(featureRequests).pick({
  projectId: true,
  clientId: true,
  title: true,
  description: true,
  category: true,
  priority: true,
});

export const insertProjectFileSchema = createInsertSchema(projectFiles).pick({
  projectId: true,
  uploadedBy: true,
  uploaderType: true,
  uploaderName: true,
  fileName: true,
  fileUrl: true,
  fileType: true,
  fileSize: true,
  description: true,
});

export const insertProjectQuestionSchema = createInsertSchema(projectQuestions).pick({
  projectId: true,
  question: true,
  answer: true,
  category: true,
  isRequired: true,
  order: true,
});

// Types for new tables
export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ModificationRequest = typeof modificationRequests.$inferSelect;
export type InsertModificationRequest = z.infer<typeof insertModificationRequestSchema>;
export type FeatureRequest = typeof featureRequests.$inferSelect;
export type InsertFeatureRequest = z.infer<typeof insertFeatureRequestSchema>;
export type ProjectFile = typeof projectFiles.$inferSelect;
export type InsertProjectFile = z.infer<typeof insertProjectFileSchema>;
export type ProjectQuestion = typeof projectQuestions.$inferSelect;
export type InsertProjectQuestion = z.infer<typeof insertProjectQuestionSchema>;