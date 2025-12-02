import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { User, GraduationCap, Briefcase, LogIn, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

type UserType = "client" | "student" | "employee";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<UserType>("client");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: result.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          variant: "destructive"
        });
        return;
      }

      const userType = localStorage.getItem("ma3k_user_type");
      const userName = localStorage.getItem("ma3k_user_name");

      toast({
        title: "تم تسجيل الدخول بنجاح!",
        description: `مرحباً ${userName}`
      });

      setTimeout(() => {
        if (userType === "client") {
          setLocation("/my-projects-complete");
        } else if (userType === "student") {
          setLocation("/my-courses-complete");
        } else if (userType === "employee") {
          setLocation("/employee-dashboard");
        } else {
          setLocation("/");
        }
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
            تسجيل الدخول
          </h1>
          <p 
            className="text-xl"
            style={{ color: "var(--ma3k-beige-dark)" }}
          >
            أدخل بياناتك للمتابعة
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
                          placeholder="أدخل كلمة المرور"
                          data-testid="input-password"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full py-6 text-lg font-bold rounded-full"
                        style={{
                          background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                          color: "white"
                        }}
                        disabled={isLoading}
                        data-testid="button-submit"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <LogIn className="w-5 h-5 ml-2" />
                            تسجيل الدخول
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="text-center mt-6">
                      <button
                        type="button"
                        onClick={() => setLocation("/register")}
                        className="text-sm hover:underline"
                        style={{ color: "var(--ma3k-green)" }}
                        data-testid="button-register"
                      >
                        ليس لديك حساب؟ إنشاء حساب جديد
                      </button>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </motion.div>

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
            نظام واحد لجميع أنواع المستخدمين - الطلاب والعملاء والموظفين
          </p>
        </motion.div>
      </div>
    </div>
  );
}
