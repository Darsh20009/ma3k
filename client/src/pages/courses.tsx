import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Code, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

export default function Courses() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    language: "",
    fullName: "",
    email: "",
    phone: "",
    age: "",
    reason: "",
    goal: ""
  });

  const programmingLanguages = [
    "Python",
    "Java",
    "JavaScript",
    "C++",
    "Front-End Development",
    "Back-End Development",
    "Full-Stack Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من العمر
    const age = parseInt(formData.age);
    if (age < 14) {
      toast({
        title: "عذراً",
        description: "يجب أن يكون العمر 14 سنة أو أكثر",
        variant: "destructive"
      });
      return;
    }

    // إرسال البيانات إلى واتساب
    const message = `
🎓 طلب تسجيل في الدورات

📚 اللغة المطلوبة: ${formData.language}
👤 الاسم الثلاثي: ${formData.fullName}
📧 البريد الإلكتروني: ${formData.email}
📱 رقم الجوال: ${formData.phone}
🎂 العمر: ${formData.age}
❓ سبب التعلم: ${formData.reason}
🎯 الهدف: ${formData.goal}
    `.trim();

    const whatsappUrl = `https://wa.me/+201155201921?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center"
        >
          <Card className="glass-card p-12 rounded-3xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle 
                className="w-24 h-24 mx-auto mb-6"
                style={{ color: "var(--ma3k-green)" }}
              />
            </motion.div>
            
            <h2 
              className="text-4xl font-bold mb-6"
              style={{ color: "var(--ma3k-beige)" }}
            >
              شكراً لإرسال الاستبيان!
            </h2>
            
            <div 
              className="text-xl mb-8 space-y-4"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              <p>سيتم إنشاء حسابك خلال <strong style={{ color: "var(--ma3k-green)" }}>24 ساعة</strong></p>
              <p>سيتم إرسال رسالة تأكيد عبر الواتساب</p>
            </div>

            <Button 
              onClick={() => window.location.href = "/login"}
              className="font-bold py-6 px-12 rounded-full text-lg"
              style={{
                background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                color: "white"
              }}
              data-testid="button-goto-login"
            >
              انتقل إلى صفحة التسجيل
            </Button>

            <p 
              className="mt-6 text-sm"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              <strong>تذكير:</strong> جميع الدورات مجانية (دورتين فقط لكل طالب)
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-20">
      <div className="container mx-auto max-w-4xl">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <GraduationCap 
            className="w-20 h-20 mx-auto mb-6"
            style={{ color: "var(--ma3k-green)" }}
          />
          <h1 
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ابدأ عالم تعلم البرمجة مع معك
          </h1>
          <p 
            className="text-xl max-w-2xl mx-auto"
            style={{ color: "var(--ma3k-beige-dark)" }}
          >
            انضم إلى برنامجنا التعليمي المجاني واحصل على دورتين في البرمجة بإشراف خبراء محترفين
          </p>
        </motion.div>

        {/* فوائد الدورات */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { title: "مجاني 100%", desc: "دورتين مجانية لكل طالب" },
            { title: "شهادة معتمدة", desc: "احصل على شهادة برقم فريد" },
            { title: "منصة تفاعلية", desc: "تعلم وطبق في MA3K STUDIO" }
          ].map((benefit, index) => (
            <Card 
              key={index}
              className="glass-card p-6 text-center"
              data-testid={`benefit-${index}`}
            >
              <Code 
                className="w-10 h-10 mx-auto mb-4"
                style={{ color: "var(--ma3k-green)" }}
              />
              <h3 
                className="font-bold text-lg mb-2"
                style={{ color: "var(--ma3k-beige)" }}
              >
                {benefit.title}
              </h3>
              <p style={{ color: "var(--ma3k-beige-dark)" }}>
                {benefit.desc}
              </p>
            </Card>
          ))}
        </motion.div>

        {/* نموذج التسجيل */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card p-8 md:p-12 rounded-3xl">
            <h2 
              className="text-3xl font-bold mb-8 text-center"
              style={{ color: "var(--ma3k-green)" }}
            >
              نموذج التسجيل
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* اللغة المطلوبة */}
              <div className="space-y-2">
                <Label 
                  htmlFor="language"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  اللغة البرمجية المطلوبة *
                </Label>
                <Select
                  required
                  value={formData.language}
                  onValueChange={(value) => handleChange("language", value)}
                >
                  <SelectTrigger 
                    id="language"
                    className="bg-ma3k-dark border-ma3k-teal"
                    data-testid="select-language"
                  >
                    <SelectValue placeholder="اختر اللغة البرمجية" />
                  </SelectTrigger>
                  <SelectContent>
                    {programmingLanguages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* الاسم الثلاثي */}
              <div className="space-y-2">
                <Label 
                  htmlFor="fullName"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  الاسم الثلاثي *
                </Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="bg-ma3k-dark border-ma3k-teal"
                  placeholder="أدخل اسمك الكامل"
                  data-testid="input-fullName"
                />
              </div>

              {/* البريد الإلكتروني */}
              <div className="space-y-2">
                <Label 
                  htmlFor="email"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  البريد الإلكتروني *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="bg-ma3k-dark border-ma3k-teal"
                  placeholder="example@email.com"
                  data-testid="input-email"
                />
              </div>

              {/* رقم الجوال */}
              <div className="space-y-2">
                <Label 
                  htmlFor="phone"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  رقم الجوال *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="bg-ma3k-dark border-ma3k-teal"
                  placeholder="+966XXXXXXXXX"
                  data-testid="input-phone"
                />
              </div>

              {/* العمر */}
              <div className="space-y-2">
                <Label 
                  htmlFor="age"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  العمر * (يجب أن يكون 14 سنة أو أكثر)
                </Label>
                <Input
                  id="age"
                  type="number"
                  required
                  min="14"
                  value={formData.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  className="bg-ma3k-dark border-ma3k-teal"
                  placeholder="أدخل عمرك"
                  data-testid="input-age"
                />
              </div>

              {/* سبب تعلم البرمجة */}
              <div className="space-y-2">
                <Label 
                  htmlFor="reason"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  لماذا تريد تعلم البرمجة؟ *
                </Label>
                <Textarea
                  id="reason"
                  required
                  value={formData.reason}
                  onChange={(e) => handleChange("reason", e.target.value)}
                  className="bg-ma3k-dark border-ma3k-teal resize-none"
                  rows={3}
                  placeholder="اكتب السبب..."
                  data-testid="input-reason"
                />
              </div>

              {/* الهدف من الدورة */}
              <div className="space-y-2">
                <Label 
                  htmlFor="goal"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  ما هو هدفك من هذه الدورة؟ *
                </Label>
                <Textarea
                  id="goal"
                  required
                  value={formData.goal}
                  onChange={(e) => handleChange("goal", e.target.value)}
                  className="bg-ma3k-dark border-ma3k-teal resize-none"
                  rows={3}
                  placeholder="اكتب هدفك..."
                  data-testid="input-goal"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg font-bold rounded-full"
                style={{
                  background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                  color: "white"
                }}
                data-testid="button-submit"
              >
                <Send className="w-5 h-5 ml-2" />
                إرسال الطلب
              </Button>

              <p 
                className="text-center text-sm mt-4"
                style={{ color: "var(--ma3k-beige-dark)" }}
              >
                بالتسجيل، أنت توافق على سياسة الخصوصية وشروط الاستخدام
              </p>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
