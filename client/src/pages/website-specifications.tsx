import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Globe, Sparkles, CheckCircle, ArrowLeft, ArrowRight, Download, FileText } from "lucide-react";

const websiteSpecsSchema = z.object({
  websiteName: z.string().min(2, "اسم الموقع يجب أن يكون على الأقل حرفين"),
  idea: z.string().min(20, "اكتب فكرتك بتفصيل أكثر (على الأقل 20 حرف)"),
  purpose: z.string().min(10, "حدد الغرض من الموقع بتفصيل أكثر"),
  targetAudience: z.string().min(10, "حدد الجمهور المستهدف بتفصيل أكثر"),
  designType: z.string().min(1, "اختر نوع التصميم"),
  colorScheme: z.string().min(1, "اختر نظام الألوان"),
  
  // الأقسام الرئيسية
  mainSection1: z.string().min(1, "القسم الأول مطلوب"),
  mainSection2: z.string().min(1, "القسم الثاني مطلوب"),
  mainSection3: z.string().min(1, "القسم الثالث مطلوب"),
  mainSection4: z.string().optional(),
  mainSection5: z.string().optional(),
  
  // الوظائف الأساسية
  mainFunction1: z.string().min(1, "الوظيفة الأولى مطلوبة"),
  mainFunction2: z.string().optional(),
  mainFunction3: z.string().optional(),
  mainFunction4: z.string().optional(),
  
  // المميزات الإضافية
  additionalFeatures: z.array(z.string()).default([]),
  
  // التفاصيل التقنية
  languages: z.string().min(1, "حدد اللغات المطلوبة"),
  deviceSupport: z.string().min(1, "حدد الأجهزة المدعومة"),
  contentManagement: z.string().min(1, "حدد نوع إدارة المحتوى"),
  
  // الأهداف
  mainGoal1: z.string().min(1, "الهدف الأول مطلوب"),
  mainGoal2: z.string().optional(),
  mainGoal3: z.string().optional(),
  
  // المحتوى التفاعلي
  interactiveElements: z.array(z.string()).default([]),
  
  // متطلبات خاصة
  specialRequirements: z.string().optional(),
  preferredDeadline: z.string().optional(),
  budget: z.string().min(1, "حدد الميزانية المتوقعة"),
  
  // معلومات إضافية
  competitorWebsites: z.string().optional(),
  inspirationSites: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type WebsiteSpecsData = z.infer<typeof websiteSpecsSchema>;

export default function WebsiteSpecifications() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<WebsiteSpecsData>({
    resolver: zodResolver(websiteSpecsSchema),
    defaultValues: {
      websiteName: "",
      idea: "",
      purpose: "",
      targetAudience: "",
      designType: "",
      colorScheme: "",
      mainSection1: "",
      mainSection2: "",
      mainSection3: "",
      mainSection4: "",
      mainSection5: "",
      mainFunction1: "",
      mainFunction2: "",
      mainFunction3: "",
      mainFunction4: "",
      languages: "",
      deviceSupport: "",
      contentManagement: "",
      mainGoal1: "",
      mainGoal2: "",
      mainGoal3: "",
      budget: "",
      specialRequirements: "",
      preferredDeadline: "",
      competitorWebsites: "",
      inspirationSites: "",
      additionalNotes: "",
      additionalFeatures: [],
      interactiveElements: [],
    }
  });

  const additionalFeatureOptions = [
    "نظام تسجيل الدخول",
    "نظام التعليقات",
    "متجر إلكتروني",
    "نظام الدفع",
    "تطبيق جوال",
    "نظام الحجوزات",
    "دردشة مباشرة",
    "نظام إدارة المحتوى",
    "تكامل مع وسائل التواصل",
    "نظام البحث المتقدم",
    "ملتيميديا (فيديو/صوت)",
    "نظام التقييمات",
    "تقارير وإحصائيات",
    "نظام الإشعارات",
    "دعم متعدد اللغات"
  ];

  const interactiveElementOptions = [
    "نماذج تفاعلية",
    "خرائط تفاعلية",
    "معرض صور متقدم",
    "فيديوهات تفاعلية",
    "رسوم بيانية حية",
    "اختبارات وكويزات",
    "حاسبات مخصصة",
    "جولات افتراضية",
    "أدوات مقارنة",
    "نظام التصويت",
    "ألعاب تفاعلية",
    "محرر أونلاين",
    "أدوات رسم",
    "شات بوت ذكي"
  ];

  const onSubmit = async (data: WebsiteSpecsData) => {
    setIsSubmitting(true);
    
    try {
      // التحقق من صحة البيانات المطلوبة
      if (!data.websiteName || !data.idea || !data.purpose || !data.targetAudience) {
        toast({
          title: "يرجى إكمال جميع الحقول المطلوبة",
          description: "تأكد من ملء جميع البيانات الأساسية",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // حفظ مواصفات الموقع في localStorage
      const websiteSpecs = {
        ...data,
        timestamp: new Date().toISOString(),
        specId: `SPEC-${Date.now()}`
      };
      
      localStorage.setItem('websiteSpecs', JSON.stringify(websiteSpecs));
      localStorage.setItem('websiteSpecifications', JSON.stringify(data));
      
      // إنشاء ملف مواصفات قابل للتحميل
      const specsDocument = generateSpecsDocument(websiteSpecs);
      const blob = new Blob([specsDocument], { type: 'text/html; charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      // تحميل الملف
      const link = document.createElement('a');
      link.href = url;
      link.download = `مواصفات-موقع-${data.websiteName.replace(/\s+/g, '-')}-${Date.now()}.html`;
      link.click();
      
      // تنظيف الرابط
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "✅ تم حفظ المواصفات بنجاح!",
        description: "تم تحميل ملف المواصفات الكامل. يمكنك الآن الانتقال للدفع.",
      });
      
      // الانتقال لصفحة السلة أولاً ثم الدفع
      setTimeout(() => {
        setLocation('/cart');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving specifications:', error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Globe className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">المعلومات الأساسية</h2>
              <p className="text-gray-600">ابدأ بوصف فكرة موقعك الأساسية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="websiteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الموقع المطلوب</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: موقع شركتي المميز" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الغرض من الموقع</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: عرض خدمات الشركة وجذب العملاء" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="idea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اشرح فكرة موقعك بالتفصيل</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="اكتب هنا فكرة موقعك الكاملة، ما الذي تريد تحقيقه، وكيف تتخيل الموقع..." 
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الجمهور المستهدف</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="من هم الأشخاص الذين ستستهدفهم؟ (العمر، الاهتمامات، المنطقة...)" 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Sparkles className="w-16 h-16 mx-auto text-purple-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">التصميم والمظهر</h2>
              <p className="text-gray-600">حدد نوع التصميم والألوان المفضلة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="designType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع التصميم المطلوب</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع التصميم" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="modern">عصري ومتقدم</SelectItem>
                        <SelectItem value="classic">كلاسيكي وأنيق</SelectItem>
                        <SelectItem value="minimalist">بسيط ونظيف</SelectItem>
                        <SelectItem value="creative">إبداعي ومليء بالألوان</SelectItem>
                        <SelectItem value="professional">مهني وأكاديمي</SelectItem>
                        <SelectItem value="luxury">فاخر ومميز</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorScheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نظام الألوان المفضل</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نظام الألوان" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="blue-white">أزرق وأبيض</SelectItem>
                        <SelectItem value="green-gold">أخضر وذهبي</SelectItem>
                        <SelectItem value="red-black">أحمر وأسود</SelectItem>
                        <SelectItem value="purple-silver">بنفسجي وفضي</SelectItem>
                        <SelectItem value="orange-brown">برتقالي وبني</SelectItem>
                        <SelectItem value="monochrome">أحادي اللون</SelectItem>
                        <SelectItem value="rainbow">متعدد الألوان</SelectItem>
                        <SelectItem value="custom">ألوان مخصصة</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اللغات المطلوبة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر اللغات" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="arabic">العربية فقط</SelectItem>
                        <SelectItem value="english">الإنجليزية فقط</SelectItem>
                        <SelectItem value="arabic-english">العربية والإنجليزية</SelectItem>
                        <SelectItem value="multilingual">متعدد اللغات</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deviceSupport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الأجهزة المدعومة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الأجهزة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="responsive">جميع الأجهزة (متجاوب)</SelectItem>
                        <SelectItem value="desktop-only">أجهزة سطح المكتب فقط</SelectItem>
                        <SelectItem value="mobile-first">الجوال أولاً</SelectItem>
                        <SelectItem value="tablet-optimized">محسن للتابلت</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <FileText className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">أقسام ووظائف الموقع</h2>
              <p className="text-gray-600">حدد الأقسام والوظائف الأساسية للموقع</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">الأقسام الرئيسية (مطلوبة)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['mainSection1', 'mainSection2', 'mainSection3'].map((field, index) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field as any}
                    render={({ field: fieldProps }) => (
                      <FormItem>
                        <FormLabel>القسم {index + 1}</FormLabel>
                        <FormControl>
                          <Input {...fieldProps} placeholder={`مثال: ${index === 0 ? 'الرئيسية' : index === 1 ? 'من نحن' : 'خدماتنا'}`} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">أقسام إضافية (اختيارية)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['mainSection4', 'mainSection5'].map((field, index) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field as any}
                    render={({ field: fieldProps }) => (
                      <FormItem>
                        <FormLabel>القسم {index + 4}</FormLabel>
                        <FormControl>
                          <Input {...fieldProps} placeholder={`مثال: ${index === 0 ? 'المدونة' : 'تواصل معنا'}`} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">الوظائف الأساسية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['mainFunction1', 'mainFunction2', 'mainFunction3', 'mainFunction4'].map((field, index) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field as any}
                    render={({ field: fieldProps }) => (
                      <FormItem>
                        <FormLabel>الوظيفة {index + 1} {index === 0 && '(مطلوبة)'}</FormLabel>
                        <FormControl>
                          <Input {...fieldProps} placeholder={`مثال: ${index === 0 ? 'عرض المنتجات' : index === 1 ? 'نظام البحث' : index === 2 ? 'التواصل المباشر' : 'نظام الحجوزات'}`} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 mx-auto text-orange-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">المميزات المتقدمة</h2>
              <p className="text-gray-600">اختر المميزات الإضافية التي تريدها</p>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="additionalFeatures"
                render={() => (
                  <FormItem>
                    <FormLabel>المميزات الإضافية</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {additionalFeatureOptions.map((feature) => (
                        <FormField
                          key={feature}
                          control={form.control}
                          name="additionalFeatures"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(feature)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, feature])
                                      : field.onChange(field.value?.filter((value) => value !== feature))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">{feature}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interactiveElements"
                render={() => (
                  <FormItem>
                    <FormLabel>العناصر التفاعلية</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {interactiveElementOptions.map((element) => (
                        <FormField
                          key={element}
                          control={form.control}
                          name="interactiveElements"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(element)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, element])
                                      : field.onChange(field.value?.filter((value) => value !== element))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">{element}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Download className="w-16 h-16 mx-auto text-red-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">التفاصيل النهائية</h2>
              <p className="text-gray-600">أكمل المعلومات المتبقية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الميزانية المتوقعة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الميزانية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="400-800">400 - 800 ريال</SelectItem>
                        <SelectItem value="800-1200">800 - 1200 ريال</SelectItem>
                        <SelectItem value="1200-2000">1200 - 2000 ريال</SelectItem>
                        <SelectItem value="2000+">أكثر من 2000 ريال</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentManagement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع إدارة المحتوى</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الإدارة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="simple">بسيط (تحديث نصوص)</SelectItem>
                        <SelectItem value="medium">متوسط (إضافة منتجات)</SelectItem>
                        <SelectItem value="advanced">متقدم (إدارة كاملة)</SelectItem>
                        <SelectItem value="custom">مخصص حسب الطلب</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="mainGoal1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الهدف الأساسي الأول من الموقع</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: زيادة المبيعات بنسبة 30%" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mainGoal2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الهدف الثاني (اختياري)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="مثال: بناء علامة تجارية قوية" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mainGoal3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الهدف الثالث (اختياري)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="مثال: تحسين خدمة العملاء" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="specialRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>متطلبات خاصة (اختياري)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="أي متطلبات خاصة أو ملاحظات إضافية..." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="competitorWebsites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مواقع منافسة (للمرجع)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="روابط مواقع منافسة أو مشابهة" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inspirationSites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مواقع إلهام (للتصميم)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="مواقع تعجبك في التصميم" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات إضافية</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="أي معلومات أخرى تريد إضافتها..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-center text-2xl">
              🌐 مواصفات الموقع المطلوب
            </CardTitle>
            <p className="text-center text-blue-100">
              اكمل التفاصيل بدقة ليتمكن المطور من إنشاء موقعك المثالي
            </p>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-blue-100 mb-2">
                <span>الخطوة {currentStep} من 5</span>
                <span>{Math.round((currentStep / 5) * 100)}%</span>
              </div>
              <div className="w-full bg-blue-800 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {renderStep()}
                
                <Separator />
                
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    السابق
                  </Button>
                  
                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      التالي
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          حفظ المواصفات والانتقال للدفع
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function generateSpecsDocument(specs: any): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مواصفات موقع: ${specs.websiteName}</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; }
        .section { margin: 30px 0; padding: 20px; border-radius: 8px; border-right: 4px solid #667eea; background: #f8f9ff; }
        .section h2 { color: #667eea; margin-top: 0; }
        .info-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 10px; margin: 10px 0; }
        .label { font-weight: bold; color: #333; }
        .value { color: #666; }
        .features-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
        .feature-item { background: white; padding: 10px; border-radius: 5px; border: 1px solid #e0e6ff; }
        .footer { text-align: center; margin-top: 40px; padding: 20px; background: #2c3e50; color: white; border-radius: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 مواصفات الموقع المطلوب</h1>
            <h2>${specs.websiteName}</h2>
            <p>تم إنشاؤها في: ${new Date(specs.timestamp).toLocaleDateString('ar-SA')}</p>
            <p>رقم المرجع: ${specs.specId}</p>
        </div>

        <div class="section">
            <h2>🎯 المعلومات الأساسية</h2>
            <div class="info-grid">
                <span class="label">اسم الموقع:</span>
                <span class="value">${specs.websiteName}</span>
                <span class="label">الغرض:</span>
                <span class="value">${specs.purpose}</span>
                <span class="label">الفكرة:</span>
                <span class="value">${specs.idea}</span>
                <span class="label">الجمهور المستهدف:</span>
                <span class="value">${specs.targetAudience}</span>
            </div>
        </div>

        <div class="section">
            <h2>🎨 التصميم والمظهر</h2>
            <div class="info-grid">
                <span class="label">نوع التصميم:</span>
                <span class="value">${specs.designType}</span>
                <span class="label">نظام الألوان:</span>
                <span class="value">${specs.colorScheme}</span>
                <span class="label">اللغات:</span>
                <span class="value">${specs.languages}</span>
                <span class="label">الأجهزة المدعومة:</span>
                <span class="value">${specs.deviceSupport}</span>
            </div>
        </div>

        <div class="section">
            <h2>📑 الأقسام الرئيسية</h2>
            <div class="features-list">
                ${[specs.mainSection1, specs.mainSection2, specs.mainSection3, specs.mainSection4, specs.mainSection5]
                  .filter(Boolean)
                  .map(section => `<div class="feature-item">📄 ${section}</div>`)
                  .join('')}
            </div>
        </div>

        <div class="section">
            <h2>⚙️ الوظائف الأساسية</h2>
            <div class="features-list">
                ${[specs.mainFunction1, specs.mainFunction2, specs.mainFunction3, specs.mainFunction4]
                  .filter(Boolean)
                  .map(func => `<div class="feature-item">🔧 ${func}</div>`)
                  .join('')}
            </div>
        </div>

        ${specs.additionalFeatures && specs.additionalFeatures.length > 0 ? `
        <div class="section">
            <h2>✨ المميزات الإضافية</h2>
            <div class="features-list">
                ${specs.additionalFeatures.map((feature: string) => `<div class="feature-item">⭐ ${feature}</div>`).join('')}
            </div>
        </div>
        ` : ''}

        ${specs.interactiveElements && specs.interactiveElements.length > 0 ? `
        <div class="section">
            <h2>🎮 العناصر التفاعلية</h2>
            <div class="features-list">
                ${specs.interactiveElements.map((element: string) => `<div class="feature-item">🎯 ${element}</div>`).join('')}
            </div>
        </div>
        ` : ''}

        <div class="section">
            <h2>🎯 الأهداف والمتطلبات</h2>
            <div class="info-grid">
                <span class="label">الهدف الأساسي:</span>
                <span class="value">${specs.mainGoal1}</span>
                ${specs.mainGoal2 ? `<span class="label">الهدف الثاني:</span><span class="value">${specs.mainGoal2}</span>` : ''}
                ${specs.mainGoal3 ? `<span class="label">الهدف الثالث:</span><span class="value">${specs.mainGoal3}</span>` : ''}
                <span class="label">الميزانية:</span>
                <span class="value">${specs.budget}</span>
                <span class="label">إدارة المحتوى:</span>
                <span class="value">${specs.contentManagement}</span>
            </div>
        </div>

        ${specs.specialRequirements || specs.competitorWebsites || specs.inspirationSites || specs.additionalNotes ? `
        <div class="section">
            <h2>📝 معلومات إضافية</h2>
            <div class="info-grid">
                ${specs.specialRequirements ? `<span class="label">متطلبات خاصة:</span><span class="value">${specs.specialRequirements}</span>` : ''}
                ${specs.competitorWebsites ? `<span class="label">مواقع منافسة:</span><span class="value">${specs.competitorWebsites}</span>` : ''}
                ${specs.inspirationSites ? `<span class="label">مواقع إلهام:</span><span class="value">${specs.inspirationSites}</span>` : ''}
                ${specs.additionalNotes ? `<span class="label">ملاحظات إضافية:</span><span class="value">${specs.additionalNotes}</span>` : ''}
            </div>
        </div>
        ` : ''}

        <div class="footer">
            <p><strong>منصة معك للخدمات الرقمية</strong></p>
            <p>هذا المستند يحتوي على جميع التفاصيل اللازمة لتطوير الموقع</p>
            <p>للاستفسارات: ma3k.2025@gmail.com | 966532441566</p>
        </div>
    </div>
</body>
</html>
  `;
}