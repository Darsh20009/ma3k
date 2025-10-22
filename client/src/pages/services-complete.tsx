import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Rocket,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Globe,
  Store,
  Utensils,
  User,
  Building2,
  Sparkles
} from "lucide-react";
import type { Service } from "@shared/schema";

type QuestionnaireStep = {
  websiteType: string;
  budget: string;
  websiteIdea: string;
};

type ClientRegistrationStep = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

export default function ServicesComplete() {
  const [currentStep, setCurrentStep] = useState<"questionnaire" | "service" | "register" | "checkout">("questionnaire");
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireStep>({
    websiteType: "",
    budget: "",
    websiteIdea: ""
  });
  const [registrationData, setRegistrationData] = useState<ClientRegistrationStep>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const websiteTypes = [
    { id: "restaurant", name: "مطعم", icon: Utensils },
    { id: "platform", name: "منصة", icon: Globe },
    { id: "store", name: "متجر", icon: Store },
    { id: "personal", name: "موقع شخصي", icon: User },
    { id: "business", name: "أعمال", icon: Building2 },
    { id: "other", name: "آخر", icon: Sparkles }
  ];

  const budgetOptions = [
    { id: "yes", name: "نعم، لدي ميزانية محددة" },
    { id: "no", name: "لا، أريد التعرف على الأسعار" }
  ];

  const handleQuestionnaireSubmit = () => {
    if (!questionnaireData.websiteType || !questionnaireData.budget || !questionnaireData.websiteIdea) {
      toast({
        title: "خطأ",
        description: "يرجى إكمال جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem("ma3k_questionnaire", JSON.stringify(questionnaireData));
    
    const recommendedService = services.find(s => 
      s.category?.includes(questionnaireData.websiteType) || 
      (questionnaireData.websiteType === "personal" && s.subcategory === "basic") ||
      (questionnaireData.websiteType === "business" && s.subcategory === "pro")
    ) || services[0];
    
    setSelectedService(recommendedService);
    setCurrentStep("service");
  };

  const handleAddToCart = () => {
    if (selectedService) {
      addToCart(selectedService);
      const isLoggedIn = localStorage.getItem("ma3k_client_auth");
      
      if (isLoggedIn) {
        setLocation("/cart");
      } else {
        setCurrentStep("register");
      }
    }
  };

  const handleRegistration = async () => {
    if (!registrationData.fullName || !registrationData.email || !registrationData.password) {
      toast({
        title: "خطأ",
        description: "يرجى إكمال جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (registrationData.password !== registrationData.confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive"
      });
      return;
    }

    const clientData = {
      ...registrationData,
      ...questionnaireData,
      registeredAt: new Date().toISOString()
    };
    
    localStorage.setItem("ma3k_client_auth", JSON.stringify(clientData));
    
    toast({
      title: "تم التسجيل بنجاح! 🎉",
      description: "مرحباً بك في معك",
    });

    setCurrentStep("checkout");
  };

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === "MA3K2030") {
      setAppliedDiscount(100);
      toast({
        title: "تم تطبيق كود الخصم! 🎉",
        description: "خصم 100% - الخدمة مجانية!",
      });
    } else {
      toast({
        title: "كود غير صحيح",
        description: "يرجى التحقق من كود الخصم",
        variant: "destructive"
      });
    }
  };

  const calculateFinalPrice = () => {
    if (!selectedService) return 0;
    const price = selectedService.price;
    if (appliedDiscount >= 100) return 0;
    return Math.round(price - (price * appliedDiscount / 100));
  };

  const handleProceedToPayment = () => {
    if (!selectedService) return;

    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const invoice = {
      invoiceNumber,
      websiteIdea: questionnaireData.websiteIdea,
      service: selectedService.name,
      originalPrice: selectedService.price,
      discount: appliedDiscount,
      finalPrice: calculateFinalPrice(),
      clientData: registrationData,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(`ma3k_invoice_${invoiceNumber}`, JSON.stringify(invoice));

    const message = `
مرحباً! 👋

رقم الفاتورة: ${invoiceNumber}
الخدمة: ${selectedService.name}
فكرة الموقع: ${questionnaireData.websiteIdea}
السعر الأصلي: ${selectedService.price} ريال
${appliedDiscount > 0 ? `الخصم: ${appliedDiscount}%\nالسعر النهائي: ${calculateFinalPrice()} ريال` : ''}

الاسم: ${registrationData.fullName}
البريد: ${registrationData.email}
الهاتف: ${registrationData.phone}
    `.trim();

    const whatsappUrl = `https://wa.me/+201155201921?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "تم إرسال الفاتورة! ✨",
      description: "سنتواصل معك قريباً على واتساب",
    });

    setTimeout(() => {
      setLocation("/payment");
    }, 2000);
  };

  return (
    <div className="min-h-screen royal-gradient pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <AnimatePresence mode="wait">
          {currentStep === "questionnaire" && (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="glass-card border-2 border-green-500/20" data-testid="questionnaire-card">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center green-glow">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-green-400">
                    حدد احتياجاتك
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-300">
                    دعنا نفهم مشروعك لنقدم لك أفضل حل
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-white text-lg mb-3 block">نوع الموقع</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {websiteTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setQuestionnaireData(prev => ({ ...prev, websiteType: type.id }))}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            questionnaireData.websiteType === type.id
                              ? "border-green-500 bg-green-500/20 green-glow"
                              : "border-gray-600 hover:border-green-400/50"
                          }`}
                          data-testid={`website-type-${type.id}`}
                        >
                          <type.icon className="w-8 h-8 mx-auto mb-2 text-green-400" />
                          <span className="text-white text-sm font-medium">{type.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-white text-lg mb-3 block">هل لديك ميزانية محددة؟</Label>
                    <RadioGroup 
                      value={questionnaireData.budget}
                      onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, budget: value }))}
                    >
                      {budgetOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2 space-x-reverse p-3 rounded-lg hover:bg-green-500/10">
                          <RadioGroupItem value={option.id} id={option.id} data-testid={`budget-${option.id}`} />
                          <Label htmlFor={option.id} className="text-white cursor-pointer flex-1">
                            {option.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="websiteIdea" className="text-white text-lg mb-3 block">
                      فكرة موقعك
                    </Label>
                    <Textarea
                      id="websiteIdea"
                      value={questionnaireData.websiteIdea}
                      onChange={(e) => setQuestionnaireData(prev => ({ ...prev, websiteIdea: e.target.value }))}
                      placeholder="اشرح لنا فكرتك..."
                      className="min-h-[120px] bg-gray-800/50 border-gray-600 text-white"
                      data-testid="input-website-idea"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleQuestionnaireSubmit}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-6 text-lg green-glow"
                    data-testid="button-submit-questionnaire"
                  >
                    التالي <ArrowLeft className="mr-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {currentStep === "service" && selectedService && (
            <motion.div
              key="service"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="glass-card border-2 border-green-500/20" data-testid="service-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentStep("questionnaire")}
                      className="text-green-400"
                      data-testid="button-back-to-questionnaire"
                    >
                      <ArrowRight className="ml-2" /> رجوع
                    </Button>
                  </div>
                  <CardTitle className="text-3xl font-bold text-green-400 text-center mt-4">
                    الخطة الموصى بها
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30">
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedService.name}</h3>
                    <p className="text-gray-300 mb-4">{selectedService.description}</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-green-400">{selectedService.price}</span>
                      <span className="text-xl text-gray-400">ريال</span>
                    </div>
                    {selectedService.features && (
                      <ul className="space-y-2">
                        {selectedService.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-300">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-6 text-lg green-glow"
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="ml-2" /> إضافة إلى السلة
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {currentStep === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="glass-card border-2 border-green-500/20" data-testid="register-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-green-400">
                    إنشاء حساب
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-300">
                    أكمل بياناتك للمتابعة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-white">الاسم الكامل</Label>
                    <Input
                      id="fullName"
                      value={registrationData.fullName}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white mt-2"
                      data-testid="input-fullname"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registrationData.email}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white mt-2"
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={registrationData.phone}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white mt-2"
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-white">كلمة المرور</Label>
                    <Input
                      id="password"
                      type="password"
                      value={registrationData.password}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white mt-2"
                      data-testid="input-password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-white">تأكيد كلمة المرور</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={registrationData.confirmPassword}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white mt-2"
                      data-testid="input-confirm-password"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("service")}
                    className="flex-1"
                    data-testid="button-back-to-service"
                  >
                    <ArrowRight className="ml-2" /> رجوع
                  </Button>
                  <Button
                    onClick={handleRegistration}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold green-glow"
                    data-testid="button-register"
                  >
                    التسجيل <ArrowLeft className="mr-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {currentStep === "checkout" && selectedService && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="glass-card border-2 border-green-500/20" data-testid="checkout-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-green-400">
                    إتمام الطلب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-gray-800/50">
                    <h4 className="text-white font-bold mb-2">ملخص الطلب</h4>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>الخدمة:</span>
                        <span className="font-bold text-white">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>السعر الأصلي:</span>
                        <span>{selectedService.price} ريال</span>
                      </div>
                      {appliedDiscount > 0 && (
                        <>
                          <div className="flex justify-between text-green-400">
                            <span>الخصم:</span>
                            <span>-{appliedDiscount}%</span>
                          </div>
                          <div className="flex justify-between text-2xl font-bold text-green-400">
                            <span>المجموع:</span>
                            <span>{calculateFinalPrice()} ريال</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="discountCode" className="text-white mb-2 block">
                      كود الخصم (اختياري)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="discountCode"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="MA3K2030"
                        className="bg-gray-800/50 border-gray-600 text-white"
                        data-testid="input-discount-code"
                      />
                      <Button
                        onClick={handleApplyDiscount}
                        variant="outline"
                        className="text-green-400 border-green-500"
                        data-testid="button-apply-discount"
                      >
                        تطبيق
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleProceedToPayment}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-6 text-lg green-glow"
                    data-testid="button-proceed-payment"
                  >
                    المتابعة للدفع عبر PayPal
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
