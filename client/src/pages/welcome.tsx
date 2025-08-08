import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Welcome() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      icon: "fas fa-rocket",
      title: "مرحباً بك في معك",
      subtitle: "منصتك الرقمية المتكاملة",
      description: "نحن هنا لتحويل أفكارك إلى واقع رقمي مبتكر باستخدام أحدث التقنيات والحلول الذكية",
      color: "from-blue-500 to-purple-600",
      bgPattern: "cyber-grid"
    },
    {
      icon: "fas fa-magic",
      title: "خدمات متنوعة ومبتكرة",
      subtitle: "كل ما تحتاجه في مكان واحد",
      description: "من تطوير المواقع والتطبيقات إلى التصميم والهويات البصرية، نقدم حلولاً شاملة لجميع احتياجاتك الرقمية",
      color: "from-green-500 to-teal-600",
      bgPattern: "gradient-bg"
    },
    {
      icon: "fas fa-tools",
      title: "أدوات مطور احترافية",
      subtitle: "أدوات مجانية لتسهيل عملك",
      description: "استفد من مجموعة أدواتنا المتقدمة لدمج وتفكيك الأكواد والمزيد من الأدوات التطويرية المفيدة",
      color: "from-orange-500 to-red-600",
      bgPattern: "neon-glow"
    },
    {
      icon: "fas fa-star",
      title: "ابدأ رحلتك الرقمية",
      subtitle: "جاهز للانطلاق؟",
      description: "اختر خدمتك أو تصفح أعمالنا أو تواصل معنا مباشرة. رحلتك الرقمية تبدأ من هنا!",
      color: "from-purple-500 to-pink-600",
      bgPattern: "glass-effect"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToMain = () => {
    setLocation("/");
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated Background */}
      <div className={`absolute inset-0 ${currentStepData.bgPattern} opacity-20 transition-all duration-1000`}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-bounce-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className={`max-w-4xl w-full bg-card/80 backdrop-blur border-primary/20 neon-glow transition-all duration-1000 ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <CardContent className="p-12 text-center">
            {/* Step Indicator */}
            <div className="flex justify-center mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                    index === currentStep ? 'bg-primary scale-125' : 'bg-muted'
                  }`}
                ></div>
              ))}
            </div>

            {/* Icon */}
            <div className="mb-8 animate-fade-in-down">
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${currentStepData.color} flex items-center justify-center neon-glow animate-pulse-slow`}>
                <i className={`${currentStepData.icon} text-4xl text-white`}></i>
              </div>
            </div>

            {/* Content */}
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className={`bg-gradient-to-r ${currentStepData.color} bg-clip-text text-transparent`}>
                  {currentStepData.title}
                </span>
              </h1>
              
              <h2 className="text-2xl text-muted-foreground mb-6">
                {currentStepData.subtitle}
              </h2>
              
              <p className="text-lg text-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                {currentStepData.description}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 animate-fade-in-up">
              {currentStep > 0 && (
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  className="px-8 py-3 hover:scale-105 transition-all duration-300"
                >
                  <i className="fas fa-arrow-right ml-2"></i>
                  السابق
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button 
                  onClick={nextStep}
                  className={`px-8 py-3 bg-gradient-to-r ${currentStepData.color} hover:scale-105 transition-all duration-300 neon-glow`}
                >
                  التالي
                  <i className="fas fa-arrow-left mr-2"></i>
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button 
                    onClick={() => setLocation("/services")}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:scale-105 transition-all duration-300 neon-glow"
                  >
                    <i className="fas fa-shopping-bag ml-2"></i>
                    تصفح الخدمات
                  </Button>
                  <Button 
                    onClick={() => setLocation("/portfolio")}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 transition-all duration-300 neon-glow"
                  >
                    <i className="fas fa-eye ml-2"></i>
                    معرض الأعمال
                  </Button>
                </div>
              )}
            </div>

            {/* Skip Button */}
            <div className="mt-8">
              <Button 
                variant="ghost" 
                onClick={skipToMain}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <i className="fas fa-times ml-2"></i>
                تخطي وانتقل للموقع مباشرة
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${currentStepData.color} h-2 rounded-full transition-all duration-500 neon-glow`}
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                خطوة {currentStep + 1} من {steps.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-10">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-sm">م</span>
          </div>
          <span className="text-sm">معك © 2025 - منصتك الرقمية المتكاملة</span>
        </div>
      </div>
    </div>
  );
}