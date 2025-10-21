import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UserPlus, GraduationCap, Briefcase, Users, ArrowLeft, Sparkles } from "lucide-react";

type UserType = "student" | "client" | "employee";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  age?: number;
  company?: string;
  employeeId?: string;
}

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (data.password !== data.confirmPassword) {
        throw new Error("كلمات المرور غير متطابقة");
      }

      let endpoint = "";
      let payload: any = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password
      };

      switch (userType) {
        case "student":
          endpoint = "/api/students";
          payload.age = data.age;
          break;
        case "client":
          endpoint = "/api/clients";
          payload.company = data.company;
          break;
        case "employee":
          endpoint = "/api/employees";
          payload.employeeId = data.employeeId;
          break;
      }

      return await apiRequest(endpoint, "POST", payload);
    },
    onSuccess: () => {
      toast({
        title: "تم إنشاء الحساب بنجاح! ✨",
        description: "يمكنك الآن تسجيل الدخول",
      });
      setLocation("/login");
    },
    onError: (error: Error) => {
      toast({
        title: "فشل التسجيل",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
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

  return (
    <div className="min-h-screen relative overflow-hidden py-20">
      {/* Background Elements */}
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
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-white">الاسم الكامل</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="+966 5XXXXXXXX"
                        data-testid="input-phone"
                      />
                    </div>

                    {userType === "student" && (
                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-white">العمر</Label>
                        <Input
                          id="age"
                          type="number"
                          required
                          min="13"
                          max="120"
                          value={formData.age || ""}
                          onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          placeholder="أدخل عمرك"
                          data-testid="input-age"
                        />
                      </div>
                    )}

                    {userType === "client" && (
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-white">الشركة (اختياري)</Label>
                        <Input
                          id="company"
                          value={formData.company || ""}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          placeholder="اسم الشركة"
                          data-testid="input-company"
                        />
                      </div>
                    )}

                    {userType === "employee" && (
                      <div className="space-y-2">
                        <Label htmlFor="employeeId" className="text-white">رقم الموظف</Label>
                        <Input
                          id="employeeId"
                          required
                          value={formData.employeeId || ""}
                          onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          placeholder="EMP-XXXX"
                          data-testid="input-employeeid"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">كلمة المرور</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="••••••••"
                        data-testid="input-password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white">تأكيد كلمة المرور</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="••••••••"
                        data-testid="input-confirmpassword"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      disabled={registerMutation.isPending}
                      data-testid="button-submit"
                    >
                      {registerMutation.isPending ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
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
