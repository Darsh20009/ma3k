import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, GraduationCap, Briefcase, Users, ArrowLeft, Sparkles, Loader2 } from "lucide-react";

type UserType = "student" | "client" | "employee";

interface StudentFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  age: number;
  selectedLanguage: string;
  learningGoal?: string;
}

interface ClientFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  websiteType?: string;
  budget?: string;
  websiteIdea?: string;
}

interface EmployeeFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  position: string;
  jobTitle: string;
  employeeCode: string;
}

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [studentForm, setStudentForm] = useState<StudentFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    age: 18,
    selectedLanguage: "",
    learningGoal: ""
  });

  const [clientForm, setClientForm] = useState<ClientFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    websiteType: "",
    budget: "",
    websiteIdea: ""
  });

  const [employeeForm, setEmployeeForm] = useState<EmployeeFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    position: "",
    jobTitle: "",
    employeeCode: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let endpoint = "";
      let payload: any = {};

      if (userType === "student") {
        if (studentForm.password !== studentForm.confirmPassword) {
          throw new Error("كلمات المرور غير متطابقة");
        }
        if (!studentForm.selectedLanguage) {
          throw new Error("يرجى اختيار لغة البرمجة");
        }
        endpoint = "/api/auth/register-student";
        payload = {
          fullName: studentForm.fullName,
          email: studentForm.email,
          phone: studentForm.phone,
          password: studentForm.password,
          age: studentForm.age,
          selectedLanguage: studentForm.selectedLanguage,
          learningGoal: studentForm.learningGoal || undefined
        };
      } else if (userType === "client") {
        if (clientForm.password !== clientForm.confirmPassword) {
          throw new Error("كلمات المرور غير متطابقة");
        }
        endpoint = "/api/auth/register-client";
        payload = {
          fullName: clientForm.fullName,
          email: clientForm.email,
          phone: clientForm.phone || undefined,
          password: clientForm.password,
          websiteType: clientForm.websiteType || undefined,
          budget: clientForm.budget || undefined,
          websiteIdea: clientForm.websiteIdea || undefined
        };
      } else if (userType === "employee") {
        if (employeeForm.password !== employeeForm.confirmPassword) {
          throw new Error("كلمات المرور غير متطابقة");
        }
        if (!employeeForm.employeeCode) {
          throw new Error("يرجى إدخال رمز الموظف");
        }
        endpoint = "/api/auth/register-employee";
        payload = {
          fullName: employeeForm.fullName,
          email: employeeForm.email,
          password: employeeForm.password,
          position: employeeForm.position,
          jobTitle: employeeForm.jobTitle,
          employeeCode: employeeForm.employeeCode
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل إنشاء الحساب");
      }

      toast({
        title: "تم إنشاء الحساب بنجاح!",
        description: "يمكنك الآن تسجيل الدخول",
      });
      setLocation("/login");
    } catch (error: any) {
      toast({
        title: "فشل التسجيل",
        description: error.message || "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userTypes = [
    {
      id: "student" as UserType,
      title: "طالب",
      description: "للتسجيل في الدورات التدريبية",
      icon: GraduationCap,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "client" as UserType,
      title: "عميل",
      description: "لطلب المشاريع والخدمات",
      icon: Briefcase,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "employee" as UserType,
      title: "موظف",
      description: "لإدارة المهام والمشاريع",
      icon: Users,
      color: "from-green-500 to-green-600"
    }
  ];

  const programmingLanguages = [
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "frontend", label: "Front-End (HTML, CSS, JS)" },
    { value: "backend", label: "Back-End (Node.js)" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black opacity-90" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            انضم إلى معك
          </h1>
          <p className="text-xl text-white/80 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            ابدأ رحلتك الرقمية معنا
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!userType ? (
            <motion.div
              key="type-selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6"
            >
              {userTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className="cursor-pointer h-full bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all"
                      onClick={() => setUserType(type.id)}
                      data-testid={`card-usertype-${type.id}`}
                    >
                      <CardHeader className="text-center">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl text-white">{type.title}</CardTitle>
                        <CardDescription className="text-white/70">
                          {type.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="registration-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto"
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setUserType(null)}
                      className="text-white hover:bg-white/20"
                      data-testid="button-back"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <CardTitle className="text-2xl text-white">
                      {userTypes.find(t => t.id === userType)?.title}
                    </CardTitle>
                  </div>
                  <Separator className="bg-white/20" />
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {userType === "student" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-white">الاسم الكامل</Label>
                          <Input
                            id="fullName"
                            required
                            value={studentForm.fullName}
                            onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="أدخل اسمك الكامل"
                            data-testid="input-fullname"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={studentForm.email}
                            onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="example@email.com"
                            data-testid="input-email"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-white">رقم الهاتف</Label>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            value={studentForm.phone}
                            onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="+966 5XXXXXXXX"
                            data-testid="input-phone"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="age" className="text-white">العمر</Label>
                          <Input
                            id="age"
                            type="number"
                            required
                            min="13"
                            max="120"
                            value={studentForm.age}
                            onChange={(e) => setStudentForm({ ...studentForm, age: parseInt(e.target.value) || 18 })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="أدخل عمرك"
                            data-testid="input-age"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="language" className="text-white">لغة البرمجة المفضلة</Label>
                          <Select 
                            value={studentForm.selectedLanguage} 
                            onValueChange={(value) => setStudentForm({ ...studentForm, selectedLanguage: value })}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-language">
                              <SelectValue placeholder="اختر لغة البرمجة" />
                            </SelectTrigger>
                            <SelectContent>
                              {programmingLanguages.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                  {lang.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="learningGoal" className="text-white">هدفك من التعلم (اختياري)</Label>
                          <Input
                            id="learningGoal"
                            value={studentForm.learningGoal}
                            onChange={(e) => setStudentForm({ ...studentForm, learningGoal: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="مثال: أريد أن أصبح مطور ويب"
                            data-testid="input-learninggoal"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-white">كلمة المرور</Label>
                          <Input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            value={studentForm.password}
                            onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="6 أحرف على الأقل"
                            data-testid="input-password"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-white">تأكيد كلمة المرور</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            required
                            value={studentForm.confirmPassword}
                            onChange={(e) => setStudentForm({ ...studentForm, confirmPassword: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="أعد إدخال كلمة المرور"
                            data-testid="input-confirmpassword"
                          />
                        </div>
                      </>
                    )}

                    {userType === "client" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-white">الاسم الكامل</Label>
                          <Input
                            id="fullName"
                            required
                            value={clientForm.fullName}
                            onChange={(e) => setClientForm({ ...clientForm, fullName: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="أدخل اسمك الكامل"
                            data-testid="input-fullname"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={clientForm.email}
                            onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="example@email.com"
                            data-testid="input-email"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-white">رقم الهاتف (اختياري)</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={clientForm.phone}
                            onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="+966 5XXXXXXXX"
                            data-testid="input-phone"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="websiteType" className="text-white">نوع الموقع المطلوب (اختياري)</Label>
                          <Select 
                            value={clientForm.websiteType} 
                            onValueChange={(value) => setClientForm({ ...clientForm, websiteType: value })}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-websitetype">
                              <SelectValue placeholder="اختر نوع الموقع" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="personal">موقع شخصي</SelectItem>
                              <SelectItem value="business">موقع شركة</SelectItem>
                              <SelectItem value="ecommerce">متجر إلكتروني</SelectItem>
                              <SelectItem value="restaurant">موقع مطعم</SelectItem>
                              <SelectItem value="portfolio">معرض أعمال</SelectItem>
                              <SelectItem value="other">أخرى</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-white">كلمة المرور</Label>
                          <Input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            value={clientForm.password}
                            onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="6 أحرف على الأقل"
                            data-testid="input-password"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-white">تأكيد كلمة المرور</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            required
                            value={clientForm.confirmPassword}
                            onChange={(e) => setClientForm({ ...clientForm, confirmPassword: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="أعد إدخال كلمة المرور"
                            data-testid="input-confirmpassword"
                          />
                        </div>
                      </>
                    )}

                    {userType === "employee" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-white">الاسم الكامل</Label>
                          <Input
                            id="fullName"
                            required
                            value={employeeForm.fullName}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="أدخل اسمك الكامل"
                            data-testid="input-fullname"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={employeeForm.email}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="example@email.com"
                            data-testid="input-email"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="position" className="text-white">المنصب</Label>
                          <Select 
                            value={employeeForm.position} 
                            onValueChange={(value) => setEmployeeForm({ ...employeeForm, position: value })}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-position">
                              <SelectValue placeholder="اختر المنصب" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="developer">مطور</SelectItem>
                              <SelectItem value="designer">مصمم</SelectItem>
                              <SelectItem value="manager">مدير</SelectItem>
                              <SelectItem value="support">دعم فني</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="jobTitle" className="text-white">المسمى الوظيفي</Label>
                          <Input
                            id="jobTitle"
                            required
                            value={employeeForm.jobTitle}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, jobTitle: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="مثال: مطور واجهات أمامية"
                            data-testid="input-jobtitle"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="employeeCode" className="text-white">رمز الموظف</Label>
                          <Input
                            id="employeeCode"
                            required
                            value={employeeForm.employeeCode}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, employeeCode: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="أدخل الرمز السري"
                            data-testid="input-employeecode"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-white">كلمة المرور</Label>
                          <Input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            value={employeeForm.password}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="6 أحرف على الأقل"
                            data-testid="input-password"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-white">تأكيد كلمة المرور</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            required
                            value={employeeForm.confirmPassword}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, confirmPassword: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="أعد إدخال كلمة المرور"
                            data-testid="input-confirmpassword"
                          />
                        </div>
                      </>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      disabled={isLoading}
                      data-testid="button-submit"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5 ml-2" />
                          إنشاء حساب
                        </>
                      )}
                    </Button>

                    <div className="text-center pt-4">
                      <p className="text-white/70">
                        لديك حساب بالفعل؟{" "}
                        <button
                          type="button"
                          onClick={() => setLocation("/login")}
                          className="text-purple-400 hover:text-purple-300 underline"
                          data-testid="link-login"
                        >
                          تسجيل الدخول
                        </button>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
