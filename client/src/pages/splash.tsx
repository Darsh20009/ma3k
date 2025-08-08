import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Splash() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-bounce-slow inline-block mb-6">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-rocket text-4xl text-white"></i>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-down bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            ابدأ طريقك الرقمي من هنا
          </h1>
          <p className="text-xl opacity-90 animate-fade-in-up mb-8">
            رحلتك نحو التميز الرقمي تبدأ بخطوة واحدة
          </p>
          <div className="animate-bounce-slow mb-8">
            <i className="fas fa-arrow-down text-2xl opacity-70"></i>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                icon: "fas fa-lightbulb",
                title: "حدد هدفك",
                description: "ما نوع المشروع الرقمي الذي تريد إنشاؤه؟",
                color: "text-accent-500",
              },
              {
                icon: "fas fa-palette",
                title: "اختر التصميم",
                description: "سنساعدك في اختيار أفضل تصميم يناسب احتياجاتك",
                color: "text-primary-500",
              },
              {
                icon: "fas fa-code",
                title: "التطوير",
                description: "نحول أفكارك إلى واقع رقمي احترافي",
                color: "text-success-500",
              },
              {
                icon: "fas fa-rocket",
                title: "الانطلاق",
                description: "نطلق مشروعك ونقدم الدعم المستمر",
                color: "text-accent-500",
              },
            ].map((step, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <i className={`${step.icon} ${step.color} text-4xl mb-4`}></i>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/services">
              <Button className="bg-primary-500 text-white px-8 py-4 text-lg font-semibold hover:bg-primary-600 shadow-lg hover:shadow-xl">
                ابدأ الآن - اختر خدمتك
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">لماذا تختار معك؟</h2>
            <p className="text-xl text-gray-600">نحن نقدم أفضل الحلول الرقمية بجودة عالية وأسعار منافسة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "fas fa-clock",
                title: "سرعة في التنفيذ",
                description: "نلتزم بالمواعيد المحددة ونسلم مشاريعك في الوقت المناسب",
              },
              {
                icon: "fas fa-dollar-sign",
                title: "أسعار تنافسية",
                description: "أسعار عادلة وشفافة بدون تكاليف خفية",
              },
              {
                icon: "fas fa-headset",
                title: "دعم مستمر",
                description: "نقدم الدعم الفني والمتابعة حتى بعد تسليم المشروع",
              },
              {
                icon: "fas fa-shield-alt",
                title: "جودة مضمونة",
                description: "نضمن جودة العمل مع إمكانية التعديل حسب متطلباتك",
              },
              {
                icon: "fas fa-mobile-alt",
                title: "تصميم متجاوب",
                description: "جميع مشاريعنا متجاوبة وتعمل على جميع الأجهزة",
              },
              {
                icon: "fas fa-language",
                title: "دعم اللغة العربية",
                description: "خبرة واسعة في تطوير المواقع والتطبيقات باللغة العربية",
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${feature.icon} text-primary-500 text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">هل أنت مستعد للبدء؟</h2>
          <p className="text-xl mb-8 opacity-90">
            انضم إلى مئات العملاء الذين حققوا أهدافهم الرقمية معنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button className="bg-white text-primary-600 px-8 py-4 text-lg font-semibold hover:bg-gray-100">
                اختر خدمتك الآن
              </Button>
            </Link>
            <Link href="/#contact">
              <Button 
                variant="outline" 
                className="border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-primary-600"
              >
                تواصل معنا
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
