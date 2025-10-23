
import { motion } from "framer-motion";
import { AlertTriangle, Home, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-ma3k-dark to-black" />
      
      {/* دوائر متحركة */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-ma3k-green/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-ma3k-teal/20 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* رقم 404 كبير */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-8"
          >
            <h1 
              className="text-9xl md:text-[200px] font-black mb-4"
              style={{
                background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 80px rgba(16, 185, 129, 0.3)"
              }}
            >
              404
            </motion.div>
          </motion.div>

          {/* أيقونة تحذير متحركة */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <AlertTriangle 
                className="w-24 h-24"
                style={{ color: "var(--ma3k-green)" }}
              />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <Sparkles 
                  className="w-8 h-8"
                  style={{ color: "var(--ma3k-teal)" }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* العنوان */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--ma3k-beige)" }}
          >
            عذراً، الصفحة غير موجودة!
          </motion.h2>

          {/* الوصف */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl mb-8"
            style={{ color: "var(--ma3k-beige-dark)" }}
          >
            يبدو أن الصفحة التي تبحث عنها قد انتقلت أو لم تعد موجودة 🚀
          </motion.p>

          {/* الأزرار */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => setLocation("/")}
              className="group px-8 py-6 text-lg font-bold rounded-full min-w-[200px]"
              style={{
                background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                color: "white",
              }}
            >
              <Home className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
              العودة للرئيسية
            </Button>

            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="px-8 py-6 text-lg font-bold rounded-full min-w-[200px]"
              style={{
                borderColor: "var(--ma3k-green)",
                color: "var(--ma3k-green)",
              }}
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              الرجوع للخلف
            </Button>
          </motion.div>

          {/* رسالة إضافية */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-6 rounded-2xl glass-card"
            style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <p 
              className="text-lg"
              style={{ color: "var(--ma3k-beige)" }}
            >
              💡 <strong>نصيحة:</strong> تحقق من عنوان URL أو استخدم القائمة للتنقل
            </p>
          </motion.div>

          {/* شعار معك في الأسفل */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <div className="flex items-center justify-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-12 h-12 bg-gradient-to-br from-ma3k-teal to-ma3k-green rounded-lg flex items-center justify-center"
              >
                <i className="fas fa-rocket text-white text-2xl"></i>
              </motion.div>
              <span 
                className="text-3xl font-bold"
                style={{
                  background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                معك
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
