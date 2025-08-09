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
  CheckCircle
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="hero-text luxury-text-shadow bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent mb-6">
              معك
            </h1>
            <h2 className="luxury-h1 text-white mb-6">
              نُصمم أحلامك الرقمية
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              شريكك المثالي في رحلة التحول الرقمي - من الفكرة إلى التنفيذ بأعلى معايير الجودة والإبداع
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/services">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg shadow-2xl">
                    استكشف خدماتنا
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              
              <Link href="/about">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-bold py-4 px-8 rounded-full text-lg shadow-xl">
                    تعرف علينا أكثر
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {[
                { number: "500+", label: "عميل سعيد" },
                { number: "1000+", label: "مشروع مكتمل" },
                { number: "99%", label: "رضا العملاء" },
                { number: "24/7", label: "دعم فني" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  className="glass-morphism rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl font-bold text-amber-400 mb-2">{stat.number}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="luxury-h1 text-amber-400 mb-6">خدماتنا المميزة</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              نقدم مجموعة شاملة من الحلول الرقمية المتقدمة لتحقيق أهدافك
            </p>
          </motion.div>

          {/* Service Categories */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {[
              {
                icon: Globe,
                title: "تطوير المواقع",
                description: "مواقع احترافية متجاوبة وسريعة",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Smartphone,
                title: "تطبيقات الجوال",
                description: "تطبيقات ذكية لجميع المنصات",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Palette,
                title: "التصميم الإبداعي",
                description: "هوية بصرية مميزة ومؤثرة",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Code,
                title: "حلول مخصصة",
                description: "أنظمة متقدمة حسب احتياجاتك",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: TrendingUp,
                title: "التسويق الرقمي",
                description: "استراتيجيات تسويقية فعالة",
                color: "from-indigo-500 to-blue-500"
              },
              {
                icon: Users,
                title: "إدارة المحتوى",
                description: "إدارة احترافية لحساباتك",
                color: "from-teal-500 to-green-500"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="service-card glass-card rounded-3xl p-8 text-center group cursor-pointer"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-300 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <Link href="/services">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg shadow-2xl">
                  عرض جميع الخدمات
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {services.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="luxury-h1 text-amber-400 mb-6">الباقات المميزة</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                اختر الباقة التي تناسب احتياجاتك وميزانيتك
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  whileHover={{ y: -8 }}
                  className="glass-card rounded-3xl p-8 text-center group hover:shadow-2xl transition-all duration-500"
                >
                  <h3 className="text-xl font-bold text-white mb-4">{service.name}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-amber-400">{service.price}</span>
                    <span className="text-gray-400 mr-2">ريال</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOrderService(service)}
                    className="luxury-btn w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-3 px-6 rounded-full shadow-xl"
                  >
                    <ShoppingCart className="w-5 h-5 ml-2" />
                    اطلب الآن
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="luxury-h1 text-amber-400 mb-6">لماذا نحن الأفضل؟</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              نتميز بالخبرة والإبداع والالتزام بتحقيق أهدافك
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "جودة متميزة",
                description: "نلتزم بأعلى معايير الجودة في كل مشروع"
              },
              {
                icon: Zap,
                title: "سرعة في التنفيذ",
                description: "نسلم مشاريعك في الوقت المحدد"
              },
              {
                icon: Users,
                title: "دعم مستمر",
                description: "فريق دعم متاح 24/7 لخدمتك"
              },
              {
                icon: CheckCircle,
                title: "ضمان الرضا",
                description: "نضمن رضاك التام عن النتيجة النهائية"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism rounded-2xl p-6 text-center"
              >
                <feature.icon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card rounded-3xl p-12 text-center"
          >
            <h2 className="luxury-h1 text-amber-400 mb-6">جاهز لبدء مشروعك؟</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              تواصل معنا اليوم ولنبدأ معاً رحلة تحقيق حلمك الرقمي
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/services">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg shadow-2xl">
                    ابدأ مشروعك الآن
                  </Button>
                </motion.div>
              </Link>
              
              <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '966500000000'}`} target="_blank" rel="noopener noreferrer">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-bold py-4 px-8 rounded-full text-lg shadow-xl">
                    تواصل عبر واتساب
                  </Button>
                </motion.div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}