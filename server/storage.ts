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
        name: "موقع شخصي احترافي",
        description: "موقع شخصي مخصص بالكامل يعرض ملفك الشخصي، خدماتك، وأعمالك السابقة بتصميم عصري ومتجاوب",
        price: 2500,
        category: "تطوير المواقع",
        isActive: true,
      },
      {
        id: "2", 
        name: "متجر إلكتروني متكامل",
        description: "متجر إلكتروني احترافي مع نظام الدفع، إدارة المخزون، وتتبع الطلبات",
        price: 8500,
        category: "التجارة الإلكترونية",
        isActive: true,
      },
      {
        id: "3",
        name: "منصة تعليمية تفاعلية", 
        description: "منصة تعليمية شاملة مع نظام إدارة الدورات، الاختبارات، والشهادات",
        price: 12000,
        category: "المنصات التعليمية",
        isActive: true,
      },
      {
        id: "4",
        name: "تطبيق جوال متقدم",
        description: "تطبيق جوال أصلي لأنظمة iOS و Android مع واجهة مستخدم عصرية",
        price: 15000,
        category: "تطبيقات الجوال",
        isActive: true,
      },
      {
        id: "5",
        name: "هوية بصرية متكاملة",
        description: "تصميم شعار، هوية بصرية، وجميع المواد التسويقية بأسلوب احترافي",
        price: 3500,
        category: "التصميم الإبداعي",
        isActive: true,
      },
      {
        id: "6",
        name: "حملة تسويق رقمي شاملة",
        description: "استراتيجية تسويقية متكاملة تشمل وسائل التواصل الاجتماعي و SEO",
        price: 5500,
        category: "التسويق الرقمي",
        isActive: true,
      },
      {
        id: "7",
        name: "نظام إدارة مخصص",
        description: "نظام إدارة مخصص لعملك يتضمن إدارة العملاء، المخزون، والتقارير",
        price: 18000,
        category: "الحلول المخصصة", 
        isActive: true,
      },
      {
        id: "8",
        name: "حزمة البداية للشركات الناشئة",
        description: "حزمة متكاملة تشمل موقع، هوية بصرية، وخطة تسويقية مبدئية",
        price: 7500,
        category: "حزم الشركات",
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
