import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  Rocket, 
  ShoppingCart, 
  Info,
  User,
  Utensils,
  Building2,
  Sparkles,
  Star,
  Clock,
  Shield,
  Zap
} from "lucide-react";
import type { Service } from "@shared/schema";

const createService = (id: string, name: string, price: number, originalPrice: number, description: string, category: string, features: string[]): Service => ({
  id,
  name,
  price,
  originalPrice,
  description,
  category,
  subcategory: null,
  features,
  isActive: true,
  isFeatured: false,
});

const serviceDatabase: { [key: string]: Service[] } = {
  personal: [
    createService('p1', 'موقع شخصي أساسي', 299, 500, 'مثالي لعرض السيرة الذاتية والأعمال الشخصية بتصميم نظيف.', 'individuals', ['تصميم متجاوب', '3 صفحات', 'نموذج تواصل', 'تحسين SEO']),
    createService('p2', 'تطبيق شخصي محترف', 599, 900, 'للمحترفين والفنانين مع خصائص متقدمة وتصميم عصري.', 'individuals', ['تصميم متجاوب', '10 صفحات', 'معرض أعمال', 'مدونة', 'تحسين SEO متقدم']),
    createService('p3', 'متجر شخصي بسيط', 449, 700, 'لبيع المنتجات الشخصية أو الحرفية مع نظام دفع مدمج.', 'individuals', ['نظام دفع', 'إدارة منتجات', 'سلة تسوق', 'تقارير مبيعات']),
  ],
  restaurant: [
    createService('r1', 'منيو احترافي بدون دفع', 50, 199, 'منيو إلكتروني أنيق لعرض قائمة الطعام والأسعار فقط.', 'restaurants', ['قائمة طعام رقمية', 'QR Code', 'تصميم جذاب', 'تحديث سهل']),
    createService('r2', 'منيو احترافي مع الدفع شهري', 235, 470, 'يشمل نظام الطلبات والدفع الإلكتروني وتتبع الطلبات - اشتراك شهري.', 'restaurants', ['نظام طلبات', 'دفع إلكتروني', 'تتبع الطلبات', 'إشعارات فورية']),
    createService('r3', 'نظام حجز الطاولات سنوي', 399, 798, 'نظام ذكي لإدارة المواعيد والإشعارات - سنة + سنة متابعة.', 'restaurants', ['نظام حجز', 'إدارة طاولات', 'إشعارات SMS', 'تقويم ذكي']),
    createService('r4', 'موقع متكامل للمطعم أو كافيه', 2999, 5000, 'حل شامل يشمل التوصيل والدفع وإدارة الطاولات ونظام الولاء.', 'restaurants', ['كل المميزات', 'نظام توصيل', 'برنامج ولاء', 'تقارير تحليلية']),
  ],
  business: [
    createService('b1', 'موقع شركة احترافي', 799, 1200, 'تصميم عصري ومتجاوب مع 10+ صفحات وتحسين لمحركات البحث.', 'companies', ['10+ صفحات', 'تصميم عصري', 'SEO متقدم', 'نماذج تواصل']),
    createService('b2', 'متجر إلكتروني شامل', 1499, 2500, 'متجر متكامل مع إدارة المخزون وأنظمة دفع متعددة وتقارير مفصلة.', 'companies', ['إدارة مخزون', 'دفع متعدد', 'تقارير', 'شحن متكامل']),
    createService('b3', 'نظام إدارة العملاء (CRM)', 999, 1800, 'نظام متكامل لإدارة علاقات العملاء وتتبع المبيعات.', 'companies', ['إدارة عملاء', 'تتبع مبيعات', 'تقارير', 'أتمتة']),
    createService('b4', 'منصة تعليمية تفاعلية', 2299, 4000, 'منصة متكاملة مع كورسات وامتحانات ونظام شهادات.', 'companies', ['كورسات', 'امتحانات', 'شهادات', 'إحصائيات']),
  ],
};

const categories = [
  { 
    id: 'personal', 
    title: 'شخصي / فردي', 
    desc: 'مواقع شخصية ومحافظ أعمال',
    icon: User,
    color: 'var(--ma3k-teal)'
  },
  { 
    id: 'restaurant', 
    title: 'مطعم / كافيه', 
    desc: 'منيو وأنظمة طلبات',
    icon: Utensils,
    color: 'var(--ma3k-green)'
  },
  { 
    id: 'business', 
    title: 'شركة / أعمال', 
    desc: 'مواقع ومتاجر احترافية',
    icon: Building2,
    color: 'var(--ma3k-beige)'
  },
];

const PRICING_OPTIONS = {
  r4: [
    { id: 'r4-monthly', name: 'الخطة الشهرية', price: 235, originalPrice: 470, description: 'اشتراك شهري متجدد' },
    { id: 'r4-yearly', name: 'الخطة السنوية', price: 399, originalPrice: 798, description: 'سنة كاملة + سنة متابعة مجانية', recommended: true }
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
      name: `${selection.service!.name} - ${pricingOption.name}`,
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
      title: "تمت الإضافة بنجاح",
      description: "تمت إضافة الخدمة إلى سلة التسوق.",
    });
    setStep(4);
  };

  const reset = () => {
    setSelection({ category: "", service: null, idea: "" });
    setStep(1);
  };

  const goBack = () => {
    if (step === 2) setStep(1);
    else if (step === 2.5) setStep(2);
    else if (step === 3) {
      if (selection.service?.id.startsWith('r4')) {
        setStep(2.5);
      } else {
        setStep(2);
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -30, scale: 0.95, transition: { duration: 0.3 } },
  };

  const stepIndicator = (
    <div className="flex items-center justify-center gap-3 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center gap-3">
          <motion.div
            initial={false}
            animate={{
              scale: Math.floor(step) >= s ? 1 : 0.8,
              background: Math.floor(step) >= s 
                ? "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))" 
                : "var(--glass-bg)"
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{
              border: Math.floor(step) >= s ? "none" : "2px solid var(--ma3k-border)",
              color: Math.floor(step) >= s ? "white" : "var(--ma3k-beige-dark)"
            }}
          >
            {Math.floor(step) > s ? <CheckCircle className="w-5 h-5" /> : s}
          </motion.div>
          {s < 4 && (
            <div 
              className="w-12 h-1 rounded-full hidden sm:block"
              style={{
                background: Math.floor(step) > s 
                  ? "linear-gradient(90deg, var(--ma3k-teal), var(--ma3k-green))" 
                  : "var(--ma3k-border)"
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge 
              className="mb-6 px-4 py-2"
              style={{ 
                background: "var(--glass-bg)", 
                border: "1px solid var(--ma3k-green)", 
                color: "var(--ma3k-green)" 
              }}
            >
              <Sparkles className="w-4 h-4 ml-2" />
              اختر خدمتك المثالية
            </Badge>
            <h1 
              className="text-4xl md:text-6xl font-black mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              لنبني <span style={{ color: "var(--ma3k-green)" }}>مشروعك</span> معاً
            </h1>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              من خلال خطوات بسيطة، سنحدد لك الخدمة الأنسب تماماً لاحتياجاتك
            </p>
          </motion.div>

          {/* Step Indicator */}
          {stepIndicator}

          {/* Content */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {/* Step 1: Category Selection */}
              {step === 1 && (
                <motion.div 
                  key="step1" 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit"
                >
                  <Card 
                    className="p-8 md:p-12 border-0"
                    style={{ 
                      background: "var(--glass-bg)", 
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--glass-border)"
                    }}
                  >
                    <h3 
                      className="text-2xl md:text-3xl font-bold mb-8 text-center"
                      style={{ color: "var(--ma3k-beige)" }}
                    >
                      ما هو مجال مشروعك؟
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {categories.map((cat, index) => (
                        <motion.button
                          key={cat.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSelectCategory(cat.id)}
                          className="p-8 rounded-2xl text-center transition-all group hover-elevate active-elevate-2"
                          style={{
                            background: "var(--ma3k-dark)",
                            border: "2px solid var(--ma3k-border)"
                          }}
                          data-testid={`button-category-${cat.id}`}
                        >
                          <div 
                            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all"
                            style={{ 
                              background: `linear-gradient(135deg, ${cat.color}, var(--ma3k-teal))`,
                              boxShadow: `0 10px 30px ${cat.color}40`
                            }}
                          >
                            <cat.icon className="w-10 h-10 text-white" />
                          </div>
                          <h4 
                            className="text-xl font-bold mb-2"
                            style={{ color: "var(--ma3k-beige)" }}
                          >
                            {cat.title}
                          </h4>
                          <p style={{ color: "var(--ma3k-beige-dark)" }}>
                            {cat.desc}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Service Selection */}
              {step === 2 && (
                <motion.div 
                  key="step2" 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit"
                >
                  <Card 
                    className="p-8 md:p-12 border-0"
                    style={{ 
                      background: "var(--glass-bg)", 
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--glass-border)"
                    }}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <Button
                        variant="ghost"
                        onClick={goBack}
                        style={{ color: "var(--ma3k-beige-dark)" }}
                        data-testid="button-back"
                      >
                        <ArrowRight className="w-5 h-5 ml-2" />
                        رجوع
                      </Button>
                      <h3 
                        className="text-2xl font-bold"
                        style={{ color: "var(--ma3k-beige)" }}
                      >
                        اختر الخدمة المطلوبة
                      </h3>
                      <div className="w-20" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {serviceDatabase[selection.category]?.map((service, index) => (
                        <motion.button
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSelectService(service)}
                          className="p-6 rounded-2xl text-right transition-all relative overflow-visible group hover-elevate active-elevate-2"
                          style={{
                            background: "var(--ma3k-dark)",
                            border: "2px solid var(--ma3k-border)"
                          }}
                          data-testid={`button-service-${service.id}`}
                        >
                          {/* Popular Badge */}
                          {service.id === 'b2' && (
                            <Badge 
                              className="absolute top-4 left-4"
                              style={{ 
                                background: "var(--ma3k-green)", 
                                color: "var(--ma3k-darker)" 
                              }}
                            >
                              <Star className="w-3 h-3 ml-1" />
                              الأكثر طلباً
                            </Badge>
                          )}
                          
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h5 
                                className="font-bold text-lg mb-1"
                                style={{ color: "var(--ma3k-beige)" }}
                              >
                                {service.name}
                              </h5>
                              <p 
                                className="text-sm"
                                style={{ color: "var(--ma3k-beige-dark)" }}
                              >
                                {service.description}
                              </p>
                            </div>
                            <div className="text-left">
                              <p 
                                className="font-black text-2xl"
                                style={{ color: "var(--ma3k-green)" }}
                              >
                                {service.price} ر.س
                              </p>
                              {service.originalPrice && (
                                <p 
                                  className="text-sm line-through"
                                  style={{ color: "var(--ma3k-beige-dark)" }}
                                >
                                  {service.originalPrice} ر.س
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            {service.features?.slice(0, 4).map((feature, i) => (
                              <span 
                                key={i}
                                className="text-xs px-3 py-1 rounded-full"
                                style={{ 
                                  background: "var(--glass-bg)", 
                                  color: "var(--ma3k-beige-dark)",
                                  border: "1px solid var(--ma3k-border)"
                                }}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 2.5: Pricing Selection */}
              {step === 2.5 && selection.service && (
                <motion.div 
                  key="step2.5" 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit"
                >
                  <Card 
                    className="p-8 md:p-12 border-0"
                    style={{ 
                      background: "var(--glass-bg)", 
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--glass-border)"
                    }}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <Button
                        variant="ghost"
                        onClick={goBack}
                        style={{ color: "var(--ma3k-beige-dark)" }}
                        data-testid="button-back"
                      >
                        <ArrowRight className="w-5 h-5 ml-2" />
                        رجوع
                      </Button>
                      <h3 
                        className="text-2xl font-bold"
                        style={{ color: "var(--ma3k-beige)" }}
                      >
                        اختر الخطة المناسبة
                      </h3>
                      <div className="w-20" />
                    </div>
                    
                    <p 
                      className="text-center mb-8"
                      style={{ color: "var(--ma3k-beige-dark)" }}
                    >
                      استخدم كود الخصم <strong style={{ color: "var(--ma3k-green)" }}>ma3k1winter</strong> للحصول على خصم 50%
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      {PRICING_OPTIONS.r4?.map((option, index) => (
                        <motion.button
                          key={option.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSelectPricingOption(option)}
                          className="p-8 rounded-2xl text-center relative overflow-visible hover-elevate active-elevate-2"
                          style={{
                            background: option.recommended 
                              ? "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))" 
                              : "var(--ma3k-dark)",
                            border: option.recommended 
                              ? "none" 
                              : "2px solid var(--ma3k-border)"
                          }}
                          data-testid={`button-pricing-${option.id}`}
                        >
                          {option.recommended && (
                            <Badge 
                              className="absolute top-4 left-4"
                              style={{ 
                                background: "var(--ma3k-beige)", 
                                color: "var(--ma3k-darker)" 
                              }}
                            >
                              موصى به
                            </Badge>
                          )}
                          
                          <h4 
                            className="text-xl font-bold mb-2"
                            style={{ color: option.recommended ? "white" : "var(--ma3k-beige)" }}
                          >
                            {option.name}
                          </h4>
                          <p 
                            className="text-sm mb-6"
                            style={{ color: option.recommended ? "rgba(255,255,255,0.8)" : "var(--ma3k-beige-dark)" }}
                          >
                            {option.description}
                          </p>
                          
                          <div className="flex items-baseline justify-center gap-2 mb-6">
                            <span 
                              className="text-4xl font-black"
                              style={{ color: option.recommended ? "white" : "var(--ma3k-green)" }}
                            >
                              {option.price}
                            </span>
                            <span style={{ color: option.recommended ? "rgba(255,255,255,0.8)" : "var(--ma3k-beige-dark)" }}>
                              ر.س
                            </span>
                            <span 
                              className="text-lg line-through"
                              style={{ color: option.recommended ? "rgba(255,255,255,0.5)" : "var(--ma3k-beige-dark)" }}
                            >
                              {option.originalPrice} ر.س
                            </span>
                          </div>
                          
                          <div 
                            className="py-3 px-6 rounded-xl font-bold"
                            style={{
                              background: option.recommended ? "rgba(255,255,255,0.2)" : "var(--glass-bg)",
                              color: option.recommended ? "white" : "var(--ma3k-beige)"
                            }}
                          >
                            اختر هذه الخطة
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Project Idea */}
              {step === 3 && selection.service && (
                <motion.div 
                  key="step3" 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit"
                >
                  <Card 
                    className="p-8 md:p-12 border-0"
                    style={{ 
                      background: "var(--glass-bg)", 
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--glass-border)"
                    }}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <Button
                        variant="ghost"
                        onClick={goBack}
                        style={{ color: "var(--ma3k-beige-dark)" }}
                        data-testid="button-back"
                      >
                        <ArrowRight className="w-5 h-5 ml-2" />
                        رجوع
                      </Button>
                      <h3 
                        className="text-2xl font-bold"
                        style={{ color: "var(--ma3k-beige)" }}
                      >
                        أخبرنا عن مشروعك
                      </h3>
                      <div className="w-20" />
                    </div>
                    
                    {/* Selected Service Summary */}
                    <div 
                      className="p-6 rounded-2xl mb-8 flex items-center justify-between"
                      style={{ 
                        background: "var(--ma3k-dark)",
                        border: "1px solid var(--ma3k-border)"
                      }}
                    >
                      <div>
                        <p style={{ color: "var(--ma3k-beige-dark)" }} className="text-sm mb-1">
                          الخدمة المختارة
                        </p>
                        <h4 
                          className="font-bold text-lg"
                          style={{ color: "var(--ma3k-beige)" }}
                        >
                          {selection.service.name}
                        </h4>
                      </div>
                      <div className="text-left">
                        <p 
                          className="font-black text-2xl"
                          style={{ color: "var(--ma3k-green)" }}
                        >
                          {selection.service.price} ر.س
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <Label 
                        htmlFor="idea" 
                        className="text-lg font-bold mb-3 block"
                        style={{ color: "var(--ma3k-beige)" }}
                      >
                        اكتب فكرة مشروعك هنا
                      </Label>
                      <p 
                        className="text-sm mb-4"
                        style={{ color: "var(--ma3k-beige-dark)" }}
                      >
                        كلما كانت التفاصيل أوضح، كانت النتيجة أفضل
                      </p>
                      <Textarea 
                        id="idea" 
                        value={selection.idea} 
                        onChange={e => setSelection({...selection, idea: e.target.value})} 
                        className="min-h-[150px] text-lg"
                        placeholder="مثال: أريد موقع لعرض خدماتي كمصمم جرافيك..."
                        style={{
                          background: "var(--ma3k-dark)",
                          border: "2px solid var(--ma3k-border)",
                          color: "var(--ma3k-beige)"
                        }}
                        data-testid="textarea-idea"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        size="lg"
                        onClick={handleAddToCart} 
                        className="flex-1 text-lg py-6 rounded-xl font-bold"
                        style={{
                          background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                          color: "white"
                        }}
                        data-testid="button-add-to-cart"
                      >
                        <ShoppingCart className="w-5 h-5 ml-2" />
                        أضف إلى السلة
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <motion.div 
                  key="step4" 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit"
                >
                  <Card 
                    className="p-8 md:p-12 border-0 text-center"
                    style={{ 
                      background: "var(--glass-bg)", 
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--glass-border)"
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
                      style={{ 
                        background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                        boxShadow: "0 10px 40px var(--glow-green)"
                      }}
                    >
                      <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                    
                    <h3 
                      className="text-3xl font-black mb-4"
                      style={{ color: "var(--ma3k-beige)" }}
                    >
                      تمت الإضافة بنجاح
                    </h3>
                    <p 
                      className="text-lg mb-8"
                      style={{ color: "var(--ma3k-beige-dark)" }}
                    >
                      الخدمة الآن في سلة التسوق. أكمل عملية الشراء للبدء في تنفيذ مشروعك.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        size="lg"
                        variant="outline" 
                        onClick={reset}
                        className="text-lg py-6 px-8 rounded-xl font-bold"
                        style={{
                          borderColor: "var(--ma3k-beige)",
                          color: "var(--ma3k-beige)"
                        }}
                        data-testid="button-add-more"
                      >
                        إضافة خدمة أخرى
                      </Button>
                      <a href="/cart">
                        <Button 
                          size="lg"
                          className="text-lg py-6 px-8 rounded-xl font-bold"
                          style={{
                            background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                            color: "white"
                          }}
                          data-testid="button-go-to-cart"
                        >
                          الانتقال للسلة
                          <ArrowLeft className="w-5 h-5 mr-2" />
                        </Button>
                      </a>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8"
          >
            {[
              { icon: Shield, text: "دفع آمن 100%" },
              { icon: Clock, text: "تسليم سريع" },
              { icon: Zap, text: "دعم 24/7" }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-2"
                style={{ color: "var(--ma3k-beige-dark)" }}
              >
                <item.icon className="w-5 h-5" style={{ color: "var(--ma3k-green)" }} />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
