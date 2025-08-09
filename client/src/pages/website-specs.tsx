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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Globe, Sparkles, CheckCircle, ArrowRight, Download, Code } from "lucide-react";

const websiteSpecsSchema = z.object({
  websiteName: z.string().min(2, "اسم الموقع يجب أن يكون على الأقل حرفين"),
  idea: z.string().min(20, "اكتب فكرتك بتفصيل أكثر (20 حرف على الأقل)"),
  purpose: z.string().min(10, "حدد الغرض من الموقع بوضوح"),
  targetAudience: z.string().min(10, "حدد الجمهور المستهدف بدقة"),
  budget: z.string().min(1, "حدد الميزانية المتوقعة"),
  designType: z.string().min(1, "حدد نوع التصميم المطلوب"),
  
  // الوظائف الأساسية
  mainFunction1: z.string().min(3, "حدد الوظيفة الأساسية الأولى"),
  mainFunction2: z.string().optional(),
  mainFunction3: z.string().optional(),
  mainFunction4: z.string().optional(),
  mainFunction5: z.string().optional(),
  
  // الأقسام الرئيسية
  mainSection1: z.string().min(3, "حدد القسم الرئيسي الأول"),
  mainSection2: z.string().min(3, "حدد القسم الرئيسي الثاني"),
  mainSection3: z.string().min(3, "حدد القسم الرئيسي الثالث"),
  mainSection4: z.string().optional(),
  mainSection5: z.string().optional(),
  mainSection6: z.string().optional(),
  mainSection7: z.string().optional(),
  mainSection8: z.string().optional(),
  mainSection9: z.string().optional(),
  mainSection10: z.string().optional(),
  
  deviceSupport: z.string().min(1, "حدد الأجهزة المطلوبة"),
  languages: z.string().min(1, "حدد اللغات المطلوبة"),
  contentType: z.string().min(1, "حدد نوع المحتوى"),
  
  // المميزات الإضافية
  additionalFeature1: z.string().min(3, "حدد المميزة الإضافية الأولى"),
  additionalFeature2: z.string().optional(),
  additionalFeature3: z.string().optional(),
  
  // الأهداف الأساسية
  mainGoal1: z.string().min(5, "حدد الهدف الأساسي الأول"),
  mainGoal2: z.string().optional(),
  mainGoal3: z.string().optional(),
  
  techSupport: z.string().min(1, "حدد نوع الدعم الفني"),
  
  // المحتوى التفاعلي
  interactiveContent1: z.string().min(3, "حدد نوع المحتوى التفاعلي الأول"),
  interactiveContent2: z.string().optional(),
  interactiveContent3: z.string().optional(),
  
  // خيارات إضافية
  needsEcommerce: z.boolean().default(false),
  needsPaymentGateway: z.boolean().default(false),
  needsUserAccounts: z.boolean().default(false),
  needsAdminPanel: z.boolean().default(false),
  needsSEO: z.boolean().default(false),
  needsAnalytics: z.boolean().default(false),
  needsMultiLanguage: z.boolean().default(false),
  needsMobileApp: z.boolean().default(false),
  
  additionalNotes: z.string().optional(),
  specialRequests: z.string().optional(),
});

type WebsiteSpecsData = z.infer<typeof websiteSpecsSchema>;

export default function WebsiteSpecs() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedSpecs, setGeneratedSpecs] = useState<any>(null);
  const { toast } = useToast();
  
  const form = useForm<WebsiteSpecsData>({
    resolver: zodResolver(websiteSpecsSchema),
    defaultValues: {
      needsEcommerce: false,
      needsPaymentGateway: false,
      needsUserAccounts: false,
      needsAdminPanel: false,
      needsSEO: false,
      needsAnalytics: false,
      needsMultiLanguage: false,
      needsMobileApp: false,
    }
  });

  const onSubmit = async (data: WebsiteSpecsData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/website-specs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setGeneratedSpecs(result.specification);
        
        // حفظ المواصفات في localStorage للاستخدام في صفحة الدفع
        localStorage.setItem('websiteSpecs', JSON.stringify(data));
        
        toast({
          title: "تم إنشاء المواصفات بنجاح! 🎉",
          description: "يمكنك الآن تحميل الملفات أو المتابعة للدفع",
        });
        
      } else {
        throw new Error('Failed to process specifications');
      }
    } catch (error) {
      toast({
        title: "حدث خطأ في المعالجة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadFiles = () => {
    if (!generatedSpecs) return;
    
    // تحميل ملف HTML
    const htmlContent = generatedSpecs.htmlTemplate;
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = `${generatedSpecs.websiteName || 'website'}.html`;
    htmlLink.click();
    
    // تحميل ملف CSS
    setTimeout(() => {
      const cssContent = generatedSpecs.cssTemplate;
      const cssBlob = new Blob([cssContent], { type: 'text/css' });
      const cssUrl = URL.createObjectURL(cssBlob);
      const cssLink = document.createElement('a');
      cssLink.href = cssUrl;
      cssLink.download = `${generatedSpecs.websiteName || 'website'}-styles.css`;
      cssLink.click();
    }, 1000);
  };

  const proceedToPayment = () => {
    setLocation('/payment');
  };

  if (generatedSpecs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              تم إنشاء مواصفات موقعك بنجاح! 🎉
            </h1>
            <p className="text-gray-600">
              يمكنك الآن تحميل الملفات الأولية أو المتابعة لإتمام الطلب
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  تحميل الملفات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  احصل على ملفات HTML و CSS أولية لموقعك
                </p>
                <Button onClick={downloadFiles} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  تحميل الملفات
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  إكمال الطلب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  انتقل لصفحة الدفع لإكمال طلب تطوير الموقع
                </p>
                <Button onClick={proceedToPayment} variant="default" className="w-full">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  متابعة للدفع
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>📋 ملخص مواصفات موقعك</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>اسم الموقع:</strong> {generatedSpecs.websiteName}
                </div>
                <div>
                  <strong>الفكرة:</strong> {generatedSpecs.idea}
                </div>
                <div>
                  <strong>الغرض:</strong> {generatedSpecs.purpose}
                </div>
                <div>
                  <strong>الأقسام الرئيسية:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[generatedSpecs.mainSection1, generatedSpecs.mainSection2, generatedSpecs.mainSection3]
                      .filter(Boolean)
                      .map((section, index) => (
                        <Badge key={index} variant="secondary">{section}</Badge>
                      ))}
                  </div>
                </div>
                <div>
                  <strong>الوظائف الأساسية:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[generatedSpecs.mainFunction1, generatedSpecs.mainFunction2, generatedSpecs.mainFunction3]
                      .filter(Boolean)
                      .map((func, index) => (
                        <Badge key={index} variant="outline">{func}</Badge>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Globe className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مواصفات موقعك الإلكتروني
          </h1>
          <p className="text-gray-600">
            أكمل هذا النموذج التفصيلي لنتمكن من تطوير موقع يلبي احتياجاتك بدقة
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              تفاصيل المشروع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* المعلومات الأساسية */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="websiteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم الموقع *</FormLabel>
                        <FormControl>
                          <Input placeholder="اسم موقعك أو شركتك" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الميزانية المتوقعة *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الميزانية" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="400-800">400 - 800 ريال</SelectItem>
                            <SelectItem value="800-1200">800 - 1200 ريال</SelectItem>
                            <SelectItem value="1200-1600">1200 - 1600 ريال</SelectItem>
                            <SelectItem value="1600+">أكثر من 1600 ريال</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel>فكرة الموقع *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="اشرح فكرة موقعك بالتفصيل - ما هو، لماذا تريد إنشاءه، ماذا يقدم..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الغرض من الموقع *</FormLabel>
                        <FormControl>
                          <Input placeholder="عرض خدمات، بيع منتجات، مدونة شخصية..." {...field} />
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
                        <FormLabel>الجمهور المستهدف *</FormLabel>
                        <FormControl>
                          <Input placeholder="الشباب، الأعمال، النساء، العائلات..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* نوع التصميم */}
                <FormField
                  control={form.control}
                  name="designType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع التصميم المطلوب *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع التصميم" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="modern">عصري ومتطور</SelectItem>
                          <SelectItem value="classic">كلاسيكي وأنيق</SelectItem>
                          <SelectItem value="creative">إبداعي وفني</SelectItem>
                          <SelectItem value="corporate">مؤسسي ومهني</SelectItem>
                          <SelectItem value="minimalist">بسيط ونظيف</SelectItem>
                          <SelectItem value="colorful">ملون وحيوي</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* الأقسام الرئيسية */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">الأقسام الرئيسية للموقع</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <FormField
                        key={num}
                        control={form.control}
                        name={`mainSection${num}` as keyof WebsiteSpecsData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              القسم {num} {num <= 3 ? '*' : '(اختياري)'}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={`مثل: الرئيسية، من نحن، الخدمات، تواصل معنا...`}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                {/* الوظائف الأساسية */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">الوظائف الأساسية</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <FormField
                        key={num}
                        control={form.control}
                        name={`mainFunction${num}` as keyof WebsiteSpecsData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              الوظيفة {num} {num === 1 ? '*' : '(اختياري)'}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="عرض المحتوى، نموذج تواصل، حجز موعد..."
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                {/* المواصفات التقنية */}
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="deviceSupport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>دعم الأجهزة *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الأجهزة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">جميع الأجهزة</SelectItem>
                            <SelectItem value="desktop">أجهزة الكمبيوتر فقط</SelectItem>
                            <SelectItem value="mobile">الهواتف المحمولة فقط</SelectItem>
                            <SelectItem value="mobile-first">الهواتف أولاً</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اللغات المطلوبة *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر اللغات" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="arabic">العربية فقط</SelectItem>
                            <SelectItem value="english">الإنجليزية فقط</SelectItem>
                            <SelectItem value="both">العربية والإنجليزية</SelectItem>
                            <SelectItem value="multiple">لغات متعددة</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع المحتوى *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع المحتوى" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">نصوص بشكل أساسي</SelectItem>
                            <SelectItem value="images">صور ونصوص</SelectItem>
                            <SelectItem value="video">فيديوهات ومحتوى بصري</SelectItem>
                            <SelectItem value="interactive">محتوى تفاعلي</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* المميزات الإضافية */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">المميزات والخيارات الإضافية</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {[
                      { name: 'needsEcommerce', label: '🛒 متجر إلكتروني' },
                      { name: 'needsPaymentGateway', label: '💳 بوابة دفع' },
                      { name: 'needsUserAccounts', label: '👥 حسابات المستخدمين' },
                      { name: 'needsAdminPanel', label: '⚙️ لوحة إدارة' },
                      { name: 'needsSEO', label: '🔍 تحسين محركات البحث' },
                      { name: 'needsAnalytics', label: '📊 أدوات التحليل' },
                      { name: 'needsMultiLanguage', label: '🌍 دعم لغات متعددة' },
                      { name: 'needsMobileApp', label: '📱 تطبيق جوال' }
                    ].map((option) => (
                      <FormField
                        key={option.name}
                        control={form.control}
                        name={option.name as keyof WebsiteSpecsData}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                {option.label}
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((num) => (
                      <FormField
                        key={num}
                        control={form.control}
                        name={`additionalFeature${num}` as keyof WebsiteSpecsData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              مميزة إضافية {num} {num === 1 ? '*' : '(اختياري)'}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="نظام حجوزات، مراسلة مباشرة..."
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                {/* الأهداف والدعم */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">الأهداف الأساسية</h3>
                    {[1, 2, 3].map((num) => (
                      <FormField
                        key={num}
                        control={form.control}
                        name={`mainGoal${num}` as keyof WebsiteSpecsData}
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>
                              الهدف {num} {num === 1 ? '*' : '(اختياري)'}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="زيادة المبيعات، تعزيز الهوية..."
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">المحتوى التفاعلي</h3>
                    {[1, 2, 3].map((num) => (
                      <FormField
                        key={num}
                        control={form.control}
                        name={`interactiveContent${num}` as keyof WebsiteSpecsData}
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>
                              محتوى تفاعلي {num} {num === 1 ? '*' : '(اختياري)'}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="استطلاعات، ألعاب، نماذج..."
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="techSupport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع الدعم الفني المطلوب *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع الدعم" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="basic">دعم أساسي (شهر واحد)</SelectItem>
                          <SelectItem value="extended">دعم ممتد (3 أشهر)</SelectItem>
                          <SelectItem value="maintenance">صيانة مستمرة</SelectItem>
                          <SelectItem value="training">تدريب على الاستخدام</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* ملاحظات إضافية */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ملاحظات إضافية</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="أي ملاحظات أو تفاصيل إضافية تريد مشاركتها..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>طلبات خاصة</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="أي طلبات خاصة أو تعديلات مخصصة..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation('/cart')}
                    className="flex-1"
                  >
                    العودة للسلة
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        جاري المعالجة...
                      </>
                    ) : (
                      <>
                        <Code className="mr-2 h-4 w-4" />
                        إنشاء المواصفات والملفات
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}