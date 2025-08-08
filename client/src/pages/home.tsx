import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ServiceCard from "@/components/services/service-card";
import OrderModal from "@/components/services/order-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CONTACT_INFO, SERVICE_CATEGORIES } from "@/lib/constants";
import type { Service } from "@shared/schema";

export default function Home() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const handleOrderService = (service: Service) => {
    setSelectedService(service);
    setIsOrderModalOpen(true);
  };

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
      {/* Enhanced Hero Section */}
      <section className="creative-gradient text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-yellow-300/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            <div className="mb-8 animate-fade-in-down">
              <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">معك</h1>
              <div className="w-32 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full mx-auto mb-6"></div>
            </div>
            
            <h2 className="text-3xl md:text-4xl mb-8 font-bold animate-fade-in-up">
              🎨 نُصمم أحلامك الرقمية بإبداع
            </h2>
            
            <p className="text-xl md:text-2xl mb-10 max-w-5xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              🚀 نحن نساعد الأفراد والمؤسسات على تحويل أفكارهم إلى واقع رقمي احترافي<br/>
              🎯 مواقع • تطبيقات • متاجر • هويات بصرية • حلول دفع وفواتير<br/>
              ⚡ خدمة سريعة • شفافية بالأسعار • دعم ما بعد التسليم
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <Link href="/services">
                <Button className="bg-white text-blue-600 px-10 py-5 text-xl font-bold hover:bg-gray-100 shadow-2xl rounded-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                  <span className="relative z-10 flex items-center">
                    <span className="ml-3">🚀</span>
                    اطلب الآن
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              
              <Button
                onClick={() => setIsConsultationModalOpen(true)}
                variant="outline"
                className="border-2 border-white text-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-blue-600 rounded-2xl glass-morphism transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center">
                  <span className="ml-3">🎆</span>
                  استشارة مجانية
                </span>
              </Button>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="glass-morphism p-6 rounded-2xl">
                <h3 className="text-3xl font-bold text-yellow-300 mb-2">500+</h3>
                <p className="text-lg">مشروع ناجح</p>
              </div>
              <div className="glass-morphism p-6 rounded-2xl">
                <h3 className="text-3xl font-bold text-green-400 mb-2">24س</h3>
                <p className="text-lg">زمن الاستجابة</p>
              </div>
              <div className="glass-morphism p-6 rounded-2xl">
                <h3 className="text-3xl font-bold text-pink-400 mb-2">100%</h3>
                <p className="text-lg">رضا العملاء</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 service-gradient"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 animate-fade-in-up">🎯 خدماتنا المتميزة</h2>
            <div className="section-divider mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">🚀 نقدم مجموعة شاملة من الخدمات الرقمية الإبداعية بأسعار تنافسية</p>
          </div>

          {SERVICE_CATEGORIES.map((category) => {
            const categoryServices = groupedServices[category] || [];
            if (categoryServices.length === 0) return null;

            return (
              <div key={category} className="mb-20 animate-fade-in-up">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-morphism mb-6 animate-glow-pulse">
                    <i className={`fas fa-${getCategoryIcon(category)} text-3xl text-blue-500`}></i>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    {category}
                  </h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryServices.map((service: Service, index: number) => (
                    <div 
                      key={service.id}
                      className="animate-fade-in-up floating-card"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ServiceCard
                        service={service}
                        onOrder={handleOrderService}
                        variant={getServiceVariant(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="text-center mt-16">
            <Link href="/services">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-5 text-xl font-bold hover:from-blue-600 hover:to-purple-700 rounded-2xl transform hover:scale-105 transition-all duration-300 multi-glow">
                <span className="flex items-center">
                  <span className="ml-3">🔍</span>
                  عرض جميع الخدمات
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Payment Methods Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative">
        <div className="absolute inset-0 cyber-grid opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 animate-fade-in-up">💳 طرق الدفع الآمنة</h2>
            <div className="section-divider mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">🔒 اختر طريقة الدفع المناسبة لك من بين خياراتنا الآمنة</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { icon: 'fab fa-paypal', title: 'PayPal', desc: 'ادفع عبر حساب PayPal الآمن', color: 'text-blue-600', bg: 'from-blue-100 to-blue-200' },
              { icon: 'fas fa-university', title: 'تحويل بنكي', desc: 'بنك الراجحي', sub: 'SA78 8000 0539 6080 1942 4738', color: 'text-green-600', bg: 'from-green-100 to-green-200' },
              { icon: 'fas fa-mobile-alt', title: 'STC Pay', desc: '00532441566', color: 'text-purple-600', bg: 'from-purple-100 to-purple-200' },
              { icon: 'fas fa-wallet', title: 'المحافظ الرقمية', desc: 'UR PAY: 0532441566', sub: 'ALINMA PAY: 966532441566', color: 'text-orange-600', bg: 'from-orange-100 to-orange-200' }
            ].map((payment, index) => (
              <Card key={index} className={`text-center p-6 bg-gradient-to-br ${payment.bg} creative-hover floating-card border-2 border-white/50 backdrop-blur-sm`} style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="pt-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/80 ${payment.color} mb-6 group-hover:scale-110 transition-transform`}>
                    <i className={`${payment.icon} text-3xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{payment.title}</h3>
                  <p className="text-gray-700 font-medium">{payment.desc}</p>
                  {payment.sub && <p className="text-sm text-gray-600 mt-2 font-mono">{payment.sub}</p>}
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

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">تواصل معنا</h2>
            <p className="text-xl opacity-90">نحن هنا لمساعدتك في تحقيق أهدافك الرقمية</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">معلومات الاتصال</h3>
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
                <h3 className="text-2xl font-bold mb-6">أرسل رسالة</h3>
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
                    className="w-full bg-accent-500 text-white hover:bg-accent-600"
                  >
                    إرسال الرسالة
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        service={selectedService}
      />

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
