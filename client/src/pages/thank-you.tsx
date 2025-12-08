import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Home, 
  LayoutDashboard, 
  FileText, 
  MessageCircle,
  Clock,
  Phone,
  Mail,
  Rocket,
  Building2,
  Receipt,
  Calendar,
  User,
  CreditCard,
  ArrowLeft
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
    
    setTimeout(() => setShowContent(true), 300);
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
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: "var(--ma3k-green)" }}
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 
              className="text-3xl font-bold mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              شكراً لزيارتك
            </h1>
            <p 
              className="text-lg mb-8"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              نحن سعداء بخدمتك. تصفح خدماتنا واكتشف المزيد
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gap-2"
                style={{
                  background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                  color: "white"
                }}
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
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: "var(--ma3k-green)" }}
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
              
              <h1 
                className="text-4xl md:text-5xl font-bold mb-3"
                style={{ color: "var(--ma3k-beige)" }}
              >
                تم استلام طلبك بنجاح
              </h1>
              <p 
                className="text-xl"
                style={{ color: "var(--ma3k-beige-dark)" }}
              >
                شكراً لثقتك بنا، سيتم التواصل معك قريباً
              </p>
            </div>

            <Card className="glass-card p-8 mb-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "var(--ma3k-teal)" }}
                  >
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 
                      className="text-2xl font-bold"
                      style={{ color: "var(--ma3k-beige)" }}
                    >
                      تفاصيل الطلب
                    </h2>
                    <p 
                      className="text-sm"
                      style={{ color: "var(--ma3k-beige-dark)" }}
                    >
                      {formatDate(orderDetails.timestamp)}
                    </p>
                  </div>
                </div>
                <Badge 
                  className="text-sm px-4 py-2"
                  style={{ 
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    color: "var(--ma3k-green)",
                    border: "1px solid var(--ma3k-green)"
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                  تم الاستلام
                </Badge>
              </div>

              <Separator className="mb-6 opacity-20" />

              <div className="grid md:grid-cols-2 gap-6">
                {orderDetails.orderNumber && (
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(var(--ma3k-teal-rgb), 0.15)" }}
                    >
                      <FileText className="w-5 h-5" style={{ color: "var(--ma3k-teal)" }} />
                    </div>
                    <div>
                      <p 
                        className="text-sm mb-1"
                        style={{ color: "var(--ma3k-beige-dark)" }}
                      >
                        رقم الطلب
                      </p>
                      <p 
                        className="text-lg font-bold font-mono"
                        style={{ color: "var(--ma3k-green)" }}
                        data-testid="text-order-number"
                      >
                        {orderDetails.orderNumber}
                      </p>
                    </div>
                  </div>
                )}

                {orderDetails.customerName && (
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(var(--ma3k-teal-rgb), 0.15)" }}
                    >
                      <User className="w-5 h-5" style={{ color: "var(--ma3k-teal)" }} />
                    </div>
                    <div>
                      <p 
                        className="text-sm mb-1"
                        style={{ color: "var(--ma3k-beige-dark)" }}
                      >
                        اسم العميل
                      </p>
                      <p 
                        className="text-lg font-semibold"
                        style={{ color: "var(--ma3k-beige)" }}
                        data-testid="text-customer-name"
                      >
                        {orderDetails.customerName}
                      </p>
                    </div>
                  </div>
                )}

                {orderDetails.serviceName && (
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(var(--ma3k-teal-rgb), 0.15)" }}
                    >
                      <Building2 className="w-5 h-5" style={{ color: "var(--ma3k-teal)" }} />
                    </div>
                    <div>
                      <p 
                        className="text-sm mb-1"
                        style={{ color: "var(--ma3k-beige-dark)" }}
                      >
                        الخدمة
                      </p>
                      <p 
                        className="text-lg font-semibold"
                        style={{ color: "var(--ma3k-beige)" }}
                        data-testid="text-service-name"
                      >
                        {orderDetails.serviceName}
                      </p>
                    </div>
                  </div>
                )}

                {orderDetails.finalAmount && (
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(16, 185, 129, 0.15)" }}
                    >
                      <CreditCard className="w-5 h-5" style={{ color: "var(--ma3k-green)" }} />
                    </div>
                    <div>
                      <p 
                        className="text-sm mb-1"
                        style={{ color: "var(--ma3k-beige-dark)" }}
                      >
                        المبلغ الإجمالي
                      </p>
                      <p 
                        className="text-xl font-bold"
                        style={{ color: "var(--ma3k-green)" }}
                        data-testid="text-order-amount"
                      >
                        ${orderDetails.finalAmount}
                      </p>
                    </div>
                  </div>
                )}

                {orderDetails.paymentMethod && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(var(--ma3k-teal-rgb), 0.15)" }}
                    >
                      <Calendar className="w-5 h-5" style={{ color: "var(--ma3k-teal)" }} />
                    </div>
                    <div>
                      <p 
                        className="text-sm mb-1"
                        style={{ color: "var(--ma3k-beige-dark)" }}
                      >
                        طريقة الدفع
                      </p>
                      <p 
                        className="text-lg font-semibold"
                        style={{ color: "var(--ma3k-beige)" }}
                      >
                        {getPaymentMethodName(orderDetails.paymentMethod)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="glass-card p-6 mb-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(251, 191, 36, 0.15)" }}
                >
                  <Clock className="w-6 h-6" style={{ color: "#fbbf24" }} />
                </div>
                <div>
                  <h3 
                    className="text-xl font-bold mb-3"
                    style={{ color: "var(--ma3k-beige)" }}
                  >
                    الخطوات التالية
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--ma3k-green)" }} />
                      <span style={{ color: "var(--ma3k-beige-dark)" }}>
                        سيتم مراجعة طلبك خلال 24 ساعة عمل
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--ma3k-green)" }} />
                      <span style={{ color: "var(--ma3k-beige-dark)" }}>
                        سنتواصل معك عبر البريد الإلكتروني أو الهاتف لتأكيد الطلب
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--ma3k-green)" }} />
                      <span style={{ color: "var(--ma3k-beige-dark)" }}>
                        يمكنك متابعة حالة طلبك من لوحة التحكم الخاصة بك
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 mb-8 rounded-2xl">
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(var(--ma3k-teal-rgb), 0.15)" }}
                >
                  <MessageCircle className="w-6 h-6" style={{ color: "var(--ma3k-teal)" }} />
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ color: "var(--ma3k-beige)" }}
                  >
                    تحتاج مساعدة؟
                  </h3>
                  <p 
                    className="mb-4"
                    style={{ color: "var(--ma3k-beige-dark)" }}
                  >
                    فريق الدعم متاح لمساعدتك في أي وقت
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gap-2 text-lg px-8"
                style={{
                  background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                  color: "white"
                }}
                onClick={() => setLocation("/my-projects-complete")}
                data-testid="button-go-dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
                متابعة مشاريعي
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
            </div>

            <div className="text-center mt-10">
              <p style={{ color: "var(--ma3k-beige-dark)" }}>
                نقدر ثقتك بنا ونتطلع لخدمتك
              </p>
              <p 
                className="text-sm mt-2"
                style={{ color: "var(--ma3k-beige-dark)", opacity: 0.7 }}
              >
                منصة معك الرقمية - شريكك في النجاح
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
