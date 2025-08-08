import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  dueDate: string;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
  paymentMethod: string;
}

export default function InvoiceGenerator() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${new Date().getTime()}`,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    items: [
      { id: "1", description: "خدمة تطوير موقع", quantity: 1, price: 2500, total: 2500 }
    ],
    subtotal: 2500,
    tax: 375, // 15%
    discount: 0,
    total: 2875,
    notes: "شكراً لك على اختيار خدماتنا",
    paymentMethod: "تحويل بنكي"
  });

  const [activeTemplate, setActiveTemplate] = useState<"modern" | "classic" | "cyber">("modern");

  const generateHTML = (template: string) => {
    const templates = {
      modern: generateModernInvoice(),
      classic: generateClassicInvoice(),
      cyber: generateCyberInvoice()
    };
    return templates[template as keyof typeof templates];
  };

  const generateModernInvoice = () => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة ${invoiceData.invoiceNumber}</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Tajawal', sans-serif;
            background: linear-gradient(135deg, #0f1419 0%, #1a202c 100%);
            color: #e2e8f0;
            padding: 20px;
            min-height: 100vh;
        }
        
        .invoice {
            max-width: 800px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border: 2px solid #3b82f6;
            border-radius: 20px;
            padding: 40px;
            position: relative;
            overflow: hidden;
            box-shadow: 
                0 20px 60px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .invoice::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
            pointer-events: none;
        }
        
        .invoice-header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
            z-index: 1;
        }
        
        .invoice-logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: linear-gradient(135deg, #3b82f6, #10b981);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
            font-weight: bold;
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }
        
        .invoice-title {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #3b82f6, #10b981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        
        .invoice-number {
            font-size: 1.2rem;
            color: #94a3b8;
            font-weight: 600;
        }
        
        .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 30px 0;
            position: relative;
            z-index: 1;
        }
        
        .invoice-section {
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-radius: 15px;
            border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .invoice-section h3 {
            color: #3b82f6;
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            position: relative;
            z-index: 1;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 10px;
            overflow: hidden;
        }
        
        .invoice-table th,
        .invoice-table td {
            padding: 15px;
            text-align: right;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .invoice-table th {
            background: linear-gradient(135deg, #3b82f6, #10b981);
            color: white;
            font-weight: 700;
        }
        
        .invoice-total {
            background: linear-gradient(135deg, #3b82f6, #10b981);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            margin: 30px 0;
            position: relative;
            z-index: 1;
        }
        
        .invoice-total-amount {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 5px;
        }
        
        .invoice-footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid rgba(59, 130, 246, 0.2);
            position: relative;
            z-index: 1;
        }
        
        .invoice-qr {
            width: 100px;
            height: 100px;
            background: white;
            margin: 20px auto;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: #1e293b;
        }
        
        @media print {
            body { background: white; color: black; }
            .invoice { box-shadow: none; border: 1px solid #ddd; }
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="invoice-header">
            <div class="invoice-logo">م</div>
            <h1 class="invoice-title">فاتورة</h1>
            <p class="invoice-number">رقم الفاتورة: ${invoiceData.invoiceNumber}</p>
        </div>
        
        <div class="invoice-details">
            <div class="invoice-section">
                <h3>بيانات العميل</h3>
                <p><strong>الاسم:</strong> ${invoiceData.customerName}</p>
                <p><strong>البريد:</strong> ${invoiceData.customerEmail}</p>
                <p><strong>الهاتف:</strong> ${invoiceData.customerPhone}</p>
                <p><strong>العنوان:</strong> ${invoiceData.customerAddress}</p>
            </div>
            
            <div class="invoice-section">
                <h3>تفاصيل الفاتورة</h3>
                <p><strong>تاريخ الإصدار:</strong> ${invoiceData.date}</p>
                <p><strong>تاريخ الاستحقاق:</strong> ${invoiceData.dueDate}</p>
                <p><strong>طريقة الدفع:</strong> ${invoiceData.paymentMethod}</p>
            </div>
        </div>
        
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>الإجمالي</th>
                    <th>السعر</th>
                    <th>الكمية</th>
                    <th>الوصف</th>
                </tr>
            </thead>
            <tbody>
                ${invoiceData.items.map(item => `
                <tr>
                    <td>${item.total} ر.س</td>
                    <td>${item.price} ر.س</td>
                    <td>${item.quantity}</td>
                    <td>${item.description}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="invoice-total">
            <div class="invoice-total-amount">${invoiceData.total} ر.س</div>
            <p>المبلغ الإجمالي</p>
        </div>
        
        <div class="invoice-footer">
            <div class="invoice-qr">QR</div>
            <p>شكراً لاختياركم خدماتنا</p>
            <p>معك - منصتك الرقمية المتكاملة</p>
            <p>ma3k.2025@gmail.com | +20 115 520 1921</p>
        </div>
    </div>
</body>
</html>
`;

  const generateClassicInvoice = () => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة ${invoiceData.invoiceNumber}</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Tajawal', sans-serif;
            background: #f8fafc;
            color: #1e293b;
            padding: 20px;
        }
        
        .invoice {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .invoice-header {
            text-align: center;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .invoice-title {
            font-size: 2.5rem;
            color: #3b82f6;
            margin-bottom: 10px;
        }
        
        .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .invoice-table th,
        .invoice-table td {
            padding: 12px;
            text-align: right;
            border: 1px solid #e2e8f0;
        }
        
        .invoice-table th {
            background: #f1f5f9;
            font-weight: bold;
        }
        
        .total-section {
            text-align: left;
            margin-top: 20px;
        }
        
        .total-amount {
            font-size: 1.5rem;
            font-weight: bold;
            color: #3b82f6;
            padding: 15px;
            background: #eff6ff;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="invoice-header">
            <h1 class="invoice-title">فاتورة</h1>
            <p>رقم الفاتورة: ${invoiceData.invoiceNumber}</p>
        </div>
        
        <div class="invoice-details">
            <div>
                <h3>بيانات العميل</h3>
                <p><strong>الاسم:</strong> ${invoiceData.customerName}</p>
                <p><strong>البريد:</strong> ${invoiceData.customerEmail}</p>
                <p><strong>الهاتف:</strong> ${invoiceData.customerPhone}</p>
            </div>
            
            <div>
                <h3>تفاصيل الفاتورة</h3>
                <p><strong>التاريخ:</strong> ${invoiceData.date}</p>
                <p><strong>الاستحقاق:</strong> ${invoiceData.dueDate}</p>
                <p><strong>طريقة الدفع:</strong> ${invoiceData.paymentMethod}</p>
            </div>
        </div>
        
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>الإجمالي</th>
                    <th>السعر</th>
                    <th>الكمية</th>
                    <th>الوصف</th>
                </tr>
            </thead>
            <tbody>
                ${invoiceData.items.map(item => `
                <tr>
                    <td>${item.total} ر.س</td>
                    <td>${item.price} ر.س</td>
                    <td>${item.quantity}</td>
                    <td>${item.description}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="total-section">
            <div class="total-amount">المجموع الكلي: ${invoiceData.total} ر.س</div>
        </div>
    </div>
</body>
</html>
`;

  const generateCyberInvoice = () => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة ${invoiceData.invoiceNumber}</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Tajawal', sans-serif;
            background: #000;
            color: #00ff41;
            padding: 20px;
            min-height: 100vh;
            background-image: 
                linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px);
            background-size: 20px 20px;
            animation: matrix 20s linear infinite;
        }
        
        @keyframes matrix {
            0% { background-position: 0 0; }
            100% { background-position: 20px 20px; }
        }
        
        .invoice {
            max-width: 800px;
            margin: 0 auto;
            background: linear-gradient(135deg, rgba(0, 30, 20, 0.9), rgba(0, 50, 30, 0.9));
            border: 2px solid #00ff41;
            border-radius: 10px;
            padding: 40px;
            position: relative;
            overflow: hidden;
            box-shadow: 
                0 0 20px #00ff41,
                inset 0 0 20px rgba(0, 255, 65, 0.1);
        }
        
        .invoice::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #00ff41, #00cc33, #00ff41, #00cc33);
            z-index: -1;
            border-radius: 10px;
            animation: borderGlow 2s ease-in-out infinite alternate;
        }
        
        @keyframes borderGlow {
            0% { box-shadow: 0 0 5px #00ff41; }
            100% { box-shadow: 0 0 20px #00ff41, 0 0 30px #00ff41; }
        }
        
        .invoice-header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
        }
        
        .invoice-title {
            font-size: 3rem;
            font-weight: 900;
            text-shadow: 0 0 10px #00ff41;
            margin-bottom: 10px;
            animation: textGlow 2s ease-in-out infinite alternate;
        }
        
        @keyframes textGlow {
            0% { text-shadow: 0 0 5px #00ff41; }
            100% { text-shadow: 0 0 20px #00ff41, 0 0 30px #00ff41; }
        }
        
        .invoice-number {
            font-size: 1.2rem;
            color: #00cc33;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
        }
        
        .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 30px 0;
        }
        
        .invoice-section {
            background: rgba(0, 255, 65, 0.1);
            padding: 20px;
            border: 1px solid #00ff41;
            border-radius: 5px;
            box-shadow: inset 0 0 10px rgba(0, 255, 65, 0.2);
        }
        
        .invoice-section h3 {
            color: #00ff41;
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            border: 1px solid #00ff41;
        }
        
        .invoice-table th,
        .invoice-table td {
            padding: 15px;
            text-align: right;
            border: 1px solid #00ff41;
            background: rgba(0, 255, 65, 0.05);
        }
        
        .invoice-table th {
            background: rgba(0, 255, 65, 0.2);
            color: #00ff41;
            font-weight: 700;
            text-shadow: 0 0 5px #00ff41;
        }
        
        .invoice-total {
            background: linear-gradient(135deg, rgba(0, 255, 65, 0.2), rgba(0, 204, 51, 0.2));
            color: #00ff41;
            padding: 30px;
            border: 2px solid #00ff41;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
        }
        
        .invoice-total-amount {
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 10px;
            text-shadow: 0 0 15px #00ff41;
            font-family: 'Courier New', monospace;
        }
        
        .invoice-footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid #00ff41;
        }
        
        .matrix-text {
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
            opacity: 0.7;
            letter-spacing: 1px;
        }
        
        @media print {
            body { background: white; color: black; }
            .invoice { box-shadow: none; border: 2px solid #000; }
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="invoice-header">
            <h1 class="invoice-title">INVOICE_CYBER.EXE</h1>
            <p class="invoice-number">ID: ${invoiceData.invoiceNumber}</p>
            <p class="matrix-text">>>> SYSTEM AUTHENTICATED <<<</p>
        </div>
        
        <div class="invoice-details">
            <div class="invoice-section">
                <h3>CLIENT_DATA.TXT</h3>
                <p>NAME: ${invoiceData.customerName}</p>
                <p>EMAIL: ${invoiceData.customerEmail}</p>
                <p>PHONE: ${invoiceData.customerPhone}</p>
                <p>ADDRESS: ${invoiceData.customerAddress}</p>
            </div>
            
            <div class="invoice-section">
                <h3>INVOICE_INFO.LOG</h3>
                <p>DATE: ${invoiceData.date}</p>
                <p>DUE: ${invoiceData.dueDate}</p>
                <p>METHOD: ${invoiceData.paymentMethod}</p>
                <p>STATUS: PENDING</p>
            </div>
        </div>
        
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>TOTAL</th>
                    <th>PRICE</th>
                    <th>QTY</th>
                    <th>DESCRIPTION</th>
                </tr>
            </thead>
            <tbody>
                ${invoiceData.items.map(item => `
                <tr>
                    <td>${item.total} SAR</td>
                    <td>${item.price} SAR</td>
                    <td>${item.quantity}</td>
                    <td>${item.description}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="invoice-total">
            <div class="invoice-total-amount">${invoiceData.total} SAR</div>
            <p class="matrix-text">>>> PAYMENT REQUIRED <<<</p>
        </div>
        
        <div class="invoice-footer">
            <p class="matrix-text">>>> END OF TRANSMISSION <<<</p>
            <p>معك - DIGITAL MATRIX SERVICES</p>
            <p>ma3k.2025@gmail.com | +20 115 520 1921</p>
        </div>
    </div>
</body>
</html>
`;

  const downloadInvoice = () => {
    const html = generateHTML(activeTemplate);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `فاتورة-${invoiceData.invoiceNumber}-${activeTemplate}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const previewInvoice = () => {
    const html = generateHTML(activeTemplate);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    }
  };

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      price: 0,
      total: 0
    };
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, newItem]
    });
  };

  const updateItem = (id: string, field: string, value: any) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    });
    
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + tax - invoiceData.discount;
    
    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
      subtotal,
      tax,
      total
    });
  };

  const removeItem = (id: string) => {
    const updatedItems = invoiceData.items.filter(item => item.id !== id);
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax - invoiceData.discount;
    
    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
      subtotal,
      tax,
      total
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-background text-foreground">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            مولد الفواتير الإبداعي
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          أنشئ فواتير HTML إبداعية وأنيقة بتصاميم متنوعة
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <i className="fas fa-edit ml-3"></i>
              بيانات الفاتورة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">رقم الفاتورة</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                <Input
                  id="paymentMethod"
                  value={invoiceData.paymentMethod}
                  onChange={(e) => setInvoiceData({...invoiceData, paymentMethod: e.target.value})}
                  className="bg-background/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customerName">اسم العميل</Label>
              <Input
                id="customerName"
                value={invoiceData.customerName}
                onChange={(e) => setInvoiceData({...invoiceData, customerName: e.target.value})}
                className="bg-background/50"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={invoiceData.customerEmail}
                  onChange={(e) => setInvoiceData({...invoiceData, customerEmail: e.target.value})}
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">رقم الهاتف</Label>
                <Input
                  id="customerPhone"
                  value={invoiceData.customerPhone}
                  onChange={(e) => setInvoiceData({...invoiceData, customerPhone: e.target.value})}
                  className="bg-background/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customerAddress">عنوان العميل</Label>
              <Textarea
                id="customerAddress"
                value={invoiceData.customerAddress}
                onChange={(e) => setInvoiceData({...invoiceData, customerAddress: e.target.value})}
                className="bg-background/50"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">تاريخ الإصدار</Label>
                <Input
                  id="date"
                  type="date"
                  value={invoiceData.date}
                  onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                  className="bg-background/50"
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>عناصر الفاتورة</Label>
                <Button size="sm" onClick={addItem} className="bg-primary hover:bg-primary/80">
                  <i className="fas fa-plus ml-2"></i>
                  إضافة عنصر
                </Button>
              </div>
              
              <div className="space-y-4">
                {invoiceData.items.map((item) => (
                  <Card key={item.id} className="p-4 bg-muted/20">
                    <div className="grid md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <Input
                          placeholder="وصف الخدمة"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="الكمية"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="bg-background/50"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="السعر"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {item.total} ر.س
                        </span>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => removeItem(item.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                className="bg-background/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview and Templates */}
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <i className="fas fa-eye ml-3"></i>
              معاينة القوالب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTemplate} onValueChange={(value) => setActiveTemplate(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="modern">عصري</TabsTrigger>
                <TabsTrigger value="classic">كلاسيكي</TabsTrigger>
                <TabsTrigger value="cyber">سايبر</TabsTrigger>
              </TabsList>

              <TabsContent value="modern" className="mt-6">
                <div className="text-center">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-lg mb-4 flex items-center justify-center border border-primary/20">
                    <div className="text-center">
                      <i className="fas fa-magic text-4xl text-primary mb-2"></i>
                      <p className="text-sm text-muted-foreground">قالب عصري بتأثيرات متقدمة</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    تصميم عصري مع تدرجات وتأثيرات ضوئية جميلة
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="classic" className="mt-6">
                <div className="text-center">
                  <div className="w-full h-48 bg-slate-100/10 rounded-lg mb-4 flex items-center justify-center border border-primary/20">
                    <div className="text-center">
                      <i className="fas fa-file-alt text-4xl text-primary mb-2"></i>
                      <p className="text-sm text-muted-foreground">قالب كلاسيكي بسيط</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    تصميم كلاسيكي نظيف ومهني للاستخدام التقليدي
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="cyber" className="mt-6">
                <div className="text-center">
                  <div className="w-full h-48 bg-green-500/10 rounded-lg mb-4 flex items-center justify-center border border-green-500/20">
                    <div className="text-center">
                      <i className="fas fa-terminal text-4xl text-green-500 mb-2"></i>
                      <p className="text-sm text-green-400">قالب سايبر فوتورستك</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    تصميم مستقبلي بأسلوب Matrix مع تأثيرات متحركة
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-4">
              <div className="bg-muted/20 rounded-lg p-4">
                <div className="flex justify-between items-center text-sm">
                  <span>المجموع الفرعي:</span>
                  <span>{invoiceData.subtotal} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>الضريبة (15%):</span>
                  <span>{invoiceData.tax} ر.س</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-border">
                  <span>المجموع الكلي:</span>
                  <span className="text-primary">{invoiceData.total} ر.س</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={previewInvoice} className="flex-1 bg-accent hover:bg-accent/80">
                  <i className="fas fa-eye ml-2"></i>
                  معاينة
                </Button>
                <Button onClick={downloadInvoice} className="flex-1 bg-primary hover:bg-primary/80">
                  <i className="fas fa-download ml-2"></i>
                  تحميل HTML
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}