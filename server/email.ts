import { MailService } from '@sendgrid/mail';

// Set up SendGrid
const sgMail = new MailService();
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY not found in environment variables');
}

interface EmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  price: number;
  paymentStatus: string;
  paymentMethod: string;
  websiteSpecs?: any;
  invoiceHtml?: string;
}

export async function sendOrderNotificationEmail(data: EmailData) {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured, skipping email');
      return false;
    }

    const emailBody = generateOrderEmailHTML(data);
    
    const message = {
      to: 'ma3k.2025@gmail.com',
      from: 'noreply@ma3k.com', // Use a proper sender email
      subject: `طلب جديد رقم ${data.orderNumber} - ${data.serviceName}`,
      html: emailBody,
      text: `طلب جديد من ${data.customerName} - ${data.serviceName} - ${data.price} ريال سعودي`
    };

    await sgMail.send(message);
    console.log('✅ Email sent successfully to ma3k.2025@gmail.com');
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

function generateOrderEmailHTML(data: EmailData): string {
  const isWebsiteService = data.serviceName.includes('موقع') || data.serviceName.includes('تطبيق') || data.serviceName.includes('متجر');
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>طلب جديد - ${data.orderNumber}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 20px; 
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
        }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 10px 0 0; opacity: 0.9; font-size: 16px; }
        .content { padding: 40px 30px; }
        .order-info { 
            background: #f8faff; 
            padding: 25px; 
            border-radius: 15px; 
            margin-bottom: 30px;
            border-right: 4px solid #2a5298;
        }
        .info-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 15px; 
            padding-bottom: 15px; 
            border-bottom: 1px solid #e0e6ff;
        }
        .info-row:last-child { margin-bottom: 0; border-bottom: none; }
        .label { font-weight: 600; color: #2a5298; }
        .value { font-weight: 500; }
        .price { 
            font-size: 24px; 
            font-weight: 700; 
            color: #e74c3c; 
            text-align: center; 
            background: #fff5f5; 
            padding: 15px; 
            border-radius: 10px; 
            margin: 20px 0;
        }
        .website-specs {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin: 20px 0;
        }
        .website-specs h3 { margin: 0 0 20px; font-size: 20px; }
        .spec-item { 
            background: rgba(255,255,255,0.1); 
            padding: 10px 15px; 
            margin: 8px 0; 
            border-radius: 8px;
            backdrop-filter: blur(10px);
        }
        .status { 
            padding: 8px 20px; 
            border-radius: 20px; 
            font-weight: 600; 
            text-align: center; 
            margin: 10px 0;
        }
        .status.pending { background: #fff3cd; color: #856404; }
        .status.completed { background: #d4edda; color: #155724; }
        .footer { 
            background: #2c3e50; 
            color: white; 
            padding: 25px 30px; 
            text-align: center;
        }
        .action-btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            margin: 10px 5px;
            transition: transform 0.2s;
        }
        .action-btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 طلب جديد وصل!</h1>
            <p>رقم الطلب: ${data.orderNumber}</p>
        </div>
        
        <div class="content">
            <div class="order-info">
                <h2 style="margin-top: 0; color: #2a5298;">📋 تفاصيل الطلب</h2>
                
                <div class="info-row">
                    <span class="label">👤 اسم العميل:</span>
                    <span class="value">${data.customerName}</span>
                </div>
                
                <div class="info-row">
                    <span class="label">📧 البريد الإلكتروني:</span>
                    <span class="value">${data.customerEmail}</span>
                </div>
                
                <div class="info-row">
                    <span class="label">📱 رقم الهاتف:</span>
                    <span class="value">${data.customerPhone}</span>
                </div>
                
                <div class="info-row">
                    <span class="label">🛍️ الخدمة المطلوبة:</span>
                    <span class="value">${data.serviceName}</span>
                </div>
                
                <div class="info-row">
                    <span class="label">💳 طريقة الدفع:</span>
                    <span class="value">${data.paymentMethod}</span>
                </div>
                
                <div class="info-row">
                    <span class="label">📊 حالة الدفع:</span>
                    <span class="value status ${data.paymentStatus === 'completed' ? 'completed' : 'pending'}">
                        ${data.paymentStatus === 'completed' ? '✅ مدفوع' : '⏳ في الانتظار'}
                    </span>
                </div>
            </div>
            
            <div class="price">
                💰 المبلغ الإجمالي: ${data.price} ريال سعودي
            </div>
            
            ${isWebsiteService && data.websiteSpecs ? `
            <div class="website-specs">
                <h3>🌐 مواصفات الموقع المطلوب</h3>
                <div class="spec-item"><strong>اسم الموقع:</strong> ${data.websiteSpecs.websiteName || 'غير محدد'}</div>
                <div class="spec-item"><strong>الفكرة:</strong> ${data.websiteSpecs.idea || 'غير محددة'}</div>
                <div class="spec-item"><strong>الغرض:</strong> ${data.websiteSpecs.purpose || 'غير محدد'}</div>
                <div class="spec-item"><strong>الجمهور المستهدف:</strong> ${data.websiteSpecs.targetAudience || 'غير محدد'}</div>
                <div class="spec-item"><strong>نوع التصميم:</strong> ${data.websiteSpecs.designType || 'غير محدد'}</div>
                <div class="spec-item"><strong>الأقسام الرئيسية:</strong> ${[
                  data.websiteSpecs.mainSection1,
                  data.websiteSpecs.mainSection2,
                  data.websiteSpecs.mainSection3,
                  data.websiteSpecs.mainSection4,
                  data.websiteSpecs.mainSection5
                ].filter(Boolean).join(' - ') || 'غير محددة'}</div>
                <div class="spec-item"><strong>الوظائف الأساسية:</strong> ${[
                  data.websiteSpecs.mainFunction1,
                  data.websiteSpecs.mainFunction2,
                  data.websiteSpecs.mainFunction3
                ].filter(Boolean).join(' - ') || 'غير محددة'}</div>
                <div class="spec-item"><strong>اللغات:</strong> ${data.websiteSpecs.languages || 'غير محددة'}</div>
                <div class="spec-item"><strong>الأجهزة المدعومة:</strong> ${data.websiteSpecs.deviceSupport || 'غير محددة'}</div>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://wa.me/966532441566?text=بخصوص الطلب رقم ${data.orderNumber}" class="action-btn">
                    📱 تواصل عبر واتساب
                </a>
                <a href="mailto:${data.customerEmail}" class="action-btn">
                    📧 راسل العميل
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>منصة معك للخدمات الرقمية</strong></p>
            <p>تم إرسال هذا الإيميل تلقائياً من نظام إدارة الطلبات</p>
        </div>
    </div>
</body>
</html>`;
}