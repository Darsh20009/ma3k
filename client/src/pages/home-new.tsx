import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Globe, 
  Code, 
  Users,
  Award,
  CheckCircle,
  Sparkles,
  GraduationCap,
  ArrowLeft,
  Zap,
  Shield,
  Clock,
  Laptop,
  Palette,
  MessageSquare,
  Target,
  Lightbulb,
  BookOpen,
  Trophy,
  Phone,
  Mail,
  ChevronDown,
  Star,
  Play,
  Headphones,
  Building2,
  ShoppingBag,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Service } from "@shared/schema";

export default function HomeNew() {
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "صاحب متجر إلكتروني",
      text: "فريق معك حول فكرتي البسيطة إلى متجر إلكتروني احترافي. النتيجة فاقت كل التوقعات والدعم الفني ممتاز.",
      rating: 5,
      company: "متجر الأناقة"
    },
    {
      name: "فاطمة السعيد",
      role: "مديرة مطعم",
      text: "موقعنا الجديد ساعد في زيادة الطلبات بنسبة كبيرة. الفريق محترف ويفهم احتياجات العمل.",
      rating: 5,
      company: "مطعم الذواقة"
    },
    {
      name: "خالد العتيبي",
      role: "رائد أعمال",
      text: "خدمة ممتازة وسعر مناسب. أنصح أي شخص يبحث عن حلول رقمية احترافية بالتعامل مع معك.",
      rating: 5,
      company: "شركة الابتكار"
    }
  ];

  const features = [
    { icon: Laptop, title: "تصميم متجاوب", desc: "يعمل بشكل مثالي على جميع الأجهزة والشاشات" },
    { icon: Shield, title: "أمان عالي", desc: "حماية متقدمة لبياناتك ومعلومات عملائك" },
    { icon: Zap, title: "سرعة فائقة", desc: "أداء محسن لتجربة مستخدم سلسة وسريعة" },
    { icon: Palette, title: "تصميم احترافي", desc: "واجهات عصرية تعكس هوية علامتك التجارية" },
    { icon: Clock, title: "تسليم سريع", desc: "التزام صارم بمواعيد التسليم المتفق عليها" },
    { icon: MessageSquare, title: "دعم متواصل", desc: "فريق دعم متاح على مدار الساعة لمساعدتك" }
  ];

  const processSteps = [
    { step: "01", title: "اختر خدمتك", desc: "تصفح خدماتنا المتنوعة واختر ما يناسب مشروعك", icon: Target },
    { step: "02", title: "شاركنا رؤيتك", desc: "أخبرنا بتفاصيل مشروعك وأهدافك", icon: Lightbulb },
    { step: "03", title: "نبدأ التنفيذ", desc: "فريقنا المتخصص يحول فكرتك إلى واقع", icon: Code },
    { step: "04", title: "استلم مشروعك", desc: "مشروعك جاهز للانطلاق مع الدعم الكامل", icon: Rocket }
  ];

  const services_categories = [
    { icon: Globe, title: "مواقع الشركات", desc: "مواقع احترافية تعزز تواجدك الرقمي" },
    { icon: ShoppingBag, title: "متاجر إلكترونية", desc: "متاجر متكاملة لبيع منتجاتك عبر الإنترنت" },
    { icon: GraduationCap, title: "منصات تعليمية", desc: "أكاديميات ومنصات تدريب تفاعلية" },
    { icon: Building2, title: "أنظمة إدارة", desc: "حلول إدارية متكاملة لعملك" },
  ];

  const faqs = [
    {
      question: "كم تستغرق عملية تطوير الموقع؟",
      answer: "تعتمد المدة على حجم المشروع وتعقيده. المواقع البسيطة تستغرق من 3-7 أيام، بينما المشاريع الأكبر قد تستغرق 2-4 أسابيع."
    },
    {
      question: "هل تقدمون الدعم الفني بعد التسليم؟",
      answer: "نعم، نقدم دعم فني مجاني لمدة 30 يوم بعد التسليم، ونوفر باقات دعم ممتدة حسب احتياجاتك."
    },
    {
      question: "هل يمكنني تعديل الموقع بنفسي بعد التسليم؟",
      answer: "بالتأكيد، جميع مواقعنا تأتي مع لوحة تحكم سهلة الاستخدام تمكنك من إدارة المحتوى بكل سهولة."
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نقبل الدفع عبر التحويل البنكي، البطاقات الائتمانية، وخدمات الدفع الإلكتروني المختلفة."
    }
  ];

  const stats = [
    { number: "150+", label: "مشروع مكتمل", icon: Trophy },
    { number: "98%", label: "عملاء راضون", icon: Users },
    { number: "50+", label: "دورة تدريبية", icon: BookOpen },
    { number: "24/7", label: "دعم فني", icon: Headphones }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(var(--ma3k-teal) 1px, transparent 1px),
                linear-gradient(90deg, var(--ma3k-teal) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />
          <div 
            className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, var(--ma3k-green) 0%, transparent 70%)" }}
          />
          <div 
            className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, var(--ma3k-teal) 0%, transparent 70%)" }}
          />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Badge 
                className="px-5 py-2 text-sm font-medium"
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "var(--ma3k-green)",
                }}
              >
                <Sparkles className="w-4 h-4 ml-2" />
                شريكك الموثوق في التحول الرقمي
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ color: "var(--ma3k-beige)" }}
            >
              نبني مستقبلك
              <span 
                className="block mt-2"
                style={{ color: "var(--ma3k-green)" }}
              >
                الرقمي باحترافية
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              نحول أفكارك إلى مواقع ومتاجر إلكترونية احترافية مع دورات تدريبية مجانية في البرمجة والتصميم
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/services">
                <Button 
                  size="lg"
                  className="text-base px-8 py-6 rounded-xl font-semibold"
                  style={{
                    background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                    color: "white",
                  }}
                  data-testid="button-services"
                >
                  <Rocket className="w-5 h-5 ml-2" />
                  ابدأ مشروعك الآن
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </Link>
              
              <Link href="/courses">
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 rounded-xl font-semibold"
                  style={{
                    borderColor: "var(--ma3k-beige-dark)",
                    borderWidth: "1px",
                    color: "var(--ma3k-beige)",
                    background: "transparent"
                  }}
                  data-testid="button-courses"
                >
                  <GraduationCap className="w-5 h-5 ml-2" />
                  تعلم البرمجة مجاناً
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="glass-morphism rounded-xl p-5 text-center"
                  data-testid={`stat-${index}`}
                >
                  <stat.icon 
                    className="w-6 h-6 mx-auto mb-2"
                    style={{ color: "var(--ma3k-green)" }}
                  />
                  <div 
                    className="text-2xl font-bold mb-1"
                    style={{ color: "var(--ma3k-beige)" }}
                  >
                    {stat.number}
                  </div>
                  <div 
                    className="text-xs"
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
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown 
            className="w-6 h-6"
            style={{ color: "var(--ma3k-beige-dark)" }}
          />
        </motion.div>
      </section>

      {/* Services Categories Section */}
      <section className="py-20" style={{ background: "var(--ma3k-darker)" }}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              خدماتنا <span style={{ color: "var(--ma3k-green)" }}>المتميزة</span>
            </h2>
            <p 
              className="text-base max-w-xl mx-auto"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              نقدم حلول رقمية متكاملة تناسب جميع احتياجات عملك
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services_categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href="/services">
                  <Card 
                    className="p-6 h-full border-0 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    style={{ 
                      background: "var(--glass-bg)", 
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--glass-border)"
                    }}
                    data-testid={`category-card-${index}`}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))" }}
                    >
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 
                      className="text-lg font-semibold mb-2"
                      style={{ color: "var(--ma3k-beige)" }}
                    >
                      {category.title}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: "var(--ma3k-beige-dark)" }}
                    >
                      {category.desc}
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/services">
              <Button 
                variant="outline"
                className="px-6"
                style={{
                  borderColor: "var(--ma3k-green)",
                  color: "var(--ma3k-green)",
                }}
                data-testid="button-all-services"
              >
                عرض جميع الخدمات
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Free Planning Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge 
              className="mb-4 px-4 py-1"
              style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "var(--ma3k-green)" }}
            >
              مجاني تماماً
            </Badge>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              احصل على مخطط مشروعك <span style={{ color: "var(--ma3k-green)" }}>مجاناً</span>
            </h2>
            <p 
              className="text-base max-w-xl mx-auto"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              أرسل لنا فكرتك واحصل على مخطط تفصيلي لموقعك خلال 24 ساعة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link href="/website-form">
                <Card 
                  className="p-6 h-full border-0 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  style={{ 
                    background: "var(--glass-bg)", 
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)"
                  }}
                  data-testid="card-website-form"
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))" }}
                  >
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{ color: "var(--ma3k-beige)" }}
                  >
                    موقع إلكتروني
                  </h3>
                  <p 
                    className="text-sm mb-4"
                    style={{ color: "var(--ma3k-beige-dark)" }}
                  >
                    مواقع شخصية، مواقع شركات، أو متاجر إلكترونية
                  </p>
                  <Button 
                    className="w-full"
                    style={{
                      background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                      color: "white"
                    }}
                  >
                    ابدأ التخطيط
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/educational-website-form">
                <Card 
                  className="p-6 h-full border-0 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  style={{ 
                    background: "var(--glass-bg)", 
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)"
                  }}
                  data-testid="card-educational-form"
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: "linear-gradient(135deg, var(--ma3k-green), var(--ma3k-teal))" }}
                  >
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{ color: "var(--ma3k-beige)" }}
                  >
                    منصة تعليمية
                  </h3>
                  <p 
                    className="text-sm mb-4"
                    style={{ color: "var(--ma3k-beige-dark)" }}
                  >
                    أكاديميات، مواقع دورات تدريبية، أو منصات تعليم
                  </p>
                  <Button 
                    className="w-full"
                    style={{
                      background: "linear-gradient(135deg, var(--ma3k-green), var(--ma3k-teal))",
                      color: "white"
                    }}
                  >
                    ابدأ التخطيط
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                </Card>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" style={{ background: "var(--ma3k-darker)" }}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              لماذا تختار <span style={{ color: "var(--ma3k-green)" }}>معك</span>؟
            </h2>
            <p 
              className="text-base max-w-xl mx-auto"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              نلتزم بأعلى معايير الجودة والاحترافية في كل مشروع
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  className="p-6 h-full border-0"
                  style={{ 
                    background: "var(--glass-bg)", 
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)"
                  }}
                  data-testid={`feature-card-${index}`}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: "rgba(16, 185, 129, 0.15)" }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: "var(--ma3k-green)" }} />
                  </div>
                  <h3 
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--ma3k-beige)" }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: "var(--ma3k-beige-dark)" }}
                  >
                    {feature.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              كيف <span style={{ color: "var(--ma3k-green)" }}>نعمل</span>؟
            </h2>
            <p 
              className="text-base max-w-xl mx-auto"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              4 خطوات بسيطة لتحويل فكرتك إلى مشروع ناجح
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 relative"
                  style={{ 
                    background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                  }}
                >
                  <span 
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--ma3k-beige)", color: "var(--ma3k-darker)" }}
                  >
                    {step.step}
                  </span>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  {step.title}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: "var(--ma3k-beige-dark)" }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" style={{ background: "var(--ma3k-darker)" }}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              ماذا يقول <span style={{ color: "var(--ma3k-green)" }}>عملاؤنا</span>؟
            </h2>
            <p 
              className="text-base max-w-xl mx-auto"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              نفخر بثقة عملائنا ورضاهم عن خدماتنا
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  className="p-6 h-full border-0"
                  style={{ 
                    background: "var(--glass-bg)", 
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)"
                  }}
                  data-testid={`testimonial-card-${index}`}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 fill-current"
                        style={{ color: "var(--ma3k-green)" }}
                      />
                    ))}
                  </div>
                  <p 
                    className="text-sm mb-6 leading-relaxed"
                    style={{ color: "var(--ma3k-beige-dark)" }}
                  >
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback 
                        style={{ 
                          background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                          color: "white"
                        }}
                      >
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div 
                        className="text-sm font-semibold"
                        style={{ color: "var(--ma3k-beige)" }}
                      >
                        {testimonial.name}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: "var(--ma3k-beige-dark)" }}
                      >
                        {testimonial.role} - {testimonial.company}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              الأسئلة <span style={{ color: "var(--ma3k-green)" }}>الشائعة</span>
            </h2>
            <p 
              className="text-base max-w-xl mx-auto"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              إجابات على أكثر الأسئلة تكراراً
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem 
                    value={`item-${index}`}
                    className="border-0 rounded-lg overflow-hidden"
                    style={{ 
                      background: "var(--glass-bg)", 
                      border: "1px solid var(--glass-border)"
                    }}
                    data-testid={`faq-item-${index}`}
                  >
                    <AccordionTrigger 
                      className="px-5 py-4 text-right hover:no-underline"
                      style={{ color: "var(--ma3k-beige)" }}
                    >
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent 
                      className="px-5 pb-4 text-sm"
                      style={{ color: "var(--ma3k-beige-dark)" }}
                    >
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: "var(--ma3k-darker)" }}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              جاهز لبدء مشروعك؟
            </h2>
            <p 
              className="text-base mb-8"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              تواصل معنا اليوم ودعنا نساعدك في تحقيق أهدافك الرقمية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button 
                  size="lg"
                  className="px-8"
                  style={{
                    background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                    color: "white",
                  }}
                  data-testid="button-cta-services"
                >
                  <Rocket className="w-5 h-5 ml-2" />
                  اطلب خدمتك الآن
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-8"
                  style={{
                    borderColor: "var(--ma3k-beige-dark)",
                    color: "var(--ma3k-beige)",
                  }}
                  data-testid="button-cta-contact"
                >
                  <Phone className="w-5 h-5 ml-2" />
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
