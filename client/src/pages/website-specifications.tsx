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
      console.log('Form submission started with data:', data);
      
      // Log form errors if any
      const errors = form.formState.errors;
      console.log('Form errors:', errors);
      
      if (Object.keys(errors).length > 0) {
        toast({
          title: "يرجى إصلاح الأخطاء في النموذج",
          description: "تحقق من جميع الحقول المطلوبة",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // إرسال المواصفات للخادم
      const response = await fetch('/api/website-specs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit specifications');
      }

      const result = await response.json();
      console.log('Server response:', result);
      
      // حفظ رقم الطلب في localStorage للاستخدام في الدفع
      const orderNumber = result.specification.specId;
      localStorage.setItem('websiteOrderNumber', orderNumber);
      localStorage.setItem('websiteSpecifications', JSON.stringify(data));
      
      toast({
        title: "✅ تم إرسال المواصفات بنجاح!",
        description: `رقم الطلب: ${orderNumber} - سيتم التواصل معك قريباً`,
      });
      
      // الانتقال مباشرة للدفع
      setTimeout(() => {
        setLocation('/payment');
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting specifications:', error);
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
                          إرسال المواصفات والانتقال للدفع
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