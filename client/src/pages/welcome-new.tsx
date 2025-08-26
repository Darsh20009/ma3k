import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Zap, 
  Star, 
  Code, 
  Palette, 
  Globe, 
  MessageCircle,
  CheckCircle,
  ArrowRight,
  ShoppingCart,
  Laptop
} from "lucide-react";

export default function WelcomeNew() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const services = [
    {
      icon: Code,
      title: "خدمات فردية",
      description: "حلول تقنية مخصصة للأفراد",
      price: "من 100 ريال",
      features: ["مواقع شخصية", "تطبيقات بسيطة", "استشارات تقنية"]
    },
    {
      icon: Palette,
      title: "خدمات المطاعم",
      description: "قوائم طعام رقمية واحترافية",
      price: "من 50 ريال",
      features: ["قائمة طعام بسيطة", "قائمة احترافية", "موقع مطعم كامل"],
      highlight: "الأكثر طلباً"
    },
    {
      icon: Globe,
      title: "خدمات الأعمال",
      description: "حلول متكاملة للشركات",
      price: "من 500 ريال",
      features: ["مواقع الشركات", "أنظمة إدارة", "تطبيقات الويب"]
    }
  ];

  const stats = [
    { number: "500+", label: "مشروع منجز" },
    { number: "200+", label: "عميل سعيد" },
    { number: "99%", label: "نسبة الرضا" },
    { number: "24/7", label: "دعم مستمر" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.3
            }}
            style={{
              left: `${10 + (i * 4) % 80}%`,
              top: `${10 + (i * 3) % 80}%`
            }}
          />
        ))}
      </div>

      {/* Mouse follower */}
      <div
        className="fixed pointer-events-none z-10 w-96 h-96 bg-gradient-radial from-amber-400/10 via-purple-500/5 to-transparent rounded-full blur-3xl"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'all 0.3s ease'
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
              className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl mb-8 shadow-2xl"
            >
              <span className="text-4xl font-bold text-black">معك</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 mb-6"
            >
              معك للحلول التقنية
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex justify-center mb-6"
            >
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xl py-3 px-6 rounded-full shadow-lg">
                <Sparkles className="w-6 h-6 ml-2" />
                أحلامك الرقمية بين يديك
              </Badge>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              نحن نحول أفكارك إلى واقع رقمي مذهل. من المواقع الشخصية إلى حلول الأعمال المتكاملة، 
              نقدم خدمات تقنية مبتكرة بأسعار تنافسية وجودة استثنائية
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <a href="/services" data-testid="button-explore-services">
                <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg shadow-xl transform hover:scale-105 transition-all">
                  <Zap className="w-6 h-6 ml-2" />
                  استكشف خدماتنا
                </Button>
              </a>
              
              <a href="https://wa.me/966532441566" target="_blank" rel="noopener noreferrer" data-testid="button-contact-whatsapp">
                <Button variant="outline" className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black py-4 px-8 rounded-full text-lg font-bold">
                  <MessageCircle className="w-6 h-6 ml-2" />
                  تحدث معنا
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 relative">
        <motion.div style={{ y: y1 }} className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              خدماتنا المميزة
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات التقنية المصممة خصيصاً لتلبية احتياجاتك
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                data-testid={`service-card-${index}`}
              >
                {service.highlight && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                      <Star className="w-4 h-4 ml-1" />
                      {service.highlight}
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-400 mb-4">{service.description}</p>
                  <div className="text-3xl font-bold text-amber-400 mb-6">{service.price}</div>
                </div>

                <div className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 ml-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <a href="/services" data-testid="link-view-all-services">
              <Button className="luxury-btn bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-xl">
                عرض جميع الخدمات
                <ArrowRight className="w-6 h-6 mr-2" />
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <motion.div style={{ y: y2 }} className="container mx-auto px-6">
          <div className="glass-card rounded-3xl p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">أرقام تتحدث عن نفسها</h2>
              <p className="text-xl text-gray-300">نفتخر بإنجازاتنا ورضا عملائنا</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                  data-testid={`stat-${index}`}
                >
                  <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-lg">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">لماذا تختار معك؟</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              نحن أكثر من مجرد مطورين، نحن شركاؤك في النجاح الرقمي
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {[
                { icon: Zap, title: "سرعة في التنفيذ", desc: "نسلم مشاريعك في الوقت المحدد بأعلى جودة" },
                { icon: Star, title: "جودة استثنائية", desc: "نستخدم أحدث التقنيات والممارسات المتطورة" },
                { icon: MessageCircle, title: "دعم مستمر", desc: "فريقنا متاح لدعمك 24/7 عبر واتساب" },
                { icon: ShoppingCart, title: "أسعار تنافسية", desc: "نقدم أفضل قيمة مقابل استثمارك" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 space-x-reverse"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-purple-500/10" />
                <div className="relative z-10">
                  <Laptop className="w-24 h-24 text-amber-400 mb-6 mx-auto" />
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">
                    تجربة رقمية لا تُنسى
                  </h3>
                  <p className="text-gray-300 text-center leading-relaxed">
                    نحن نصمم ونطور حلولاً تقنية تفوق توقعاتك وتحقق أهدافك بطريقة مبتكرة وفعالة. 
                    كل مشروع نعمل عليه هو قصة نجاح جديدة نكتبها معاً.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-purple-500/5" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6">
                هل أنت مستعد لتحويل أحلامك إلى واقع؟
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                ابدأ رحلتك الرقمية اليوم واكتشف كيف يمكن لخدماتنا المبتكرة أن تغير مشروعك
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/services" data-testid="button-start-journey">
                  <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg shadow-xl">
                    <Sparkles className="w-6 h-6 ml-2" />
                    ابدأ رحلتك الآن
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}