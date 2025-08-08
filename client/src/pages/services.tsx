import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceCard from "@/components/services/service-card";
import PayPalButton from "@/components/PayPalButton";
import { BANK_DETAILS, WALLET_DETAILS, WHATSAPP_URL, WHATSAPP_MESSAGE_TEMPLATE } from "@/lib/constants";
import type { Service } from "@shared/schema";

export default function Services() {

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });


  const groupedServices = (services as Service[]).reduce((acc: Record<string, Service[]>, service: Service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  const categories = Object.keys(groupedServices);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      <div className="absolute inset-0 luxury-bg"></div>
      
      {/* Luxury Creative Header */}
      <section className="dark-gradient text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 luxury-bg"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-luxury-float">
            <h1 className="text-7xl md:text-9xl font-bold mb-8 animate-text-shimmer">خدماتنا المتميزة</h1>
            <div className="luxury-divider mb-8"></div>
            <p className="text-2xl md:text-3xl opacity-90 max-w-5xl mx-auto leading-relaxed animate-gold-pulse">
              👑 نقدم مجموعة شاملة من الخدمات الرقمية الفخمة بأسعار تنافسية وجودة عالمية
            </p>
          </div>
          <div className="mt-12 animate-luxury-glow">
            <div className="luxury-card px-10 py-5 rounded-3xl border-2 border-yellow-400/30">
              <span className="text-2xl font-bold text-yellow-400">💎 أكثر من 500 مشروع ناجح 💎</span>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Services Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold animate-text-shimmer mb-8">👑 اختر خدمتك المثالية</h2>
            <div className="luxury-divider mb-8"></div>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto animate-gold-pulse">استكشف مجموعتنا الشاملة من الخدمات الرقمية المصممة خصيصاً لتحقيق أهدافك</p>
          </div>
          
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-16 luxury-card p-3 rounded-3xl border-2 border-yellow-400/20">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-110 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-black animate-luxury-glow data-[state=active]:animate-gold-pulse"
                >
                  {category.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="animate-luxury-float">
                <div className="mb-16 text-center">
                  <div className="w-32 h-32 rounded-full gold-gradient flex items-center justify-center mx-auto mb-8 animate-gold-pulse">
                    <i className={`fas fa-${getCategoryIcon(category)} text-5xl text-black animate-luxury-glow`}></i>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold animate-text-shimmer mb-6">
                    {category}
                  </h2>
                  <div className="luxury-divider"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {groupedServices[category]?.map((service: Service, index: number) => (
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
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Luxury Payment Methods */}
      <section className="py-32 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden z-10">
        <div className="absolute inset-0 luxury-bg opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold animate-text-shimmer mb-8">💳 طرق الدفع الآمنة</h2>
            <div className="luxury-divider mb-8"></div>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto animate-gold-pulse">🔒 اختر طريقة الدفع المناسبة لك من بين خياراتنا الآمنة والمتنوعة</p>
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
              <Card className="holographic-card text-center p-8 hover:scale-105 transition-all duration-300 animate-glow-pulse border-2 border-blue-400/30">
                <CardContent className="pt-6">
                  <i className="fab fa-paypal text-blue-400 text-6xl mb-6 animate-neon-pulse"></i>
                  <h3 className="text-2xl font-bold mb-4 text-blue-600">PayPal</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">ادفع عبر حساب PayPal الآمن</p>
                  <div className="mt-6">
                    <PayPalButton 
                      amount="100" 
                      currency="SAR" 
                      intent="capture" 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="holographic-card text-center p-8 hover:scale-105 transition-all duration-300 animate-glow-pulse border-2 border-green-400/30">
                <CardContent className="pt-6">
                  <i className="fas fa-university text-green-400 text-6xl mb-6 animate-neon-pulse"></i>
                  <h3 className="text-2xl font-bold mb-4 text-green-600">تحويل بنكي</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 text-lg">{BANK_DETAILS.BANK_NAME}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                    {BANK_DETAILS.IBAN}
                  </p>
                </CardContent>
              </Card>

              <Card className="holographic-card text-center p-8 hover:scale-105 transition-all duration-300 animate-glow-pulse border-2 border-purple-400/30">
                <CardContent className="pt-6">
                  <i className="fas fa-mobile-alt text-purple-400 text-6xl mb-6 animate-neon-pulse"></i>
                  <h3 className="text-2xl font-bold mb-4 text-purple-600">STC Pay</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-mono text-lg bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">{WALLET_DETAILS.STC_PAY}</p>
                </CardContent>
              </Card>

              <Card className="holographic-card text-center p-8 hover:scale-105 transition-all duration-300 animate-glow-pulse border-2 border-orange-400/30">
                <CardContent className="pt-6">
                  <i className="fas fa-wallet text-orange-400 text-6xl mb-6 animate-neon-pulse"></i>
                  <h3 className="text-2xl font-bold mb-4 text-orange-600">المحافظ الرقمية</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">UR PAY: {WALLET_DETAILS.UR_PAY}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">ALINMA PAY: {WALLET_DETAILS.ALINMA_PAY}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="luxury-card border-4 border-yellow-400/30 animate-luxury-glow backdrop-blur-lg">
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 rounded-full gold-gradient text-black mb-6 flex items-center justify-center animate-gold-pulse">
                    <i className="fas fa-check-circle text-4xl"></i>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold animate-text-shimmer mb-6">✅ خطوات ما بعد الدفع</h3>
                  <div className="luxury-divider mb-6"></div>
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
                    className="btn-luxury px-12 py-6 text-2xl font-bold rounded-3xl hover:scale-110 transition-all duration-300 animate-gold-pulse"
                  >
                    <i className="fab fa-whatsapp ml-3 text-3xl animate-luxury-float"></i>
                    💎 أرسل سند التحويل الآن
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
