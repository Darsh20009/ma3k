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

const createService = (id: string, name: string, price: number, originalPrice: number, description: string, category: string): Service => ({
  id,
  name,
  price,
  originalPrice,
  description,
  category,
  subcategory: null,
  features: null,
  isActive: true,
  isFeatured: false,
});

const serviceDatabase: { [key: string]: Service[] } = {
  personal: [
    createService('p1', 'موقع شخصي أساسي', 299, 500, 'مثالي لعرض السيرة الذاتية والأعمال الشخصية بتصميم نظيف.', 'individuals'),
    createService('p2', 'تطبيق شخصي محترف', 599, 900, 'للمحترفين والفنانين مع خصائص متقدمة وتصميم عصري.', 'individuals'),
    createService('p3', 'متجر شخصي بسيط', 449, 700, 'لبيع المنتجات الشخصية أو الحرفية مع نظام دفع مدمج.', 'individuals'),
  ],
  restaurant: [
    createService('r1', 'منيو احترافي بدون دفع', 50, 199, 'منيو إلكتروني أنيق لعرض قائمة الطعام والأسعار فقط.', 'restaurants'),
    createService('r2', 'منيو احترافي مع الدفع شهري', 235, 470, 'يشمل نظام الطلبات والدفع الإلكتروني وتتبع الطلبات - اشتراك شهري.', 'restaurants'),
    createService('r3', 'نظام حجز الطاولات سنوي', 399, 798, 'نظام ذكي لإدارة المواعيد والإشعارات - سنة + سنة متابعة.', 'restaurants'),
    createService('r4', 'موقع متكامل للمطعم أو كافيه', 2999, 5000, 'حل شامل يشمل التوصيل والدفع وإدارة الطاولات ونظام الولاء.', 'restaurants'),
  ],
  business: [
    createService('b1', 'موقع شركة احترافي', 799, 1200, 'تصميم عصري ومتجاوب مع 10+ صفحات وتحسين لمحركات البحث.', 'companies'),
    createService('b2', 'متجر إلكتروني شامل', 1499, 2500, 'متجر متكامل مع إدارة المخزون وأنظمة دفع متعددة وتقارير مفصلة.', 'companies'),
    createService('b3', 'نظام إدارة العملاء (CRM)', 999, 1800, 'نظام متكامل لإدارة علاقات العملاء وتتبع المبيعات.', 'companies'),
    createService('b4', 'منصة تعليمية تفاعلية', 2299, 4000, 'منصة متكاملة مع كورسات وامتحانات ونظام شهادات.', 'companies'),
  ],
};

const MotionCard = motion(Card);

const PRICING_OPTIONS = {
  r4: [
    { id: 'r4-monthly', name: 'الخطة الشهرية', price: 235, originalPrice: 470, description: 'اشتراك شهري' },
    { id: 'r4-yearly', name: 'الخطة السنوية', price: 399, originalPrice: 798, description: 'سنة + سنة متابعة مجانية' }
  ]
};

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
    // إذا كانت الخدمة r4، أعرض خيارات التسعير
    if (service.id === 'r4') {
      setSelection({ ...selection, service });
      setStep(2.5);
    } else {
      setSelection({ ...selection, service });
      setStep(3);
    }
  };

  const handleSelectPricingOption = (pricingOption: any) => {
    const updatedService: Service = {
      ...selection.service!,
      id: pricingOption.id,
      name: pricingOption.name,
      price: pricingOption.price,
      originalPrice: pricingOption.originalPrice,
      description: pricingOption.description
    };
    setSelection({ ...selection, service: updatedService });
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

            {/* Step 2.5: Pricing Selection (for r4 only) */}
            {step === 2.5 && selection.service && (
              <MotionCard key="step2.5" variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="card-ma3k p-8">
                <h3 className="text-2xl font-bold mb-2 text-center">اختر الخطة المناسبة</h3>
                <p className="text-center text-muted-foreground mb-6">كود الخصم ma3k1winter يوفر لك 50% على جميع الخطط</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {PRICING_OPTIONS.r4?.map((option) => (
                    <div key={option.id} className="p-6 border rounded-xl hover:border-primary transition-all cursor-pointer" onClick={() => handleSelectPricingOption(option)}>
                      <h4 className="text-lg font-bold mb-2">{option.name}</h4>
                      <p className="text-muted-foreground text-sm mb-3">{option.description}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">{option.price} ر.س</span>
                        <span className="text-sm line-through text-muted-foreground">{option.originalPrice} ر.س</span>
                      </div>
                      <Button className="w-full mt-4 btn-ma3k">اختر هذه الخطة</Button>
                    </div>
                  ))}
                </div>
                <Button onClick={() => setStep(2)} variant="link" className="mt-6">رجوع</Button>
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