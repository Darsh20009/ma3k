import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Brain,
  Send,
  Sparkles,
  MessageSquare,
  Lightbulb,
  Rocket,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Code,
  Smartphone,
  Globe,
  ShoppingCart,
  Palette
} from "lucide-react";

const projectTypes = [
  { id: "website", name: "موقع إلكتروني", icon: Globe },
  { id: "app", name: "تطبيق جوال", icon: Smartphone },
  { id: "ecommerce", name: "متجر إلكتروني", icon: ShoppingCart },
  { id: "custom", name: "مشروع مخصص", icon: Code },
  { id: "design", name: "تصميم", icon: Palette }
];

export default function OpenLifePage() {
  const { toast } = useToast();
  const [projectType, setProjectType] = useState<string>("");
  const [projectIdea, setProjectIdea] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!projectType || !projectIdea.trim() || !customerName.trim() || !customerEmail.trim()) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/consultations", {
        name: customerName.trim(),
        email: customerEmail.trim(),
        phone: customerPhone.trim(),
        message: `نوع المشروع: ${projectTypes.find(p => p.id === projectType)?.name}\n\nفكرة المشروع:\n${projectIdea.trim()}`,
        subject: `فكرة مشروع جديدة - ${projectTypes.find(p => p.id === projectType)?.name}`
      });

      setIsSubmitted(true);
      toast({
        title: "تم إرسال فكرتك بنجاح!",
        description: "سنتواصل معك قريباً لمناقشة التفاصيل"
      });
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "فشل إرسال الفكرة، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto mb-8 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">تم استلام فكرتك!</h1>
            <p className="text-xl text-gray-300 mb-8">
              شكراً لمشاركتك فكرتك معنا. سيقوم فريقنا بمراجعتها والتواصل معك قريباً.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold" data-testid="button-browse-services">
                  <Rocket className="w-5 h-5 ml-2" />
                  تصفح خدماتنا
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-amber-400 text-amber-400" data-testid="button-go-home">
                  <ArrowLeft className="w-5 h-5 ml-2" />
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/30">
              <Brain className="w-12 h-12 text-black" />
            </div>
          </motion.div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span className="text-amber-400 font-bold text-lg">ذكاء اصطناعي متطور</span>
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            أوبن لايف - Open Life AI
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            صمّم تطبيقك أو موقعك الخاص بسهولة واحترافية. اكتب وناقش فكرتك معنا وأرسلها لننفذ أحسن تطبيق!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 border-2 border-amber-500/30 backdrop-blur-xl">
            <div className="space-y-8">
              <div>
                <Label className="text-lg font-bold text-white mb-4 block">
                  <Lightbulb className="w-5 h-5 inline-block ml-2 text-amber-400" />
                  ما نوع مشروعك؟
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {projectTypes.map((type) => {
                    const IconComponent = type.icon;
                    const isSelected = projectType === type.id;
                    return (
                      <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setProjectType(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-amber-500 bg-amber-500/20"
                            : "border-gray-700 bg-gray-800/50 hover:border-amber-500/50"
                        }`}
                        data-testid={`project-type-${type.id}`}
                      >
                        <IconComponent className={`w-8 h-8 mx-auto mb-2 ${isSelected ? "text-amber-400" : "text-gray-400"}`} />
                        <span className={`text-sm font-medium ${isSelected ? "text-amber-400" : "text-gray-300"}`}>
                          {type.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="projectIdea" className="text-lg font-bold text-white mb-4 block">
                  <MessageSquare className="w-5 h-5 inline-block ml-2 text-amber-400" />
                  شاركنا فكرتك بالتفصيل *
                </Label>
                <Textarea
                  id="projectIdea"
                  value={projectIdea}
                  onChange={(e) => setProjectIdea(e.target.value)}
                  placeholder="اكتب فكرة مشروعك هنا... ما هي الميزات التي تريدها؟ ما المشكلة التي تحلها؟ من هو جمهورك المستهدف؟"
                  className="min-h-[200px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500"
                  data-testid="input-project-idea"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="customerName" className="text-white mb-2 block">الاسم الكامل *</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="اسمك"
                    className="bg-gray-800/50 border-gray-700 text-white"
                    data-testid="input-customer-name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail" className="text-white mb-2 block">البريد الإلكتروني *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="bg-gray-800/50 border-gray-700 text-white"
                    data-testid="input-customer-email"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone" className="text-white mb-2 block">رقم الهاتف</Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="bg-gray-800/50 border-gray-700 text-white"
                    data-testid="input-customer-phone"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-6 px-8 text-lg"
                  data-testid="button-submit-idea"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 ml-2" />
                  )}
                  {isSubmitting ? "جاري الإرسال..." : "أرسل فكرتك"}
                </Button>
                <Link href="/services">
                  <Button variant="outline" className="border-amber-400/50 text-amber-400 py-6 px-8" data-testid="button-view-services">
                    تصفح الخدمات المتاحة
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">ماذا يحدث بعد إرسال فكرتك؟</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "1", title: "مراجعة الفكرة", desc: "يقوم فريقنا بدراسة فكرتك" },
              { step: "2", title: "التواصل معك", desc: "نتواصل لمناقشة التفاصيل" },
              { step: "3", title: "بدء التنفيذ", desc: "نبدأ العمل على مشروعك" }
            ].map((item, index) => (
              <div key={index} className="glass-card rounded-2xl p-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-black font-bold">{item.step}</span>
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
