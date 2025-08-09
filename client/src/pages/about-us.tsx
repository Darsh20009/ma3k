import { motion } from "framer-motion";
import { 
  Award, 
  Users, 
  Zap, 
  Target, 
  Heart, 
  Star,
  CheckCircle,
  TrendingUp,
  Globe,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
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
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="luxury-h1 text-amber-400 mb-6">من نحن</h1>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              نحن فريق متخصص في تطوير الحلول الرقمية المبتكرة، نؤمن بأن التكنولوجيا يجب أن تخدم أهدافك وتحقق أحلامك
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">قصتنا</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  بدأت رحلتنا من إيمان عميق بأن التكنولوجيا يجب أن تكون في متناول الجميع، وأن كل فكرة تستحق أن تصبح حقيقة رقمية مميزة.
                </p>
                <p>
                  منذ تأسيسنا، ساعدنا مئات العملاء في تحقيق أهدافهم الرقمية، من المشاريع الشخصية البسيطة إلى الحلول المؤسسية المعقدة.
                </p>
                <p>
                  نحن لا نقدم مجرد خدمات تقنية، بل نكون شركاءكم في رحلة النجاح، نفهم احتياجاتكم ونترجمها إلى حلول رقمية تفوق توقعاتكم.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="glass-card rounded-3xl p-8"
            >
              <div className="grid grid-cols-2 gap-6 text-center">
                {[
                  { number: "500+", label: "عميل سعيد", icon: Users },
                  { number: "1000+", label: "مشروع مكتمل", icon: CheckCircle },
                  { number: "99%", label: "رضا العملاء", icon: Star },
                  { number: "5+", label: "سنوات خبرة", icon: Award }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                    className="p-4"
                  >
                    <stat.icon className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-amber-400 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="luxury-h1 text-amber-400 mb-6">قيمنا الأساسية</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              القيم التي تحكم عملنا وتوجه قراراتنا في كل مشروع
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Award,
                title: "التميز والجودة",
                description: "نلتزم بأعلى معايير الجودة في كل تفصيل من عملنا",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Heart,
                title: "الشغف والإبداع",
                description: "نحب ما نفعله وننقل هذا الشغف إلى كل مشروع",
                color: "from-pink-500 to-red-500"
              },
              {
                icon: Users,
                title: "التعاون والشراكة",
                description: "نؤمن بالعمل الجماعي وبناء شراكات طويلة الأمد",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Zap,
                title: "الابتكار والتطوير",
                description: "نبحث دائماً عن حلول مبتكرة وتقنيات حديثة",
                color: "from-purple-500 to-indigo-500"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card rounded-2xl p-6 text-center group"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="luxury-h1 text-amber-400 mb-6">لماذا تختارنا؟</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              الأسباب التي تجعلنا الخيار الأمثل لمشروعك الرقمي
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {[
                {
                  icon: Target,
                  title: "فهم عميق لاحتياجاتك",
                  description: "نستمع جيداً ونفهم أهدافك لنقدم حلول مخصصة تماماً"
                },
                {
                  icon: TrendingUp,
                  title: "خبرة واسعة ومتنوعة",
                  description: "سنوات من الخبرة في مختلف المجالات التقنية والرقمية"
                },
                {
                  icon: Globe,
                  title: "مواكبة أحدث التقنيات",
                  description: "نستخدم أحدث الأدوات والتقنيات لضمان حلول عصرية"
                },
                {
                  icon: MessageCircle,
                  title: "تواصل مستمر ودعم متواصل",
                  description: "فريق دعم متاح دائماً للرد على استفساراتكم ومساعدتكم"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 glass-morphism rounded-xl p-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-card rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold text-amber-400 mb-6 text-center">منهجيتنا في العمل</h3>
              <div className="space-y-6">
                {[
                  { step: "01", title: "الفهم والتحليل", description: "ندرس احتياجاتكم بعمق ونضع خطة شاملة" },
                  { step: "02", title: "التصميم والتطوير", description: "ننفذ المشروع بأعلى معايير الجودة والإبداع" },
                  { step: "03", title: "الاختبار والتحسين", description: "نختبر كل شيء ونحسن الأداء باستمرار" },
                  { step: "04", title: "التسليم والمتابعة", description: "نسلم مشروعاً مكتملاً مع دعم مستمر" }
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-black font-bold">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{step.title}</h4>
                      <p className="text-gray-300 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
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
            <h2 className="luxury-h1 text-amber-400 mb-6">جاهز لبدء رحلتك معنا؟</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              دعنا نكون شريكك في تحقيق النجاح الرقمي وتحويل أفكارك إلى واقع مذهل
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg shadow-2xl">
                  تواصل معنا الآن
                </Button>
              </motion.div>
              
              <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '966500000000'}`} target="_blank" rel="noopener noreferrer">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-bold py-4 px-8 rounded-full text-lg shadow-xl">
                    واتساب مباشر
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