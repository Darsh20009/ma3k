import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (project: any) => {
    const existingItem = cart.find(item => item.id === project.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === project.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...project, quantity: 1, price: 2500 }]);
    }
  };

  const projects = [
    {
      id: 1,
      title: "متجر التقنية المتقدمة",
      category: "متجر إلكتروني",
      description: "متجر إلكتروني متكامل للمنتجات التقنية مع نظام دفع متقدم وإدارة المخزون الذكية",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["React", "Node.js", "PayPal", "AI"],
      features: [
        "تصميم متجاوب بالكامل",
        "نظام دفع متعدد الطرق",
        "إدارة المخزون التلقائية",
        "تتبع الطلبات والشحن",
        "برنامج نقاط الولاء الذكي"
      ],
      testimonial: {
        text: "موقع رائع وسهل الاستخدام، زادت مبيعاتي بنسبة 300% خلال شهرين",
        author: "أحمد التقني",
        role: "صاحب متجر"
      }
    },
    {
      id: 2,
      title: "منصة التعلم الذكي",
      category: "تعليمي",
      description: "منصة تعليمية تفاعلية مع اختبارات ذكية ونظام تتبع التقدم باستخدام الذكاء الاصطناعي",
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["Vue.js", "Python", "AI", "Machine Learning"],
      features: [
        "مسارات تعليمية مخصصة",
        "اختبارات تفاعلية ذكية",
        "تتبع التقدم والإنجازات",
        "منتدى طلابي نشط",
        "شهادات معتمدة رقمية"
      ],
      testimonial: {
        text: "أفضل منصة تعليمية استخدمتها، التصميم بديهي والمحتوى عالي الجودة",
        author: "د. محمد الخالدي",
        role: "أستاذ جامعي"
      }
    },
    {
      id: 3,
      title: "تطبيق إدارة المشاريع الذكي",
      category: "تطبيق جوال",
      description: "تطبيق جوال متقدم لإدارة المشاريع وتنسيق الفرق مع ميزات الذكاء الاصطناعي",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["React Native", "Firebase", "Real-time", "AI"],
      features: [
        "إدارة المهام والمشاريع بالذكاء الاصطناعي",
        "تنسيق الفرق والتعاون الفوري",
        "تقارير الأداء المتقدمة",
        "إشعارات ذكية ومخصصة",
        "تزامن متعدد الأجهزة والمنصات"
      ],
      testimonial: {
        text: "ساعدنا التطبيق في تحسين إنتاجية الفريق بشكل كبير ونظم عملنا",
        author: "أحمد سالم",
        role: "مدير مشاريع"
      }
    },
    {
      id: 4,
      title: "موقع الشركة التقنية الذكي",
      category: "مؤسسي",
      description: "موقع احترافي لشركة تقنية مع عرض الخدمات والحلول المبتكرة وتقنيات الذكاء الاصطناعي",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["Next.js", "TypeScript", "SEO", "AI"],
      features: [
        "تصميم احترافي ومعاصر",
        "تحسين محركات البحث المتقدم",
        "صفحات خدمات تفاعلية وذكية",
        "نماذج تواصل مدعومة بالذكاء الاصطناعي",
        "سرعة تحميل فائقة وأداء محسن"
      ],
      testimonial: {
        text: "موقع يعكس احترافية شركتنا ويجذب العملاء بشكل ممتاز",
        author: "خالد المحمدي",
        role: "مدير التسويق"
      }
    },
    {
      id: 5,
      title: "منصة المحتوى الرقمي",
      category: "اجتماعي",
      description: "منصة اجتماعية لمشاركة المحتوى الرقمي والتفاعل مع مجتمع المبدعين والتقنيين",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["React", "MongoDB", "Social Features", "AI"],
      features: [
        "مشاركة المحتوى بتنسيقات متعددة",
        "تقييم وتعليق المستخدمين الذكي",
        "خوارزميات توصيات ذكية",
        "متابعة المبدعين المفضلين",
        "أدوات إنتاج المحتوى المتقدمة"
      ],
      testimonial: {
        text: "منصة رائعة للمبدعين، ساعدتني في الوصول لجمهور أكبر وتحسين محتواي",
        author: "عبدالله العلي",
        role: "منشئ محتوى"
      }
    },
    {
      id: 6,
      title: "تطبيق الإنتاجية الذكي",
      category: "إنتاجية",
      description: "تطبيق متكامل لتحسين الإنتاجية الشخصية مع تتبع العادات وتحسين الأداء",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["Flutter", "Analytics", "AI", "Productivity"],
      features: [
        "تتبع المهام والأهداف الذكي",
        "تحليل الإنتاجية والأداء",
        "تذكيرات ذكية ومخصصة",
        "تتبع العادات والتقدم",
        "تقارير تفصيلية وإحصائيات متقدمة"
      ],
      testimonial: {
        text: "التطبيق غير طريقة عملي بشكل إيجابي وساعدني في تحقيق أهدافي",
        author: "محمد الرشيد",
        role: "رجل أعمال"
      }
    }
  ];

  const categories = ["الكل", "متجر إلكتروني", "تعليمي", "تطبيق جوال", "مؤسسي", "اجتماعي", "إنتاجية"];
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="gradient-bg text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-down">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              معرض أعمالنا الرقمية
            </span>
          </h1>
          <p className="text-xl opacity-90 animate-fade-in-up">
            مجموعة مختارة من أفضل مشاريعنا التقنية المبتكرة والحلول الذكية
          </p>
        </div>
      </section>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed top-20 left-4 z-50">
          <Card className="bg-card/95 backdrop-blur border-primary/20 neon-glow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-primary mb-2">
                <i className="fas fa-shopping-cart"></i>
                <span className="font-bold">عربة التسوق ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                المجموع: {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)} ر.س
              </div>
              <Button size="sm" className="w-full bg-primary hover:bg-primary/80">
                إتمام الطلب
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 group hover:scale-105 transition-all duration-300">
                <i className={`${stat.icon} text-primary text-4xl mb-4 group-hover:animate-pulse`}></i>
                <div className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          {/* Category Filter */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-8">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                مشاريعنا المتميزة
              </span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-primary hover:bg-primary/80 neon-glow" : "border-border hover:bg-card"}
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
                className="overflow-hidden hover:shadow-2xl service-card bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all duration-500 cursor-pointer group"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative">
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-primary/90 backdrop-blur text-white neon-glow">
                      {project.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
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
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                    >
                      عرض التفاصيل
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(project);
                      }}
                    >
                      <i className="fas fa-cart-plus"></i>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4 animate-pulse-slow">
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              هل أنت مستعد لبدء رحلتك الرقمية؟
            </span>
          </h2>
          <p className="text-xl mb-8 opacity-90">
            دع فريقنا المتخصص يحول أفكارك إلى واقع رقمي متميز بأحدث التقنيات والحلول الذكية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary px-8 py-4 text-lg font-semibold hover:bg-gray-100 neon-glow hover:scale-105 transition-all duration-300">
              <i className="fas fa-rocket ml-2"></i>
              ابدأ مشروعك الآن
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-primary glass-effect hover:scale-105 transition-all duration-300"
            >
              <i className="fas fa-comments ml-2"></i>
              طلب استشارة مجانية
            </Button>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto neon-glow">
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
