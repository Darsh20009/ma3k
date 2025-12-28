import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  ShieldCheck, 
  Zap,
  Layout,
  Rocket,
  MessageCircle,
  Briefcase
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function About() {
  const stats = [
    { label: "سنوات خبرة", value: "+5", icon: Award },
    { label: "مشروع ناجح", value: "+150", icon: Target },
    { label: "عميل راضٍ", value: "+100", icon: Users },
    { label: "دولة مستفيدة", value: "12", icon: Globe },
  ];

  return (
    <div className="pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-primary">قصة معك</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              بدأت معك كفكرة بسيطة تهدف لسد الفجوة بين التقنيات المتطورة واحتياجات السوق العربي. اليوم، نحن فخورون بكوننا أحد رواد التحول الرقمي في المنطقة.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              نحن لا نبني مجرد مواقع، نحن نبني تجارب رقمية متكاملة تساعد الشركات والأفراد على تحقيق أهدافهم والوصول لجمهورهم بفعالية.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-primary/10 rounded-3xl flex items-center justify-center">
              <Rocket className="w-32 h-32 text-primary" />
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, i) => (
            <Card key={i} className="p-8 text-center luxury-card space-y-4">
              <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-4xl font-bold">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Values Section */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold">قيمنا الجوهرية</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">المبادئ التي تحركنا في كل مشروع نقوم به</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "الابتكار المستمر", desc: "نبحث دائماً عن أحدث التقنيات لنقدم حلولاً تسبق عصرها.", icon: Zap },
            { title: "الجودة العالية", desc: "لا نساوم أبداً على جودة العمل، من الكود البرمجي وحتى واجهة المستخدم.", icon: ShieldCheck },
            { title: "التركيز على العميل", desc: "نجاح عميلنا هو المعيار الحقيقي لنجاحنا كشركة.", icon: Layout },
          ].map((value, i) => (
            <div key={i} className="luxury-card p-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                <value.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <section className="mt-32">
          <div className="text-center max-w-3xl mx-auto p-8 md:p-12 rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">مستعدون لبدء مشروعك؟</h2>
            <p className="text-lg opacity-90 mb-8">تواصل معنا اليوم ودعنا نحول أفكارك إلى حقيقة رقمية مذهلة</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/966532441566" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-12 px-8">
                  <MessageCircle className="w-5 h-5 ml-2" />
                  تواصل معنا عبر واتساب
                </Button>
              </a>
              <Link href="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Briefcase className="w-5 h-5 ml-2" />
                  استكشف خدماتنا
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
