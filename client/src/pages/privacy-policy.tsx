import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Users, FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "جمع المعلومات",
      content: [
        "نجمع المعلومات التي تقدمها لنا مباشرة عند إنشاء حساب أو طلب خدمة",
        "معلومات الاتصال مثل الاسم والبريد الإلكتروني ورقم الهاتف",
        "تفاصيل المشروع والمتطلبات التقنية للخدمات المطلوبة",
        "معلومات الدفع اللازمة لمعالجة الطلبات (تُحفظ بشكل آمن ومشفر)"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "استخدام المعلومات",
      content: [
        "تقديم الخدمات المطلوبة وتنفيذ المشاريع حسب المواصفات",
        "التواصل معك بخصوص مشاريعك وتقديم الدعم التقني",
        "إرسال تحديثات هامة حول حالة مشروعك أو تغييرات في الخدمة",
        "تحسين خدماتنا وتطوير حلول أفضل لعملائنا"
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "حماية البيانات",
      content: [
        "نستخدم تشفير SSL لحماية جميع البيانات المنقولة",
        "خوادمنا محمية بأحدث تقنيات الأمان والمراقبة المستمرة",
        "الوصول للبيانات مقتصر على الموظفين المخولين فقط",
        "نقوم بعمل نسخ احتياطية منتظمة لضمان عدم فقدان البيانات"
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "مشاركة المعلومات",
      content: [
        "لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة أبداً",
        "قد نشارك معلومات ضرورية مع مقدمي خدمات الدفع (بشكل آمن)",
        "نشارك المعلومات فقط عند وجود التزام قانوني أو أمر قضائي",
        "في حالة بيع الشركة، ستُنقل البيانات للمالك الجديد مع نفس الضمانات"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "حقوقك",
      content: [
        "يحق لك طلب نسخة من جميع بياناتك المحفوظة لدينا",
        "يمكنك طلب تعديل أو تحديث معلوماتك الشخصية في أي وقت",
        "يحق لك طلب حذف بياناتك بعد انتهاء الخدمة (مع حفظ السجلات المالية)",
        "يمكنك الاعتراض على استخدام بياناتك لأغراض تسويقية"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="w-20 h-20 bg-gradient-to-br from-amber-400 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl"
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
                سياسة الخصوصية
              </span>
            </h1>
            <p className="text-2xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
              نحن نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية بأعلى معايير الأمان
            </p>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 inline-flex items-center bg-green-500/20 text-green-300 px-6 py-3 rounded-full border border-green-500/30"
            >
              <Lock className="w-5 h-5 ml-2" />
              آخر تحديث: يناير 2025
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">التزامنا بخصوصيتك</h2>
                <div className="text-lg text-gray-300 space-y-4 leading-relaxed text-center">
                  <p>
                    في <strong className="text-amber-400">منصة معك</strong>، نؤمن بأن خصوصيتك حق أساسي. 
                    هذه السياسة توضح كيفية جمع واستخدام وحماية معلوماتك الشخصية.
                  </p>
                  <p>
                    نلتزم بالشفافية الكاملة في التعامل مع بياناتك ونطبق أفضل الممارسات العالمية 
                    لحماية المعلومات وفقاً لقوانين حماية البيانات المحلية والدولية.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 h-full hover:border-purple-400/40 transition-colors duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white text-xl">
                      <div className="text-purple-400 ml-3">
                        {section.icon}
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index * 0.1) + (itemIndex * 0.05) }}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-300 leading-relaxed">{item}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact and Rights */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Contact for Privacy */}
              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 backdrop-blur-sm border-amber-400/20">
                <CardContent className="p-8 text-center">
                  <div className="text-amber-400 mb-4 flex justify-center">
                    <MessageCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">تواصل معنا</h3>
                  <p className="text-gray-300 mb-6">
                    لديك أسئلة حول خصوصيتك أو تريد ممارسة حقوقك؟ نحن هنا لمساعدتك
                  </p>
                  <a href="https://wa.me/966532441566" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold">
                      تواصل معنا
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Data Rights */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border-purple-400/20">
                <CardContent className="p-8 text-center">
                  <div className="text-purple-400 mb-4 flex justify-center">
                    <Users className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">حقوقك مضمونة</h3>
                  <p className="text-gray-300 mb-6">
                    يمكنك طلب الوصول، التعديل، أو الحذف لبياناتك في أي وقت
                  </p>
                  <div className="text-sm text-gray-400">
                    البريد الإلكتروني: ma3k.2025@gmail.com<br />
                    الهاتف: +966532441566
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Important Note */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border-red-400/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Shield className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-red-300 mb-2">ملاحظة مهمة</h4>
                      <p className="text-gray-300 leading-relaxed">
                        تحتفظ منصة معك بالحق في تحديث سياسة الخصوصية عند الضرورة. 
                        سيتم إشعارك بأي تغييرات جوهرية قبل تطبيقها بمدة كافية. 
                        استمرار استخدام خدماتنا يعني موافقتك على السياسة المحدثة.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}