import mongoose, { Schema } from 'mongoose';

export interface IUser {
  _id: string;
  username: string;
  password: string;
}

export interface IService {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  features?: string[];
  isActive: boolean;
  isFeatured: boolean;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  clientId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId?: string;
  serviceName: string;
  price: number;
  description?: string;
  status: string;
  paymentMethod?: string;
  paymentStatus: string;
  paymentReceiptUrl?: string;
  paymentReceiptFileName?: string;
  paymentNotes?: string;
  discountCode?: string;
  discountAmount: number;
  finalAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvoice {
  _id: string;
  invoiceNumber: string;
  orderId?: string;
  clientId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceName: string;
  serviceDescription?: string;
  subtotal: number;
  discountAmount: number;
  amount: number;
  taxAmount: number;
  paymentMethod?: string;
  paymentStatus: string;
  paidAt?: Date;
  dueDate?: Date;
  notes?: string;
  createdAt: Date;
}

export interface IConsultation {
  _id: string;
  name: string;
  email: string;
  phone: string;
  projectType?: string;
  description: string;
  status: string;
  createdAt: Date;
}

export interface IMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: Date;
}

export interface IStudent {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  age: number;
  selectedLanguage: string;
  learningGoal?: string;
  freeCoursesTaken: number;
  createdAt: Date;
}

export interface IClient {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  websiteType?: string;
  budget?: string;
  websiteIdea?: string;
  createdAt: Date;
}

export interface IEmployee {
  _id: string;
  employeeNumber?: string;
  fullName: string;
  email: string;
  password: string;
  position: string;
  jobTitle: string;
  photoUrl?: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface ICourse {
  _id: string;
  name: string;
  language: string;
  description: string;
  price: number;
  originalPrice?: number;
  isFree: boolean;
  content?: any;
  isActive: boolean;
  createdAt: Date;
}

export interface IEnrollment {
  _id: string;
  studentId: string;
  courseId: string;
  progress: number;
  status: string;
  quizScores?: any;
  finalExamScore?: number;
  enrolledAt: Date;
  completedAt?: Date;
}

export interface ICertificate {
  _id: string;
  certificateNumber: string;
  studentId: string;
  courseId: string;
  studentName: string;
  courseName: string;
  finalScore: number;
  status: string;
  approvedBy?: string;
  issuedAt: Date;
  approvedAt?: Date;
}

export interface IProject {
  _id: string;
  clientId: string;
  orderId?: string;
  projectName: string;
  websiteIdea: string;
  status: string;
  daysRemaining?: number;
  targetDate?: Date;
  domain?: string;
  email?: string;
  toolsUsed?: string[];
  assignedEmployees?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IDiscountCode {
  _id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

export interface IEmployeeTask {
  _id: string;
  employeeId: string;
  projectId: string;
  isCompleted: boolean;
  hoursRemaining?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILesson {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  videoUrl?: string;
  content?: string;
  materials?: string[];
  duration?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface ILessonProgress {
  _id: string;
  enrollmentId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
}

export interface IQuiz {
  _id: string;
  lessonId?: string;
  courseId?: string;
  title: string;
  description?: string;
  questions: any;
  passingScore: number;
  isFinalExam: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface IQuizAttempt {
  _id: string;
  enrollmentId: string;
  quizId: string;
  answers: any;
  score: number;
  passed: boolean;
  attemptNumber: number;
  completedAt: Date;
}

export interface IReview {
  _id: string;
  userId: string;
  userType: string;
  userName: string;
  targetId: string;
  targetType: string;
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt: Date;
}

export interface INotification {
  _id: string;
  userId: string;
  userType: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const ServiceSchema = new Schema<IService>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  category: { type: String, required: true },
  subcategory: String,
  features: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
});

const OrderSchema = new Schema<IOrder>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  orderNumber: { type: String, required: true, unique: true },
  clientId: String,
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  serviceId: String,
  serviceName: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  status: { type: String, default: 'pending' },
  paymentMethod: String,
  paymentStatus: { type: String, default: 'pending' },
  paymentReceiptUrl: String,
  paymentReceiptFileName: String,
  paymentNotes: String,
  discountCode: String,
  discountAmount: { type: Number, default: 0 },
  finalAmount: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const InvoiceSchema = new Schema<IInvoice>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  invoiceNumber: { type: String, required: true, unique: true },
  orderId: String,
  clientId: String,
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: String,
  serviceName: { type: String, required: true },
  serviceDescription: String,
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  amount: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  paymentMethod: String,
  paymentStatus: { type: String, default: 'pending' },
  paidAt: Date,
  dueDate: Date,
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

const ConsultationSchema = new Schema<IConsultation>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  projectType: String,
  description: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const MessageSchema = new Schema<IMessage>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  message: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const StudentSchema = new Schema<IStudent>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  selectedLanguage: { type: String, required: true },
  learningGoal: String,
  freeCoursesTaken: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const ClientSchema = new Schema<IClient>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  websiteType: String,
  budget: String,
  websiteIdea: String,
  createdAt: { type: Date, default: Date.now },
});

const EmployeeSchema = new Schema<IEmployee>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  employeeNumber: { type: String, unique: true, sparse: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  position: { type: String, required: true },
  jobTitle: { type: String, required: true },
  photoUrl: String,
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const CourseSchema = new Schema<ICourse>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true },
  language: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, default: 0 },
  originalPrice: Number,
  isFree: { type: Boolean, default: true },
  content: Schema.Types.Mixed,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const EnrollmentSchema = new Schema<IEnrollment>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  studentId: { type: String, required: true },
  courseId: { type: String, required: true },
  progress: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
  quizScores: Schema.Types.Mixed,
  finalExamScore: Number,
  enrolledAt: { type: Date, default: Date.now },
  completedAt: Date,
});

const CertificateSchema = new Schema<ICertificate>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  certificateNumber: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  courseId: { type: String, required: true },
  studentName: { type: String, required: true },
  courseName: { type: String, required: true },
  finalScore: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  approvedBy: String,
  issuedAt: { type: Date, default: Date.now },
  approvedAt: Date,
});

const ProjectSchema = new Schema<IProject>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  clientId: { type: String, required: true },
  orderId: String,
  projectName: { type: String, required: true },
  websiteIdea: { type: String, required: true },
  status: { type: String, default: 'analysis' },
  daysRemaining: Number,
  targetDate: Date,
  domain: String,
  email: String,
  toolsUsed: [String],
  assignedEmployees: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const DiscountCodeSchema = new Schema<IDiscountCode>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
});

const EmployeeTaskSchema = new Schema<IEmployeeTask>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  employeeId: { type: String, required: true },
  projectId: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  hoursRemaining: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const LessonSchema = new Schema<ILesson>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  courseId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  order: { type: Number, required: true },
  videoUrl: String,
  content: String,
  materials: [String],
  duration: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const LessonProgressSchema = new Schema<ILessonProgress>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  enrollmentId: { type: String, required: true },
  lessonId: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

const QuizSchema = new Schema<IQuiz>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  lessonId: String,
  courseId: String,
  title: { type: String, required: true },
  description: String,
  questions: { type: Schema.Types.Mixed, required: true },
  passingScore: { type: Number, default: 70 },
  isFinalExam: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  enrollmentId: { type: String, required: true },
  quizId: { type: String, required: true },
  answers: { type: Schema.Types.Mixed, required: true },
  score: { type: Number, required: true },
  passed: { type: Boolean, default: false },
  attemptNumber: { type: Number, default: 1 },
  completedAt: { type: Date, default: Date.now },
});

const ReviewSchema = new Schema<IReview>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  userId: { type: String, required: true },
  userType: { type: String, required: true },
  userName: { type: String, required: true },
  targetId: { type: String, required: true },
  targetType: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: String,
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const NotificationSchema = new Schema<INotification>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  userId: { type: String, required: true },
  userType: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: String,
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export const Invoice = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
export const Consultation = mongoose.models.Consultation || mongoose.model<IConsultation>('Consultation', ConsultationSchema);
export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
export const Client = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
export const Employee = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);
export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
export const Enrollment = mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
export const Certificate = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);
export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export const DiscountCode = mongoose.models.DiscountCode || mongoose.model<IDiscountCode>('DiscountCode', DiscountCodeSchema);
export const EmployeeTask = mongoose.models.EmployeeTask || mongoose.model<IEmployeeTask>('EmployeeTask', EmployeeTaskSchema);
export const Lesson = mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);
export const LessonProgress = mongoose.models.LessonProgress || mongoose.model<ILessonProgress>('LessonProgress', LessonProgressSchema);
export const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);
export const QuizAttempt = mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
