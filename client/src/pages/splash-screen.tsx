import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

export default function SplashScreen() {
  const [showContent, setShowContent] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate('/welcome');
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="mb-8"
        >
          <div className="relative">
            {/* Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-32 h-32 mx-auto border-4 border-transparent border-t-amber-400 border-r-purple-400 rounded-full"
            />
            
            {/* Inner Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 w-28 h-28 mx-auto border-2 border-transparent border-b-blue-400 border-l-pink-400 rounded-full"
            />

            {/* Logo */}
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-400 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-3xl font-bold text-white"
              >
                معك
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Welcome Text */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="inline-block"
              >
                مرحباً
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="inline-block bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent"
              >
                بك
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-xl md:text-2xl text-purple-200 font-medium"
            >
              في عالمنا الرقمي
            </motion.p>

            {/* Creative Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex justify-center space-x-4 mt-8"
            >
              {['🌟', '✨', '💎', '🚀'].map((emoji, index) => (
                <motion.div
                  key={index}
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    delay: index * 0.2, 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                  className="text-3xl"
                >
                  {emoji}
                </motion.div>
              ))}
            </motion.div>

            {/* Loading Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.5, duration: 1.5 }}
              className="h-1 bg-gradient-to-r from-amber-400 via-purple-500 to-blue-500 rounded-full mt-8 mx-auto max-w-xs"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}