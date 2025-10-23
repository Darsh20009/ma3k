import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { User, GraduationCap, Briefcase, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type UserType = "client" | "student" | "employee";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<UserType>("client");
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isLogin) {
        // تسجيل الدخول
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        if (!response.ok) {
          const error = await response.json();
          toast({
            title: "خطأ في تسجيل الدخول",
            description: error.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
            variant: "destructive"
          });
          return;
        }

        const data = await response.json();
        
        // حفظ بيانات المستخدم في localStorage
        localStorage.setItem("ma3k_user_id", data.user.id);
        localStorage.setItem("ma3k_user_type", data.type);
        localStorage.setItem("ma3k_user_email", data.user.email);
        localStorage.setItem("ma3k_user_name", data.user.fullName);

        toast({
          title: "تم تسجيل الدخول بنجاح! ✨",
          description: `مرحباً ${data.user.fullName}`
        });

        // التوجيه حسب نوع المستخدم
        setTimeout(() => {
          if (data.type === "client") {
            window.location.href = "/my-projects-complete";
          } else if (data.type === "student") {
            window.location.href = "/my-courses-complete";
          } else if (data.type === "employee") {
            window.location.href = "/employee-dashboard";
          } else {
            window.location.href = "/";
          }
        }, 500);
      } else {
        // إنشاء حساب جديد
        const endpoint = activeTab === "client" ? "/api/auth/register-client" : "/api/auth/register-student";
        
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.name,
            email: formData.email,
            password: formData.password
          })
        });

        if (!response.ok) {
          const error = await response.json();
          toast({
            title: "خطأ في إنشاء الحساب",
            description: error.error || "حدث خطأ، يرجى المحاولة مرة أخرى",
            variant: "destructive"
          });
          return;
        }

        const data = await response.json();
        
        toast({
          title: "تم إنشاء الحساب بنجاح! 🎉",
          description: "يمكنك الآن تسجيل الدخول"
        });

        // العودة لوضع تسجيل الدخول
        setIsLogin(true);
        setFormData({ ...formData, password: "", confirmPassword: "" });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const userTypes = [
    {
      id: "client" as UserType,
      label: "العملاء",
      icon: User,
      description: "لإدارة مشاريعك ومواقعك"
    },
    {
      id: "student" as UserType,
      label: "الطلاب",
      icon: GraduationCap,
      description: "للوصول إلى دوراتك التعليمية"
    },
    {
      id: "employee" as UserType,
      label: "الموظفين",
      icon: Briefcase,
      description: "لإدارة المهام والمشاريع"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 pb-20">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <LogIn 
            className="w-20 h-20 mx-auto mb-6"
            style={{ color: "var(--ma3k-green)" }}
          />
          <h1 
            className="text-5xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h1>
          <p 
            className="text-xl"
            style={{ color: "var(--ma3k-beige-dark)" }}
          >
            اختر نوع الحساب للمتابعة
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card p-8 md:p-12 rounded-3xl">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserType)}>
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-ma3k-dark">
                {userTypes.map((type) => (
                  <TabsTrigger 
                    key={type.id}
                    value={type.id}
                    className="data-[state=active]:bg-ma3k-teal data-[state=active]:text-white"
                    data-testid={`tab-${type.id}`}
                  >
                    <type.icon className="w-5 h-5 ml-2" />
                    {type.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {userTypes.map((type) => (
                <TabsContent key={type.id} value={type.id}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="text-center mb-8">
                      <type.icon 
                        className="w-16 h-16 mx-auto mb-4"
                        style={{ color: "var(--ma3k-green)" }}
                      />
                      <h3 
                        className="text-2xl font-bold mb-2"
                        style={{ color: "var(--ma3k-beige)" }}
                      >
                        {type.label}
                      </h3>
                      <p style={{ color: "var(--ma3k-beige-dark)" }}>
                        {type.description}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {!isLogin && (
                        <div className="space-y-2">
                          <Label 
                            htmlFor="name"
                            style={{ color: "var(--ma3k-beige)" }}
                          >
                            الاسم الكامل
                          </Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-ma3k-dark border-ma3k-teal"
                            placeholder="أدخل اسمك الكامل"
                            data-testid="input-name"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label 
                          htmlFor="email"
                          style={{ color: "var(--ma3k-beige)" }}
                        >
                          البريد الإلكتروني
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-ma3k-dark border-ma3k-teal"
                          placeholder="example@email.com"
                          data-testid="input-email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label 
                          htmlFor="password"
                          style={{ color: "var(--ma3k-beige)" }}
                        >
                          كلمة المرور
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="bg-ma3k-dark border-ma3k-teal"
                          placeholder="••••••••"
                          data-testid="input-password"
                        />
                      </div>

                      {!isLogin && (
                        <div className="space-y-2">
                          <Label 
                            htmlFor="confirmPassword"
                            style={{ color: "var(--ma3k-beige)" }}
                          >
                            تأكيد كلمة المرور
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="bg-ma3k-dark border-ma3k-teal"
                            placeholder="••••••••"
                            data-testid="input-confirm-password"
                          />
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full py-6 text-lg font-bold rounded-full"
                        style={{
                          background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                          color: "white"
                        }}
                        data-testid="button-submit"
                      >
                        {isLogin ? (
                          <>
                            <LogIn className="w-5 h-5 ml-2" />
                            تسجيل الدخول
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-5 h-5 ml-2" />
                            إنشاء حساب
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="text-center mt-6">
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm hover:underline"
                        style={{ color: "var(--ma3k-green)" }}
                        data-testid="button-toggle-mode"
                      >
                        {isLogin ? "ليس لديك حساب؟ إنشاء حساب جديد" : "لديك حساب؟ تسجيل الدخول"}
                      </button>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </motion.div>

        {/* ملاحظة */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <p 
            className="text-sm"
            style={{ color: "var(--ma3k-beige-dark)" }}
          >
            💡 <strong>ملاحظة:</strong> يتم حفظ بيانات كل نوع مستخدم في ملفات منفصلة لضمان الأمان والخصوصية
          </p>
        </motion.div>
      </div>
    </div>
  );
}
