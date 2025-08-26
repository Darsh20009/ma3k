import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function EmployeeLogin() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    employeeId: "",
    name: ""
  });
  const [showId, setShowId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // التحقق من بيانات الدخول
    if (formData.employeeId === "18082030" && formData.name === "Ma3k") {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة تحكم الموظفين",
      });
      
      // حفظ بيانات الموظف في localStorage
      localStorage.setItem("employee", JSON.stringify({
        id: formData.employeeId,
        name: formData.name,
        loginTime: new Date().toISOString(),
        role: "admin"
      }));
      
      // انتقال إلى لوحة التحكم
      setTimeout(() => {
        window.location.href = "/employee-dashboard";
      }, 1000);
    } else {
      toast({
        title: "خطأ في بيانات الدخول",
        description: "رقم الموظف أو الاسم غير صحيح",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-10 pb-10">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-amber-900/20" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          <div className="glass-card rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Shield className="w-10 h-10 text-black" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-white mb-2">تسجيل دخول الموظفين</h1>
              <p className="text-gray-300 text-sm">مخصص لموظفي شركة معك فقط</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">رقم الموظف *</label>
                <div className="relative">
                  <Input
                    type={showId ? "text" : "password"}
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-800/50 border-gray-600 text-white pl-12 pr-12"
                    placeholder="ادخل رقم الموظف"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowId(!showId)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showId ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">اسم الموظف *</label>
                <div className="relative">
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-800/50 border-gray-600 text-white pl-12"
                    placeholder="ادخل اسم الموظف"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-3"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    جاري التحقق...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    تسجيل الدخول
                  </div>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <Shield className="w-4 h-4" />
                <span className="font-semibold text-sm">تنبيه أمني</span>
              </div>
              <p className="text-red-300 text-xs leading-relaxed">
                هذا القسم مخصص للموظفين المعتمدين فقط. أي محاولة دخول غير مصرح بها سيتم تسجيلها ومتابعتها قانونياً.
              </p>
            </div>

            {/* Help */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-xs">
                في حالة مواجهة مشكلة في الدخول؟
              </p>
              <a
                href="/contact"
                className="text-amber-400 hover:text-amber-300 text-xs underline"
              >
                تواصل مع الدعم التقني
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}