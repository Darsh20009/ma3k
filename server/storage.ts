import { 
  users, services, orders, invoices, consultations, messages,
  type User, type InsertUser, type Service, type InsertService,
  type Order, type InsertOrder, type Consultation, type InsertConsultation,
  type Message, type InsertMessage, type Invoice
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private services: Map<string, Service> = new Map();
  private orders: Map<string, Order> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private consultations: Map<string, Consultation> = new Map();
  private messages: Map<string, Message> = new Map();

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    const defaultServices: Service[] = [
      {
        id: "1",
        name: "موقع شخصي بسيط",
        description: "صفحة تعريفية وسيرة وأعمال قابلة للتحديث",
        price: 400,
        category: "مواقع وتطبيقات",
        isActive: true,
      },
      {
        id: "2",
        name: "تطبيق شخصي احترافي",
        description: "تطبيق ويب/هجين لعرض خدماتك وملفك الشخصي",
        price: 600,
        category: "مواقع وتطبيقات",
        isActive: true,
      },
      {
        id: "3",
        name: "موقع تعليمي (غير ربحي)",
        description: "منصة دورات/محتوى تعليمي بدون بوابات دفع متقدمة",
        price: 1100,
        category: "مواقع وتطبيقات",
        isActive: true,
      },
      {
        id: "4",
        name: "موقع تعليمي ربحي",
        description: "كامل بخصائص كورسات، اشتراكات ودفع إلكتروني",
        price: 1499,
        category: "مواقع وتطبيقات",
        isActive: true,
      },
      {
        id: "5",
        name: "موقع + متجر إلكتروني",
        description: "عرض وبيع منتجات مع بوابات دفع وشحن",
        price: 550,
        category: "مواقع وتطبيقات",
        isActive: true,
      },
      {
        id: "6",
        name: "تصميم شعار (Logo)",
        description: "شعار احترافي مع ملفات المصدر",
        price: 15,
        category: "هويات وتصميم",
        isActive: true,
      },
      {
        id: "7",
        name: "متابعة مبتدئ",
        description: "جلسات إرشاد وتوجيه (محددة)",
        price: 50,
        category: "متابعة ودعم",
        isActive: true,
      },
      {
        id: "8",
        name: "متابعة احترافية",
        description: "دعم وتطوير بخطة شهرية",
        price: 115,
        category: "متابعة ودعم",
        isActive: true,
      },
      {
        id: "9",
        name: "متابعة خبير",
        description: "استشارات استراتيجية ومتابعة متقدمة",
        price: 150,
        category: "متابعة ودعم",
        isActive: true,
      },
      {
        id: "10",
        name: "تصميم اختبارات تفاعلية",
        description: "اختبارات ومختبرات تفاعلية (تعليمية أو ترفيهية)",
        price: 10,
        category: "تجارب تفاعلية وحلول مبتكرة",
        isActive: true,
      },
      {
        id: "11",
        name: "النظام اللامحدود",
        description: "باقة تطوير دائمة (ميزات متغيرة ـ تحديثات شهرية)",
        price: 200,
        category: "تجارب تفاعلية وحلول مبتكرة",
        isActive: true,
      },
      {
        id: "12",
        name: "بطاقة هدايا",
        description: "يمكن استخدامها للدفع لاحقًا",
        price: 50,
        category: "مدفوعات ورصيد",
        isActive: true,
      },
      {
        id: "13",
        name: "شحن المحفظة الإلكترونية",
        description: "إضافة رصيد سريع للخدمات",
        price: 50,
        category: "مدفوعات ورصيد",
        isActive: true,
      },
      // خدمات إضافية من التحديث
      {
        id: "14",
        name: "موقع لشركات",
        description: "موقع احترافي للشركات والمؤسسات مع عرض الخدمات",
        price: 800,
        category: "مواقع وتطبيقات",
        isActive: true,
      },
      {
        id: "15",
        name: "موقع حجز المواعيد",
        description: "نظام حجز مواعيد متكامل مع إدارة العملاء",
        price: 700,
        category: "مواقع وتطبيقات",
        isActive: true,
      },
      {
        id: "16",
        name: "مدونة احترافية",
        description: "مدونة شخصية أو تجارية مع نظام إدارة المحتوى",
        price: 450,
        category: "مواقع وتطبيقات",
        isActive: true,
      },
      {
        id: "17",
        name: "بوابة أعضاء",
        description: "نظام عضوية متكامل مع صلاحيات وإدارة المحتوى",
        price: 900,
        category: "مواقع وتطبيقات",
        isActive: true,
      },
      {
        id: "18",
        name: "موقع معرض أعمال (Portfolio)",
        description: "موقع لعرض الأعمال والمشاريع بشكل احترافي",
        price: 500,
        category: "مواقع وتطبيقات",
        isActive: true,
      },
      {
        id: "19",
        name: "تحويل المحتوى بالذكاء الاصطناعي",
        description: "مولد نصوص وصفحات تلقائي باستخدام AI",
        price: 300,
        category: "تجارب تفاعلية وحلول مبتكرة",
        isActive: true,
      },
      {
        id: "20",
        name: "نظام فواتير تلقائي",
        description: "يولد فاتورة HTML/CSS وPDF عند تأكيد الدفع",
        price: 250,
        category: "تجارب تفاعلية وحلول مبتكرة",
        isActive: true,
      },
      {
        id: "21",
        name: "نظام تذاكر ودعم",
        description: "نظام دعم داخل الموقع لتتبع الطلبات والشكاوى",
        price: 400,
        category: "متابعة ودعم",
        isActive: true,
      },
      {
        id: "22",
        name: "تسليم الملفات المصدرية",
        description: "خدمة تسليم ملفات PSD/AI وشفرة المصدر",
        price: 100,
        category: "هويات وتصميم",
        isActive: true,
      },
      {
        id: "23",
        name: "تركيب Google Analytics + SEO أساسي",
        description: "إعداد تتبع الإحصائيات وتحسين محركات البحث",
        price: 150,
        category: "متابعة ودعم",
        isActive: true,
      },
    ];

    defaultServices.forEach(service => {
      this.services.set(service.id, service);
    });
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
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
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
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status, updatedAt: new Date() };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  async updateOrderPayment(id: string, paymentMethod: string, paymentStatus: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, paymentMethod, paymentStatus, updatedAt: new Date() };
      this.orders.set(id, updatedOrder);
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
      status: "pending",
      createdAt: new Date(),
    };
    this.consultations.set(id, consultation);
    return consultation;
  }

  async getConsultations(): Promise<Consultation[]> {
    return Array.from(this.consultations.values());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }
}

export const storage = new MemStorage();
