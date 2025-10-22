import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  BookOpen,
  Code,
  Rocket,
  Award,
  CheckCircle,
  MessageCircle,
  Sparkles
} from "lucide-react";

type CourseLanguage = {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
};

export default function CoursesComplete() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    selectedLanguage: "",
    learningGoal: ""
  });

  const languages: CourseLanguage[] = [
    {
      id: "python",
      name: "Python",
      description: "لغة برمجة متعددة الاستخدامات - مثالية للمبتدئين",
      icon: Code,
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: "java",
      name: "Java",
      description: "لغة قوية للتطبيقات الكبيرة وأنظمة المؤسسات",
      icon: Code,
      color: "from-red-500 to-orange-600"
    },
    {
      id: "frontend",
      name: "Front-End Development",
      description: "HTML, CSS, JavaScript, React - بناء واجهات المستخدم",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600"
    },
    {
      id: "backend",
      name: "Back-End Development",
      description: "Node.js, Express, قواعد البيانات - بناء الخوادم",
      icon: Rocket,
      color: "from-green-500 to-emerald-600"
    },
    {
      id: "javascript",
      name: "JavaScript",
      description: "لغة الويب الأساسية - من المبتدئ للمحترف",
      icon: Code,
      color: "from-yellow-500 to-amber-600"
    },
    {
      id: "cpp",
      name: "C++",
      description: "لغة قوية للأداء العالي والألعاب",
      icon: Code,
      color: "from-indigo-500 to-blue-600"
    }
  ];

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.age || !formData.selectedLanguage) {
      toast({
        title: "خطأ",
        description: "يرجى إكمال جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 14) {
      toast({
        title: "خطأ في العمر",
        description: "يجب أن يكون العمر 14 سنة أو أكثر",
        variant: "destructive"
      });
      return;
    }

    const selectedLang = languages.find(l => l.id === formData.selectedLanguage);
    const message = `
🎓 طلب التحاق بدورة برمجة جديد

📚 اللغة المختارة: ${selectedLang?.name}

👤 بيانات الطالب:
الاسم الثلاثي: ${formData.fullName}
البريد الإلكتروني: ${formData.email}
رقم الجوال: ${formData.phone}
العمر: ${formData.age} سنة

🎯 السبب والهدف من تعلم البرمجة:
${formData.learningGoal || "لم يذكر"}
    `.trim();

    localStorage.setItem("ma3k_course_registration", JSON.stringify(formData));

    const whatsappUrl = `https://wa.me/+201155201921?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "تم إرسال الطلب! 🎉",
      description: "سنتواصل معك قريباً",
    });

    setTimeout(() => {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        age: "",
        selectedLanguage: "",
        learningGoal: ""
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen royal-gradient pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mx-auto mb-6 flex items-center justify-center teal-glow">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-green-400 to-amber-400 mb-6">
            ابدأ عالم تعلم البرمجة مع معك
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            انضم إلى آلاف الطلاب واكتسب مهارات البرمجة من الصفر للاحتراف
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-2 border-green-500/20 h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  لماذا تتعلم معنا؟
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-bold mb-1">دورتين مجانيتين</h4>
                    <p className="text-gray-400 text-sm">ابدأ رحلتك بدورتين مجانيتين كاملتين</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-bold mb-1">محتوى تفاعلي</h4>
                    <p className="text-gray-400 text-sm">دروس نصية وفيديوهات وتطبيق عملي</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-bold mb-1">MA3K STUDIO</h4>
                    <p className="text-gray-400 text-sm">محرر برمجي متقدم داخل المنصة</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-bold mb-1">شهادة معتمدة</h4>
                    <p className="text-gray-400 text-sm">احصل على شهادة عند اجتياز الاختبار النهائي بنسبة ≥80%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-bold mb-1">أسعار مناسبة</h4>
                    <p className="text-gray-400 text-sm">بعد الدورتين المجانيتين: 10-30 دولار فقط (خصم من 150 دولار)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border-2 border-amber-500/20 h-full" data-testid="registration-form">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-400">
                  سجل الآن - مجاناً!
                </CardTitle>
                <CardDescription className="text-gray-300">
                  أكمل البيانات وسيتم إنشاء حسابك خلال 24 ساعة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language" className="text-white">اختر اللغة البرمجية *</Label>
                  <Select value={formData.selectedLanguage} onValueChange={(value) => setFormData(prev => ({ ...prev, selectedLanguage: value }))}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white mt-2" data-testid="select-language">
                      <SelectValue placeholder="اختر اللغة..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {languages.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id} className="text-white hover:bg-gray-700">
                          <div>
                            <div className="font-bold">{lang.name}</div>
                            <div className="text-xs text-gray-400">{lang.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fullName" className="text-white">الاسم الثلاثي *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white mt-2"
                    placeholder="محمد أحمد علي"
                    data-testid="input-fullname"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white mt-2"
                    placeholder="example@email.com"
                    data-testid="input-email"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="phone" className="text-white">رقم الجوال *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white mt-2"
                      placeholder="+20 1XX XXX XXXX"
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-white">العمر (≥ 14) *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="14"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white mt-2"
                      placeholder="18"
                      data-testid="input-age"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="learningGoal" className="text-white">لماذا تريد تعلم البرمجة؟</Label>
                  <Textarea
                    id="learningGoal"
                    value={formData.learningGoal}
                    onChange={(e) => setFormData(prev => ({ ...prev, learningGoal: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white mt-2 min-h-[80px]"
                    placeholder="أخبرنا عن أهدافك..."
                    data-testid="input-goal"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-6 text-lg teal-glow"
                  data-testid="button-submit"
                >
                  <MessageCircle className="ml-2" />
                  إرسال الطلب عبر واتساب
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {languages.slice(0, 3).map((lang, idx) => {
            const Icon = lang.icon;
            return (
              <Card key={lang.id} className="glass-card border-2 border-gray-600/20 hover:border-amber-500/40 transition-all">
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-br ${lang.color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-amber-400">{lang.name}</CardTitle>
                  <CardDescription className="text-gray-400">{lang.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 text-center"
        >
          <Award className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-400 mb-3">
            رسالة الشكر
          </h3>
          <p className="text-xl text-gray-300 mb-2">
            "تم استلام استبيانك، سيتم إنشاء حسابك خلال 24 ساعة"
          </p>
          <p className="text-gray-400">
            ستتلقى رسالة تأكيد عبر البريد الإلكتروني فور تفعيل حسابك
          </p>
        </motion.div>
      </div>
    </div>
  );
}
