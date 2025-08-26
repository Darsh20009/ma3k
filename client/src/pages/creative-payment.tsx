import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Download,
  CheckCircle,
  MessageCircle,
  Sparkles,
  Receipt,
  Star,
  Zap
} from "lucide-react";

export default function CreativePayment() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "", 
    phone: "",
    projectIdea: ""
  });

  const totalPrice = getTotalPrice();

  const paymentMethods = [
    {
      id: "paypal",
      name: "PayPal",
      icon: CreditCard,
      description: "دفع دولي آمن",
      color: "from-blue-500 to-blue-600",
      available: true
    },
    {
      id: "stc_pay",
      name: "STC Pay",
      icon: Smartphone,
      description: "دفع محلي سعودي",
      color: "from-purple-500 to-purple-600",
      available: true
    },
    {
      id: "bank_transfer",
      name: "تحويل بنكي",
      icon: Building,
      description: "تحويل مباشر للحساب",
      color: "from-green-500 to-green-600",
      available: true
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const generateInvoice = async (orderId: string) => {
    try {
      const response = await apiRequest("POST", "/api/generate-invoice", { orderId });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `invoice-${orderId}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "تم تحميل الفاتورة",
          description: "تم تحميل الفاتورة بنجاح",
        });
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      toast({
        title: "اختر طريقة الدفع",
        description: "يرجى اختيار طريقة دفع أولاً",
        variant: "destructive"
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order for each service
      const orders = await Promise.all(
        cart.map(async (service) => {
          const orderData = {
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            serviceId: service.id,
            serviceName: service.name,
            price: service.price,
            description: customerInfo.projectIdea || `طلب خدمة: ${service.name}`,
            paymentMethod: selectedPayment
          };
          
          const response = await apiRequest("POST", "/api/orders", orderData);
          return await response.json();
        })
      );

      // Generate invoices for all orders
      await Promise.all(orders.map(order => generateInvoice(order.id)));

      clearCart();
      
      toast({
        title: "تم إنشاء الطلب بنجاح! 🎉",
        description: "سيتم التواصل معك قريباً لتأكيد التفاصيل",
      });

      // Redirect to WhatsApp with order details
      const orderSummary = orders.map(order => 
        `${order.serviceName} - ${order.price} ريال`
      ).join('\n');
      
      const whatsappMessage = `مرحباً، قمت بطلب الخدمات التالية:\n\n${orderSummary}\n\nالمجموع: ${totalPrice} ريال\nطريقة الدفع: ${selectedPayment}\n\nفكرة المشروع: ${customerInfo.projectIdea || 'غير محدد'}`;
      
      window.open(`https://wa.me/966532441566?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء معالجة الطلب، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="container mx-auto px-6 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold text-white mb-6">السلة فارغة</h1>
            <p className="text-xl text-gray-300 mb-8">لم تقم بإضافة أي خدمات للسلة بعد</p>
            <a href="/services">
              <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3 px-8 rounded-full">
                تصفح الخدمات
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-amber-400 mb-4">إتمام الطلب</h1>
            <p className="text-xl text-gray-300">اكمل بياناتك واختر طريقة الدفع المناسبة</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="glass-card rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Receipt className="w-6 h-6 ml-2 text-amber-400" />
                ملخص الطلب
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((service) => (
                  <div key={service.id} className="flex justify-between items-start p-4 bg-white/5 rounded-2xl">
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1">{service.name}</h3>
                      {service.originalPrice && (
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive" className="text-xs">
                            خصم {Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}%
                          </Badge>
                          <span className="text-gray-500 line-through text-sm">
                            {service.originalPrice} ريال
                          </span>
                        </div>
                      )}
                      {service.features && (
                        <div className="text-gray-400 text-sm">
                          {service.features.slice(0, 2).map((feature, idx) => (
                            <div key={idx} className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-400 ml-1" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-amber-400 font-bold text-xl">
                      {service.price} ريال
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />
              
              <div className="flex justify-between items-center text-2xl font-bold">
                <span className="text-white">المجموع:</span>
                <span className="text-amber-400">{totalPrice} ريال</span>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="glass-card rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">بيانات العميل</h2>

              <div className="space-y-6 mb-8">
                <div>
                  <Label htmlFor="name" className="text-white mb-2 block">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="اكتب اسمك الكامل"
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white mb-2 block">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="example@email.com"
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white mb-2 block">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="+966xxxxxxxxx"
                    data-testid="input-phone"
                  />
                </div>

                <div>
                  <Label htmlFor="idea" className="text-white mb-2 block">فكرة المشروع (اختياري)</Label>
                  <Textarea
                    id="idea"
                    value={customerInfo.projectIdea}
                    onChange={(e) => handleInputChange("projectIdea", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                    placeholder="اكتب فكرة مشروعك أو متطلباتك الخاصة..."
                    data-testid="textarea-idea"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <h3 className="text-xl font-bold text-white mb-4">اختر طريقة الدفع</h3>
              <div className="grid gap-4 mb-8">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedPayment === method.id
                        ? "border-amber-400 bg-amber-400/10 shadow-lg"
                        : "border-white/20 bg-white/5 hover:border-amber-400/50"
                    }`}
                    data-testid={`payment-${method.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${method.color} flex items-center justify-center text-white mr-4`}>
                          <method.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-white font-bold">{method.name}</div>
                          <div className="text-gray-400 text-sm">{method.description}</div>
                        </div>
                      </div>
                      {selectedPayment === method.id && (
                        <CheckCircle className="w-6 h-6 text-amber-400" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="luxury-btn w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg shadow-xl disabled:opacity-50"
                data-testid="button-submit-order"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full ml-2"></div>
                    جاري المعالجة...
                  </div>
                ) : (
                  <>
                    <Zap className="w-6 h-6 ml-2" />
                    تأكيد الطلب ({totalPrice} ريال)
                  </>
                )}
              </Button>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm mb-4">
                  سيتم تحميل الفاتورة تلقائياً بعد تأكيد الطلب
                </p>
                <a 
                  href="https://wa.me/966532441566" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 ml-1" />
                  تحتاج مساعدة؟ تواصل معنا
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}