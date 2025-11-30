import { motion } from "framer-motion";
import { ExternalLink, Globe, Smartphone, Code, Database, Star, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

interface PortfolioItem {
  id: number | string;
  name: string;
  description: string;
  url: string;
  image: string;
  category: string;
  technologies: string[];
  features: string[];
  stats: {
    users: string;
    rating: number;
    completionRate: string;
  };
}

const staticPortfolioItems: PortfolioItem[] = [
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

function projectToPortfolioItem(project: Project & { name?: string }): PortfolioItem {
  const projectName = project.projectName || project.name || "مشروع بدون اسم";
  return {
    id: project.id,
    name: projectName,
    description: project.websiteIdea || "مشروع متميز",
    url: project.domain ? (project.domain.startsWith('http') ? project.domain : `https://${project.domain}`) : "#",
    image: "/api/placeholder/600/400",
    category: "مشاريع العملاء",
    technologies: project.toolsUsed || ["React", "Node.js"],
    features: [
      "تصميم عصري",
      "واجهة مستخدم متجاوبة",
      "أداء عالي",
      "تجربة مستخدم ممتازة"
    ],
    stats: {
      users: "1,000+",
      rating: 4.8,
      completionRate: "100%"
    }
  };
}

export default function Portfolio() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const completedProjects = projects?.filter(p => p.status === 'completed') || [];
  const dynamicItems = completedProjects.map(projectToPortfolioItem);
  
  const portfolioItems = [...dynamicItems, ...staticPortfolioItems];

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const categories = ["الكل", "تعليمية", "إسلامية", "رياضية", "خدمات تقنية", "تجارة إلكترونية", "طعام وشراب", "مشاريع العملاء"];

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="luxury-h1 mb-4">
              <span className="text-amber-400">أعمالنا</span> المتميزة
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              مجموعة مختارة من أفضل المشاريع التي نفخر بتقديمها لعملائنا الكرام
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10"
                data-testid={`filter-${category}`}
              >
                {category}
              </Button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              <span className="mr-3 text-gray-300">جاري تحميل المشاريع...</span>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="group relative"
                  data-testid={`portfolio-item-${item.id}`}
                >
                  <div className="glass-card overflow-hidden rounded-2xl border border-amber-400/20 transition-all duration-500 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-400/10">
                    <div className="relative h-48 bg-gradient-to-br from-amber-400/20 to-amber-600/20 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="w-16 h-16 text-amber-400/50" />
                      </div>
                      
                      <div className="absolute top-3 right-3">
                        <span className="bg-amber-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                          {item.category}
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        {item.url !== "#" && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-amber-400 text-black p-3 rounded-full hover:scale-110 transition-transform"
                            data-testid={`link-external-${item.id}`}
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                        <button 
                          className="bg-white/20 text-white p-3 rounded-full hover:scale-110 transition-transform backdrop-blur-sm"
                          data-testid={`button-preview-${item.id}`}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.technologies.slice(0, 4).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="bg-amber-400/10 text-amber-400 px-2 py-1 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-700 pt-4">
                        <div>
                          <p className="text-amber-400 font-bold">{item.stats.users}</p>
                          <p className="text-gray-500 text-xs">مستخدم</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-amber-400 font-bold">{item.stats.rating}</span>
                          </div>
                          <p className="text-gray-500 text-xs">تقييم</p>
                        </div>
                        <div>
                          <p className="text-amber-400 font-bold">{item.stats.completionRate}</p>
                          <p className="text-gray-500 text-xs">إكمال</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="glass-card p-8 rounded-2xl border border-amber-400/20 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">هل لديك مشروع في ذهنك؟</h2>
              <p className="text-gray-300 mb-6">
                نحن هنا لتحويل أفكارك إلى واقع رقمي متميز. تواصل معنا اليوم!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-amber-400 text-black hover:bg-amber-500"
                  onClick={() => window.location.href = '/services'}
                  data-testid="button-start-project"
                >
                  <Globe className="w-4 h-4 ml-2" />
                  ابدأ مشروعك الآن
                </Button>
                <Button 
                  variant="outline" 
                  className="border-amber-400 text-amber-400 hover:bg-amber-400/10"
                  onClick={() => window.location.href = '/contact'}
                  data-testid="button-contact-portfolio"
                >
                  تواصل معنا
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Globe, label: "مشروع منجز", value: `${portfolioItems.length}+` },
              { icon: Star, label: "تقييم العملاء", value: "4.9/5" },
              { icon: Code, label: "سطر كود", value: "500K+" },
              { icon: Database, label: "عميل راضٍ", value: "100+" }
            ].map((stat, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-xl text-center border border-amber-400/10"
                data-testid={`stat-${stat.label}`}
              >
                <stat.icon className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
