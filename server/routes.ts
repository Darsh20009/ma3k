import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertConsultationSchema, insertMessageSchema } from "@shared/schema";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";

export async function registerRoutes(app: Express): Promise<Server> {
  // PayPal routes
  app.get("/api/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.get("/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/api/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  app.post("/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  // Website form submission route
  app.post("/api/website-form", async (req, res) => {
    try {
      const formData = req.body;
      
      // Generate HTML/CSS export based on form data
      const htmlContent = generateHtmlFromForm(formData);
      const cssContent = generateCssFromForm(formData);
      
      // Create a comprehensive specification document
      const specification = {
        ...formData,
        htmlTemplate: htmlContent,
        cssTemplate: cssContent,
        timestamp: new Date().toISOString(),
        exportId: `WEB-${Date.now()}`
      };
      
      res.status(201).json({
        success: true,
        specification,
        downloadLinks: {
          html: `/api/download/html/${specification.exportId}`,
          css: `/api/download/css/${specification.exportId}`,
          complete: `/api/download/complete/${specification.exportId}`
        }
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid form data" });
    }
  });

  // Download routes for HTML/CSS exports
  app.get("/api/download/html/:exportId", (req, res) => {
    const { exportId } = req.params;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="website-${exportId}.html"`);
    res.send(generateSampleHtml(exportId));
  });

  app.get("/api/download/css/:exportId", (req, res) => {
    const { exportId } = req.params;
    res.setHeader('Content-Type', 'text/css');
    res.setHeader('Content-Disposition', `attachment; filename="styles-${exportId}.css"`);
    res.send(generateSampleCss(exportId));
  });

  // Orders routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.put("/api/orders/:id/payment", async (req, res) => {
    try {
      const { paymentMethod, paymentStatus } = req.body;
      const order = await storage.updateOrderPayment(req.params.id, paymentMethod, paymentStatus);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Create invoice if payment is completed
      if (paymentStatus === "completed") {
        await storage.createInvoice(req.params.id);
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update payment" });
    }
  });

  // Consultations routes
  app.post("/api/consultations", async (req, res) => {
    try {
      const consultationData = insertConsultationSchema.parse(req.body);
      const consultation = await storage.createConsultation(consultationData);
      res.status(201).json(consultation);
    } catch (error) {
      res.status(400).json({ error: "Invalid consultation data" });
    }
  });

  // Messages routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  // Invoice routes
  app.post("/api/invoices", async (req, res) => {
    try {
      const { orderId, customerName, customerEmail, serviceName, amount } = req.body;
      const invoice = await storage.createInvoice(orderId);
      res.status(201).json(invoice);
    } catch (error) {
      console.error("Invoice creation error:", error);
      res.status(500).json({ error: "Failed to create invoice" });
    }
  });

  app.get("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoice" });
    }
  });

  // Invoice download route  
  app.get("/api/invoices/:id/download", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      
      const order = await storage.getOrder(invoice.orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const invoiceHtml = generateInvoiceHtml(invoice, order);
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.html"`);
      res.send(invoiceHtml);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate invoice download" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for HTML/CSS generation
function generateHtmlFromForm(formData: any): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.websiteName || 'موقع جديد'}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>${formData.websiteName || 'اسم الموقع'}</h1>
        <nav>
            <ul>
                <li><a href="#${formData.mainSection1 || 'section1'}">${formData.mainSection1 || 'القسم الأول'}</a></li>
                <li><a href="#${formData.mainSection2 || 'section2'}">${formData.mainSection2 || 'القسم الثاني'}</a></li>
                <li><a href="#${formData.mainSection3 || 'section3'}">${formData.mainSection3 || 'القسم الثالث'}</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="hero">
            <h2>مرحباً بك في ${formData.websiteName || 'موقعنا'}</h2>
            <p>${formData.purpose || 'هدف الموقع'}</p>
        </section>
        
        <section id="${formData.mainSection1 || 'section1'}">
            <h2>${formData.mainSection1 || 'القسم الأول'}</h2>
            <p>محتوى ${formData.mainSection1 || 'القسم الأول'}</p>
        </section>
        
        <section id="${formData.mainSection2 || 'section2'}">
            <h2>${formData.mainSection2 || 'القسم الثاني'}</h2>
            <p>محتوى ${formData.mainSection2 || 'القسم الثاني'}</p>
        </section>
        
        <section id="${formData.mainSection3 || 'section3'}">
            <h2>${formData.mainSection3 || 'القسم الثالث'}</h2>
            <p>محتوى ${formData.mainSection3 || 'القسم الثالث'}</p>
        </section>
    </main>
    
    <footer>
        <p>© 2025 ${formData.websiteName || 'اسم الموقع'}. جميع الحقوق محفوظة.</p>
    </footer>
</body>
</html>`;
}

function generateCssFromForm(formData: any): string {
  const designType = formData.designType || 'modern';
  const primaryColor = designType === 'classic' ? '#2c3e50' : '#3498db';
  
  return `/* تصميم ${formData.websiteName || 'الموقع'} */
/* نوع التصميم: ${designType} */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Tajawal', 'Arial', sans-serif;
    direction: rtl;
    text-align: right;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
}

header {
    background: ${primaryColor};
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

header h1 {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

nav ul {
    display: flex;
    justify-content: center;
    list-style: none;
    gap: 2rem;
}

nav a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: background-color 0.3s;
}

nav a:hover {
    background-color: rgba(255,255,255,0.2);
}

main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

section {
    margin-bottom: 3rem;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

#hero {
    text-align: center;
    background: linear-gradient(135deg, ${primaryColor}, #2980b9);
    color: white;
}

h2 {
    margin-bottom: 1rem;
    color: ${primaryColor};
    font-size: 2rem;
}

#hero h2 {
    color: white;
}

p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
}

footer {
    background: #34495e;
    color: white;
    text-align: center;
    padding: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    nav ul {
        flex-direction: column;
        gap: 1rem;
    }
    
    main {
        padding: 1rem;
    }
    
    header h1 {
        font-size: 2rem;
    }
}

/* ${formData.additionalFeature1 || 'ميزة إضافية'} styles */
.feature-highlight {
    border-right: 4px solid ${primaryColor};
    padding-right: 1rem;
}

/* Target audience: ${formData.targetAudience || 'الجمهور المستهدف'} */
/* Budget range: ${formData.budget || 'الميزانية المحددة'} */
/* Content type: ${formData.contentType || 'نوع المحتوى'} */`;
}

function generateSampleHtml(exportId: string): string {
  return generateHtmlFromForm({ 
    websiteName: `موقع-${exportId}`,
    mainSection1: 'الرئيسية',
    mainSection2: 'الخدمات', 
    mainSection3: 'تواصل معنا',
    purpose: 'موقع احترافي'
  });
}

function generateSampleCss(exportId: string): string {
  return generateCssFromForm({ 
    designType: 'modern',
    websiteName: `موقع-${exportId}`
  });
}

function generateInvoiceHtml(invoice: any, order: any): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة رقم ${invoice.invoiceNumber}</title>
    <style>
        body {
            font-family: 'Tajawal', Arial, sans-serif;
            direction: rtl;
            text-align: right;
            margin: 0;
            padding: 20px;
            background: #f8f9fa;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .logo {
            font-size: 2rem;
            font-weight: bold;
            color: #f59e0b;
            margin-bottom: 10px;
        }
        .invoice-title {
            font-size: 1.8rem;
            color: #333;
            margin: 20px 0;
        }
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .info-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            flex: 1;
            margin: 0 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: right;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f59e0b;
            color: white;
        }
        .total-row {
            font-weight: bold;
            background-color: #f8f9fa;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="logo">معك</div>
            <h1 class="invoice-title">فاتورة ضريبية</h1>
            <p>رقم الفاتورة: ${invoice.invoiceNumber}</p>
            <p>تاريخ الإصدار: ${new Date(invoice.createdAt).toLocaleDateString('ar-SA')}</p>
        </div>
        
        <div class="info-section">
            <div class="info-box">
                <h3>معلومات العميل</h3>
                <p><strong>الاسم:</strong> ${order.customerName}</p>
                <p><strong>البريد الإلكتروني:</strong> ${order.customerEmail}</p>
                <p><strong>الهاتف:</strong> ${order.customerPhone || 'غير محدد'}</p>
            </div>
            <div class="info-box">
                <h3>معلومات الشركة</h3>
                <p><strong>معك للخدمات الرقمية</strong></p>
                <p>البريد: ma3k.2025@gmail.com</p>
                <p>الهاتف: 966532441566</p>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>الخدمة</th>
                    <th>الوصف</th>
                    <th>السعر</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${order.serviceName}</td>
                    <td>${order.description || 'خدمات رقمية متخصصة'}</td>
                    <td>${order.price} ر.س</td>
                </tr>
                <tr class="total-row">
                    <td colspan="2"><strong>المجموع الكلي</strong></td>
                    <td><strong>${invoice.amount} ر.س</strong></td>
                </tr>
            </tbody>
        </table>
        
        <div class="footer">
            <p>شكراً لاختياركم خدماتنا</p>
            <p>معك - نُصمم أحلامك الرقمية</p>
            <p>رقم الطلب: ${order.orderNumber}</p>
        </div>
    </div>
</body>
</html>`;
}
