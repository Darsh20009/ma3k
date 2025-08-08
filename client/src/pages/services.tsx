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

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
  });

  const handleOrderService = (service: Service) => {
    setSelectedService(service);
    setIsOrderModalOpen(true);
  };

  const groupedServices = services.reduce((acc: Record<string, Service[]>, service: Service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  const categories = Object.keys(groupedServices);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">خدماتنا المتميزة</h1>
          <p className="text-xl opacity-90">
            نقدم مجموعة شاملة من الخدمات الرقمية بأسعار تنافسية وجودة عالية
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-12">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-sm">
                  {category.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
                    <i className={`fas fa-${getCategoryIcon(category)} ml-3 text-primary-500`}></i>
                    {category}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {groupedServices[category]?.map((service, index) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onOrder={handleOrderService}
                      variant={getServiceVariant(index)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">طرق الدفع المتاحة</h2>
            <p className="text-xl text-gray-600">ادفع بالطريقة التي تناسبك</p>
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

            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-primary-800 mb-4">بعد إتمام الدفع</h3>
                <p className="text-primary-700 mb-4">
                  الرجاء إرسال صورة/سند التحويل (Receipt) عبر واتساب:
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
                    className="bg-success-500 text-white px-8 py-4 text-lg font-semibold hover:bg-success-600"
                  >
                    <i className="fab fa-whatsapp ml-3 text-2xl"></i>
                    أرسل سند التحويل الآن
                  </Button>
                </div>

                <p className="text-center text-primary-600 mt-4 text-sm">
                  سنؤكد الدفع خلال 1-24 ساعة ونرسل الفاتورة الرقمية فور التحقق
                </p>
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
