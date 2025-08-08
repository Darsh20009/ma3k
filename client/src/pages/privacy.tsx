import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">الشروط والأحكام</h1>
          <p className="text-xl opacity-90">
            شروط الاستخدام وسياسة الخصوصية لمنصة معك
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid gap-8">
            {/* Terms of Service */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary-600 flex items-center">
                  <i className="fas fa-file-contract ml-3"></i>
                  شروط الاستخدام
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">1. المقدمة</h3>
                  <p className="text-gray-700 leading-relaxed">
                    مرحبًا بكم في موقع "معك". باستخدامك لهذا الموقع، فإنك توافق على الالتزام بشروط الاستخدام التالية. 
                    إذا كنت لا توافق على أي جزء من هذه الشروط، يُرجى عدم استخدام الموقع.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-bold mb-4">2. الخدمات المقدمة</h3>
                  <p className="text-gray-700 leading-relaxed">
                    يقدم موقع "معك" خدمات تصميم وتطوير المواقع والتطبيقات، بالإضافة إلى متاجر إلكترونية وحلول تعليمية. 
                    نحن نلتزم بتقديم خدمات عالية الجودة وفقاً للمعايير المتفق عليها مع العميل.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-bold mb-4">3. الاستخدام المقبول</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    يُحظر استخدام الموقع لأي غرض غير قانوني أو غير مصرح به. يجب عليك عدم:
                  </p>
                  <ul className="list-disc mr-6 text-gray-700 space-y-2">
                    <li>انتهاك أي قوانين أو لوائح محلية أو دولية</li>
                    <li>نقل أو تحميل فيروسات أو أي نوع آخر من الشيفرات الضارة</li>
                    <li>محاولة الوصول غير المصرح به إلى أي جزء من الموقع</li>
                    <li>استخدام الموقع لأغراض تجارية دون إذن مسبق</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-bold mb-4">4. الملكية الفكرية</h3>
                  <p className="text-gray-700 leading-relaxed">
                    جميع المحتويات والمواد المتاحة على الموقع، بما في ذلك النصوص والصور والشعارات، هي ملك لموقع "معك" 
                    ومحميّة بموجب قوانين حقوق النشر والعلامات التجارية. لا يجوز نسخ أو توزيع أي محتوى دون إذن مكتوب.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-bold mb-4">5. التعديلات على الشروط</h3>
                  <p className="text-gray-700 leading-relaxed">
                    يحتفظ موقع "معك" بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر التعديلات على هذه الصفحة، 
                    ويُعتبر استمرار استخدامك للموقع بعد نشر التعديلات موافقةً منك على الشروط المعدلة.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-bold mb-4">6. إخلاء المسؤولية</h3>
                  <p className="text-gray-700 leading-relaxed">
                    يتم تقديم الخدمات والمعلومات على الموقع "كما هي" دون أي ضمانات، سواء صريحة أو ضمنية. 
                    لا يضمن موقع "معك" دقة أو اكتمال المعلومات المقدمة، ولا يتحمل المسؤولية عن أي أضرار قد تنتج عن استخدام الموقع.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-success-600 flex items-center">
                  <i className="fas fa-shield-alt ml-3"></i>
                  سياسة الخصوصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">1. جمع المعلومات</h3>
                  <p className="text-gray-700 leading-relaxed">
                    قد نقوم بجمع المعلومات الشخصية التي تقدمها طواعية عند التواصل معنا، مثل الاسم وعنوان البريد الإلكتروني 
                    ورقم الهاتف. كما قد نجمع معلومات تقنية حول استخدامك للموقع لتحسين تجربة المستخدم.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-bold mb-4">2. استخدام المعلومات</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    نستخدم المعلومات التي نجمعها من أجل:
                  </p>
                  <ul className="list-disc mr-6 text-gray-700 space-y-2">
                    <li>تقديم الخدمات المطلوبة</li>
                    <li>تحسين موقعنا وخدماتنا</li>
                    <li>التواصل معك بشأن التحديثات أو العروض الخاصة</li>
                    <li>معالجة الطلبات والفواتير</li>
                    <li>تقديم الدعم الفني</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-bold mb-4">3. حماية المعلومات</h3>
                  <p className="text-gray-700 leading-relaxed">
                    نحن نتخذ تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الكشف أو التدمير. 
                    نستخدم تشفير SSL لحماية البيانات المرسلة عبر الموقع، ونقوم بتحديث أنظمة الأمان بانتظام.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-bold mb-4">4. مشاركة المعلومات</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    نحن لا نبيع أو نتاجر أو ننقل معلوماتك الشخصية إلى أطراف خارجية دون موافقتك، باستثناء:
                  </p>
                  <ul className="list-disc mr-6 text-gray-700 space-y-2">
                    <li>المزودين الموثوق بهم الذين يساعدوننا في تشغيل موقعنا أو تقديم الخدمات، بشرط موافقتهم على الحفاظ على سرية المعلومات</li>
                    <li>عندما يكون الإفصاح ضروريًا للامتثال للقانون أو حماية حقوقنا أو حقوق الآخرين</li>
                    <li>معالجات الدفع المعتمدة لإتمام المعاملات المالية</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-bold mb-4">5. ملفات تعريف الارتباط (Cookies)</h3>
                  <p className="text-gray-700 leading-relaxed">
                    قد يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة المستخدم وتذكر تفضيلاتك. 
                    يمكنك ضبط متصفحك لرفض ملفات تعريف الارتباط، ولكن قد يؤثر ذلك على كيفية عمل الموقع.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-bold mb-4">6. روابط الطرف الثالث</h3>
                  <p className="text-gray-700 leading-relaxed">
                    قد يحتوي موقعنا على روابط لمواقع خارجية. نحن لسنا مسؤولين عن محتوى أو سياسات الخصوصية لتلك المواقع. 
                    ننصحك بمراجعة سياسات الخصوصية لأي موقع تزوره.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-bold mb-4">7. حقوقك في البيانات</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    لديك الحق في:
                  </p>
                  <ul className="list-disc mr-6 text-gray-700 space-y-2">
                    <li>الوصول إلى بياناتك الشخصية التي نحتفظ بها</li>
                    <li>طلب تصحيح أي معلومات غير دقيقة</li>
                    <li>طلب حذف بياناتك الشخصية</li>
                    <li>الاعتراض على معالجة بياناتك</li>
                    <li>طلب نسخة من بياناتك بصيغة قابلة للقراءة</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-bold mb-4">8. التغييرات على سياسة الخصوصية</h3>
                  <p className="text-gray-700 leading-relaxed">
                    قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة مع تاريخ التحديث. 
                    ننصحك بمراجعة هذه الصفحة بشكل دوري للاطلاع على أحدث المعلومات.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-accent-600 flex items-center">
                  <i className="fas fa-phone ml-3"></i>
                  الاتصال بنا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  إذا كانت لديك أي أسئلة أو استفسارات بشأن هذه الشروط أو سياسة الخصوصية، أو إذا كنت تريد ممارسة أي من حقوقك في البيانات، 
                  يُرجى التواصل معنا عبر:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-primary-500 text-xl ml-4"></i>
                    <div>
                      <div className="font-semibold">البريد الإلكتروني</div>
                      <div className="text-gray-600">ma3k.2025@gmail.com</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <i className="fab fa-whatsapp text-success-500 text-xl ml-4"></i>
                    <div>
                      <div className="font-semibold">واتساب</div>
                      <div className="text-gray-600">+20 115 520 1921</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <i className="fas fa-clock text-accent-500 text-xl ml-4"></i>
                    <div>
                      <div className="font-semibold">ساعات العمل</div>
                      <div className="text-gray-600">الرد خلال 1-24 ساعة عمل</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <i className="fas fa-globe text-primary-500 text-xl ml-4"></i>
                    <div>
                      <div className="font-semibold">الموقع الإلكتروني</div>
                      <div className="text-gray-600">ma3k.online</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Updated */}
            <div className="text-center text-gray-500 text-sm">
              <p>آخر تحديث: {new Date().toLocaleDateString('ar-SA', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
