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

  const { data: services = [] } = useQuery({
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

  const groupedServices = services.reduce((acc: Record<string, Service[]>, service: Service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-down">معك</h1>
            <h2 className="text-2xl md:text-3xl mb-8 opacity-90 animate-fade-in-up">
              نُصمم أحلامك الرقمية
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-80 animate-fade-in-up">
              نحن نساعد الأفراد والمؤسسات على تحويل أفكارهم إلى واقع رقمي احترافي — مواقع، تطبيقات، متاجر، هويات بصرية، وحلول دفع وفواتير إلكترونية. خدمة سريعة، شفافية بالأسعار، ودعم ما بعد التسليم.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Link href="/services">
                <Button className="bg-white text-primary-600 px-8 py-4 text-lg font-semibold hover:bg-gray-100 shadow-lg">
                  اطلب الآن
                </Button>
              </Link>
              <Button
                onClick={() => setIsConsultationModalOpen(true)}
                variant="outline"
                className="border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-primary-600"
              >
                اطلب استشارة مجانية
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">خدماتنا المتميزة</h2>
            <p className="text-xl text-gray-600">نقدم مجموعة شاملة من الخدمات الرقمية بأسعار تنافسية</p>
          </div>

          {SERVICE_CATEGORIES.map((category) => {
            const categoryServices = groupedServices[category] || [];
            if (categoryServices.length === 0) return null;

            return (
              <div key={category} className="mb-16">
                <h3 className="text-2xl font-bold text-primary-600 mb-8 flex items-center">
                  <i className={`fas fa-${getCategoryIcon(category)} ml-3`}></i>
                  {category}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryServices.map((service, index) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onOrder={handleOrderService}
                      variant={getServiceVariant(index)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="text-center mt-12">
            <Link href="/services">
              <Button className="bg-primary-500 text-white px-8 py-3 text-lg hover:bg-primary-600">
                عرض جميع الخدمات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">طرق الدفع المتاحة</h2>
            <p className="text-xl text-gray-600">ادفع بالطريقة التي تناسبك</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <i className="fab fa-paypal text-blue-600 text-4xl mb-4"></i>
                <h3 className="text-xl font-bold mb-2">PayPal</h3>
                <p className="text-gray-600">ادفع عبر حساب PayPal الآمن</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <i className="fas fa-university text-green-600 text-4xl mb-4"></i>
                <h3 className="text-xl font-bold mb-2">تحويل بنكي</h3>
                <p className="text-gray-600">بنك الراجحي</p>
                <p className="text-sm text-gray-500 mt-2">SA78 8000 0539 6080 1942 4738</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <i className="fas fa-mobile-alt text-purple-600 text-4xl mb-4"></i>
                <h3 className="text-xl font-bold mb-2">STC Pay</h3>
                <p className="text-gray-600">00532441566</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <i className="fas fa-wallet text-orange-600 text-4xl mb-4"></i>
                <h3 className="text-xl font-bold mb-2">المحافظ الرقمية</h3>
                <p className="text-gray-600">UR PAY: 0532441566</p>
                <p className="text-gray-600">ALINMA PAY: 966532441566</p>
              </CardContent>
            </Card>
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
