import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Sparkles, 
  Home, 
  LayoutDashboard, 
  FileText, 
  MessageCircle,
  Star,
  Rocket,
  Heart,
  Clock,
  Phone,
  Mail,
  ArrowLeft,
  Download,
  Gift
} from "lucide-react";

interface OrderDetails {
  orderNumber?: string;
  orderId?: string;
  customerName?: string;
  customerEmail?: string;
  serviceName?: string;
  finalAmount?: number;
  paymentMethod?: string;
  timestamp?: string;
}

const confettiColors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: confettiColors[i % confettiColors.length],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 20,
            rotate: Math.random() * 720 - 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatDelay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

function FloatingStars() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </motion.div>
      ))}
    </div>
  );
}

export default function ThankYouPage() {
  const [, setLocation] = useLocation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({});
  const [showContent, setShowContent] = useState(false);
  const [hasValidOrder, setHasValidOrder] = useState(true);

  useEffect(() => {
    const savedOrder = localStorage.getItem("lastOrderDetails");
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        if (parsed && (parsed.orderNumber || parsed.customerName)) {
          setOrderDetails(parsed);
          setHasValidOrder(true);
        } else {
          setHasValidOrder(false);
        }
      } catch (e) {
        console.error("Failed to parse order details");
        setHasValidOrder(false);
      }
    } else {
      setHasValidOrder(false);
    }
    
    setTimeout(() => setShowContent(true), 500);
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString("ar-SA");
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodName = (method?: string) => {
    switch (method) {
      case "paypal": return "PayPal";
      case "egypt_transfer": return "تحويل بنكي / اتصالات كاش";
      case "bank_transfer": return "تحويل بنكي";
      case "stc_pay": return "STC Pay";
      default: return method || "غير محدد";
    }
  };

  const sendWhatsAppMessage = () => {
    const message = encodeURIComponent(
      `مرحباً،\n\nأود المتابعة بخصوص طلبي:\n` +
      `رقم الطلب: ${orderDetails.orderNumber || "غير متوفر"}\n` +
      `الاسم: ${orderDetails.customerName || "غير متوفر"}\n\n` +
      `شكراً لكم!`
    );
    window.open(`https://wa.me/966570708801?text=${message}`, "_blank");
  };

  if (!hasValidOrder && showContent) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full mx-auto mb-8 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              شكراً لزيارتك!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              نحن سعداء بخدمتك. تصفح خدماتنا واكتشف المزيد!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => setLocation("/services")}
                data-testid="button-browse-services"
              >
                <Rocket className="w-5 h-5" />
                تصفح الخدمات
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => setLocation("/")}
                data-testid="button-go-home-fallback"
              >
                <Home className="w-5 h-5" />
                الصفحة الرئيسية
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      <Confetti />
      <FloatingStars />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            delay: 0.2 
          }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="relative inline-block"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-green-500/30">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <motion.div
              className="absolute -bottom-1 -left-3"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            </motion.div>
          </motion.div>
        </motion.div>

        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center mb-10">
              <motion.h1 
                className="text-4xl md:text-6xl font-extrabold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500">
                  شكراً لك!
                </span>
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                تم استلام طلبك بنجاح وجاري المراجعة
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="p-8 mb-8 bg-gradient-to-br from-background to-muted/30 border-2 border-primary/20 shadow-xl">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">تفاصيل الطلب</h2>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(orderDetails.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                    تم الاستلام
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {orderDetails.orderNumber && (
                    <motion.div 
                      className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm text-muted-foreground mb-1">رقم الطلب</p>
                      <p className="text-2xl font-bold font-mono text-primary" data-testid="text-order-number">
                        {orderDetails.orderNumber}
                      </p>
                    </motion.div>
                  )}

                  {orderDetails.customerName && (
                    <motion.div 
                      className="p-4 rounded-xl bg-muted/50 border border-border"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm text-muted-foreground mb-1">اسم العميل</p>
                      <p className="text-xl font-semibold" data-testid="text-customer-name">
                        {orderDetails.customerName}
                      </p>
                    </motion.div>
                  )}

                  {orderDetails.serviceName && (
                    <motion.div 
                      className="p-4 rounded-xl bg-muted/50 border border-border"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm text-muted-foreground mb-1">الخدمة</p>
                      <p className="text-lg font-semibold" data-testid="text-service-name">
                        {orderDetails.serviceName}
                      </p>
                    </motion.div>
                  )}

                  {orderDetails.finalAmount && (
                    <motion.div 
                      className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm text-muted-foreground mb-1">المبلغ</p>
                      <p className="text-2xl font-bold text-emerald-600" data-testid="text-order-amount">
                        ${orderDetails.finalAmount}
                      </p>
                    </motion.div>
                  )}

                  {orderDetails.paymentMethod && (
                    <motion.div 
                      className="p-4 rounded-xl bg-muted/50 border border-border md:col-span-2"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm text-muted-foreground mb-1">طريقة الدفع</p>
                      <p className="text-lg font-semibold">
                        {getPaymentMethodName(orderDetails.paymentMethod)}
                      </p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Card className="p-6 mb-8 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border-2 border-amber-500/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-amber-600">الخطوات التالية</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        سيتم مراجعة إيصال التحويل خلال 24 ساعة
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        سنتواصل معك لتأكيد الطلب وبدء التنفيذ
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        يمكنك متابعة حالة طلبك من لوحة التحكم
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <Card className="p-6 mb-8 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-blue-600">تحتاج مساعدة؟</h3>
                    <p className="text-muted-foreground mb-4">
                      نحن هنا لمساعدتك! تواصل معنا في أي وقت
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={sendWhatsAppMessage}
                        data-testid="button-whatsapp-contact"
                      >
                        <MessageCircle className="w-4 h-4" />
                        واتساب
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => window.location.href = "tel:+966570708801"}
                        data-testid="button-phone-contact"
                      >
                        <Phone className="w-4 h-4" />
                        اتصل بنا
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => window.location.href = "mailto:ma3k.2025@gmail.com"}
                        data-testid="button-email-contact"
                      >
                        <Mail className="w-4 h-4" />
                        البريد الإلكتروني
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-lg px-8"
                onClick={() => setLocation("/client-dashboard")}
                data-testid="button-go-dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
                لوحة التحكم
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8"
                onClick={() => setLocation("/")}
                data-testid="button-go-home"
              >
                <Home className="w-5 h-5" />
                الصفحة الرئيسية
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8"
                onClick={() => setLocation("/services")}
                data-testid="button-continue-shopping"
              >
                <Rocket className="w-5 h-5" />
                تصفح الخدمات
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground">
                نقدر ثقتك بنا ونتطلع لخدمتك
              </p>
              <div className="flex justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2 + i * 0.1 }}
                  >
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
