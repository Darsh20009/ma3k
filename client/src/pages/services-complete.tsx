import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  ShoppingCart, 
  User,
  Utensils,
  Building2,
  Sparkles,
  Star
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
  features: features || [],
  isActive: true,
  isFeatured: false,
});

const serviceDatabase: { [key: string]: Service[] } = {
  personal: [
    createService('p1', 'موقع شخصي أساسي', 299, 500, 'مثالي لعرض السيرة الذاتية والأعمال الشخصية.', 'individuals', ['تصميم متجاوب', '3 صفحات', 'نموذج تواصل']),
    createService('p2', 'تطبيق شخصي محترف', 599, 900, 'للمحترفين والفنانين مع خصائص متقدمة.', 'individuals', ['10 صفحات', 'معرض أعمال', 'مدونة']),
  ],
  restaurant: [
    createService('r1', 'منيو إلكتروني', 50, 199, 'منيو أنيق لعرض قائمة الطعام والأسعار.', 'restaurants', ['QR Code', 'تحديث سهل', 'تصميم جذاب']),
    createService('r4', 'نظام مطعم متكامل', 2999, 5000, 'حل شامل يشمل التوصيل والدفع وإدارة الطاولات.', 'restaurants', ['نظام طلبات', 'دفع إلكتروني', 'تتبع الطلبات']),
  ],
  business: [
    createService('b1', 'موقع شركة احترافي', 799, 1200, 'تصميم عصري ومتجاوب مع تحسين SEO.', 'companies', ['10+ صفحات', 'SEO متقدم', 'نماذج تواصل']),
    createService('b2', 'متجر إلكتروني شامل', 1499, 2500, 'متجر متكامل مع إدارة المخزون والدفع.', 'companies', ['إدارة مخزون', 'دفع متعدد', 'شحن متكامل']),
  ],
};

const categories = [
  { id: 'personal', title: 'شخصي / فردي', desc: 'مواقع شخصية ومحافظ أعمال', icon: User },
  { id: 'restaurant', title: 'مطعم / كافيه', desc: 'منيو وأنظمة طلبات', icon: Utensils },
  { id: 'business', title: 'شركة / أعمال', desc: 'مواقع ومتاجر احترافية', icon: Building2 },
];

export default function ServicesNew() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<{ category: string; service: Service | null; idea: string }>({ category: "", service: null, idea: "" });

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
    toast({ title: "تمت الإضافة بنجاح", description: "تمت إضافة الخدمة إلى سلة التسوق." });
    setStep(4);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <Badge className="px-4 py-1 rounded-full">خدماتنا</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold">مركز الخدمات الرقمية</h1>
          <p className="text-xl text-muted-foreground">اختر الفئة المناسبة لمشروعك وابدأ رحلة التحول الرقمي</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid md:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <Card key={cat.id} className="luxury-card p-10 text-center space-y-6 cursor-pointer bg-card shadow-sm" onClick={() => handleSelectCategory(cat.id)}>
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">{cat.title}</h3>
                  <p className="text-muted-foreground">{cat.desc}</p>
                  <Button variant="outline" className="w-full">اختر الفئة</Button>
                </Card>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                <ArrowRight className="w-4 h-4" /> رجوع للفئات
              </Button>
              <div className="grid md:grid-cols-2 gap-8">
                {serviceDatabase[selection.category]?.map((service) => (
                  <Card key={service.id} className="luxury-card p-8 space-y-6 cursor-pointer" onClick={() => handleSelectService(service)}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{service.name}</h3>
                      <div className="text-left">
                        <p className="text-2xl font-bold text-primary">{service.price} ر.س</p>
                        <p className="text-sm text-muted-foreground line-through">{service.originalPrice} ر.س</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selection.service?.features?.map((f, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                      ))}
                    </div>
                    <Button className="w-full">اختيار هذه الخدمة</Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-8">
              <Button variant="ghost" onClick={() => setStep(2)} className="gap-2">
                <ArrowRight className="w-4 h-4" /> رجوع للخدمات
              </Button>
              <Card className="luxury-card p-8 space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">أخبرنا عن فكرتك</h3>
                  <p className="text-muted-foreground">مشروعك: {selection.service?.name}</p>
                </div>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="اشرح لنا تفاصيل مشروعك أو أي متطلبات خاصة..." 
                    value={selection.idea}
                    onChange={(e) => setSelection({ ...selection, idea: e.target.value })}
                    rows={6}
                  />
                  <Button className="w-full h-12 text-lg" onClick={handleAddToCart}>
                    إضافة إلى السلة والبدء
                    <ShoppingCart className="mr-2 w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center space-y-8 py-20">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold">تمت الإضافة!</h2>
              <p className="text-muted-foreground">الخدمة جاهزة في سلة التسوق، يمكنك إتمام الطلب الآن.</p>
              <div className="flex flex-col gap-4">
                <Link href="/cart">
                  <Button size="lg" className="w-full">الذهاب للسلة</Button>
                </Link>
                <Button variant="outline" onClick={() => setStep(1)}>إضافة خدمة أخرى</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
