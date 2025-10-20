import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Star, 
  Globe, 
  Code, 
  TrendingUp,
  Users,
  Award,
  Heart,
  CheckCircle,
  Quote,
  Sparkles,
  GraduationCap,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Service } from "@shared/schema";

export default function HomeNew() {
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "صاحب متجر إلكتروني",
      image: "",
      text: "معك حولت فكرة بسيطة إلى موقع احترافي تماماً! الفريق متعاون والنتيجة فاقت التوقعات.",
      rating: 5
    },
    {
      name: "فاطمة السعيد",
      role: "مديرة مطعم",
      image: "",
      text: "موقعنا الجديد ساعد في زيادة الطلبات بنسبة 300%. شكراً لفريق معك المبدع!",
      rating: 5
    },
    {
      name: "خالد العتيبي",
      role: "رائد أعمال",
      image: "",
      text: "خدمة ممتازة وسعر مناسب. أنصح أي شخص يبحث عن حلول رقمية احترافية.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 3 === 0 
                  ? "var(--ma3k-teal)" 
                  : i % 3 === 1 
                  ? "var(--ma3k-green)" 
                  : "var(--ma3k-beige)",
                opacity: 0.2
              }}
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              animate={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* العنوان الرئيسي */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="mb-8"
            >
              <Sparkles 
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: "var(--ma3k-green)" }}
              />
            </motion.div>

            <h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              style={{
                background: "linear-gradient(135deg, var(--ma3k-teal) 0%, var(--ma3k-green) 50%, var(--ma3k-beige) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              أنشئ موقعك الآن وابدأ التعلم!
            </h1>
            
            <h2 
              className="text-2xl md:text-4xl font-bold mb-8"
              style={{ color: "var(--ma3k-beige)" }}
            >
              نحو مستقبل رقمي يبدأ بخطوتك الأولى
            </h2>
            
            <p 
              className="text-xl max-w-4xl mx-auto leading-relaxed mb-6"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              نحول أحلامك الرقمية إلى واقع ملموس مع خدمات تطوير مواقع ومتاجر احترافية وبرامج تعليمية مجانية
            </p>
            
            {/* أزرار الإجراءات */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/services">
                <Button 
                  className="luxury-btn font-bold py-6 px-8 rounded-full text-lg group"
                  style={{
                    background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                    color: "white"
                  }}
                  data-testid="button-services"
                >
                  <Rocket className="w-6 h-6 ml-2 group-hover:animate-bounce" />
                  اكتشف خدماتنا
                </Button>
              </Link>
              
              <Link href="/courses">
                <Button 
                  className="border-2 font-bold py-6 px-8 rounded-full text-lg"
                  style={{
                    borderColor: "var(--ma3k-green)",
                    color: "var(--ma3k-green)",
                    background: "transparent"
                  }}
                  data-testid="button-courses"
                >
                  <GraduationCap className="w-6 h-6 ml-2" />
                  ابدأ التعلم مجاناً
                </Button>
              </Link>
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { number: "100+", label: "مشروع مكتمل", icon: Award },
                { number: "500+", label: "عميل سعيد", icon: Users },
                { number: "دورتين", label: "مجانية لكل طالب", icon: GraduationCap },
                { number: "24/7", label: "دعم فني", icon: Heart }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="glass-morphism rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300"
                  data-testid={`stat-${index}`}
                >
                  <stat.icon 
                    className="w-8 h-8 mx-auto mb-3 group-hover:animate-pulse"
                    style={{ color: "var(--ma3k-green)" }}
                  />
                  <div 
                    className="text-2xl font-bold mb-2"
                    style={{ color: "var(--ma3k-beige)" }}
                  >
                    {stat.number}
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: "var(--ma3k-beige-dark)" }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* قسم تجارب العملاء */}
      <section className="py-20" style={{ background: "var(--ma3k-darker)" }}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 
              className="luxury-h1 mb-6"
              style={{ color: "var(--ma3k-green)" }}
            >
              ماذا يقول عملاؤنا
            </h2>
            <p 
              className="text-xl max-w-3xl mx-auto"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              نفخر بثقة عملائنا ورضاهم عن خدماتنا
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="glass-card rounded-3xl p-8 relative"
                data-testid={`testimonial-${index}`}
              >
                <Quote 
                  className="absolute top-4 right-4 w-12 h-12 opacity-20"
                  style={{ color: "var(--ma3k-green)" }}
                />
                
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback 
                      className="text-2xl font-bold"
                      style={{
                        background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                        color: "white"
                      }}
                    >
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 
                      className="font-bold text-lg"
                      style={{ color: "var(--ma3k-beige)" }}
                    >
                      {testimonial.name}
                    </h4>
                    <p 
                      className="text-sm"
                      style={{ color: "var(--ma3k-beige-dark)" }}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 fill-current"
                      style={{ color: "var(--ma3k-green)" }}
                    />
                  ))}
                </div>

                <p 
                  className="leading-relaxed"
                  style={{ color: "var(--ma3k-beige-dark)" }}
                >
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم من نحن مختصر */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 
                className="luxury-h1 mb-6"
                style={{ color: "var(--ma3k-green)" }}
              >
                من نحن؟
              </h2>
              <p 
                className="text-lg leading-relaxed mb-6"
                style={{ color: "var(--ma3k-beige-dark)" }}
              >
                <strong style={{ color: "var(--ma3k-beige)" }}>معك</strong> هي منصة رقمية متخصصة في تقديم حلول تقنية متكاملة للأفراد والشركات. نجمع بين الخبرة العالمية والإبداع المحلي لتقديم خدمات تطوير مواقع ومتاجر إلكترونية احترافية، بالإضافة إلى برامج تعليمية مجانية في البرمجة.
              </p>
              <p 
                className="text-lg leading-relaxed mb-8"
                style={{ color: "var(--ma3k-beige-dark)" }}
              >
                نؤمن بأن التحول الرقمي حق للجميع، ولذلك نقدم خدماتنا بأسعار تنافسية مع جودة عالمية.
              </p>
              <Link href="/about">
                <Button 
                  className="font-bold py-6 px-8 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                    color: "white"
                  }}
                  data-testid="button-about"
                >
                  تعرف علينا أكثر
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Globe, title: "خبرة عالمية", desc: "معايير دولية" },
                { icon: Code, title: "تقنيات حديثة", desc: "أحدث الأدوات" },
                { icon: TrendingUp, title: "نمو مستمر", desc: "تطوير دائم" },
                { icon: Award, title: "جودة عالية", desc: "رضا 100%" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card rounded-2xl p-6 text-center"
                >
                  <item.icon 
                    className="w-12 h-12 mx-auto mb-4"
                    style={{ color: "var(--ma3k-green)" }}
                  />
                  <h4 
                    className="font-bold mb-2"
                    style={{ color: "var(--ma3k-beige)" }}
                  >
                    {item.title}
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: "var(--ma3k-beige-dark)" }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        className="py-20"
        style={{ background: "var(--ma3k-darker)" }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 
              className="luxury-h1 mb-6"
              style={{ color: "var(--ma3k-green)" }}
            >
              ابدأ مشروعك الرقمي اليوم
            </h2>
            <p 
              className="text-xl mb-8 max-w-2xl mx-auto"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              انضم إلى مئات العملاء الراضين واحصل على موقعك الاحترافي بأسعار تنافسية
            </p>
            <Link href="/services">
              <Button 
                size="lg"
                className="luxury-btn font-bold py-8 px-12 rounded-full text-xl"
                style={{
                  background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                  color: "white",
                  boxShadow: "0 0 30px var(--glow-green)"
                }}
                data-testid="button-cta"
              >
                <Rocket className="w-6 h-6 ml-2" />
                ابدأ الآن
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
