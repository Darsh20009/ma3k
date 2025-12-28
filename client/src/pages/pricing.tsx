import { motion } from "framer-motion";
import { Check, Zap, Rocket, Building2, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Pricing() {
  const plans = [
    {
      name: "الأساسية",
      price: "299",
      desc: "مثالية للأفراد والمشاريع الصغيرة",
      icon: Zap,
      features: ["تصميم متجاوب", "3 صفحات تعريفية", "نموذج تواصل", "استضافة مجانية شهر", "دعم فني إيميل"],
      recommended: false
    },
    {
      name: "الاحترافية",
      price: "799",
      desc: "للشركات والمتاجر المتوسطة",
      icon: Rocket,
      features: ["كل مميزات الأساسية", "10 صفحات متكاملة", "متجر إلكتروني بسيط", "تحسين SEO", "دعم فني 24/7"],
      recommended: true
    },
    {
      name: "المؤسسات",
      price: "2499",
      desc: "حلول مخصصة للمشاريع الكبرى",
      icon: Building2,
      features: ["كل مميزات الاحترافية", "تطبيقات جوال", "أنظمة CRM", "لوحات تحكم متقدمة", "مدير حساب مخصص"],
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold">باقات تناسب طموحاتك</h1>
          <p className="text-xl text-muted-foreground">شفافية كاملة في الأسعار بدون رسوم خفية</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card key={i} className={`luxury-card p-10 flex flex-col relative ${plan.recommended ? 'border-primary shadow-lg shadow-primary/10' : ''}`}>
              {plan.recommended && (
                <Badge className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1">
                  الأكثر طلباً
                </Badge>
              )}
              
              <div className="space-y-6 flex-grow">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <plan.icon className="w-6 h-6" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground mt-2">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">ر.س</span>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Link href="/services">
                  <Button className="w-full h-12 text-lg" variant={plan.recommended ? "default" : "outline"}>
                    اختر الباقة
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-2xl bg-primary/5 text-center">
          <p className="text-muted-foreground">
            هل لديك متطلبات خاصة؟ <Link href="/contact" className="text-primary font-bold underline">تواصل معنا</Link> للحصول على عرض مخصص.
          </p>
        </div>
      </div>
    </div>
  );
}
