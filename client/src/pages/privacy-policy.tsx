import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Users, FileText } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: FileText,
      title: "جمع المعلومات",
      desc: "نجمع المعلومات التي تقدمها لنا مباشرة عند طلب خدمة أو التسجيل في المنصة."
    },
    {
      icon: Shield,
      title: "حماية البيانات",
      desc: "نطبق أعلى معايير الأمان والتشفير لحماية بياناتك من الوصول غير المصرح به."
    },
    {
      icon: Lock,
      title: "السرية التامة",
      desc: "نلتزم بعدم مشاركة بياناتك مع أي طرف ثالث دون موافقتك الصريحة."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center space-y-4 mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary">سياسة الخصوصية</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            نحن نقدر ثقتك في معك ونلتزم بحماية خصوصيتك وبياناتك الشخصية بأعلى قدر من الجدية والاحترافية.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="luxury-card p-10 flex gap-8 items-start"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <section.icon className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{section.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
          <p className="text-center text-muted-foreground">
            آخر تحديث: يناير 2025. إذا كان لديك أي استفسار حول سياسة الخصوصية، يرجى التواصل معنا.
          </p>
        </div>
      </div>
    </div>
  );
}
