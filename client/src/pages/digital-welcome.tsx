import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Code, Palette, Rocket } from "lucide-react";

export default function DigitalWelcome() {
  const [, setLocation] = useLocation();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    const redirectTimer = setTimeout(() => {
      setLocation("/");
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [setLocation]);

  const floatingIcons = [
    { Icon: Code, delay: 0, x: "10%", y: "20%" },
    { Icon: Palette, delay: 0.2, x: "80%", y: "30%" },
    { Icon: Rocket, delay: 0.4, x: "15%", y: "70%" },
    { Icon: Sparkles, delay: 0.6, x: "85%", y: "75%" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--ma3k-teal) 0%, transparent 70%)",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--ma3k-green) 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--ma3k-beige) 0%, transparent 70%)",
            animation: "float 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* أيقونات عائمة */}
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-ma3k-teal opacity-20"
          style={{ left: x, top: y }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 3,
            delay: delay,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Icon size={48} />
        </motion.div>
      ))}

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 text-center px-4">
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* النص الرئيسي */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 
                className="hero-text font-black mb-4"
                style={{
                  background: "linear-gradient(135deg, var(--ma3k-teal) 0%, var(--ma3k-green) 50%, var(--ma3k-beige) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                مرحباً
              </h1>
              <h2 className="luxury-h1 font-bold text-ma3k-beige mb-2">
                إلى العالم الرقمي
              </h2>
            </motion.div>

            {/* خط الزينة */}
            <motion.div
              className="flex items-center justify-center gap-4"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div 
                className="h-1 flex-1 rounded-full"
                style={{
                  background: "linear-gradient(to right, transparent, var(--ma3k-teal), transparent)"
                }}
                animate={{
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
              <Sparkles className="text-ma3k-green" size={24} />
              <motion.div 
                className="h-1 flex-1 rounded-full"
                style={{
                  background: "linear-gradient(to left, transparent, var(--ma3k-green), transparent)"
                }}
                animate={{
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            </motion.div>

            {/* شعار فرعي */}
            <motion.p
              className="text-xl md:text-2xl text-ma3k-beige-dark font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              حيث تبدأ أحلامك الرقمية بالتحقق
            </motion.p>

            {/* شريط التحميل */}
            <motion.div
              className="max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="h-2 bg-ma3k-dark rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, var(--ma3k-teal), var(--ma3k-green))"
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, delay: 1 }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
