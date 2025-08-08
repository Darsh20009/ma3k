import { Card, CardContent } from "@/components/ui/card";
import CodeMergeTool from "@/components/tools/code-merge-tool";

export default function Tools() {
  const tools = [
    {
      id: "code-merge",
      title: "أداة دمج وتفكيك الأكواد",
      description: "دمج وتفكيك أكواد HTML، CSS، و JavaScript بسهولة",
      icon: "fas fa-code",
      color: "text-primary-500",
      featured: true,
    },
    {
      id: "invoice-generator",
      title: "مولد الفواتير الإبداعي",
      description: "إنشاء فواتير HTML احترافية بتصاميم متنوعة ومتقدمة",
      icon: "fas fa-file-invoice",
      color: "text-accent-500",
      featured: true,
    },
    {
      id: "logo-generator",
      title: "مولد الشعارات",
      description: "إنشاء شعارات احترافية بأدوات متقدمة",
      icon: "fas fa-palette",
      color: "text-accent-500",
      comingSoon: true,
    },
    {
      id: "color-palette",
      title: "مختبر الألوان",
      description: "استكشاف وتجريب تركيبات الألوان المتناسقة",
      icon: "fas fa-eye-dropper",
      color: "text-success-500",
      comingSoon: true,
    },
    {
      id: "price-calculator",
      title: "حاسبة الأسعار",
      description: "احسب تكلفة مشروعك الرقمي بدقة",
      icon: "fas fa-calculator",
      color: "text-primary-500",
      comingSoon: true,
    },
    {
      id: "font-tester",
      title: "مختبر الخطوط",
      description: "تجربة واختبار الخطوط العربية والإنجليزية",
      icon: "fas fa-font",
      color: "text-accent-500",
      comingSoon: true,
    },
    {
      id: "responsive-tester",
      title: "اختبار الاستجابة",
      description: "اختبار مدى استجابة التصميم على الأجهزة المختلفة",
      icon: "fas fa-mobile-alt",
      color: "text-success-500",
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">أدواتنا المجانية</h1>
          <p className="text-xl opacity-90">
            استخدم أدواتنا المتقدمة لتطوير وتحسين مشاريعك الرقمية
          </p>
        </div>
      </section>

      {/* Tools Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">جميع الأدوات</h2>
            <p className="text-lg text-gray-600">مجموعة شاملة من الأدوات لمساعدتك في العمل</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tools.map((tool) => (
              <Card 
                key={tool.id} 
                className={`hover:shadow-lg transition-all duration-300 ${
                  tool.featured ? 'border-primary-500 border-2' : ''
                } ${tool.comingSoon ? 'opacity-75' : ''}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="relative">
                    <i className={`${tool.icon} ${tool.color} text-4xl mb-4`}></i>
                    {tool.featured && (
                      <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                        مميز
                      </span>
                    )}
                    {tool.comingSoon && (
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                        قريباً
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                  
                  {tool.comingSoon ? (
                    <div className="text-gray-500 text-sm">
                      <i className="fas fa-clock ml-2"></i>
                      متاح قريباً
                    </div>
                  ) : tool.featured ? (
                    tool.id === "invoice-generator" ? (
                      <a 
                        href="/invoices" 
                        className="inline-block bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent/80 transition-colors"
                      >
                        <i className="fas fa-external-link-alt ml-2"></i>
                        فتح الأداة
                      </a>
                    ) : (
                      <div className="text-primary-600 font-semibold">
                        <i className="fas fa-arrow-down ml-2"></i>
                        متاح أدناه
                      </div>
                    )
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tool: Code Merge Tool */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">أداة دمج وتفكيك الأكواد</h2>
            <p className="text-xl text-gray-600">
              دمج وتفكيك أكواد HTML، CSS، و JavaScript بطريقة احترافية ومتقدمة
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <CodeMergeTool />
          </div>

          {/* Tool Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <i className="fas fa-magic text-primary-500 text-3xl mb-4"></i>
                <h3 className="text-xl font-bold mb-3">دمج ذكي</h3>
                <p className="text-gray-600">
                  دمج أكواد HTML وCSS وJavaScript في ملف واحد منظم ونظيف
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <i className="fas fa-cut text-success-500 text-3xl mb-4"></i>
                <h3 className="text-xl font-bold mb-3">تفكيك دقيق</h3>
                <p className="text-gray-600">
                  استخراج وفصل الأكواد من الملفات المدمجة بدقة عالية
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <i className="fas fa-eye text-accent-500 text-3xl mb-4"></i>
                <h3 className="text-xl font-bold mb-3">معاينة فورية</h3>
                <p className="text-gray-600">
                  مشاهدة النتيجة مباشرة مع إمكانية الفتح في نافذة منفصلة
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">كيفية الاستخدام</h2>
            <p className="text-lg text-gray-600">خطوات بسيطة للاستفادة من أداة دمج الأكواد</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold text-primary-600 mb-6">تفكيك الأكواد</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold ml-4 mt-1">1</span>
                  <div>
                    <h4 className="font-semibold mb-1">ألصق الكود الكامل</h4>
                    <p className="text-gray-600 text-sm">ضع الكود المدمج في الصندوق العلوي</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold ml-4 mt-1">2</span>
                  <div>
                    <h4 className="font-semibold mb-1">اضغط "تفكيك الكود"</h4>
                    <p className="text-gray-600 text-sm">سيتم فصل HTML وCSS وJavaScript تلقائياً</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold ml-4 mt-1">3</span>
                  <div>
                    <h4 className="font-semibold mb-1">انسخ النتائج</h4>
                    <p className="text-gray-600 text-sm">استخدم أزرار النسخ لكل جزء منفصل</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-success-600 mb-6">دمج الأكواد</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="bg-success-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold ml-4 mt-1">1</span>
                  <div>
                    <h4 className="font-semibold mb-1">أدخل الأكواد المنفصلة</h4>
                    <p className="text-gray-600 text-sm">ضع كل نوع من الكود في الصندوق المخصص له</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-success-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold ml-4 mt-1">2</span>
                  <div>
                    <h4 className="font-semibold mb-1">اضغط "دمج الأكواد"</h4>
                    <p className="text-gray-600 text-sm">سيتم إنشاء ملف HTML كامل ومنظم</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-success-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold ml-4 mt-1">3</span>
                  <div>
                    <h4 className="font-semibold mb-1">عاين أو انسخ</h4>
                    <p className="text-gray-600 text-sm">شاهد النتيجة أو انسخ الكود النهائي</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Tools */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">أدوات قادمة</h2>
          <p className="text-lg opacity-90 mb-8">
            نعمل على تطوير المزيد من الأدوات المفيدة لتسهيل عملك
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {tools.filter(tool => tool.comingSoon).map((tool) => (
              <div key={tool.id} className="bg-white bg-opacity-10 rounded-lg p-6">
                <i className={`${tool.icon} text-3xl mb-3`}></i>
                <h3 className="text-lg font-bold mb-2">{tool.title}</h3>
                <p className="text-sm opacity-80">{tool.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <p className="text-lg mb-4">هل لديك اقتراح لأداة جديدة؟</p>
            <a 
              href="/#contact" 
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              اقترح أداة جديدة
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
