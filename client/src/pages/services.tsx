import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceCard from "@/components/services/service-card";
import OrderModal from "@/components/services/order-modal";
import PayPalButton from "@/components/PayPalButton";
import { PAYMENT_METHODS, BANK_DETAILS, WALLET_DETAILS, WHATSAPP_URL, WHATSAPP_MESSAGE_TEMPLATE } from "@/lib/constants";
import type { Service } from "@shared/schema";

export default function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const handleOrderService = (service: Service) => {
    setSelectedService(service);
    setIsOrderModalOpen(true);
  };

  const groupedServices = (services as Service[]).reduce((acc: Record<string, Service[]>, service: Service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  const categories = Object.keys(groupedServices);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Enhanced Creative Header */}
      <section className="creative-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in-down">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">خدماتنا المتميزة</h1>
            <div className="section-divider mb-6"></div>
            <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
              🚀 نقدم مجموعة شاملة من الخدمات الرقمية الإبداعية بأسعار تنافسية وجودة عالمية
            </p>
          </div>
          <div className="mt-8 animate-float">
            <div className="inline-block px-6 py-3 glass-morphism rounded-full">
              <span className="text-lg font-semibold">✨ أكثر من 500 مشروع ناجح ✨</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 service-gradient"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in-up">🎯 اختر خدمتك المثالية</h2>
            <div className="section-divider mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">استكشف مجموعتنا الشاملة من الخدمات الرقمية المصممة خصيصاً لتحقيق أهدافك</p>
          </div>
          
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-12 glass-morphism p-2 rounded-2xl">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  {category.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="animate-fade-in-up">
                <div className="mb-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-morphism mb-6 animate-glow-pulse">
                    <i className={`fas fa-${getCategoryIcon(category)} text-3xl text-blue-500`}></i>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    {category}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {groupedServices[category]?.map((service: Service, index: number) => (
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
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Enhanced Payment Methods */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 animate-fade-in-up">💳 طرق الدفع الآمنة</h2>
            <div className="section-divider mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">🔒 اختر طريقة الدفع المناسبة لك من بين خياراتنا الآمنة والمتنوعة</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <i className="fab fa-paypal text-blue-600 text-4xl mb-4"></i>
                  <h3 className="text-xl font-bold mb-2">PayPal</h3>
                  <p className="text-gray-600">ادفع عبر حساب PayPal الآمن</p>
                  <div className="mt-4">
                    <PayPalButton 
                      amount="100" 
                      currency="SAR" 
                      intent="capture" 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <i className="fas fa-university text-green-600 text-4xl mb-4"></i>
                  <h3 className="text-xl font-bold mb-2">تحويل بنكي</h3>
                  <p className="text-gray-600">{BANK_DETAILS.BANK_NAME}</p>
                  <p className="text-sm text-gray-500 mt-2 font-mono">
                    {BANK_DETAILS.IBAN}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <i className="fas fa-mobile-alt text-purple-600 text-4xl mb-4"></i>
                  <h3 className="text-xl font-bold mb-2">STC Pay</h3>
                  <p className="text-gray-600 font-mono">{WALLET_DETAILS.STC_PAY}</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <i className="fas fa-wallet text-orange-600 text-4xl mb-4"></i>
                  <h3 className="text-xl font-bold mb-2">المحافظ الرقمية</h3>
                  <p className="text-gray-600 text-sm">UR PAY: {WALLET_DETAILS.UR_PAY}</p>
                  <p className="text-gray-600 text-sm">ALINMA PAY: {WALLET_DETAILS.ALINMA_PAY}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-morphism border-2 border-blue-200 tech-border animate-glow-pulse">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-600 text-white mb-4">
                    <i className="fas fa-check-circle text-2xl"></i>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">✅ خطوات ما بعد الدفع</h3>
                </div>
                <p className="text-gray-700 mb-6 text-lg text-center">
                  📤 الرجاء إرسال صورة/سند التحويل (Receipt) عبر واتساب:
                </p>

                <Card className="bg-white border mb-6">
                  <CardContent className="p-6">
                    <h4 className="font-bold mb-3">نموذج رسالة جاهز:</h4>
                    <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                      مرحبًا، أنا [الاسم الكامل]<br />
                      - رقم الطلب (إن وُجد): [ORDER_ID]<br />
                      - المبلغ: [AMOUNT] ر.س<br />
                      - طريقة الدفع: [METHOD]<br />
                      - إرفق صورة سند التحويل هنا.<br />
                      الرجاء إصدار الفاتورة وإرسالها لي.
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button
                    onClick={() => {
                      const message = WHATSAPP_MESSAGE_TEMPLATE(
                        "رقم الطلب",
                        "اسمك",
                        0,
                        "طريقة الدفع المختارة"
                      );
                      window.open(WHATSAPP_URL(message), "_blank");
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-5 text-lg font-bold rounded-2xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 multi-glow animate-pulse-slow"
                  >
                    <i className="fab fa-whatsapp ml-3 text-2xl animate-bounce-slow"></i>
                    🚀 أرسل سند التحويل الآن
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                  <p className="text-center text-gray-700 text-lg font-medium">
                    ⚡ سنؤكد الدفع خلال 1-24 ساعة ونرسل الفاتورة الرقمية فور التحقق
                  </p>
                  <div className="flex justify-center mt-3">
                    <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      🎯 ضمان الرد السريع
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">آلية العمل</h2>
            <p className="text-xl text-gray-600">خطوات بسيطة للحصول على مشروعك</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "اختيار الخدمة",
                description: "يختار العميل الحزمة ويضغط 'اطلب الآن'",
                icon: "fas fa-mouse-pointer",
              },
              {
                step: "2",
                title: "دخول بيانات الطلب",
                description: "اسم، بريد، رقم واتساب، وصف مختصر",
                icon: "fas fa-edit",
              },
              {
                step: "3",
                title: "خيارات الدفع",
                description: "يختار طريقة دفع ويظهر له تفاصيل التحويل",
                icon: "fas fa-credit-card",
              },
              {
                step: "4",
                title: "إرسال سند التحويل",
                description: "يضغط العميل زر واتساب ويرسل سند التحويل",
                icon: "fab fa-whatsapp",
              },
              {
                step: "5",
                title: "تأكيد واستلام فاتورة",
                description: "بعد التحقق من السند، نصدر فاتورة ونبدأ التنفيذ",
                icon: "fas fa-file-invoice",
              },
              {
                step: "6",
                title: "التسليم",
                description: "تسليم أولي > مراجعتين مجانية > التسليم النهائي",
                icon: "fas fa-check-circle",
              },
            ].map((step, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">{step.step}</span>
                  </div>
                  <i className={`${step.icon} text-primary-500 text-3xl mb-4`}></i>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        service={selectedService}
      />
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
