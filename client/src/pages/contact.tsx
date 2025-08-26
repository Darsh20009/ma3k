import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MessageCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    contactMethod: "email" // email or whatsapp
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
        // إرسال إلى واتساب
        const whatsappMessage = `مرحباً! أريد التواصل معكم\n\nالاسم: ${formData.name}\nرقم الهاتف: ${formData.phone}\n\nالرسالة: ${formData.message}`;
        const whatsappUrl = `https://wa.me/966532441566?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
      } else {
        // إرسال إلى الإيميل
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: "ma3k.2025@gmail.com", // الإيميل المطلوب للإرسال إليه
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto px-6"
        >
          <div className="glass-card rounded-3xl p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-4">تم إرسال رسالتك بنجاح!</h1>
            <p className="text-gray-300 mb-8">
              شكراً لتواصلك معنا. تم استلام رسالتك وسنرد عليك في أقرب وقت ممكن إن شاء الله.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold"
              >
                إرسال رسالة أخرى
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/"}
                className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black"
              >
                العودة للرئيسية
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="luxury-h1 text-amber-400 mb-6">تواصل معنا</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            نحن هنا للإجابة على استفساراتك ومساعدتك في تحقيق أهدافك الرقمية
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">أرسل لنا رسالة</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">الاسم *</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="اكتب اسمك الكريم"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">رقم الهاتف *</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="05xxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">الرسالة *</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="bg-gray-800/50 border-gray-600 text-white resize-none"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>

              {/* Contact Method Selection */}
              <div>
                <label className="block text-gray-300 mb-4">طريقة التواصل المفضلة</label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleContactMethodChange("email")}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.contactMethod === "email"
                        ? "border-amber-400 bg-amber-400/10"
                        : "border-gray-600 bg-gray-800/30"
                    }`}
                  >
                    <Mail className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                    <span className="text-white font-medium">الإيميل</span>
                    <p className="text-sm text-gray-400 mt-1">ma3k.2025@gmail.com</p>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleContactMethodChange("whatsapp")}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.contactMethod === "whatsapp"
                        ? "border-green-400 bg-green-400/10"
                        : "border-gray-600 bg-gray-800/30"
                    }`}
                  >
                    <MessageCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
                    <span className="text-white font-medium">واتساب</span>
                    <p className="text-sm text-gray-400 mt-1">966532441566</p>
                  </motion.button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">معلومات التواصل</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">البريد الإلكتروني</h4>
                    <p className="text-gray-300">ma3k.2025@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">رقم الهاتف والواتساب</h4>
                    <p className="text-gray-300" dir="ltr">+966 53 244 1566</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">الدعم الفني</h4>
                    <p className="text-gray-300">متاح 24/7 لخدمتك</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">أوقات العمل</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">السبت - الخميس</span>
                  <span className="text-white font-semibold">9:00 ص - 11:00 م</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">الجمعة</span>
                  <span className="text-white font-semibold">2:00 م - 11:00 م</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">الاستجابة</span>
                  <span className="text-amber-400 font-semibold">خلال ساعة واحدة</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">لماذا تختارنا؟</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">استجابة سريعة خلال ساعة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">فريق متخصص ومحترف</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">أسعار تنافسية ومناسبة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">دعم فني مستمر</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}