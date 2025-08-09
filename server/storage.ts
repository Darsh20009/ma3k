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
        description: "موقع شخصي بسيط مع تصميم نظيف وسهل الاستخدام",
        price: 400,
        category: "المواقع الشخصية",
        isActive: true,
      },
      {
        id: "2", 
        name: "تطبيق شخصي محترف",
        description: "تطبيق شخصي محترف مع خصائص متقدمة وتصميم عصري",
        price: 600,
        category: "التطبيقات",
        isActive: true,
      },
      {
        id: "3",
        name: "موقع تعليمي غير ربحي", 
        description: "موقع تعليمي غير ربحي مع نظام إدارة المحتوى التعليمي",
        price: 1100,
        category: "التعليم",
        isActive: true,
      },
      {
        id: "4",
        name: "موقع تعليمي ربحي",
        description: "موقع تعليمي ربحي مع نظام الدفع والاشتراكات", 
        price: 1499,
        category: "التعليم",
        isActive: true,
      },
      {
        id: "5",
        name: "موقع إلكتروني ومتجر",
        description: "موقع إلكتروني مع متجر إلكتروني متكامل ونظام دفع",
        price: 550,
        category: "التجارة الإلكترونية",
        isActive: true,
      },
      {
        id: "6", 
        name: "صنع شعار",
        description: "تصميم شعار احترافي مع ملفات متعددة الصيغ",
        price: 15,
        category: "التصميم",
        isActive: true,
      },
      {
        id: "7",
        name: "متابعة مبتدئ",
        description: "خدمة متابعة مبتدئة لإدارة الحسابات الشخصية",
        price: 50,
        category: "المتابعة",
        isActive: true,
      },
      {
        id: "8", 
        name: "متابعة احترافي",
        description: "خدمة متابعة احترافية مع تقارير مفصلة",
        price: 115,
        category: "المتابعة",
        isActive: true,
      },
      {
        id: "9",
        name: "متابعة خبير",
        description: "خدمة متابعة على مستوى خبير مع استراتيجيات متقدمة",
        price: 150,
        category: "المتابعة",
        isActive: true,
      },
      {
        id: "10", 
        name: "تصميم اختبارات تفاعلية / عادية",
        description: "تصميم اختبارات تفاعلية أو عادية للمواقع التعليمية",
        price: 50,
        category: "التفاعلية",
        isActive: true,
      },
      {
        id: "11",
        name: "النظام اللامحدود",
        description: "نظام شامل بخصائص لامحدودة حسب المتطلبات",
        price: 200,
        category: "الأنظمة",
        isActive: true,
      },
      {
        id: "12",
        name: "موقع شركة احترافي",
        description: "موقع شركة احترافي بتصميم عصري ومتجاوب",
        price: 800,
        category: "المواقع التجارية",
        isActive: true,
      },
      {
        id: "13",
        name: "تطبيق أعمال متقدم",
        description: "تطبيق أعمال متقدم مع خصائص إدارية شاملة",
        price: 1200,
        category: "التطبيقات",
        isActive: true,
      },
      {
        id: "14",
        name: "حملة تسويقية إبداعية",
        description: "حملة تسويقية إبداعية مع محتوى مميز",
        price: 300,
        category: "التسويق",
        isActive: true,
      },
      {
        id: "15",
        name: "استشارة تقنية متخصصة",
        description: "استشارة تقنية متخصصة لحل المشاكل التقنية",
        price: 100,
        category: "الاستشارات",
        isActive: true,
      },
      {
        id: "16",
        name: "نظام إدارة محتوى",
        description: "نظام إدارة محتوى مخصص وسهل الاستخدام",
        price: 750,
        category: "الأنظمة",
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
