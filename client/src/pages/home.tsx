import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ServiceCard from "@/components/services/service-card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CONTACT_INFO, SERVICE_CATEGORIES } from "@/lib/constants";
import type { Service } from "@shared/schema";

export default function Home() {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });


  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      await apiRequest("POST", "/api/consultations", {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        projectType: formData.get("project_type"),
        description: formData.get("description"),
      });

      toast({
        title: "تم إرسال طلب الاستشارة بنجاح!",
        description: "سنتواصل معك في أقرب وقت ممكن.",
      });

      setIsConsultationModalOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      await apiRequest("POST", "/api/messages", {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
      });

      toast({
        title: "تم إرسال رسالتك بنجاح!",
        description: "سنرد عليك في أقرب وقت ممكن.",
      });

      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "خطأ في إرسال الرسالة",
        description: "حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const groupedServices = (services as Service[]).reduce((acc: Record<string, Service[]>, service: Service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      {/* Luxury Hero Section */}
      <section className="dark-gradient text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 luxury-bg"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-xl animate-luxury-float opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-400 rounded-full blur-xl animate-luxury-float opacity-20" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            <div className="mb-8 animate-luxury-float">
              <h1 className="text-8xl md:text-9xl font-bold mb-6 animate-text-shimmer">معك</h1>
              <div className="luxury-divider mb-8"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl mb-10 font-bold animate-gold-pulse">
              👑 نُصمم أحلامك الرقمية بإبداع فخم
            </h2>
            
            <p className="text-xl md:text-2xl mb-12 max-w-5xl mx-auto leading-relaxed animate-text-shimmer">
              🚀 نحن نساعد الأفراد والمؤسسات على تحويل أفكارهم إلى واقع رقمي احترافي<br/>
              🎯 مواقع • تطبيقات • متاجر • هويات بصرية • حلول دفع وفواتير<br/>
              ⚡ خدمة سريعة • شفافية بالأسعار • دعم ما بعد التسليم
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-12 animate-luxury-glow">
              <Link href="/services">
                <Button className="btn-luxury px-12 py-6 text-2xl font-bold rounded-3xl hover:scale-110 transition-all duration-300 animate-gold-pulse">
                  <span className="flex items-center">
                    <span className="ml-3">💎</span>
                    اطلب الآن
                  </span>
                </Button>
              </Link>
              
              <Button
                onClick={() => setIsConsultationModalOpen(true)}
                className="luxury-card border-2 border-yellow-400/30 text-white px-12 py-6 text-2xl font-bold hover:bg-black/20 rounded-3xl backdrop-blur-lg hover:scale-110 transition-all duration-300 animate-luxury-float"
              >
                <span className="flex items-center">
                  <span className="ml-3">✨</span>
                  استشارة مجانية
                </span>
              </Button>
            </div>
            
            {/* Luxury Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-luxury-glow">
              <div className="luxury-card p-8 rounded-3xl border-2 border-yellow-400/30">
                <h3 className="text-5xl font-bold text-yellow-400 mb-3 animate-gold-pulse">500+</h3>
                <p className="text-xl font-medium text-gray-300">مشروع ناجح</p>
              </div>
              <div className="luxury-card p-8 rounded-3xl border-2 border-green-400/30">
                <h3 className="text-5xl font-bold text-green-400 mb-3 animate-gold-pulse">24س</h3>
                <p className="text-xl font-medium text-gray-300">زمن الاستجابة</p>
              </div>
              <div className="luxury-card p-8 rounded-3xl border-2 border-purple-400/30">
                <h3 className="text-5xl font-bold text-purple-400 mb-3 animate-gold-pulse">100%</h3>
                <p className="text-xl font-medium text-gray-300">رضا العملاء</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Services Section */}
      <section id="services" className="py-32 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 luxury-bg"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold animate-text-shimmer mb-8">👑 خدماتنا المتميزة</h2>
            <div className="luxury-divider mb-8"></div>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto">💎 نقدم مجموعة شاملة من الخدمات الرقمية الفخمة بأسعار تنافسية</p>
          </div>

          {SERVICE_CATEGORIES.map((category) => {
            const categoryServices = groupedServices[category] || [];
            if (categoryServices.length === 0) return null;

            return (
              <div key={category} className="mb-24 animate-luxury-float">
                <div className="text-center mb-16">
                  <div className="w-32 h-32 rounded-full gold-gradient flex items-center justify-center mx-auto mb-8 animate-gold-pulse">
                    <i className={`fas fa-${getCategoryIcon(category)} text-5xl text-black animate-luxury-glow`}></i>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold animate-text-shimmer mb-6">
                    {category}
                  </h3>
                  <div className="luxury-divider"></div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {categoryServices.map((service: Service, index: number) => (
                    <div 
                      key={service.id}
                      className="animate-luxury-float"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <ServiceCard
                        service={service}
                        variant={getServiceVariant(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="text-center mt-20">
            <Link href="/services">
              <Button className="btn-luxury px-16 py-6 text-2xl font-bold rounded-3xl hover:scale-110 transition-all duration-300 animate-gold-pulse">
                <span className="flex items-center">
                  <span className="ml-3">💎</span>
                  عرض جميع الخدمات
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Luxury Payment Methods Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative">
        <div className="absolute inset-0 royal-grid opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-200 mb-6 animate-text-shimmer">💳 طرق الدفع الآمنة</h2>
            <div className="luxury-divider mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">🔒 اختر طريقة الدفع المناسبة لك من بين خياراتنا الآمنة</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { icon: 'fab fa-paypal', title: 'PayPal', desc: 'ادفع عبر حساب PayPal الآمن', color: 'text-blue-600', bg: 'from-blue-100 to-blue-200' },
              { icon: 'fas fa-university', title: 'تحويل بنكي', desc: 'بنك الراجحي', sub: 'SA78 8000 0539 6080 1942 4738', color: 'text-green-600', bg: 'from-green-100 to-green-200' },
              { icon: 'fas fa-mobile-alt', title: 'STC Pay', desc: '00532441566', color: 'text-purple-600', bg: 'from-purple-100 to-purple-200' },
              { icon: 'fas fa-wallet', title: 'المحافظ الرقمية', desc: 'UR PAY: 0532441566', sub: 'ALINMA PAY: 966532441566', color: 'text-orange-600', bg: 'from-orange-100 to-orange-200' }
            ].map((payment, index) => (
              <Card key={index} className={`luxury-card text-center p-6 luxury-hover floating-card border-2 border-yellow-400/30`} style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="pt-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400/20 ${payment.color} mb-6 group-hover:scale-110 transition-transform animate-gold-pulse`}>
                    <i className={`${payment.icon} text-3xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-200">{payment.title}</h3>
                  <p className="text-gray-300 font-medium">{payment.desc}</p>
                  {payment.sub && <p className="text-sm text-gray-400 mt-2 font-mono bg-black/40 p-2 rounded">{payment.sub}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">آراء عملائنا</h2>
            <p className="text-xl text-gray-600">ماذا يقول عملاؤنا عن خدماتنا</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "أحمد محمد",
                role: "صاحب متجر إلكتروني",
                content: "خدمة ممتازة وسرعة في التنفيذ. الفريق محترف جداً وقام بتنفيذ الموقع بالضبط كما طلبت.",
                initial: "أ",
                color: "bg-primary-500",
              },
              {
                name: "سارة أحمد",
                role: "مدربة لياقة",
                content: "التطبيق الذي صمموه لي يعمل بشكل مثالي. التصميم جميل والأداء ممتاز.",
                initial: "س",
                color: "bg-success-500",
              },
              {
                name: "محمد علي",
                role: "رائد أعمال",
                content: "أسعار منافسة وجودة عالية. أنصح بالتعامل معهم بشدة.",
                initial: "م",
                color: "bg-accent-500",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-50 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="flex text-accent-500 text-xl">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold`}>
                      {testimonial.initial}
                    </div>
                    <div className="mr-3">
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Contact Section */}
      <section id="contact" className="py-20 dark-gradient text-white relative">
        <div className="absolute inset-0 luxury-bg opacity-20"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-4xl font-bold mb-4 animate-text-shimmer">تواصل معنا</h2>
            <div className="luxury-divider mb-6"></div>
            <p className="text-xl opacity-90">نحن هنا لمساعدتك في تحقيق أهدافك الرقمية</p>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-yellow-400">معلومات الاتصال</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-2xl ml-4"></i>
                    <span className="text-lg">{CONTACT_INFO.EMAIL}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fab fa-whatsapp text-2xl ml-4"></i>
                    <span className="text-lg">{CONTACT_INFO.WHATSAPP}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-clock text-2xl ml-4"></i>
                    <span className="text-lg">الرد خلال 1-24 ساعة عمل</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-xl font-bold mb-4">ضماناتنا</h4>
                  <ul className="space-y-2">
                    {[
                      "ضمان 14 يوماً لتعديلات بعد التسليم",
                      "طرق دفع آمنة ومتعددة",
                      "فواتير رسمية لكل عملية",
                      "دعم تقني متواصل",
                    ].map((guarantee, index) => (
                      <li key={index} className="flex items-center">
                        <i className="fas fa-check text-success-400 ml-3"></i>
                        {guarantee}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 text-yellow-400">أرسل رسالة</h3>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <Input
                    name="name"
                    placeholder="الاسم الكامل"
                    required
                    className="bg-white text-gray-900"
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="البريد الإلكتروني"
                    required
                    className="bg-white text-gray-900"
                  />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="رقم الهاتف"
                    className="bg-white text-gray-900"
                  />
                  <Textarea
                    name="message"
                    placeholder="رسالتك"
                    rows={4}
                    required
                    className="bg-white text-gray-900"
                  />
                  <Button
                    type="submit"
                    className="w-full btn-luxury"
                  >
                    إرسال الرسالة
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Consultation Modal */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">طلب استشارة مجانية</h2>
                <Button
                  variant="ghost"
                  onClick={() => setIsConsultationModalOpen(false)}
                >
                  <i className="fas fa-times text-xl"></i>
                </Button>
              </div>

              <div className="mb-6 p-4 bg-success-50 rounded-lg">
                <p className="text-success-800">
                  <i className="fas fa-gift ml-2"></i>
                  استشارة مجانية تماماً لمساعدتك في اختيار الحل المناسب
                </p>
              </div>

              <form onSubmit={handleConsultationSubmit} className="space-y-6">
                <Input name="name" placeholder="الاسم الكامل" required />
                <Input name="email" type="email" placeholder="البريد الإلكتروني" required />
                <Input name="phone" type="tel" placeholder="رقم الهاتف / واتساب" required />
                <select
                  name="project_type"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">اختر نوع المشروع</option>
                  <option value="website">موقع إلكتروني</option>
                  <option value="app">تطبيق جوال</option>
                  <option value="ecommerce">متجر إلكتروني</option>
                  <option value="educational">منصة تعليمية</option>
                  <option value="other">أخرى</option>
                </select>
                <Textarea
                  name="description"
                  placeholder="اكتب هنا تفاصيل مشروعك والمساعدة التي تحتاجها..."
                  rows={4}
                  required
                />
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsConsultationModalOpen(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" className="flex-1 bg-success-500 hover:bg-success-600">
                    طلب الاستشارة
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function getCategoryIcon(category: string): string {
  switch (category) {
    case "مواقع وتطبيقات":
      return "globe";
    case "هويات وتصميم":
      return "paint-brush";
    case "متابعة ودعم":
      return "headset";
    case "تجارب تفاعلية وحلول مبتكرة":
      return "flask";
    case "مدفوعات ورصيد":
      return "credit-card";
    default:
      return "cog";
  }
}

function getServiceVariant(index: number): "primary" | "success" | "accent" {
  const variants = ["primary", "success", "accent"] as const;
  return variants[index % 3];
}
