import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Rocket, ShoppingCart, Info } from "lucide-react";
import type { Service } from "@shared/schema";

// قائمة الخدمات الكاملة التي قدمتها
const serviceDatabase: { [key: string]: Service[] } = {
  personal: [
    { id: 'p1', name: 'موقع شخصي أساسي', price: 299, originalPrice: 500, description: 'مثالي لعرض السيرة الذاتية والأعمال الشخصية بتصميم نظيف.' },
    { id: 'p2', name: 'تطبيق شخصي محترف', price: 599, originalPrice: 900, description: 'للمحترفين والفنانين مع خصائص متقدمة وتصميم عصري.' },
    { id: 'p3', name: 'متجر شخصي بسيط', price: 449, originalPrice: 700, description: 'لبيع المنتجات الشخصية أو الحرفية مع نظام دفع مدمج.' },
  ],
  restaurant: [
    { id: 'r1', name: 'منيو احترافي بدون دفع', price: 50, originalPrice: 199, description: 'منيو إلكتروني أنيق لعرض قائمة الطعام والأسعار فقط.' },
    { id: 'r2', name: 'منيو احترافي مع الدفع', price: 300, originalPrice: 1230, description: 'يشمل نظام الطلبات والدفع الإلكتروني وتتبع الطلبات.' },
    { id: 'r3', name: 'نظام حجز الطاولات', price: 399, originalPrice: 600, description: 'نظام ذكي لإدارة المواعيد والإشعارات.' },
    { id: 'r4', name: 'موقع متكامل للمطعم أو كافيه', price: 2999, originalPrice: 5000, description: 'حل شامل يشمل التوصيل والدفع وإدارة الطاولات ونظام الولاء.' },
  ],
  business: [
    { id: 'b1', name: 'موقع شركة احترافي', price: 799, originalPrice: 1200, description: 'تصميم عصري ومتجاوب مع 10+ صفحات وتحسين لمحركات البحث.' },
    { id: 'b2', name: 'متجر إلكتروني شامل', price: 1499, originalPrice: 2500, description: 'متجر متكامل مع إدارة المخزون وأنظمة دفع متعددة وتقارير مفصلة.' },
    { id: 'b3', name: 'نظام إدارة العملاء (CRM)', price: 999, originalPrice: 1800, description: 'نظام متكامل لإدارة علاقات العملاء وتتبع المبيعات.' },
    { id: 'b4', name: 'منصة تعليمية تفاعلية', price: 2299, originalPrice: 4000, description: 'منصة متكاملة مع كورسات وامتحانات ونظام شهادات.' },
  ],
};

const MotionCard = motion(Card);

export default function ServicesNew() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<{
    category: string;
    service: Service | null;
    idea: string;
  }>({ category: "", service: null, idea: "" });

  const handleSelectCategory = (category: string) => {
    setSelection({ ...selection, category });
    setStep(2);
  };

  const handleSelectService = (service: Service) => {
    setSelection({ ...selection, service });
    setStep(3);
  };

  const handleAddToCart = () => {
    if (!selection.service) return;
    addToCart(selection.service, selection.idea);
    toast({
      title: "✅ تمت الإضافة إلى السلة!",
      description: "تمت إضافة باقتك المخصصة للسلة بنجاح.",
    });
    setStep(4);
  };

  const reset = () => {
    setSelection({ category: "", service: null, idea: "" });
    setStep(1);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-main rounded-2xl mb-6 shadow-lg">
                <Rocket className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
                لنكتشف الباقة المثالية لمشروعك
            </h1>
            <p className="text-xl text-muted-foreground">
                من خلال خطوات بسيطة، سنحدد لك الخدمة الأنسب تماماً.
            </p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {/* Step 1: Category Selection */}
            {step === 1 && (
              <MotionCard key="step1" variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="card-ma3k p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">الخطوة الأولى: ما هو مجال مشروعك؟</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <CategoryCard title="شخصي / فردي" onClick={() => handleSelectCategory('personal')} />
                  <CategoryCard title="مطعم / كافيه" onClick={() => handleSelectCategory('restaurant')} />
                  <CategoryCard title="شركة / أعمال" onClick={() => handleSelectCategory('business')} />
                </div>
              </MotionCard>
            )}

            {/* Step 2: Service Selection */}
            {step === 2 && (
              <MotionCard key="step2" variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="card-ma3k p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">الخطوة الثانية: اختر الخدمة المطلوبة</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {serviceDatabase[selection.category]?.map(service => (
                    <ServiceCard key={service.id} service={service} onSelect={handleSelectService} />
                  ))}
                </div>
                 <Button onClick={() => setStep(1)} variant="link" className="mt-4">الرجوع لاختيار المجال</Button>
              </MotionCard>
            )}

            {/* Step 3: Project Idea */}
            {step === 3 && selection.service && (
              <MotionCard key="step3" variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="card-ma3k p-8">
                <h3 className="text-2xl font-bold mb-2 text-center">الخطوة الأخيرة: تفاصيل فكرتك</h3>
                <p className="text-center text-muted-foreground mb-6">كلما كانت التفاصيل أوضح، كانت النتيجة أفضل!</p>
                <div className="p-4 border rounded-xl bg-secondary/20 mb-6">
                    <h4 className="font-bold">{selection.service.name}</h4>
                    <p className="text-primary font-bold text-xl">{selection.service.price} ر.س</p>
                </div>
                <Label htmlFor="idea" className="font-semibold">اكتب فكرة مشروعك هنا:</Label>
                <Textarea id="idea" value={selection.idea} onChange={e => setSelection({...selection, idea: e.target.value})} className="mt-2 min-h-[120px]" />
                <div className="flex gap-4 mt-6">
                    <Button onClick={() => setStep(2)} variant="outline" className="w-full">رجوع</Button>
                    <Button onClick={handleAddToCart} className="w-full btn-ma3k">أضف للسلة</Button>
                </div>
              </MotionCard>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <MotionCard key="step4" variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="card-ma3k p-8 text-center">
                 <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                 <h3 className="text-3xl font-bold mb-4">رائع! الخدمة الآن في سلتك</h3>
                 <p className="text-muted-foreground mb-8">أنت على وشك تحقيق فكرتك. أكمل الشراء من عربة التسوق.</p>
                 <div className="flex gap-4 justify-center">
                    <Button onClick={reset} variant="outline">إضافة خدمة أخرى</Button>
                    <a href="/cart"><Button className="btn-ma3k">الانتقال للسلة <ArrowLeft className="mr-2 h-4 w-4" /></Button></a>
                 </div>
              </MotionCard>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Components for the questionnaire
const CategoryCard = ({ title, onClick }: { title: string, onClick: () => void }) => (
  <button onClick={onClick} className="p-8 border rounded-2xl text-center hover:bg-primary hover:text-white transition-all duration-300">
    <h4 className="text-xl font-bold">{title}</h4>
  </button>
);

const ServiceCard = ({ service, onSelect }: { service: Service, onSelect: (s: Service) => void }) => (
  <button onClick={() => onSelect(service)} className="p-4 border rounded-xl text-right hover:border-primary transition-all">
    <div className="flex justify-between items-center">
        <h5 className="font-bold">{service.name}</h5>
        <div className="text-left">
            <p className="font-bold text-primary">{service.price} ر.س</p>
            {service.originalPrice && <p className="text-xs line-through text-muted-foreground">{service.originalPrice} ر.س</p>}
        </div>
    </div>
    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
  </button>
);