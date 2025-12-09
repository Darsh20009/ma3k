import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MessageCircle, CheckCircle, Clock, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    contactMethod: "email"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactMethodChange = (method: string) => {
    setFormData(prev => ({
      ...prev,
      contactMethod: method
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.contactMethod === "whatsapp") {
        const whatsappMessage = `مرحباً! أريد التواصل معكم\n\nالاسم: ${formData.name}\nرقم الهاتف: ${formData.phone}\n\nالرسالة: ${formData.message}`;
        const whatsappUrl = `https://wa.me/201155201921?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        setIsSubmitted(true);
      } else {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: "ma3k.2025@gmail.com",
            phone: formData.phone,
            message: `طلب تواصل جديد من العميل:\n\nاسم العميل: ${formData.name}\nرقم الهاتف: ${formData.phone}\n\nرسالة العميل:\n${formData.message}\n\nطريقة التواصل المفضلة: إيميل`
          }),
        });

        if (response.ok) {
          setIsSubmitted(true);
          setFormData({ name: "", phone: "", message: "", contactMethod: "email" });
          
          toast({
            title: "تم إرسال الرسالة بنجاح",
            description: "سنتواصل معك قريباً إن شاء الله",
          });
        } else {
          throw new Error("Failed to send message");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: Clock, text: "استجابة سريعة خلال ساعة" },
    { icon: Users, text: "فريق متخصص ومحترف" },
    { icon: Shield, text: "أسعار تنافسية ومناسبة" },
    { icon: CheckCircle, text: "دعم فني مستمر" }
  ];

  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center py-24 px-6"
        style={{ background: "var(--ma3k-darker)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg mx-auto"
        >
          <Card 
            className="border-0"
            style={{ 
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)"
            }}
          >
            <CardContent className="p-8 md:p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "var(--ma3k-green)" }}
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ color: "var(--ma3k-beige)" }}
              >
                تم إرسال رسالتك بنجاح!
              </h1>
              <p 
                className="mb-8"
                style={{ color: "var(--ma3k-beige-dark)" }}
              >
                شكراً لتواصلك معنا. تم استلام رسالتك وسنرد عليك في أقرب وقت ممكن إن شاء الله.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  style={{ 
                    background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                    color: "white"
                  }}
                  data-testid="button-send-another"
                >
                  إرسال رسالة أخرى
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/"}
                  style={{ 
                    borderColor: "var(--ma3k-green)",
                    color: "var(--ma3k-green)"
                  }}
                  data-testid="button-back-home"
                >
                  العودة للرئيسية
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-24"
      style={{ background: "var(--ma3k-darker)" }}
    >
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge 
            className="mb-6 px-4 py-2"
            style={{ 
              background: "var(--glass-bg)", 
              border: "1px solid var(--ma3k-green)", 
              color: "var(--ma3k-green)" 
            }}
            data-testid="badge-contact"
          >
            <MessageCircle className="w-4 h-4 ml-2" />
            نحن هنا لمساعدتك
          </Badge>
          <h1 
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ color: "var(--ma3k-beige)" }}
          >
            تواصل <span style={{ color: "var(--ma3k-green)" }}>معنا</span>
          </h1>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "var(--ma3k-beige-dark)" }}
          >
            نحن هنا للإجابة على استفساراتك ومساعدتك في تحقيق أهدافك الرقمية
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card 
              className="border-0"
              style={{ 
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)"
              }}
            >
              <CardContent className="p-6 md:p-8">
                <h2 
                  className="text-2xl font-bold mb-6"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  أرسل لنا رسالة
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label 
                      className="block mb-2 text-sm font-medium"
                      style={{ color: "var(--ma3k-beige-dark)" }}
                    >
                      الاسم *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="border"
                      style={{ 
                        background: "var(--ma3k-dark)",
                        borderColor: "var(--ma3k-border)",
                        color: "var(--ma3k-beige)"
                      }}
                      placeholder="اكتب اسمك الكريم"
                      data-testid="input-name"
                    />
                  </div>

                  <div>
                    <label 
                      className="block mb-2 text-sm font-medium"
                      style={{ color: "var(--ma3k-beige-dark)" }}
                    >
                      رقم الهاتف *
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="border"
                      style={{ 
                        background: "var(--ma3k-dark)",
                        borderColor: "var(--ma3k-border)",
                        color: "var(--ma3k-beige)"
                      }}
                      placeholder="05xxxxxxxx"
                      data-testid="input-phone"
                    />
                  </div>

                  <div>
                    <label 
                      className="block mb-2 text-sm font-medium"
                      style={{ color: "var(--ma3k-beige-dark)" }}
                    >
                      الرسالة *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="resize-none border"
                      style={{ 
                        background: "var(--ma3k-dark)",
                        borderColor: "var(--ma3k-border)",
                        color: "var(--ma3k-beige)"
                      }}
                      placeholder="اكتب رسالتك هنا..."
                      data-testid="textarea-message"
                    />
                  </div>

                  {/* Contact Method Selection */}
                  <div>
                    <label 
                      className="block mb-3 text-sm font-medium"
                      style={{ color: "var(--ma3k-beige-dark)" }}
                    >
                      طريقة التواصل المفضلة
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleContactMethodChange("email")}
                        className="p-4 rounded-xl border-2 transition-all"
                        style={{
                          borderColor: formData.contactMethod === "email" ? "var(--ma3k-green)" : "var(--ma3k-border)",
                          background: formData.contactMethod === "email" ? "rgba(122, 201, 67, 0.1)" : "var(--ma3k-dark)"
                        }}
                        data-testid="button-method-email"
                      >
                        <Mail className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--ma3k-green)" }} />
                        <span className="font-medium" style={{ color: "var(--ma3k-beige)" }}>الإيميل</span>
                        <p className="text-xs mt-1" style={{ color: "var(--ma3k-beige-dark)" }}>ma3k.2025@gmail.com</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleContactMethodChange("whatsapp")}
                        className="p-4 rounded-xl border-2 transition-all"
                        style={{
                          borderColor: formData.contactMethod === "whatsapp" ? "var(--ma3k-teal)" : "var(--ma3k-border)",
                          background: formData.contactMethod === "whatsapp" ? "rgba(0, 168, 150, 0.1)" : "var(--ma3k-dark)"
                        }}
                        data-testid="button-method-whatsapp"
                      >
                        <MessageCircle className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--ma3k-teal)" }} />
                        <span className="font-medium" style={{ color: "var(--ma3k-beige)" }}>واتساب</span>
                        <p className="text-xs mt-1" style={{ color: "var(--ma3k-beige-dark)" }}>201155201921</p>
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    style={{ 
                      background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                      color: "white"
                    }}
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        {formData.contactMethod === "whatsapp" ? "إرسال عبر واتساب" : "إرسال الرسالة"}
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <Card 
              className="border-0"
              style={{ 
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)"
              }}
            >
              <CardContent className="p-6">
                <h3 
                  className="text-xl font-bold mb-6"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  معلومات التواصل
                </h3>
                
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))" }}
                    >
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: "var(--ma3k-beige)" }}>البريد الإلكتروني</h4>
                      <p style={{ color: "var(--ma3k-beige-dark)" }}>ma3k.2025@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, var(--ma3k-green), var(--ma3k-teal))" }}
                    >
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: "var(--ma3k-beige)" }}>رقم الهاتف والواتساب</h4>
                      <p dir="ltr" style={{ color: "var(--ma3k-beige-dark)" }}>+20 115 520 1921</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))" }}
                    >
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: "var(--ma3k-beige)" }}>الدعم الفني</h4>
                      <p style={{ color: "var(--ma3k-beige-dark)" }}>متاح 24/7 لخدمتك</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-0"
              style={{ 
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)"
              }}
            >
              <CardContent className="p-6">
                <h3 
                  className="text-xl font-bold mb-6"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  أوقات العمل
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center gap-4">
                    <span style={{ color: "var(--ma3k-beige-dark)" }}>السبت - الخميس</span>
                    <span className="font-semibold" style={{ color: "var(--ma3k-beige)" }}>9:00 ص - 11:00 م</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span style={{ color: "var(--ma3k-beige-dark)" }}>الجمعة</span>
                    <span className="font-semibold" style={{ color: "var(--ma3k-beige)" }}>2:00 م - 11:00 م</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span style={{ color: "var(--ma3k-beige-dark)" }}>الاستجابة</span>
                    <span className="font-semibold" style={{ color: "var(--ma3k-green)" }}>خلال ساعة واحدة</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-0"
              style={{ 
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)"
              }}
            >
              <CardContent className="p-6">
                <h3 
                  className="text-xl font-bold mb-4"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  لماذا تختارنا؟
                </h3>
                
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <benefit.icon className="w-5 h-5 flex-shrink-0" style={{ color: "var(--ma3k-green)" }} />
                      <span style={{ color: "var(--ma3k-beige-dark)" }}>{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
