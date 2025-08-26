import {
  type User, type InsertUser, type Service, type InsertService,
  type Order, type InsertOrder, type Consultation, type InsertConsultation,
  type Message, type InsertMessage, type Invoice
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
}

export class JsonStorage implements IStorage {
  private dataDir = join(process.cwd(), 'data');
  private users: Map<string, User> = new Map();
  private services: Map<string, Service> = new Map();
  private orders: Map<string, Order> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private consultations: Map<string, Consultation> = new Map();
  private messages: Map<string, Message> = new Map();

  constructor() {
    this.ensureDataDir();
    this.loadData();
    this.initializeServices();
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
    const service: Service = { ...insertService, id };
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
    const message: Message = { ...insertMessage, id, createdAt: new Date() };
    this.messages.set(id, message);
    this.saveMessages();
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }
}

export const storage = new JsonStorage();