import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Rocket, 
  ArrowLeft,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Layout,
  Globe2,
  Users2,
  Target,
  ShoppingCart,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomeNew() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="px-4 py-1 text-sm rounded-full bg-primary/10 text-primary border-none">
                نصنع التميز الرقمي لمشروعك
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              حلول رقمية <span className="text-primary">مبتكرة</span> تنقل أعمالك للمستقبل
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              نحن في معك نؤمن بأن كل فكرة تستحق الظهور بأفضل حلة رقمية. نصمم ونطور المواقع والمتاجر الإلكترونية باحترافية تليق بطموحاتك.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/services">
                <Button size="lg" className="h-14 px-8 text-lg rounded-xl shadow-lg shadow-primary/20">
                  ابدأ مشروعك الآن
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl">
                  مشاهدة أعمالنا
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "مشروع مكتمل", value: "+150", icon: CheckCircle2 },
              { label: "عميل راضٍ", value: "+100", icon: Users2 },
              { label: "دولة حول العالم", value: "12", icon: Globe2 },
              { label: "سنة خبرة", value: "+5", icon: Target },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="text-center space-y-2"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Hub Preview */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">خدماتنا المتميزة</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">نقدم حلولاً متكاملة تغطي كافة جوانب حضورك الرقمي</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "تطوير المواقع", desc: "مواقع تعريفية وتفاعلية بأحدث التقنيات العالمية.", icon: Layout },
              { title: "المتاجر الإلكترونية", desc: "بناء متاجر متكاملة مع أنظمة دفع وشحن ذكية.", icon: ShoppingCart },
              { title: "التحول الرقمي", desc: "استشارات وحلول تقنية لنقل أعمالك للعالم الرقمي.", icon: Rocket },
            ].map((service, i) => (
              <motion.div 
                key={i}
                className="luxury-card p-8 space-y-6"
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
                <Link href="/services">
                  <Button variant="link" className="p-0 text-primary h-auto font-bold">
                    اكتشف المزيد
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
        <div className="absolute top-0 left-1/4 -z-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] opacity-20" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">لماذا تختار <span className="text-primary">معك</span> لشريكك الرقمي؟</h2>
              <div className="space-y-6">
                {[
                  { title: "جودة لا تضاهى", desc: "نلتزم بأعلى معايير البرمجة والتصميم العالمية.", icon: Zap },
                  { title: "أمان وموثوقية", desc: "نظام حماية متقدم لبياناتك وضمان استقرار موقعك.", icon: ShieldCheck },
                  { title: "دعم فني مستمر", desc: "فريقنا معك دائماً للمساعدة والتطوير المستمر.", icon: Headphones },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-primary-foreground/80">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-foreground/20 to-transparent rounded-3xl border border-white/10 p-8 flex items-center justify-center">
                <Rocket className="w-48 h-48 text-primary-foreground animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
