import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Star, 
  Globe, 
  Smartphone, 
  Palette, 
  Code, 
  TrendingUp,
  Users,
  Award,
  Zap,
  ShoppingCart,
  CheckCircle,
  Rocket,
  Heart,
  Coffee,
  Lightbulb,
  MessageSquare,
  Brain,
  Shield,
  Clock,
  ThumbsUp,
  Link as LinkIcon,
  Headphones,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  BarChart3,
  Send,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@shared/schema";

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ComponentType<{ className?: string }>;
}

const faqItems: FAQItem[] = [
  {
    question: "ما الذي يميزنا؟",
    answer: "نحن نقدم حلولاً مخصصة، مما يضمن حصول كل عميل على خدمة من الدرجة الأولى مصممة خصيصاً لتلبية احتياجاته.",
    icon: Award
  },
  {
    question: "هل إنشاء الموقع الإلكتروني سهل الاستخدام؟",
    answer: "تم تصميم موقعنا الإلكتروني لسهولة التصفح، مما يتيح لك العثور على المعلومات التي تحتاجها بسرعة وكفاءة.",
    icon: ThumbsUp
  },
  {
    question: "هل يمكنك الوثوق بشركائنا؟",
    answer: "نحن نتعاون مع شركاء موثوق بهم وذوي جودة عالية لنقدم لك خدمات تصميم مواقع موثوقة ومن أفضل ما يكون.",
    icon: Users
  },
  {
    question: "ما نوع الدعم الذي نقدمه؟",
    answer: "نحن نوفر الدعم على مدار الساعة طوال أيام الأسبوع من خلال قنوات مختلفة، بما في ذلك الدردشة المباشرة والبريد الإلكتروني والهاتف، للمساعدة في أي استفسارات.",
    icon: Headphones
  },
  {
    question: "كيف يتم تأمين بياناتك بشكل جيد؟",
    answer: "بياناتك محمية ببروتوكولات تشفير وأمان متقدمة، مما يحافظ على أمان معلوماتك الشخصية.",
    icon: Shield
  },
  {
    question: "هل الروابط إلى مواقع إلكترونية أخرى معتمدة؟",
    answer: "على الرغم من أن هذا الموقع الإلكتروني قد يكون مرتبطاً بمواقع إلكترونية أخرى، إلا أننا لا نشير بشكل مباشر أو غير مباشر إلى أي موافقة.",
    icon: LinkIcon
  }
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  const IconComponent = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between text-right hover-elevate"
        data-testid={`faq-question-${item.question.slice(0, 20)}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-6 h-6 text-black" />
          </div>
          <h3 className="text-lg font-bold text-white">{item.question}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-amber-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-6 h-6 text-amber-400 flex-shrink-0" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pr-[4.5rem]">
          <p className="text-gray-300 leading-relaxed">{item.answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const handleOrderService = (service: Service) => {
    addToCart(service);
    
    toast({
      title: "تم إضافة الخدمة للسلة",
      description: `تم إضافة ${service.name} إلى سلة التسوق`,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const services_preview = [
    {
      icon: Globe,
      title: "تطوير المواقع",
      description: "مواقع إلكترونية احترافية سريعة ومتجاوبة",
      price: "من 2500 ر.س",
      features: ["تصميم متجاوب", "سرعة عالية", "محسن لمحركات البحث"]
    },
    {
      icon: Smartphone,
      title: "تطبيقات الجوال",
      description: "تطبيقات iOS و Android بأعلى جودة",
      price: "من 5000 ر.س",
      features: ["متوافق مع جميع الأجهزة", "واجهة سهلة الاستخدام", "أداء متفوق"]
    },
    {
      icon: ShoppingCart,
      title: "متاجر إلكترونية",
      description: "متاجر إلكترونية كاملة مع أنظمة دفع آمنة",
      price: "من 4000 ر.س",
      features: ["بوابات دفع متعددة", "إدارة المخزون", "تقارير مفصلة"]
    },
    {
      icon: Code,
      title: "حلول مخصصة",
      description: "حلول برمجية مخصصة لاحتياجاتك الخاصة",
      price: "حسب المشروع",
      features: ["حلول مبتكرة", "دعم فني شامل", "تطوير مستمر"]
    }
  ];

  const progressIndicators = [
    { number: "500+", label: "مشروع ناجح", icon: Target },
    { number: "98%", label: "رضا العملاء", icon: ThumbsUp },
    { number: "50+", label: "شريك موثوق", icon: Users },
    { number: "24/7", label: "دعم متواصل", icon: Clock }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/20 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              }}
              animate={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
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
            {/* Main Logo and Title */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-5xl font-bold text-black">معك</span>
              </div>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent mb-6">
              معك
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
              صمّم تطبيقك أو موقعك الخاص بسهولة واحترافية
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6">
              سواء كنت تحتاج تطبيقًا شخصيًا، موقعًا إلكترونيًا، متجرًا إلكترونيًا، أو خدمات إضافية، نحن هنا لنساعدك!
            </p>
            <p className="text-lg text-amber-300 max-w-3xl mx-auto mb-12 font-semibold">
              نقدم استراتيجيات مصممة خصيصاً لمساعدتك في بناء موقعك الإلكتروني بنجاح
            </p>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/services">
                <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg group" data-testid="button-discover-services">
                  <Rocket className="w-6 h-6 ml-2 group-hover:animate-bounce" />
                  اذهب واكتشف خدماتنا
                </Button>
              </Link>
              
              <Link href="/openlife">
                <Button variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-bold py-4 px-8 rounded-full text-lg" data-testid="button-discover-openlife">
                  <Brain className="w-6 h-6 ml-2" />
                  اكتشف أوبن لايف AI
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { number: "50+", label: "مشروع مكتمل", icon: Award },
                { number: "15,000+", label: "مستخدم سعيد", icon: Users },
                { number: "99%", label: "معدل النجاح", icon: TrendingUp },
                { number: "24/7", label: "دعم مستمر", icon: Heart }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="glass-morphism rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 text-amber-400 mx-auto mb-3 group-hover:animate-pulse" />
                  <div className="text-2xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Open Life AI Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <Card className="relative overflow-hidden border-2 border-amber-500/30 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-xl">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-20 h-20 bg-amber-500/10 rounded-full blur-xl" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-600/10 rounded-full blur-xl" />
              </div>
              
              <div className="relative p-8 md:p-12">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* AI Icon */}
                  <motion.div
                    animate={{ 
                      rotateY: [0, 360],
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="flex-shrink-0"
                  >
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/30">
                      <Brain className="w-16 h-16 md:w-20 md:h-20 text-black" />
                    </div>
                  </motion.div>
                  
                  {/* Content */}
                  <div className="flex-1 text-center lg:text-right">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                      <Sparkles className="w-6 h-6 text-amber-400" />
                      <span className="text-amber-400 font-bold text-lg">ذكاء اصطناعي متطور</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      أوبن لايف - Open Life AI
                    </h2>
                    <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                      صمّم تطبيقك أو موقعك الخاص بسهولة واحترافية مع أوبن لايف نسخة الذكاء الاصطناعي التي نملكها. اكتب وناقش فكرتك معه وأرسلها لننفذ أحسن تطبيق!
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Link href="/openlife">
                        <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-3 px-6 rounded-full" data-testid="button-try-openlife">
                          <MessageSquare className="w-5 h-5 ml-2" />
                          جرّب أوبن لايف الآن
                        </Button>
                      </Link>
                      <Link href="/services">
                        <Button variant="outline" className="border-amber-400/50 text-amber-400 hover:bg-amber-400/10" data-testid="button-view-services-ai">
                          اطلع على خدماتنا
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Quality Website Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="luxury-h1 text-amber-400 mb-6">موقع نظيف وعالي الجودة</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              موقعنا مصمم للأداء، القابلية للتوسع، والموثوقية. مع اهتمام دقيق بالتفاصيل، نقوم بإنشاء حلول نظيفة، قابلة للصيانة، وفعالة تدفع عملك للأمام.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto text-center"
          >
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              تصميم موقع متكامل يقدم خدمات متنوعة بأسعار معقولة، مع واجهة سهلة الاستخدام تلبي احتياجات العملاء الشخصية والتعليمية.
            </p>
            <Link href="/services">
              <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg" data-testid="button-explore-services">
                انتقل وشوف خدماتنا وأسعارنا
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Communication Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <MessageSquare className="w-10 h-10 text-black" />
            </div>
            <h2 className="luxury-h1 text-amber-400 mb-6">التواصل هو أهم ما في الأمر!</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              التواصل الواضح والمتسق يدفع النجاح. نحن نولي أهمية للحوار المفتوح، مما يضمن التوافق مع أهدافك والتعاون السلس طوال كل مشروع.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="luxury-h1 text-amber-400 mb-6">خدماتنا المتميزة</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات الرقمية لتلبية جميع احتياجاتك التقنية
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {services_preview.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-card rounded-3xl p-6 group hover:shadow-2xl transition-all duration-500"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="text-2xl font-bold text-amber-400 mb-4">
                    {service.price}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold">
                  طلب الخدمة
                </Button>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button className="luxury-btn bg-transparent border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-bold py-3 px-8 rounded-full">
                عرض جميع الخدمات
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Progress Indicators Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="luxury-h1 text-amber-400 mb-4">مؤشرات التقدم الرئيسية</h2>
            <p className="text-2xl text-white font-bold">نبلغ آفاقاً جديدة معاً</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {progressIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                  <indicator.icon className="w-8 h-8 text-black" />
                </div>
                <div className="text-4xl font-bold text-amber-400 mb-2">{indicator.number}</div>
                <div className="text-gray-300">{indicator.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Center Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/30">
              <Lightbulb className="w-12 h-12 text-black" />
            </div>
            <div className="text-amber-400 font-bold text-lg mb-4">مركز الابتكار</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">حيث تنبض الأفكار بالحياة</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              نحول أفكارك الإبداعية إلى مشاريع رقمية ناجحة. فريقنا المتخصص يعمل معك خطوة بخطوة لتحقيق رؤيتك.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-3 px-8 rounded-full" data-testid="button-share-idea">
                  <Send className="w-5 h-5 ml-2" />
                  شارك فكرتك معنا
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="luxury-h1 text-amber-400 mb-6">لماذا تختار معك؟</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              نحن لا نبني مجرد مواقع أو تطبيقات، بل نصنع تجارب رقمية تحقق أهدافك
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: "إبداع وابتكار",
                description: "أفكار مبتكرة وحلول إبداعية تميزك عن المنافسين"
              },
              {
                icon: Zap,
                title: "سرعة التنفيذ",
                description: "تسليم سريع دون المساومة على الجودة والإتقان"
              },
              {
                icon: Users,
                title: "فريق محترف",
                description: "خبراء متخصصون في أحدث التقنيات والتصميمات"
              },
              {
                icon: Award,
                title: "جودة مضمونة",
                description: "معايير جودة عالية وضمان على جميع خدماتنا"
              },
              {
                icon: Coffee,
                title: "دعم مستمر",
                description: "دعم فني متواصل وصيانة دورية لمشاريعك"
              },
              {
                icon: Heart,
                title: "أسعار تنافسية",
                description: "أفضل الأسعار في السوق مع خطط دفع مرنة"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-amber-400 mx-auto mb-4 group-hover:animate-pulse" />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="luxury-h1 text-amber-400 mb-4">هل أنت بحاجة إلى المساعدة؟</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              في هذا القسم، يمكنك الإجابة عن الأسئلة الشائعة بسهولة وفعالية.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <FAQAccordion
                key={index}
                item={item}
                isOpen={openFAQIndex === index}
                onToggle={() => setOpenFAQIndex(openFAQIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Join Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="relative overflow-hidden border-2 border-amber-500/30 bg-gradient-to-br from-gray-900/80 via-amber-900/20 to-gray-900/80 backdrop-blur-xl">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl" />
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500/10 rounded-full blur-xl" />
              </div>
              
              <div className="relative p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <UserPlus className="w-10 h-10 text-black" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  انضم إلى فريقنا التقني للابتكار والنمو!
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  انضم إلى فريقنا الديناميكي الذي يركز على الابتكار والنمو.
                </p>
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg" data-testid="button-join-team">
                    <Users className="w-5 h-5 ml-2" />
                    تواصل معنا للانضمام
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="luxury-h1 text-amber-400 mb-6">مستعد لبدء مشروعك؟</h2>
            <p className="text-xl text-gray-300 mb-8">
              تواصل معنا اليوم ودع فريقنا المتخصص يحول فكرتك إلى واقع رقمي مذهل
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg" data-testid="button-contact-us">
                  تواصل معنا الآن
                </Button>
              </Link>
              
              <Link href="/portfolio">
                <Button variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-bold py-4 px-8 rounded-full text-lg" data-testid="button-view-portfolio">
                  شاهد أعمالنا السابقة
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
