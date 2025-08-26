import { motion } from "framer-motion";
import { ExternalLink, Globe, Smartphone, Code, Database, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Portfolio() {
  const portfolioItems = [
    {
      id: 1,
      name: "منصة القدرات - قدراتك",
      description: "منصة تعليمية متقدمة لتحسين قدرات الطلاب مع نظام اختبارات ذكي وتقارير مفصلة",
      url: "https://www.qodratk.space",
      image: "/api/placeholder/600/400",
      category: "تعليمية",
      technologies: ["React", "Node.js", "PostgreSQL", "AI"],
      features: [
        "نظام اختبارات ذكي",
        "تقارير تحليلية مفصلة", 
        "واجهة مستخدم حديثة",
        "نظام إدارة الطلاب",
        "تتبع التقدم الأكاديمي"
      ],
      stats: {
        users: "10,000+",
        rating: 4.9,
        completionRate: "95%"
      }
    },
    {
      id: 2,
      name: "منصة تحفيظ القرآن - بستان",
      description: "منصة إسلامية متميزة لتحفيظ القرآن الكريم مع خصائص تفاعلية ونظام متابعة شخصي",
      url: "https://bustan.ma3k.online",
      image: "/api/placeholder/600/400",
      category: "إسلامية",
      technologies: ["Vue.js", "Express", "MongoDB", "Audio API"],
      features: [
        "تلاوة صوتية متقنة",
        "نظام التسميع الذكي",
        "تتبع الحفظ اليومي",
        "مراجعة تفاعلية",
        "إحصائيات شخصية"
      ],
      stats: {
        users: "5,000+",
        rating: 5.0,
        completionRate: "98%"
      }
    },
    {
      id: 3,
      name: "شركة الرياضة - ProCourse",
      description: "منصة رياضية شاملة لإدارة الدورات التدريبية والأنشطة الرياضية مع نظام حجز متطور",
      url: "https://www.procourse.site",
      image: "/api/placeholder/600/400",
      category: "رياضية",
      technologies: ["Angular", "Django", "Redis", "Payment Gateway"],
      features: [
        "نظام حجز الدورات",
        "إدارة الأنشطة الرياضية",
        "نظام دفع آمن",
        "تتبع الأداء الرياضي",
        "لوحة تحكم المدربين"
      ],
      stats: {
        users: "3,000+",
        rating: 4.8,
        completionRate: "92%"
      }
    },
    {
      id: 4,
      name: "منصة معك للخدمات",
      description: "منصة شاملة للخدمات الرقمية مع أدوات ذكاء اصطناعي متقدمة لتطوير الأعمال",
      url: "https://ma3k.site",
      image: "/api/placeholder/600/400",
      category: "خدمات تقنية",
      technologies: ["React", "TypeScript", "AI", "Cloud"],
      features: [
        "أدوات ذكاء اصطناعي",
        "خدمات تطوير متنوعة",
        "نظام إدارة العملاء",
        "منصة دفع متقدمة",
        "دعم فني مستمر"
      ],
      stats: {
        users: "15,000+",
        rating: 4.9,
        completionRate: "97%"
      }
    },
    {
      id: 5,
      name: "تطبيق التجارة الذكية",
      description: "تطبيق تجاري متطور لإدارة المتاجر الإلكترونية مع تحليلات ذكية ونظام مخزون متقدم",
      url: "#",
      image: "/api/placeholder/600/400",
      category: "تجارة إلكترونية",
      technologies: ["React Native", "Node.js", "AI Analytics", "Blockchain"],
      features: [
        "تحليلات ذكية للمبيعات",
        "إدارة المخزون الذكي",
        "نظام توصيات AI",
        "أمان blockchain",
        "تطبيق جوال"
      ],
      stats: {
        users: "8,000+",
        rating: 4.7,
        completionRate: "94%"
      }
    },
    {
      id: 6,
      name: "منصة الطبخ والوصفات",
      description: "منصة تفاعلية لمشاركة وصفات الطبخ مع مجتمع محبي الطعام ونظام تقييم متطور",
      url: "#",
      image: "/api/placeholder/600/400",
      category: "طعام وشراب",
      technologies: ["Next.js", "Prisma", "AWS", "Image Processing"],
      features: [
        "مشاركة الوصفات",
        "مجتمع تفاعلي",
        "تقييم ومراجعات",
        "قائمة التسوق الذكية",
        "فيديوهات تعليمية"
      ],
      stats: {
        users: "12,000+",
        rating: 4.6,
        completionRate: "96%"
      }
    }
  ];

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
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="luxury-h1 text-amber-400 mb-6">أعمالنا المميزة</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            استكشف مجموعة من أفضل المشاريع التي نفذناها بنجاح لعملائنا الكرام
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            {[
              { number: "50+", label: "مشروع مكتمل" },
              { number: "15,000+", label: "مستخدم راضي" },
              { number: "99%", label: "معدل النجاح" },
              { number: "24/7", label: "دعم مستمر" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="glass-morphism rounded-2xl p-6 text-center"
              >
                <div className="text-2xl font-bold text-amber-400 mb-2">{stat.number}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {portfolioItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="glass-card rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-amber-500/20 to-purple-600/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {item.category}
                  </span>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-4">
                    <Button
                      size="sm"
                      className="bg-amber-500 hover:bg-amber-600 text-black"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      زيارة الموقع
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-black"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      معاينة
                    </Button>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-amber-400 font-bold text-lg">{item.stats.users}</div>
                    <div className="text-gray-400 text-xs">مستخدم</div>
                  </div>
                  <div className="text-center">
                    <div className="text-amber-400 font-bold text-lg flex items-center justify-center gap-1">
                      {item.stats.rating}
                      <Star className="w-4 h-4 fill-amber-400" />
                    </div>
                    <div className="text-gray-400 text-xs">تقييم</div>
                  </div>
                  <div className="text-center">
                    <div className="text-amber-400 font-bold text-lg">{item.stats.completionRate}</div>
                    <div className="text-gray-400 text-xs">إنجاز</div>
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-4">
                  <h4 className="text-gray-300 text-sm mb-2">التقنيات المستخدمة:</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-gray-800/50 text-gray-300 px-2 py-1 rounded-lg text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-gray-300 text-sm mb-2">المميزات الرئيسية:</h4>
                  <div className="space-y-1">
                    {item.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        <span className="text-gray-400 text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  زيارة المشروع
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-20"
        >
          <div className="glass-card rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="luxury-h1 text-amber-400 mb-6">هل لديك مشروع في البال؟</h2>
            <p className="text-xl text-gray-300 mb-8">
              نحن متحمسون لسماع فكرتك ومساعدتك في تحويلها إلى واقع رقمي مذهل
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg">
                ابدأ مشروعك الآن
              </Button>
              
              <Button 
                variant="outline" 
                className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-bold py-4 px-8 rounded-full text-lg"
                onClick={() => window.location.href = "/contact"}
              >
                تواصل معنا
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}