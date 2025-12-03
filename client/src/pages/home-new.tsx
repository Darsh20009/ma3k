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
  ArrowLeft,
  Zap,
  Shield,
  Clock,
  Laptop,
  Smartphone,
  Server,
  Palette,
  MessageSquare,
  Target,
  Lightbulb,
  BookOpen,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

  const features = [
    { icon: Laptop, title: "تصميم متجاوب", desc: "يعمل على جميع الأجهزة" },
    { icon: Shield, title: "أمان عالي", desc: "حماية متقدمة لبياناتك" },
    { icon: Zap, title: "سرعة فائقة", desc: "أداء محسن للتحميل" },
    { icon: Palette, title: "تصميم إبداعي", desc: "واجهات عصرية وجذابة" },
    { icon: Clock, title: "تسليم سريع", desc: "مواعيد تسليم محترمة" },
    { icon: MessageSquare, title: "دعم متواصل", desc: "فريق دعم 24/7" }
  ];

  const processSteps = [
    { step: "01", title: "اختر خدمتك", desc: "تصفح خدماتنا واختر ما يناسب مشروعك", icon: Target },
    { step: "02", title: "شاركنا فكرتك", desc: "أخبرنا بتفاصيل مشروعك ورؤيتك", icon: Lightbulb },
    { step: "03", title: "نبدأ العمل", desc: "فريقنا يحول فكرتك إلى واقع", icon: Code },
    { step: "04", title: "استلم مشروعك", desc: "موقعك جاهز للانطلاق", icon: Rocket }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <motion.div
            className="absolute w-96 h-96 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, var(--ma3k-teal) 0%, transparent 70%)",
              top: "10%",
              right: "-10%",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, var(--ma3k-green) 0%, transparent 70%)",
              bottom: "10%",
              left: "-5%",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(var(--ma3k-teal) 1px, transparent 1px),
                linear-gradient(90deg, var(--ma3k-teal) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
          
          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? "var(--ma3k-teal)" : "var(--ma3k-green)",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
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
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Badge 
                className="px-6 py-2 text-sm font-semibold"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--ma3k-green)",
                  color: "var(--ma3k-green)",
                }}
              >
                <Sparkles className="w-4 h-4 ml-2" />
                منصة معك الرقمية - شريكك في النجاح
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: "linear-gradient(135deg, var(--ma3k-beige) 0%, var(--ma3k-green) 50%, var(--ma3k-teal) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              نبني مستقبلك
              <br />
              <span style={{ 
                WebkitTextFillColor: "var(--ma3k-green)",
                textShadow: "0 0 60px var(--glow-green)"
              }}>
                الرقمي
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              نحول أفكارك إلى مواقع ومتاجر احترافية مع برامج تعليمية مجانية في البرمجة
              <br />
              <strong style={{ color: "var(--ma3k-beige)" }}>أسعار تنافسية • جودة عالمية • دعم متواصل</strong>
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/services">
                <Button 
                  size="lg"
                  className="text-lg px-10 py-7 rounded-2xl font-bold group relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                    color: "white",
                    boxShadow: "0 10px 40px var(--glow-green)"
                  }}
                  data-testid="button-services"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Rocket className="w-6 h-6" />
                    ابدأ مشروعك الآن
                    <ArrowLeft className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
              
              <Link href="/courses">
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 rounded-2xl font-bold"
                  style={{
                    borderColor: "var(--ma3k-beige)",
                    borderWidth: "2px",
                    color: "var(--ma3k-beige)",
                    background: "transparent"
                  }}
                  data-testid="button-courses"
                >
                  <GraduationCap className="w-6 h-6 ml-2" />
                  تعلم البرمجة مجاناً
                </Button>
              </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {[
                { number: "100+", label: "مشروع مكتمل", icon: Trophy },
                { number: "500+", label: "عميل سعيد", icon: Users },
                { number: "دورتين", label: "مجانية لكل طالب", icon: BookOpen },
                { number: "24/7", label: "دعم فني", icon: Heart }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="glass-morphism rounded-2xl p-6 text-center cursor-default hover-elevate"
                  data-testid={`stat-${index}`}
                >
                  <stat.icon 
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: "var(--ma3k-green)" }}
                  />
                  <div 
                    className="text-2xl md:text-3xl font-black mb-1"
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
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div 
            className="w-8 h-12 rounded-full border-2 flex items-start justify-center pt-2"
            style={{ borderColor: "var(--ma3k-beige-dark)" }}
          >
            <motion.div 
              className="w-2 h-3 rounded-full"
              style={{ background: "var(--ma3k-green)" }}
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative" style={{ background: "var(--ma3k-darker)" }}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge 
              className="mb-6 px-4 py-1"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--ma3k-teal)", color: "var(--ma3k-teal)" }}
            >
              لماذا معك؟
            </Badge>
            <h2 
              className="text-4xl md:text-5xl font-black mb-6"
              style={{ color: "var(--ma3k-beige)" }}
            >
              مميزات تجعلنا <span style={{ color: "var(--ma3k-green)" }}>الخيار الأول</span>
            </h2>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              نقدم لك أفضل الحلول الرقمية بمعايير عالمية وأسعار محلية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="hover-elevate"
              >
                <Card 
                  className="p-8 h-full border-0"
                  style={{ 
                    background: "var(--glass-bg)", 
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)"
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))" }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-3"
                    style={{ color: "var(--ma3k-beige)" }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: "var(--ma3k-beige-dark)" }}>
                    {feature.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge 
              className="mb-6 px-4 py-1"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--ma3k-green)", color: "var(--ma3k-green)" }}
            >
              كيف نعمل؟
            </Badge>
            <h2 
              className="text-4xl md:text-5xl font-black mb-6"
              style={{ color: "var(--ma3k-beige)" }}
            >
              4 خطوات <span style={{ color: "var(--ma3k-green)" }}>لمشروعك</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                {/* Connector Line */}
                {index < processSteps.length - 1 && (
                  <div 
                    className="hidden lg:block absolute top-12 -left-4 w-full h-0.5"
                    style={{ background: "linear-gradient(90deg, var(--ma3k-teal), transparent)" }}
                  />
                )}
                
                <div 
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 relative"
                  style={{ 
                    background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                    boxShadow: "0 10px 40px var(--glow-teal)"
                  }}
                >
                  <span 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "var(--ma3k-beige)", color: "var(--ma3k-darker)" }}
                  >
                    {step.step}
                  </span>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                
                <h3 
                  className="text-xl font-bold mb-3"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  {step.title}
                </h3>
                <p style={{ color: "var(--ma3k-beige-dark)" }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24" style={{ background: "var(--ma3k-darker)" }}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge 
              className="mb-6 px-4 py-1"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--ma3k-beige)", color: "var(--ma3k-beige)" }}
            >
              آراء العملاء
            </Badge>
            <h2 
              className="text-4xl md:text-5xl font-black mb-6"
              style={{ color: "var(--ma3k-beige)" }}
            >
              ماذا يقول <span style={{ color: "var(--ma3k-green)" }}>عملاؤنا</span>
            </h2>
            <p 
              className="text-xl max-w-2xl mx-auto"
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
                viewport={{ once: true }}
              >
                <Card 
                  className="p-8 h-full relative border-0 hover-elevate"
                  style={{ 
                    background: "var(--glass-bg)", 
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)"
                  }}
                  data-testid={`testimonial-${index}`}
                >
                  <Quote 
                    className="absolute top-6 left-6 w-10 h-10 opacity-20"
                    style={{ color: "var(--ma3k-green)" }}
                  />
                  
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback 
                        className="text-xl font-bold"
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
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge 
                className="mb-6 px-4 py-1"
                style={{ background: "var(--glass-bg)", border: "1px solid var(--ma3k-teal)", color: "var(--ma3k-teal)" }}
              >
                من نحن
              </Badge>
              <h2 
                className="text-4xl md:text-5xl font-black mb-6"
                style={{ color: "var(--ma3k-beige)" }}
              >
                شريكك في <span style={{ color: "var(--ma3k-green)" }}>النجاح الرقمي</span>
              </h2>
              <p 
                className="text-lg leading-relaxed mb-6"
                style={{ color: "var(--ma3k-beige-dark)" }}
              >
                <strong style={{ color: "var(--ma3k-beige)" }}>معك</strong> هي منصة رقمية متكاملة تقدم حلول تقنية احترافية للأفراد والشركات. نجمع بين الخبرة العالمية والإبداع المحلي لتقديم خدمات تطوير مواقع ومتاجر إلكترونية بأعلى جودة.
              </p>
              <p 
                className="text-lg leading-relaxed mb-8"
                style={{ color: "var(--ma3k-beige-dark)" }}
              >
                نؤمن بأن التحول الرقمي حق للجميع، لذلك نقدم خدماتنا بأسعار تنافسية مع برامج تعليمية مجانية في البرمجة.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/about">
                  <Button 
                    size="lg"
                    className="rounded-xl font-bold"
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
                <Link href="/contact">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="rounded-xl font-bold"
                    style={{
                      borderColor: "var(--ma3k-beige)",
                      color: "var(--ma3k-beige)"
                    }}
                  >
                    تواصل معنا
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Globe, title: "خبرة عالمية", desc: "معايير دولية عالية" },
                { icon: Code, title: "تقنيات حديثة", desc: "أحدث الأدوات والتقنيات" },
                { icon: TrendingUp, title: "نمو مستمر", desc: "تطوير وتحديث دائم" },
                { icon: Award, title: "جودة عالية", desc: "ضمان رضا 100%" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                >
                  <Card 
                    className="p-6 text-center h-full border-0"
                    style={{ 
                      background: "var(--glass-bg)", 
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--glass-border)"
                    }}
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
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-24 relative overflow-hidden"
        style={{ background: "var(--ma3k-darker)" }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-full h-full"
            style={{
              background: "radial-gradient(circle at 50% 50%, var(--glow-green) 0%, transparent 50%)",
              opacity: 0.1
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-4xl md:text-6xl font-black mb-6"
              style={{ color: "var(--ma3k-beige)" }}
            >
              جاهز لبدء <span style={{ color: "var(--ma3k-green)" }}>مشروعك؟</span>
            </h2>
            <p 
              className="text-xl mb-10 max-w-2xl mx-auto"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              انضم إلى مئات العملاء الراضين واحصل على موقعك الاحترافي اليوم
            </p>
            <Link href="/services">
              <Button 
                size="lg"
                className="text-xl px-12 py-8 rounded-2xl font-bold"
                style={{
                  background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                  color: "white",
                  boxShadow: "0 10px 50px var(--glow-green)"
                }}
                data-testid="button-cta"
              >
                <Rocket className="w-7 h-7 ml-3" />
                ابدأ الآن مجاناً
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
