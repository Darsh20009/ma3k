import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const handleWhatsApp = () => {
    const phoneNumber = "201155201921";
    const message = "مرحباً! أود التواصل معكم بخصوص خدماتكم.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setIsOpen(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    // هنا يمكن إضافة API call لإرسال البريد
    toast({
      title: "تم الإرسال بنجاح!",
      description: "سنتواصل معك قريباً",
    });

    // إعادة تعيين النموذج
    setFormData({ name: "", email: "", message: "" });
    setShowEmailForm(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* زر التواصل العائم */}
      <motion.div
        className="fixed bottom-8 left-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        {/* نبض دائري خلف الزر */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full -z-10"
            style={{
              background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))"
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
            boxShadow: "0 0 30px var(--glow-teal), 0 0 60px var(--glow-green)"
          }}
          data-testid="button-contact-float"
        >
          {isOpen ? (
            <X className="w-8 h-8 text-white" />
          ) : (
            <MessageCircle className="w-8 h-8 text-white" />
          )}
        </motion.button>
      </motion.div>

      {/* قائمة الخيارات */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 left-8 z-50 w-80 md:w-96"
          >
            <div 
              className="glass-card rounded-2xl p-6 shadow-2xl"
              style={{
                background: "var(--ma3k-darker)",
                border: "1px solid var(--ma3k-teal)"
              }}
            >
              {showOptions && !showEmailForm && (
                <div className="space-y-4">
                  <h3 
                    className="text-xl font-bold mb-4 text-center"
                    style={{ color: "var(--ma3k-beige)" }}
                  >
                    تواصل معنا
                  </h3>

                  {/* واتساب */}
                  <Button
                    onClick={handleWhatsApp}
                    className="w-full py-6 text-lg font-semibold flex items-center justify-center gap-3 rounded-xl transition-all"
                    style={{
                      background: "linear-gradient(135deg, #25D366, #128C7E)",
                      color: "white"
                    }}
                    data-testid="button-whatsapp"
                  >
                    <FaWhatsapp size={24} />
                    واتساب
                  </Button>

                  {/* البريد الإلكتروني */}
                  <Button
                    onClick={() => {
                      setShowOptions(false);
                      setShowEmailForm(true);
                    }}
                    className="w-full py-6 text-lg font-semibold flex items-center justify-center gap-3 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                      color: "white"
                    }}
                    data-testid="button-email"
                  >
                    <Mail size={24} />
                    البريد الإلكتروني
                  </Button>

                  <p 
                    className="text-center text-sm mt-4"
                    style={{ color: "var(--ma3k-beige-dark)" }}
                  >
                    <a 
                      href="mailto:ma3k.2025@gmail.com"
                      className="hover:underline"
                      style={{ color: "var(--ma3k-green)" }}
                    >
                      ma3k.2025@gmail.com
                    </a>
                  </p>
                </div>
              )}

              {/* نموذج البريد الإلكتروني */}
              {showEmailForm && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleEmailSubmit}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 
                      className="text-xl font-bold"
                      style={{ color: "var(--ma3k-beige)" }}
                    >
                      إرسال رسالة
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowEmailForm(false);
                        setShowOptions(true);
                      }}
                      data-testid="button-back"
                    >
                      رجوع
                    </Button>
                  </div>

                  <Input
                    placeholder="الاسم"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-ma3k-dark border-ma3k-teal"
                    data-testid="input-name"
                  />

                  <Input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-ma3k-dark border-ma3k-teal"
                    data-testid="input-email"
                  />

                  <Textarea
                    placeholder="رسالتك..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="bg-ma3k-dark border-ma3k-teal resize-none"
                    data-testid="input-message"
                  />

                  <Button
                    type="submit"
                    className="w-full py-6 text-lg font-semibold flex items-center justify-center gap-3 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                      color: "white"
                    }}
                    data-testid="button-submit"
                  >
                    <Send size={20} />
                    إرسال
                  </Button>
                </motion.form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
