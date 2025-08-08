import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const projects = [
    {
      id: 1,
      title: "متجر الأزياء العصرية",
      category: "متجر إلكتروني",
      description: "متجر إلكتروني متكامل للأزياء النسائية مع نظام دفع متقدم وإدارة المخزون",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["React", "Node.js", "PayPal", "Stripe"],
      features: [
        "تصميم متجاوب بالكامل",
        "نظام دفع متعدد الطرق",
        "إدارة المخزون التلقائية",
        "تتبع الطلبات والشحن",
        "برنامج نقاط الولاء"
      ],
      testimonial: {
        text: "موقع رائع وسهل الاستخدام، زادت مبيعاتي بنسبة 300% خلال شهرين",
        author: "فاطمة أحمد",
        role: "صاحبة متجر"
      }
    },
    {
      id: 2,
      title: "منصة التعلم الذكي",
      category: "تعليمي",
      description: "منصة تعليمية تفاعلية مع اختبارات ذكية ونظام تتبع التقدم",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["Vue.js", "Python", "AI", "Machine Learning"],
      features: [
        "مسارات تعليمية مخصصة",
        "اختبارات تفاعلية ذكية",
        "تتبع التقدم والإنجازات",
        "منتدى طلابي نشط",
        "شهادات معتمدة"
      ],
      testimonial: {
        text: "أفضل منصة تعليمية استخدمتها، التصميم بديهي والمحتوى عالي الجودة",
        author: "د. محمد الخالدي",
        role: "أستاذ جامعي"
      }
    },
    {
      id: 3,
      title: "تطبيق إدارة المشاريع",
      category: "تطبيق جوال",
      description: "تطبيق جوال لإدارة المشاريع وتنسيق الفرق مع ميزات متقدمة",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["React Native", "Firebase", "Real-time"],
      features: [
        "إدارة المهام والمشاريع",
        "تنسيق الفرق والتعاون",
        "تقارير الأداء المتقدمة",
        "إشعارات فورية",
        "تزامن متعدد الأجهزة"
      ],
      testimonial: {
        text: "ساعدنا التطبيق في تحسين إنتاجية الفريق بشكل كبير ونظم عملنا",
        author: "أحمد سالم",
        role: "مدير مشاريع"
      }
    },
    {
      id: 4,
      title: "موقع الشركة التقنية",
      category: "مؤسسي",
      description: "موقع احترافي لشركة تقنية مع عرض الخدمات والحلول",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["Next.js", "TypeScript", "SEO"],
      features: [
        "تصميم احترافي ومعاصر",
        "تحسين محركات البحث",
        "صفحات خدمات تفاعلية",
        "نماذج تواصل متقدمة",
        "سرعة تحميل عالية"
      ],
      testimonial: {
        text: "موقع يعكس احترافية شركتنا ويجذب العملاء بشكل ممتاز",
        author: "سارة المحمدي",
        role: "مديرة التسويق"
      }
    },
    {
      id: 5,
      title: "منصة الطبخ والوصفات",
      category: "اجتماعي",
      description: "منصة اجتماعية لمشاركة الوصفات وتقييمها مع مجتمع الطهاة",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["React", "MongoDB", "Social Features"],
      features: [
        "مشاركة الوصفات بالصور",
        "تقييم وتعليق المستخدمين",
        "قوائم التسوق الذكية",
        "متابعة الطهاة المفضلين",
        "مقاطع فيديو تعليمية"
      ],
      testimonial: {
        text: "منصة رائعة لمحبي الطبخ، استفدت كثيراً من الوصفات والنصائح",
        author: "نورا العلي",
        role: "طاهية هاوية"
      }
    },
    {
      id: 6,
      title: "تطبيق اللياقة البدنية",
      category: "صحة ولياقة",
      description: "تطبيق متكامل للياقة البدنية مع برامج تدريب شخصية",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["Flutter", "Health APIs", "Wearables"],
      features: [
        "برامج تدريب مخصصة",
        "تتبع التقدم والإحصائيات",
        "تكامل مع الأجهزة القابلة للارتداء",
        "تحديات جماعية",
        "نصائح تغذية"
      ],
      testimonial: {
        text: "التطبيق غير حياتي الصحية بشكل إيجابي وحفزني للاستمرار",
        author: "خالد الرشيد",
        role: "رياضي"
      }
    }
  ];

  const categories = ["الكل", "متجر إلكتروني", "تعليمي", "تطبيق جوال", "مؤسسي", "اجتماعي", "صحة ولياقة"];
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const filteredProjects = selectedCategory === "الكل" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const stats = [
    { number: "50+", label: "مشروع مكتمل", icon: "fas fa-check-circle" },
    { number: "98%", label: "رضا العملاء", icon: "fas fa-heart" },
    { number: "24/7", label: "دعم فني", icon: "fas fa-headset" },
    { number: "3 سنوات", label: "خبرة في السوق", icon: "fas fa-calendar" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">معرض أعمالنا</h1>
          <p className="text-xl opacity-90">
            مجموعة مختارة من أفضل مشاريعنا التي أنجزناها لعملائنا
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <i className={`${stat.icon} text-primary-500 text-3xl mb-4`}></i>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">مشاريعنا المتميزة</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-primary-500 hover:bg-primary-600" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary-500">
                      {project.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <Button 
                    className="w-full bg-primary-500 hover:bg-primary-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                    }}
                  >
                    عرض التفاصيل
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">هل أنت مستعد لبدء مشروعك؟</h2>
          <p className="text-xl mb-8 opacity-90">
            دع فريقنا المتخصص يحول أفكارك إلى واقع رقمي متميز
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary-600 px-8 py-4 text-lg font-semibold hover:bg-gray-100">
              ابدأ مشروعك الآن
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-primary-600"
            >
              طلب استشارة مجانية
            </Button>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 left-4 z-10 bg-white/80 hover:bg-white"
              >
                <i className="fas fa-times text-xl"></i>
              </Button>
              
              {/* Project Image */}
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              
              {/* Content */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {selectedProject.title}
                    </h2>
                    <Badge className="bg-primary-500">
                      {selectedProject.category}
                    </Badge>
                  </div>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                    <TabsTrigger value="features">الميزات</TabsTrigger>
                    <TabsTrigger value="testimonial">آراء العملاء</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">وصف المشروع</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedProject.description}
                      </p>
                      
                      <div>
                        <h4 className="font-bold mb-3">التقنيات المستخدمة</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="mt-6">
                    <div>
                      <h3 className="text-xl font-bold mb-4">الميزات الرئيسية</h3>
                      <div className="grid gap-3">
                        {selectedProject.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <i className="fas fa-check text-success-500 ml-3"></i>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="testimonial" className="mt-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className="flex text-accent-500 text-xl">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="fas fa-star"></i>
                          ))}
                        </div>
                      </div>
                      <blockquote className="text-lg text-gray-700 mb-4 italic">
                        "{selectedProject.testimonial.text}"
                      </blockquote>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold ml-4">
                          {selectedProject.testimonial.author.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold">{selectedProject.testimonial.author}</div>
                          <div className="text-gray-600 text-sm">{selectedProject.testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-8 flex gap-4">
                  <Button className="flex-1 bg-primary-500 hover:bg-primary-600">
                    طلب مشروع مشابه
                  </Button>
                  <Button variant="outline" className="flex-1">
                    تواصل معنا
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
