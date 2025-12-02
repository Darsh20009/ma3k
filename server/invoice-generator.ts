import type { Order, Service, Invoice } from "@shared/schema";

export async function generateInvoicePDF(invoice: Invoice, order: Order): Promise<Buffer> {
  const html = generateSimplifiedInvoiceHTML(invoice, order);
  return Buffer.from(html, 'utf-8');
}

function generateSimplifiedInvoiceHTML(invoice: Invoice, order: Order): string {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>فاتورة ${invoice.invoiceNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; direction: rtl; padding: 40px; }
        .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; }
        .logo { font-size: 2.5em; color: #f59e0b; font-weight: bold; }
        .info { display: flex; justify-content: space-between; margin: 30px 0; }
        .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #7c3aed; color: white; padding: 15px; }
        td { padding: 15px; border-bottom: 1px solid #ddd; }
        .total { font-size: 1.5em; text-align: center; margin: 30px 0; color: #7c3aed; font-weight: bold; }
        .footer { text-align: center; color: #666; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">معك</div>
        <h1>فاتورة ضريبية</h1>
        <p>رقم الفاتورة: ${invoice.invoiceNumber}</p>
        <p>تاريخ الإصدار: ${new Date(invoice.createdAt!).toLocaleDateString('ar-SA')}</p>
    </div>
    <div class="info">
        <div class="info-box">
            <h3>معلومات العميل</h3>
            <p>الاسم: ${order.customerName}</p>
            <p>البريد: ${order.customerEmail}</p>
            <p>الهاتف: ${order.customerPhone || 'غير محدد'}</p>
        </div>
        <div class="info-box">
            <h3>معلومات الشركة</h3>
            <p>معك للخدمات الرقمية</p>
            <p>ma3k.2025@gmail.com</p>
            <p>+966532441566</p>
        </div>
    </div>
    <table>
        <thead>
            <tr><th>الخدمة</th><th>الوصف</th><th>السعر</th></tr>
        </thead>
        <tbody>
            <tr>
                <td>${order.serviceName}</td>
                <td>${order.description || 'خدمات رقمية متخصصة'}</td>
                <td>${invoice.amount} ر.س</td>
            </tr>
        </tbody>
    </table>
    <div class="total">المجموع: ${invoice.amount} ر.س</div>
    <div class="footer">
        <p>شكراً لاختياركم خدماتنا</p>
        <p>معك - نُصمم أحلامك الرقمية</p>
        <p>رقم الطلب: ${order.orderNumber}</p>
    </div>
</body>
</html>`;
}

export function generateInvoiceHTML(order: Order, service?: Service): string {
  const currentDate = new Date().toLocaleDateString('ar-SA');
  const invoiceId = `INV-${Date.now()}`;
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة - ${order.orderNumber}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #7c3aed 50%, #1e293b 100%);
            min-height: 100vh;
            padding: 20px;
            direction: rtl;
        }
        
        .invoice {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .header {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            padding: 40px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="white" opacity="0.1"/></svg>') repeat;
            background-size: 20px 20px;
        }
        
        .logo {
            background: white;
            width: 80px;
            height: 80px;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #f59e0b;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }
        
        .company-name {
            font-size: 2.5em;
            font-weight: bold;
            color: white;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
        }
        
        .company-tagline {
            font-size: 1.2em;
            color: white;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px;
        }
        
        .invoice-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .info-section h3 {
            color: #7c3aed;
            font-size: 1.3em;
            margin-bottom: 15px;
            border-bottom: 2px solid #f59e0b;
            padding-bottom: 8px;
        }
        
        .info-section p {
            margin-bottom: 8px;
            color: #374151;
            font-size: 1.1em;
        }
        
        .services-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-bottom: 40px;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .services-table th {
            background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 1.2em;
            font-weight: bold;
        }
        
        .services-table td {
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #e2e8f0;
            font-size: 1.1em;
        }
        
        .services-table tbody tr:hover {
            background: #e0e7ff;
        }
        
        .service-name {
            font-weight: bold;
            color: #1f2937;
        }
        
        .price {
            font-weight: bold;
            color: #059669;
            font-size: 1.2em;
        }
        
        .total-section {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 40px;
            text-align: center;
        }
        
        .total-amount {
            font-size: 2.5em;
            font-weight: bold;
            color: #7c3aed;
            margin-bottom: 10px;
        }
        
        .total-label {
            font-size: 1.3em;
            color: #4b5563;
            margin-bottom: 20px;
        }
        
        .payment-method {
            background: #fef3c7;
            padding: 15px 25px;
            border-radius: 25px;
            display: inline-block;
            color: #92400e;
            font-weight: bold;
            border: 2px solid #f59e0b;
        }
        
        .footer {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            padding: 30px;
            text-align: center;
        }
        
        .contact-info {
            color: white;
            margin-bottom: 20px;
        }
        
        .contact-info h4 {
            color: #f59e0b;
            margin-bottom: 10px;
            font-size: 1.2em;
        }
        
        .whatsapp-button {
            display: inline-flex;
            align-items: center;
            background: #25D366;
            color: white;
            padding: 12px 25px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .whatsapp-button:hover {
            background: #128C7E;
            transform: translateY(-2px);
        }
        
        .decoration {
            position: absolute;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
        }
        
        .decoration-1 { top: 20px; right: 20px; }
        .decoration-2 { bottom: 20px; left: 20px; }
        
        .thank-you {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 30px;
            font-size: 1.2em;
            font-weight: bold;
        }
        
        @media print {
            body { background: white; padding: 0; }
            .whatsapp-button { display: none; }
        }
        
        @media (max-width: 768px) {
            .invoice-info { grid-template-columns: 1fr; gap: 20px; }
            .content { padding: 20px; }
            .header { padding: 20px; }
            .company-name { font-size: 2em; }
            .total-amount { font-size: 2em; }
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="header">
            <div class="decoration decoration-1"></div>
            <div class="decoration decoration-2"></div>
            <div class="logo">معك</div>
            <h1 class="company-name">معك للحلول التقنية</h1>
            <p class="company-tagline">أحلامك الرقمية بين يديك</p>
        </div>
        
        <div class="content">
            <div class="thank-you">
                🎉 شكراً لك لاختيارنا! نحن سعداء بخدمتك وتحقيق أحلامك الرقمية
            </div>
            
            <div class="invoice-info">
                <div class="info-section">
                    <h3>📋 معلومات الفاتورة</h3>
                    <p><strong>رقم الفاتورة:</strong> ${invoiceId}</p>
                    <p><strong>رقم الطلب:</strong> ${order.orderNumber}</p>
                    <p><strong>تاريخ الإصدار:</strong> ${currentDate}</p>
                    <p><strong>حالة الدفع:</strong> ${order.paymentStatus === 'completed' ? '✅ مدفوع' : '⏳ في الانتظار'}</p>
                </div>
                
                <div class="info-section">
                    <h3>👤 معلومات العميل</h3>
                    <p><strong>الاسم:</strong> ${order.customerName}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${order.customerEmail}</p>
                    <p><strong>رقم الهاتف:</strong> ${order.customerPhone}</p>
                    <p><strong>طريقة الدفع:</strong> ${order.paymentMethod || 'غير محدد'}</p>
                </div>
            </div>
            
            <table class="services-table">
                <thead>
                    <tr>
                        <th>الخدمة</th>
                        <th>الوصف</th>
                        <th>السعر</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="service-name">${order.serviceName}</td>
                        <td>${order.description || 'خدمة مميزة من معك للحلول التقنية'}</td>
                        <td class="price">${order.price} ريال</td>
                    </tr>
                </tbody>
            </table>
            
            <div class="total-section">
                <div class="total-amount">${order.price} ريال</div>
                <div class="total-label">المبلغ الإجمالي</div>
                <div class="payment-method">💳 ${order.paymentMethod || 'طريقة الدفع'}</div>
            </div>
            
            ${order.description ? `
                <div style="background: #fef3c7; padding: 20px; border-radius: 15px; margin-bottom: 30px; border: 2px solid #f59e0b;">
                    <h4 style="color: #92400e; margin-bottom: 10px;">📝 تفاصيل إضافية:</h4>
                    <p style="color: #92400e; font-size: 1.1em; line-height: 1.6;">${order.description}</p>
                </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <div class="contact-info">
                <h4>📞 معلومات التواصل</h4>
                <p>للاستفسارات والدعم الفني</p>
                <p>واتساب: +966532441566</p>
            </div>
            
            <a href="https://wa.me/966532441566?text=مرحباً، أحتاج مساعدة بخصوص الطلب رقم: ${order.orderNumber}" 
               class="whatsapp-button" target="_blank">
                📱 تواصل معنا عبر واتساب
            </a>
            
            <div style="margin-top: 20px; color: #9ca3af; font-size: 0.9em;">
                <p>© 2025 معك للحلول التقنية - جميع الحقوق محفوظة</p>
                <p>فاتورة تم إنشاؤها تلقائياً بواسطة النظام الذكي</p>
            </div>
        </div>
    </div>
</body>
</html>`;
}