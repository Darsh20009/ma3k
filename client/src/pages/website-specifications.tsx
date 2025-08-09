import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      // إنشاء رقم طلب فريد
      const orderNumber = `WEB-${Date.now()}`;
      const timestamp = new Date().toISOString();
      
      const specsData = {
        ...data,
        specId: orderNumber,
        timestamp
      };

      // إنشاء مستند HTML للمواصفات
      const htmlDocument = generateSpecsDocument(specsData);
      
      // تحميل المستند كملف HTML
      const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `مواصفات-الموقع-${data.websiteName}-${orderNumber}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // إنشاء قالب HTML/CSS إبداعي للموقع
      const websiteTemplate = generateWebsiteTemplate(specsData);
      const templateBlob = new Blob([websiteTemplate], { type: 'text/html;charset=utf-8' });
      const templateUrl = URL.createObjectURL(templateBlob);
      const templateLink = document.createElement('a');
      templateLink.href = templateUrl;
      templateLink.download = `قالب-موقع-${data.websiteName}-${orderNumber}.html`;
      document.body.appendChild(templateLink);
      templateLink.click();
      document.body.removeChild(templateLink);
      URL.revokeObjectURL(templateUrl);

      toast({
        title: "✅ تم إنشاء المواصفات والقالب بنجاح!",
        description: `رقم الطلب: ${orderNumber} - تم تحميل الملفات`,
        duration: 5000,
      });

      // فتح واتساب مباشرة مع رسالة جاهزة
      setTimeout(() => {
        const whatsappMessage = `مرحباً! 🌟
تم إنشاء مواصفات موقع جديد:
• اسم المشروع: ${data.websiteName}
• رقم الطلب: ${orderNumber}
• تم تحميل ملفين: المواصفات والقالب الإبداعي

أرغب في مناقشة تفاصيل التطوير والسعر النهائي.`;
        
        const whatsappUrl = `https://wa.me/966532441566?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        toast({
          title: "📱 تم فتح واتساب",
          description: "أرسل الرسالة الجاهزة وأرفق الملفين المحملين",
          duration: 8000,
        });
      }, 2000);

      // الانتقال لصفحة دفع مبسطة بعد 4 ثوان
      setTimeout(() => {
        setLocation('/payment');
      }, 4000);
      
    } catch (error) {
      console.error('Error generating files:', error);
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
              <Globe className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground">المعلومات الأساسية</h2>
              <p className="text-muted-foreground">ابدأ بوصف فكرة موقعك الأساسية</p>
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
              <Sparkles className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground">التصميم والمظهر</h2>
              <p className="text-muted-foreground">حدد نوع التصميم والألوان المفضلة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="designType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>نوع التصميم المطلوب</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="modern" id="modern" />
                          <FormLabel htmlFor="modern">عصري ومتقدم</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="classic" id="classic" />
                          <FormLabel htmlFor="classic">كلاسيكي وأنيق</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="minimalist" id="minimalist" />
                          <FormLabel htmlFor="minimalist">بسيط ونظيف</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="creative" id="creative" />
                          <FormLabel htmlFor="creative">إبداعي ومليء بالألوان</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="professional" id="professional" />
                          <FormLabel htmlFor="professional">مهني وأكاديمي</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="luxury" id="luxury" />
                          <FormLabel htmlFor="luxury">فاخر ومميز</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorScheme"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>نظام الألوان المفضل</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="blue-white" id="blue-white" />
                          <FormLabel htmlFor="blue-white">أزرق وأبيض</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="green-gold" id="green-gold" />
                          <FormLabel htmlFor="green-gold">أخضر وذهبي</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="red-black" id="red-black" />
                          <FormLabel htmlFor="red-black">أحمر وأسود</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="purple-silver" id="purple-silver" />
                          <FormLabel htmlFor="purple-silver">بنفسجي وفضي</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="custom" id="custom" />
                          <FormLabel htmlFor="custom">ألوان مخصصة</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
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
                  <FormItem className="space-y-3">
                    <FormLabel>اللغات المطلوبة</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="arabic" id="arabic" />
                          <FormLabel htmlFor="arabic">العربية فقط</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="english" id="english" />
                          <FormLabel htmlFor="english">الإنجليزية فقط</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="arabic-english" id="arabic-english" />
                          <FormLabel htmlFor="arabic-english">العربية والإنجليزية</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="multilingual" id="multilingual" />
                          <FormLabel htmlFor="multilingual">متعدد اللغات</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deviceSupport"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>الأجهزة المدعومة</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="responsive" id="responsive" />
                          <FormLabel htmlFor="responsive">جميع الأجهزة (متجاوب)</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="desktop-only" id="desktop-only" />
                          <FormLabel htmlFor="desktop-only">أجهزة سطح المكتب فقط</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="mobile-first" id="mobile-first" />
                          <FormLabel htmlFor="mobile-first">الجوال أولاً</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="tablet-optimized" id="tablet-optimized" />
                          <FormLabel htmlFor="tablet-optimized">محسن للتابلت</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
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
              <FileText className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground">أقسام ووظائف الموقع</h2>
              <p className="text-muted-foreground">حدد الأقسام والوظائف الأساسية للموقع</p>
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
              <CheckCircle className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground">المميزات المتقدمة</h2>
              <p className="text-muted-foreground">اختر المميزات الإضافية التي تريدها</p>
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
                                    const currentValue = field.value || [];
                                    return checked
                                      ? field.onChange([...currentValue, feature])
                                      : field.onChange(currentValue.filter((value) => value !== feature))
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
                                    const currentValue = field.value || [];
                                    return checked
                                      ? field.onChange([...currentValue, element])
                                      : field.onChange(currentValue.filter((value) => value !== element))
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
              <CheckCircle className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground">التفاصيل النهائية</h2>
              <p className="text-muted-foreground">أكمل المعلومات المتبقية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>الميزانية المتوقعة</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="400-800" id="budget-400" />
                          <FormLabel htmlFor="budget-400">400 - 800 ريال</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="800-1200" id="budget-800" />
                          <FormLabel htmlFor="budget-800">800 - 1200 ريال</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="1200-2000" id="budget-1200" />
                          <FormLabel htmlFor="budget-1200">1200 - 2000 ريال</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="2000+" id="budget-2000" />
                          <FormLabel htmlFor="budget-2000">أكثر من 2000 ريال</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentManagement"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>نوع إدارة المحتوى</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="simple" id="content-simple" />
                          <FormLabel htmlFor="content-simple">بسيط (تحديث نصوص)</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="medium" id="content-medium" />
                          <FormLabel htmlFor="content-medium">متوسط (إضافة منتجات)</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="advanced" id="content-advanced" />
                          <FormLabel htmlFor="content-advanced">متقدم (إدارة كاملة)</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="custom" id="content-custom" />
                          <FormLabel htmlFor="content-custom">مخصص حسب الطلب</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
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
    <div className="min-h-screen royal-gradient py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="glass-card shadow-2xl border-0">
          <CardHeader className="gold-gradient text-black dark:text-black">
            <CardTitle className="text-center text-2xl font-bold">
              🌐 مواصفات الموقع المطلوب
            </CardTitle>
            <p className="text-center text-black/80 dark:text-black/80">
              اكمل التفاصيل بدقة ليتمكن المطور من إنشاء موقعك المثالي
            </p>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-black/70 dark:text-black/70 mb-2">
                <span>الخطوة {currentStep} من 5</span>
                <span>{Math.round((currentStep / 5) * 100)}%</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <div 
                  className="bg-black h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 bg-card/50 dark:bg-card/50 backdrop-blur-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {renderStep()}
                
                <Separator className="bg-border/20" />
                
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary border-border/30"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    السابق
                  </Button>
                  
                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                      className="flex items-center gap-2 gold-gradient text-black font-semibold hover:opacity-90"
                    >
                      التالي
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 gold-gradient text-black font-semibold hover:opacity-90"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          تحميل المواصفات والقالب
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
    <title>🚀 مواصفات ${specs.websiteName} - منصة معك</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Tajawal', -apple-system, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh;
            padding: 20px;
            line-height: 1.8;
        }
        
        .container { 
            max-width: 900px; 
            margin: 0 auto; 
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(20px);
            border-radius: 25px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0,0,0,0.2);
            border: 1px solid rgba(255,255,255,0.3);
        }
        
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 3s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        .header h1 { 
            font-size: 2.8rem; 
            font-weight: 800;
            margin-bottom: 15px;
            text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
        }
        
        .header h2 { 
            font-size: 2.2rem; 
            font-weight: 600;
            margin-bottom: 20px;
            color: #ffd700;
            position: relative;
            z-index: 1;
        }
        
        .header p { 
            font-size: 1.2rem; 
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        
        .order-badge {
            display: inline-block;
            background: rgba(255,215,0,0.9);
            color: #333;
            padding: 10px 25px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 1.1rem;
            margin-top: 15px;
            box-shadow: 0 10px 20px rgba(255,215,0,0.3);
        }
        
        .content {
            padding: 0;
        }
        
        .section { 
            margin: 0;
            padding: 35px 40px;
            border-bottom: 1px solid rgba(102,126,234,0.1);
            position: relative;
        }
        
        .section:last-child { border-bottom: none; }
        
        .section h2 { 
            color: #667eea;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .section h2::before {
            content: '';
            width: 50px;
            height: 4px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 2px;
        }
        
        .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 2fr; 
            gap: 20px 30px; 
            margin: 20px 0;
            align-items: center;
        }
        
        .label { 
            font-weight: 600; 
            color: #4a5568;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .label::before {
            content: '▶';
            color: #667eea;
            font-size: 0.8rem;
        }
        
        .value { 
            color: #2d3748;
            font-weight: 500;
            background: rgba(102,126,234,0.05);
            padding: 12px 20px;
            border-radius: 12px;
            border-right: 4px solid #667eea;
            font-size: 1.05rem;
        }
        
        .features-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            gap: 20px; 
            margin-top: 25px;
        }
        
        .feature-item { 
            background: linear-gradient(135deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%);
            padding: 20px;
            border-radius: 15px;
            border: 2px solid rgba(102,126,234,0.1);
            font-weight: 500;
            font-size: 1.05rem;
            color: #2d3748;
            transition: all 0.3s ease;
            cursor: default;
        }
        
        .feature-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(102,126,234,0.15);
            border-color: #667eea;
        }
        
        .footer { 
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .footer p { 
            margin: 10px 0;
            font-size: 1.1rem;
        }
        
        .footer strong {
            color: #ffd700;
            font-size: 1.3rem;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        
        .contact-item {
            background: rgba(255,255,255,0.1);
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: 600;
        }
        
        @media (max-width: 768px) {
            .container { margin: 10px; border-radius: 20px; }
            .header { padding: 30px 20px; }
            .header h1 { font-size: 2.2rem; }
            .header h2 { font-size: 1.8rem; }
            .section { padding: 25px 20px; }
            .info-grid { grid-template-columns: 1fr; gap: 15px; }
            .features-grid { grid-template-columns: 1fr; }
            .contact-info { flex-direction: column; align-items: center; }
        }
        
        .print-section {
            page-break-inside: avoid;
        }
        
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; border: 1px solid #ddd; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 مواصفات الموقع الإبداعي</h1>
            <h2>${specs.websiteName}</h2>
            <p>تم إنشاؤها في: ${new Date(specs.timestamp).toLocaleDateString('ar-SA')}</p>
            <div class="order-badge">رقم المرجع: ${specs.specId}</div>
        </div>

        <div class="content">
            <div class="section print-section">
                <h2>🎯 المعلومات الأساسية</h2>
                <div class="info-grid">
                    <span class="label">اسم الموقع</span>
                    <span class="value">${specs.websiteName}</span>
                    <span class="label">الغرض من الموقع</span>
                    <span class="value">${specs.purpose}</span>
                    <span class="label">فكرة المشروع</span>
                    <span class="value">${specs.idea}</span>
                    <span class="label">الجمهور المستهدف</span>
                    <span class="value">${specs.targetAudience}</span>
                </div>
            </div>

            <div class="section print-section">
                <h2>🎨 التصميم والهوية البصرية</h2>
                <div class="info-grid">
                    <span class="label">نوع التصميم</span>
                    <span class="value">${specs.designType}</span>
                    <span class="label">نظام الألوان</span>
                    <span class="value">${specs.colorScheme}</span>
                    <span class="label">اللغات المدعومة</span>
                    <span class="value">${specs.languages}</span>
                    <span class="label">الأجهزة المدعومة</span>
                    <span class="value">${specs.deviceSupport}</span>
                </div>
            </div>

            <div class="section print-section">
                <h2>📑 هيكل وأقسام الموقع</h2>
                <div class="features-grid">
                    ${[specs.mainSection1, specs.mainSection2, specs.mainSection3, specs.mainSection4, specs.mainSection5]
                      .filter(Boolean)
                      .map(section => `<div class="feature-item">📄 ${section}</div>`)
                      .join('')}
                </div>
            </div>

            <div class="section print-section">
                <h2>⚙️ الوظائف والخصائص التقنية</h2>
                <div class="features-grid">
                    ${[specs.mainFunction1, specs.mainFunction2, specs.mainFunction3, specs.mainFunction4]
                      .filter(Boolean)
                      .map(func => `<div class="feature-item">🔧 ${func}</div>`)
                      .join('')}
                </div>
            </div>

            ${specs.additionalFeatures && specs.additionalFeatures.length > 0 ? `
            <div class="section print-section">
                <h2>✨ المميزات الإضافية المتقدمة</h2>
                <div class="features-grid">
                    ${specs.additionalFeatures.map((feature: string) => `<div class="feature-item">⭐ ${feature}</div>`).join('')}
                </div>
            </div>
            ` : ''}

            ${specs.interactiveElements && specs.interactiveElements.length > 0 ? `
            <div class="section print-section">
                <h2>🎮 العناصر التفاعلية والتجربة</h2>
                <div class="features-grid">
                    ${specs.interactiveElements.map((element: string) => `<div class="feature-item">🎯 ${element}</div>`).join('')}
                </div>
            </div>
            ` : ''}

            <div class="section print-section">
                <h2>🎯 الأهداف والمتطلبات التجارية</h2>
                <div class="info-grid">
                    <span class="label">الهدف الأساسي</span>
                    <span class="value">${specs.mainGoal1}</span>
                    ${specs.mainGoal2 ? `<span class="label">الهدف الثاني</span><span class="value">${specs.mainGoal2}</span>` : ''}
                    ${specs.mainGoal3 ? `<span class="label">الهدف الثالث</span><span class="value">${specs.mainGoal3}</span>` : ''}
                    <span class="label">الميزانية المحددة</span>
                    <span class="value">${specs.budget} ريال سعودي</span>
                    <span class="label">نوع إدارة المحتوى</span>
                    <span class="value">${specs.contentManagement}</span>
                </div>
            </div>

            ${specs.specialRequirements || specs.competitorWebsites || specs.inspirationSites || specs.additionalNotes ? `
            <div class="section print-section">
                <h2>📝 تفاصيل ومتطلبات إضافية</h2>
                <div class="info-grid">
                    ${specs.specialRequirements ? `<span class="label">متطلبات خاصة</span><span class="value">${specs.specialRequirements}</span>` : ''}
                    ${specs.competitorWebsites ? `<span class="label">مواقع منافسة للمراجعة</span><span class="value">${specs.competitorWebsites}</span>` : ''}
                    ${specs.inspirationSites ? `<span class="label">مواقع إلهام ومرجعية</span><span class="value">${specs.inspirationSites}</span>` : ''}
                    ${specs.additionalNotes ? `<span class="label">ملاحظات وتوجيهات إضافية</span><span class="value">${specs.additionalNotes}</span>` : ''}
                </div>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            <p><strong>🌟 منصة معك للخدمات الرقمية المتطورة 🌟</strong></p>
            <p>هذا المستند الشامل يحتوي على جميع التفاصيل والمتطلبات اللازمة لتطوير موقعك بأعلى معايير الجودة</p>
            <div class="contact-info">
                <div class="contact-item">📧 ma3k.2025@gmail.com</div>
                <div class="contact-item">📱 966532441566</div>
                <div class="contact-item">🌐 منصة معك الرقمية</div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

function generateWebsiteTemplate(specs: any): string {
  const colors = {
    'blue-white': { primary: '#0066cc', secondary: '#ffffff', accent: '#1a73e8' },
    'green-gold': { primary: '#2d5016', secondary: '#ffd700', accent: '#4caf50' },
    'red-black': { primary: '#dc143c', secondary: '#000000', accent: '#ff4444' },
    'purple-silver': { primary: '#6a0dad', secondary: '#c0c0c0', accent: '#9c27b0' },
    'custom': { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb' }
  };
  
  const selectedColors = colors[specs.colorScheme as keyof typeof colors] || colors.custom;
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${specs.websiteName}</title>
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body { 
            font-family: 'Tajawal', 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333;
            background: linear-gradient(135deg, ${selectedColors.primary}15 0%, ${selectedColors.accent}15 100%);
            min-height: 100vh;
        }
        
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 0 20px; 
        }
        
        /* Header */
        header {
            background: linear-gradient(135deg, ${selectedColors.primary} 0%, ${selectedColors.accent} 100%);
            color: white;
            padding: 1rem 0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .logo {
            font-size: 2rem;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
            flex-wrap: wrap;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            padding: 0.5rem 1rem;
            border-radius: 25px;
        }
        
        .nav-links a:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
        }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, ${selectedColors.primary}20 0%, ${selectedColors.accent}20 100%);
            padding: 4rem 0;
            text-align: center;
            min-height: 70vh;
            display: flex;
            align-items: center;
        }
        
        .hero-content h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, ${selectedColors.primary}, ${selectedColors.accent});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: fadeInUp 1s ease;
        }
        
        .hero-content p {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            color: #666;
            animation: fadeInUp 1s ease 0.2s both;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, ${selectedColors.primary}, ${selectedColors.accent});
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            animation: fadeInUp 1s ease 0.4s both;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        /* Sections */
        .section {
            padding: 4rem 0;
            margin: 2rem 0;
        }
        
        .section h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: ${selectedColors.primary};
            position: relative;
        }
        
        .section h2::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background: linear-gradient(135deg, ${selectedColors.primary}, ${selectedColors.accent});
            border-radius: 2px;
        }
        
        /* Features Grid */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .feature-card:hover {
            transform: translateY(-10px);
            border-color: ${selectedColors.accent};
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }
        
        .feature-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, ${selectedColors.primary}, ${selectedColors.accent});
            border-radius: 50%;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
        }
        
        /* Contact Section */
        .contact {
            background: linear-gradient(135deg, ${selectedColors.primary}10 0%, ${selectedColors.accent}10 100%);
            border-radius: 20px;
            padding: 3rem;
            margin: 2rem 0;
        }
        
        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .contact-item {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        /* Footer */
        footer {
            background: linear-gradient(135deg, ${selectedColors.primary} 0%, ${selectedColors.accent} 100%);
            color: white;
            padding: 2rem 0;
            text-align: center;
            margin-top: 4rem;
        }
        
        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .hero-content h1 { font-size: 2.5rem; }
            .nav-links { display: none; }
            .section { padding: 2rem 0; }
            .features-grid { grid-template-columns: 1fr; }
        }
        
        /* Interactive Elements */
        .interactive-element {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            margin: 1rem 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        
        .interactive-element:hover {
            transform: scale(1.02);
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }
        
        .interactive-button {
            background: linear-gradient(135deg, ${selectedColors.primary}, ${selectedColors.accent});
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 0.5rem;
        }
        
        .interactive-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">${specs.websiteName}</div>
            <ul class="nav-links">
                ${[specs.mainSection1, specs.mainSection2, specs.mainSection3].filter(Boolean).map((section: string) => 
                    `<li><a href="#${section.replace(/\s+/g, '-')}">${section}</a></li>`
                ).join('')}
                <li><a href="#contact">تواصل معنا</a></li>
            </ul>
        </nav>
    </header>

    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>${specs.websiteName}</h1>
                <p>${specs.idea}</p>
                <a href="#services" class="cta-button">اكتشف خدماتنا</a>
            </div>
        </div>
    </section>

    <section id="about" class="section">
        <div class="container">
            <h2>من نحن</h2>
            <p style="text-align: center; font-size: 1.2rem; color: #666; max-width: 800px; margin: 0 auto;">
                ${specs.purpose}
            </p>
        </div>
    </section>

    <section id="services" class="section">
        <div class="container">
            <h2>خدماتنا</h2>
            <div class="features-grid">
                ${[specs.mainFunction1, specs.mainFunction2, specs.mainFunction3, specs.mainFunction4]
                  .filter(Boolean)
                  .map((func: string, index: number) => `
                    <div class="feature-card">
                        <div class="feature-icon">${['🚀', '💎', '⭐', '🎯'][index] || '✨'}</div>
                        <h3>${func}</h3>
                        <p>نقدم أفضل الحلول في ${func} بجودة عالية واحترافية تامة</p>
                    </div>
                  `).join('')}
            </div>
        </div>
    </section>

    ${specs.additionalFeatures && specs.additionalFeatures.length > 0 ? `
    <section class="section">
        <div class="container">
            <h2>المميزات الإضافية</h2>
            <div class="features-grid">
                ${specs.additionalFeatures.map((feature: string) => `
                    <div class="interactive-element">
                        <h4>⭐ ${feature}</h4>
                        <p>تمتع بميزة ${feature} المتطورة والمفيدة</p>
                        <button class="interactive-button">تعرف أكثر</button>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${specs.interactiveElements && specs.interactiveElements.length > 0 ? `
    <section class="section">
        <div class="container">
            <h2>العناصر التفاعلية</h2>
            <div class="features-grid">
                ${specs.interactiveElements.map((element: string) => `
                    <div class="interactive-element">
                        <h4>🎮 ${element}</h4>
                        <p>استمتع بتجربة ${element} التفاعلية والممتعة</p>
                        <button class="interactive-button" onclick="alert('مرحباً! هذا مثال على ${element}')">جرب الآن</button>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <section id="contact" class="section">
        <div class="container">
            <div class="contact">
                <h2>تواصل معنا</h2>
                <p style="text-align: center; font-size: 1.2rem; margin-bottom: 2rem;">
                    نحن هنا لخدمتك ومساعدتك في تحقيق أهدافك
                </p>
                <div class="contact-info">
                    <div class="contact-item">
                        <h4>📧 البريد الإلكتروني</h4>
                        <p>ma3k.2025@gmail.com</p>
                    </div>
                    <div class="contact-item">
                        <h4>📱 واتساب</h4>
                        <p>966532441566</p>
                    </div>
                    <div class="contact-item">
                        <h4>🌍 الموقع الإلكتروني</h4>
                        <p>www.${specs.websiteName.toLowerCase().replace(/\s+/g, '')}.com</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2025 ${specs.websiteName} - جميع الحقوق محفوظة</p>
            <p>تم إنشاؤه بواسطة منصة معك للخدمات الرقمية</p>
            <p>رقم المرجع: ${specs.specId}</p>
        </div>
    </footer>

    <script>
        // إضافة بعض التفاعل الأساسي
        document.addEventListener('DOMContentLoaded', function() {
            // تأثير التمرير السلس
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // تأثير ظهور العناصر عند التمرير
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // مراقبة جميع العناصر القابلة للتحريك
            document.querySelectorAll('.feature-card, .interactive-element').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
                observer.observe(el);
            });
        });
    </script>
</body>
</html>
  `;
}