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
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const { addToCart } = useCart();

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
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
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
              نُصمم أحلامك الرقمية
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6">
              شركة متخصصة في تطوير الحلول الرقمية المبتكرة، نحول أفكارك إلى واقع رقمي متميز بأحدث التقنيات والتصميمات الإبداعية
            </p>
            <p className="text-lg text-amber-300 max-w-3xl mx-auto mb-12 font-semibold">
              خبرة عالمية × إبداع محلي × أسعار تنافسية
            </p>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/services">
                <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg group">
                  <Rocket className="w-6 h-6 mr-2 group-hover:animate-bounce" />
                  اكتشف خدماتنا
                </Button>
              </Link>
              
              <Link href="/portfolio">
                <Button variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-bold py-4 px-8 rounded-full text-lg">
                  <Star className="w-6 h-6 mr-2" />
                  شاهد أعمالنا
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
                <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg">
                  تواصل معنا الآن
                </Button>
              </Link>
              
              <Link href="/portfolio">
                <Button variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-bold py-4 px-8 rounded-full text-lg">
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