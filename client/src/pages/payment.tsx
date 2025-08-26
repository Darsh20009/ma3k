import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { WHATSAPP_MESSAGE_TEMPLATE, WHATSAPP_URL, BANK_DETAILS, WALLET_DETAILS } from "@/lib/constants";
import PayPalButton from "@/components/PayPalButton";
import type { CartItem } from "@/context/CartContext";
import { CheckCircle, CreditCard, Smartphone, University, Wallet, Download, MessageSquare } from "lucide-react";

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export default function Payment() {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: "", email: "", phone: "", notes: "" });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderId, setOrderId] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    const savedCustomer = localStorage.getItem('customerInfo');
    
    if (!savedCart || !savedCustomer) {
      setLocation('/cart');
      return;
    }
    
    setCartItems(JSON.parse(savedCart));
    setCustomerInfo(JSON.parse(savedCustomer));
  }, [setLocation]);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);

  const generateInvoice = async () => {
    try {
      setIsProcessing(true);
      
      // Get website specifications from localStorage if available
      const websiteSpecs = localStorage.getItem('websiteSpecs') || localStorage.getItem('websiteSpecifications');
      const parsedSpecs = websiteSpecs ? JSON.parse(websiteSpecs) : null;
      
      // Create order in backend with website specifications
      const orderData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        serviceName: cartItems.map(item => `${item.service.name} (${item.quantity}x)`).join(', '),
        price: totalPrice,
        description: `${cartItems.length} خدمات - ${customerInfo.notes || 'لا توجد ملاحظات'}`,
        paymentMethod: selectedPaymentMethod,
        websiteSpecs: parsedSpecs
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      const order = await response.json();
      
      setOrderNumber(order.orderNumber);
      setOrderId(order.id);
      
      // Generate invoice
      const invoiceData = {
        orderId: order.id,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        serviceName: orderData.serviceName,
        amount: totalPrice
      };

      const invoiceResponse = await apiRequest("POST", "/api/invoices", invoiceData);
      const invoice = await invoiceResponse.json();
      
      // Store the invoice ID for download
      setInvoiceId(invoice.id);
      
      setInvoiceGenerated(true);
      
      toast({
        title: "✅ تم إنشاء الفاتورة بنجاح!",
        description: `رقم الطلب: ${order.orderNumber}`,
      });

      // Clear cart data but keep website specs for potential reuse
      localStorage.removeItem('cartItems');
      localStorage.removeItem('customerInfo');

    } catch (error) {
      toast({
        title: "❌ خطأ في إنشاء الفاتورة",
        description: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleProceedWithPayment = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "⚠️ يرجى اختيار طريقة الدفع",
        description: "اختر طريقة الدفع المناسبة لك",
      });
      return;
    }

    await generateInvoice();
  };

  const sendWhatsAppMessage = () => {
    const message = WHATSAPP_MESSAGE_TEMPLATE(
      orderNumber,
      customerInfo.name,
      totalPrice,
      getPaymentMethodName(selectedPaymentMethod)
    );
    window.open(WHATSAPP_URL(message), "_blank");
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'paypal': return 'PayPal';
      case 'bank_transfer': return 'تحويل بنكي';
      case 'stc_pay': return 'STC Pay';
      case 'ur_pay': return 'UR Pay';
      case 'alinma_pay': return 'ALINMA Pay';
      default: return method;
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center relative">
        <div className="absolute inset-0 luxury-bg"></div>
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold text-gray-200 mb-4">🚫 لا توجد عناصر للدفع</h1>
          <Button onClick={() => setLocation('/services')} className="btn-luxury">
            العودة للتسوق
          </Button>
        </div>
      </div>
    );
  }

  if (invoiceGenerated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
        <div className="absolute inset-0 luxury-bg"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="luxury-card p-12 rounded-3xl text-center">
              <div className="w-32 h-32 rounded-full gold-gradient flex items-center justify-center mx-auto mb-8 animate-gold-pulse">
                <CheckCircle className="w-16 h-16 text-black" />
              </div>
              
              <h1 className="text-5xl font-bold animate-text-shimmer mb-6 text-gray-200">
                🎉 تم إنشاء طلبك بنجاح!
              </h1>
              
              <div className="luxury-divider mb-8"></div>
              
              <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 p-8 rounded-2xl mb-8 border border-yellow-400/20">
                <h2 className="text-2xl font-bold text-gray-200 mb-4">📋 تفاصيل الطلب</h2>
                <div className="grid md:grid-cols-2 gap-6 text-right">
                  <div>
                    <strong className="text-yellow-400">رقم الطلب:</strong>
                    <div className="text-2xl font-bold text-gray-200">{orderNumber}</div>
                  </div>
                  <div>
                    <strong className="text-yellow-400">المبلغ الإجمالي:</strong>
                    <div className="text-2xl font-bold text-gray-200">{totalPrice} ر.س</div>
                  </div>
                  <div>
                    <strong className="text-yellow-400">طريقة الدفع:</strong>
                    <div className="text-lg text-gray-300">{getPaymentMethodName(selectedPaymentMethod)}</div>
                  </div>
                  <div>
                    <strong className="text-yellow-400">العميل:</strong>
                    <div className="text-lg text-gray-300">{customerInfo.name}</div>
                  </div>
                </div>
              </div>

              {selectedPaymentMethod !== 'paypal' && (
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 p-8 rounded-2xl mb-8 border border-green-400/30">
                  <h3 className="text-xl font-bold text-green-400 mb-4">
                    📤 الخطوة التالية: إرسال سند التحويل
                  </h3>
                  <p className="text-gray-300 mb-6">
                    قم بإجراء التحويل ثم أرسل صورة السند عبر واتساب لتأكيد الدفع
                  </p>
                  
                  <Button 
                    onClick={sendWhatsAppMessage}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg font-bold rounded-2xl hover:scale-105 transition-all duration-300"
                  >
                    <MessageSquare className="w-5 h-5 ml-2" />
                    📱 إرسال عبر واتساب
                  </Button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.open(`/api/invoices/${invoiceId}/download`, '_blank')}
                  className="btn-luxury px-8 py-4 text-lg font-bold rounded-2xl"
                  disabled={!invoiceId}
                >
                  <Download className="w-5 h-5 ml-2" />
                  📄 تحميل الفاتورة
                </Button>
                
                <Button 
                  onClick={() => setLocation('/')}
                  variant="outline"
                  className="px-8 py-4 text-lg font-bold rounded-2xl"
                >
                  🏠 العودة للرئيسية
                </Button>
              </div>
              
              <p className="text-center text-gray-300 mt-8">
                ⏰ سنتواصل معك خلال 1-24 ساعة لتأكيد الدفع وبدء التنفيذ
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      <div className="absolute inset-0 luxury-bg"></div>
      
      {/* Header */}
      <section className="dark-gradient text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 luxury-bg opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-text-shimmer">
            💳 صفحة الدفع
          </h1>
          <div className="luxury-divider mb-6"></div>
          <p className="text-xl opacity-90">
            اختر طريقة الدفع المناسبة وأكمل طلبك
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <div className="luxury-card p-8 rounded-3xl mb-8">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-200">🔐 طرق الدفع الآمنة</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* PayPal - مُعطّل مؤقتاً */}
                  <div 
                    className="luxury-card p-6 rounded-2xl opacity-50 cursor-not-allowed"
                  >
                    <div className="text-center">
                      <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2 text-gray-200">PayPal</h3>
                      <p className="text-gray-300 mb-4">قريباً</p>
                      <div className="text-center p-2 bg-blue-900/20 rounded-lg border border-blue-400/30">
                        <p className="text-blue-300 text-xs">
                          متاح قريباً
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bank Transfer */}
                  <div 
                    className={`luxury-card p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedPaymentMethod === 'bank_transfer' ? 'ring-4 ring-green-400 bg-green-500/10 border-green-400/30' : 'hover:bg-white/5'
                    }`}
                    onClick={() => handlePaymentMethodSelect('bank_transfer')}
                  >
                    <div className="text-center">
                      <University className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2 text-gray-200">تحويل بنكي</h3>
                      <div className="text-sm space-y-2">
                        {BANK_DETAILS.map((bank, idx) => (
                          <div key={idx} className="border-b border-gray-600 pb-2 last:border-b-0">
                            <p className="text-gray-300 font-medium">{bank.BANK_NAME}</p>
                            <p className="text-xs text-gray-400 font-mono">{bank.IBAN}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* STC Pay */}
                  <div 
                    className={`luxury-card p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedPaymentMethod === 'stc_pay' ? 'ring-4 ring-purple-400 bg-purple-500/10 border-purple-400/30' : 'hover:bg-white/5'
                    }`}
                    onClick={() => handlePaymentMethodSelect('stc_pay')}
                  >
                    <div className="text-center">
                      <Smartphone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2 text-gray-200">STC Pay</h3>
                      <p className="text-gray-300 font-mono">{WALLET_DETAILS.STC_PAY}</p>
                    </div>
                  </div>

                  {/* Digital Wallets */}
                  <div 
                    className={`luxury-card p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedPaymentMethod === 'ur_pay' ? 'ring-4 ring-orange-400 bg-orange-500/10 border-orange-400/30' : 'hover:bg-white/5'
                    }`}
                    onClick={() => handlePaymentMethodSelect('ur_pay')}
                  >
                    <div className="text-center">
                      <Wallet className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2 text-gray-200">المحافظ الرقمية</h3>
                      <p className="text-gray-300 text-sm">UR PAY: {WALLET_DETAILS.UR_PAY}</p>
                      <p className="text-gray-300 text-sm">ALINMA: {WALLET_DETAILS.ALINMA_PAY}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="luxury-card p-8 rounded-3xl sticky top-8 border-2 border-yellow-400/30">
                <h3 className="text-2xl font-bold mb-6 text-center text-yellow-400">📊 ملخص الطلب</h3>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.service.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-200">{item.service.name}</span>
                        <span className="text-gray-400 text-sm"> × {item.quantity}</span>
                      </div>
                      <span className="font-bold text-gray-200">{item.service.price * item.quantity} ر.س</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-300">المجموع الفرعي:</span>
                    <span className="font-bold text-gray-200">{totalPrice} ر.س</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>رسوم المعالجة:</span>
                    <span>مجاناً</span>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex justify-between text-2xl font-bold text-yellow-400 mb-8">
                  <span>المجموع النهائي:</span>
                  <span>{totalPrice} ر.س</span>
                </div>

                <div className="space-y-4 mb-6 text-sm text-gray-300">
                  <div><strong className="text-yellow-400">العميل:</strong> {customerInfo.name}</div>
                  <div><strong className="text-yellow-400">البريد:</strong> {customerInfo.email}</div>
                  <div><strong className="text-yellow-400">الهاتف:</strong> {customerInfo.phone}</div>
                </div>
                
                {selectedPaymentMethod !== 'paypal' && (
                  <Button 
                    onClick={handleProceedWithPayment}
                    disabled={!selectedPaymentMethod || isProcessing}
                    className="w-full btn-luxury py-4 text-lg font-bold rounded-2xl"
                  >
                    {isProcessing ? (
                      <span>⏳ جاري المعالجة...</span>
                    ) : (
                      <span>🚀 تأكيد وإنشاء الفاتورة</span>
                    )}
                  </Button>
                )}
                
                <p className="text-center text-xs text-gray-400 mt-4">
                  🔒 معاملة آمنة ومحمية بالكامل
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}