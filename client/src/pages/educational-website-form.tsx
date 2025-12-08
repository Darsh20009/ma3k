import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle, 
  MessageSquare, 
  Mail,
  BookOpen,
  Users,
  Award,
  Video,
  FileText,
  MessageCircle,
  Trophy,
  Library,
  Target,
  Clock,
  Globe
} from "lucide-react";

const educationalFormSchema = z.object({
  websiteName: z.string().min(2, "اسم الموقع يجب أن يكون على الأقل حرفين"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(10, "رقم الهاتف يجب أن يكون على الأقل 10 أرقام"),
  idea: z.string().min(10, "اكتب فكرتك بتفصيل أكثر"),
  purpose: z.string().min(5, "حدد الغرض من الموقع"),
  targetAudience: z.string().min(5, "حدد الجمهور المستهدف"),
  budget: z.string().min(1, "حدد الميزانية المتوقعة"),
  designType: z.string().min(1, "حدد نوع التصميم المطلوب"),
  mainFunction1: z.string().min(1, "حدد الوظيفة الأساسية الأولى"),
  mainFunction2: z.string().optional(),
  mainFunction3: z.string().optional(),
  mainSection1: z.string().min(1, "حدد القسم الرئيسي الأول"),
  mainSection2: z.string().optional(),
  mainSection3: z.string().optional(),
  mainSection4: z.string().optional(),
  mainSection5: z.string().optional(),
  mainSection6: z.string().optional(),
  deviceSupport: z.string().min(1, "حدد الأجهزة المطلوبة"),
  languages: z.array(z.string()).min(1, "اختر لغة واحدة على الأقل"),
  contentTypes: z.array(z.string()).min(1, "اختر نوع محتوى واحد على الأقل"),
  additionalFeatures: z.array(z.string()).optional(),
  mainGoals: z.array(z.string()).min(1, "اختر هدف واحد على الأقل"),
  techSupport: z.string().min(1, "حدد نوع الدعم الفني"),
  interactiveContent: z.array(z.string()).optional(),
  extraOptions: z.array(z.string()).optional(),
  deliveryMethod: z.enum(["email", "whatsapp"], {
    required_error: "اختر طريقة التسليم"
  })
});

type EducationalFormData = z.infer<typeof educationalFormSchema>;

const availableLanguages = [
  { code: "ar", name: "العربية" },
  { code: "en", name: "الإنجليزية: English" },
  { code: "fr", name: "الفرنسية: Français" },
  { code: "es", name: "الإسبانية: Español" },
  { code: "de", name: "الألمانية: Deutsch" },
  { code: "it", name: "الإيطالية: Italiano" },
  { code: "pt", name: "البرتغالية: Português" },
  { code: "ru", name: "الروسية: Русский" },
  { code: "zh-cn", name: "الصينية المبسطة: 简体中文" },
  { code: "zh-tw", name: "الصينية التقليدية: 繁體中文" },
  { code: "ja", name: "اليابانية: 日本語" },
  { code: "ko", name: "الكورية: 한국어" }
];

const contentTypeOptions = [
  { id: "texts", label: "نصوص تعليمية", icon: FileText },
  { id: "videos", label: "مقاطع فيديو", icon: Video },
  { id: "infographics", label: "رسوم بيانية وإنفوجرافيك", icon: Target },
  { id: "interactive", label: "تمارين واختبارات تفاعلية", icon: BookOpen }
];

const additionalFeatureOptions = [
  { id: "social-login", label: "دعم تسجيل الدخول عبر وسائل التواصل الاجتماعي" },
  { id: "certificates", label: "شهادات إلكترونية بعد إتمام الدورات" }
];

const goalOptions = [
  { id: "improve-education", label: "تحسين مستوى التعليم للطلاب" },
  { id: "easy-access", label: "توفير منصة سهلة الوصول للمحتوى التعليمي" },
  { id: "enhance-communication", label: "تعزيز التواصل بين المعلمين والطلاب" }
];

const interactiveContentOptions = [
  { id: "competitions", label: "مسابقات تعليمية", icon: Trophy },
  { id: "assessments", label: "اختبارات تقييمية", icon: Award },
  { id: "discussions", label: "غرف نقاش مباشرة", icon: MessageCircle }
];

const extraOptionsList = [
  { id: "points-system", label: "إتاحة نظام تحفيزي بالنقاط" },
  { id: "badges", label: "شارات (Badges) تُمنح عند إكمال الدورات أو إنجاز المهام" },
  { id: "weekly-competitions", label: "مسابقات وجوائز أسبوعية أو شهرية" },
  { id: "digital-library", label: "مكتبة تعليمية رقمية تحتوي على كتب وأبحاث" },
  { id: "downloadable-files", label: "تحميل ملفات دراسية بصيغ مختلفة (PDF، فيديوهات)" },
  { id: "articles-section", label: "قسم خاص بالمقالات والنصائح التعليمية" }
];

export default function EducationalWebsiteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<EducationalFormData>({
    resolver: zodResolver(educationalFormSchema),
    defaultValues: {
      email: "ma3k.2025@gmail.com",
      phone: "966532441566",
      deliveryMethod: "email",
      languages: ["ar"],
      contentTypes: [],
      additionalFeatures: [],
      mainGoals: [],
      interactiveContent: [],
      extraOptions: []
    }
  });

  const onSubmit = async (data: EducationalFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/educational-website-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "تم إرسال طلبك بنجاح",
          description: "سنتواصل معك خلال 2-24 ساعة مع خطة موقعك التعليمي",
        });
        
        if (data.deliveryMethod === 'whatsapp') {
          const message = encodeURIComponent(
            `طلب تخطيط موقع تعليمي جديد:\n` +
            `الاسم: ${data.websiteName}\n` +
            `البريد: ${data.email}\n` +
            `الهاتف: ${data.phone}\n` +
            `الفكرة: ${data.idea}`
          );
          window.open(`https://wa.me/966570708801?text=${message}`, "_blank");
        }
        
        form.reset();
      } else {
        throw new Error('Failed to process form');
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

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "var(--ma3k-green)" }}
            >
              <GraduationCap className="w-12 h-12 text-white" />
            </motion.div>
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              فلنبدأ بتنفيذ فكرتك
            </h1>
            <h2 
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "var(--ma3k-green)" }}
            >
              إنشاء مخطط توضيحي لعمل موقع تعليمي
            </h2>
            <Badge 
              className="text-lg px-6 py-2"
              style={{ 
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "var(--ma3k-green)",
                border: "1px solid var(--ma3k-green)"
              }}
            >
              <Sparkles className="w-5 h-5 ml-2" />
              مجاني تماماً
            </Badge>
            <p 
              className="text-lg mt-6 max-w-2xl mx-auto"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              اعلم أن خططك ستصلك في غضون ساعتين إلى 24 ساعة، كن جاهزاً
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="glass-card rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" style={{ color: "var(--ma3k-beige)" }}>
                    <Globe className="w-6 h-6" style={{ color: "var(--ma3k-teal)" }} />
                    المعلومات الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="websiteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: "var(--ma3k-beige)" }}>اسم موقعك التعليمي</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="مثال: أكاديمية المستقبل" 
                            {...field} 
                            className="glass-input"
                            data-testid="input-website-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: "var(--ma3k-beige)" }}>البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="example@email.com" 
                              {...field} 
                              className="glass-input"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: "var(--ma3k-beige)" }}>رقم الهاتف</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="966XXXXXXXXX" 
                              {...field} 
                              className="glass-input"
                              data-testid="input-phone"
                            />
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
                        <FormLabel style={{ color: "var(--ma3k-beige)" }}>اكتب فكرتك هنا</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="صف فكرة موقعك التعليمي بالتفصيل..."
                            rows={4}
                            {...field} 
                            className="glass-input"
                            data-testid="input-idea"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" style={{ color: "var(--ma3k-beige)" }}>
                    <Target className="w-6 h-6" style={{ color: "var(--ma3k-teal)" }} />
                    تفاصيل المشروع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: "var(--ma3k-beige)" }}>الغرض من الموقع</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="مثال: تعليم البرمجة للمبتدئين" 
                              {...field} 
                              className="glass-input"
                              data-testid="input-purpose"
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
                          <FormLabel style={{ color: "var(--ma3k-beige)" }}>نوع الجمهور المستهدف</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="مثال: طلاب الجامعات" 
                              {...field} 
                              className="glass-input"
                              data-testid="input-target-audience"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: "var(--ma3k-beige)" }}>الميزانية المتوقعة للمشروع</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="glass-input" data-testid="select-budget">
                                <SelectValue placeholder="اختر الميزانية" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="500-1000">500 - 1000 ر.س</SelectItem>
                              <SelectItem value="1000-2500">1000 - 2500 ر.س</SelectItem>
                              <SelectItem value="2500-5000">2500 - 5000 ر.س</SelectItem>
                              <SelectItem value="5000-10000">5000 - 10000 ر.س</SelectItem>
                              <SelectItem value="10000+">أكثر من 10000 ر.س</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="designType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: "var(--ma3k-beige)" }}>التصميم المطلوب</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="glass-input" data-testid="select-design">
                                <SelectValue placeholder="اختر نوع التصميم" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="modern">تصميم عصري</SelectItem>
                              <SelectItem value="classic">تصميم كلاسيكي</SelectItem>
                              <SelectItem value="minimal">تصميم بسيط</SelectItem>
                              <SelectItem value="colorful">تصميم ملون</SelectItem>
                              <SelectItem value="professional">تصميم احترافي</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" style={{ color: "var(--ma3k-beige)" }}>
                    <BookOpen className="w-6 h-6" style={{ color: "var(--ma3k-teal)" }} />
                    الوظائف والأقسام
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label style={{ color: "var(--ma3k-beige)" }}>الوظائف المطلوبة</Label>
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="mainFunction1"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="الوظيفة 1 (مطلوب)" 
                                {...field} 
                                className="glass-input"
                                data-testid="input-function-1"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mainFunction2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="الوظيفة 2 (اختياري)" 
                                {...field} 
                                className="glass-input"
                                data-testid="input-function-2"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mainFunction3"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="الوظيفة 3 (اختياري)" 
                                {...field} 
                                className="glass-input"
                                data-testid="input-function-3"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator className="opacity-20" />
                  
                  <div className="space-y-4">
                    <Label style={{ color: "var(--ma3k-beige)" }}>الأقسام الرئيسية المطلوبة في الموقع</Label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <FormField
                          key={num}
                          control={form.control}
                          name={`mainSection${num}` as keyof EducationalFormData}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder={`القسم ${num} ${num > 1 ? '(اختياري)' : '(مطلوب)'}`}
                                  {...field}
                                  value={field.value as string || ''}
                                  className="glass-input"
                                  data-testid={`input-section-${num}`}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" style={{ color: "var(--ma3k-beige)" }}>
                    <Globe className="w-6 h-6" style={{ color: "var(--ma3k-teal)" }} />
                    الأجهزة واللغات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="deviceSupport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: "var(--ma3k-beige)" }}>الأجهزة المطلوبة لدعم التصميم</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="glass-input" data-testid="select-devices">
                              <SelectValue placeholder="اختر الأجهزة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">جميع الأجهزة (كمبيوتر، تابلت، جوال)</SelectItem>
                            <SelectItem value="desktop-mobile">كمبيوتر وجوال فقط</SelectItem>
                            <SelectItem value="mobile-only">جوال فقط</SelectItem>
                            <SelectItem value="desktop-only">كمبيوتر فقط</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="languages"
                    render={() => (
                      <FormItem>
                        <FormLabel style={{ color: "var(--ma3k-beige)" }}>اللغات التي تحتاجها</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                          {availableLanguages.map((lang) => (
                            <FormField
                              key={lang.code}
                              control={form.control}
                              name="languages"
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(lang.code)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, lang.code]);
                                        } else {
                                          field.onChange(current.filter((v) => v !== lang.code));
                                        }
                                      }}
                                      data-testid={`checkbox-lang-${lang.code}`}
                                    />
                                  </FormControl>
                                  <Label 
                                    className="text-sm cursor-pointer"
                                    style={{ color: "var(--ma3k-beige-dark)" }}
                                  >
                                    {lang.name}
                                  </Label>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" style={{ color: "var(--ma3k-beige)" }}>
                    <Video className="w-6 h-6" style={{ color: "var(--ma3k-teal)" }} />
                    نوع المحتوى المطلوب
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="contentTypes"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {contentTypeOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="contentTypes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div 
                                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        field.value?.includes(option.id) 
                                          ? 'border-[var(--ma3k-green)] bg-[var(--ma3k-green)]/10' 
                                          : 'border-transparent bg-white/5'
                                      }`}
                                      onClick={() => {
                                        const current = field.value || [];
                                        if (current.includes(option.id)) {
                                          field.onChange(current.filter((v) => v !== option.id));
                                        } else {
                                          field.onChange([...current, option.id]);
                                        }
                                      }}
                                      data-testid={`option-content-${option.id}`}
                                    >
                                      <option.icon 
                                        className="w-8 h-8 mx-auto mb-2" 
                                        style={{ color: field.value?.includes(option.id) ? "var(--ma3k-green)" : "var(--ma3k-beige-dark)" }}
                                      />
                                      <p 
                                        className="text-center text-sm"
                                        style={{ color: "var(--ma3k-beige)" }}
                                      >
                                        {option.label}
                                      </p>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" style={{ color: "var(--ma3k-beige)" }}>
                    <Award className="w-6 h-6" style={{ color: "var(--ma3k-teal)" }} />
                    المميزات والأهداف
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="additionalFeatures"
                    render={() => (
                      <FormItem>
                        <FormLabel style={{ color: "var(--ma3k-beige)" }}>مميزات إضافية مطلوبة</FormLabel>
                        <div className="space-y-3 mt-2">
                          {additionalFeatureOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="additionalFeatures"
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-3">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, option.id]);
                                        } else {
                                          field.onChange(current.filter((v) => v !== option.id));
                                        }
                                      }}
                                      data-testid={`checkbox-feature-${option.id}`}
                                    />
                                  </FormControl>
                                  <Label 
                                    className="cursor-pointer"
                                    style={{ color: "var(--ma3k-beige-dark)" }}
                                  >
                                    {option.label}
                                  </Label>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="opacity-20" />
                  
                  <FormField
                    control={form.control}
                    name="mainGoals"
                    render={() => (
                      <FormItem>
                        <FormLabel style={{ color: "var(--ma3k-beige)" }}>الأهداف الأساسية للموقع</FormLabel>
                        <div className="space-y-3 mt-2">
                          {goalOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="mainGoals"
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-3">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, option.id]);
                                        } else {
                                          field.onChange(current.filter((v) => v !== option.id));
                                        }
                                      }}
                                      data-testid={`checkbox-goal-${option.id}`}
                                    />
                                  </FormControl>
                                  <Label 
                                    className="cursor-pointer"
                                    style={{ color: "var(--ma3k-beige-dark)" }}
                                  >
                                    {option.label}
                                  </Label>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" style={{ color: "var(--ma3k-beige)" }}>
                    <Clock className="w-6 h-6" style={{ color: "var(--ma3k-teal)" }} />
                    الدعم الفني والمحتوى التفاعلي
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="techSupport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: "var(--ma3k-beige)" }}>نوع الدعم الفني المطلوب</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="glass-input" data-testid="select-support">
                              <SelectValue placeholder="اختر نوع الدعم" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="continuous">دعم مستمر</SelectItem>
                            <SelectItem value="on-demand">دعم عند الطلب</SelectItem>
                            <SelectItem value="none">لا حاجة لدعم فني</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interactiveContent"
                    render={() => (
                      <FormItem>
                        <FormLabel style={{ color: "var(--ma3k-beige)" }}>احتمالات للمحتوى التفاعلي</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                          {interactiveContentOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="interactiveContent"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div 
                                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        field.value?.includes(option.id) 
                                          ? 'border-[var(--ma3k-green)] bg-[var(--ma3k-green)]/10' 
                                          : 'border-transparent bg-white/5'
                                      }`}
                                      onClick={() => {
                                        const current = field.value || [];
                                        if (current.includes(option.id)) {
                                          field.onChange(current.filter((v) => v !== option.id));
                                        } else {
                                          field.onChange([...current, option.id]);
                                        }
                                      }}
                                      data-testid={`option-interactive-${option.id}`}
                                    >
                                      <option.icon 
                                        className="w-8 h-8 mx-auto mb-2" 
                                        style={{ color: field.value?.includes(option.id) ? "var(--ma3k-green)" : "var(--ma3k-beige-dark)" }}
                                      />
                                      <p 
                                        className="text-center text-sm"
                                        style={{ color: "var(--ma3k-beige)" }}
                                      >
                                        {option.label}
                                      </p>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" style={{ color: "var(--ma3k-beige)" }}>
                    <Trophy className="w-6 h-6" style={{ color: "var(--ma3k-teal)" }} />
                    خيارات إضافية حسب النشاط
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="extraOptions"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {extraOptionsList.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="extraOptions"
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-3">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, option.id]);
                                        } else {
                                          field.onChange(current.filter((v) => v !== option.id));
                                        }
                                      }}
                                      data-testid={`checkbox-extra-${option.id}`}
                                    />
                                  </FormControl>
                                  <Label 
                                    className="cursor-pointer text-sm"
                                    style={{ color: "var(--ma3k-beige-dark)" }}
                                  >
                                    {option.label}
                                  </Label>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="glass-card rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" style={{ color: "var(--ma3k-beige)" }}>
                    <MessageSquare className="w-6 h-6" style={{ color: "var(--ma3k-teal)" }} />
                    طريقة التسليم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="deliveryMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: "var(--ma3k-beige)" }}>
                          تريد أن يتم إرسال خطط موقعك على البريد الإلكتروني أم على الواتس آب؟
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row gap-4 mt-4"
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="email" id="email" data-testid="radio-email" />
                              <Label 
                                htmlFor="email" 
                                className="flex items-center gap-2 cursor-pointer"
                                style={{ color: "var(--ma3k-beige)" }}
                              >
                                <Mail className="w-5 h-5" style={{ color: "var(--ma3k-teal)" }} />
                                البريد الإلكتروني
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="whatsapp" id="whatsapp" data-testid="radio-whatsapp" />
                              <Label 
                                htmlFor="whatsapp" 
                                className="flex items-center gap-2 cursor-pointer"
                                style={{ color: "var(--ma3k-beige)" }}
                              >
                                <MessageSquare className="w-5 h-5" style={{ color: "var(--ma3k-green)" }} />
                                الواتس آب
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="text-lg px-12 py-6"
                  style={{
                    background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                    color: "white"
                  }}
                  data-testid="button-submit-form"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin ml-2">⏳</span>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6 ml-2" />
                      إرسال الطلب
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
