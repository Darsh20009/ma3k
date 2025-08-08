import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
  variant?: "primary" | "success" | "accent";
}

export default function ServiceCard({ service, variant = "primary" }: ServiceCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const getIcon = (category: string) => {
    switch (category) {
      case "مواقع وتطبيقات":
        return "fas fa-globe";
      case "هويات وتصميم":
        return "fas fa-paint-brush";
      case "متابعة ودعم":
        return "fas fa-headset";
      case "تجارب تفاعلية وحلول مبتكرة":
        return "fas fa-flask";
      case "مدفوعات ورصيد":
        return "fas fa-credit-card";
      default:
        return "fas fa-cog";
    }
  };

  const getSpecificIcon = (name: string) => {
    if (name.includes("شخصي")) return "fas fa-user";
    if (name.includes("تطبيق")) return "fas fa-mobile-alt";
    if (name.includes("تعليمي")) return "fas fa-graduation-cap";
    if (name.includes("متجر")) return "fas fa-shopping-cart";
    if (name.includes("شعار")) return "fas fa-copyright";
    if (name.includes("مبتدئ")) return "fas fa-star";
    if (name.includes("احترافية")) return "fas fa-crown";
    if (name.includes("خبير")) return "fas fa-gem";
    if (name.includes("اختبارات")) return "fas fa-question-circle";
    if (name.includes("اللامحدود")) return "fas fa-infinity";
    if (name.includes("هدايا")) return "fas fa-gift";
    if (name.includes("محفظة")) return "fas fa-wallet";
    return getIcon(service.category);
  };

  const handleAddToCart = () => {
    addToCart(service);
    toast({
      title: "✅ تم إضافة الخدمة للعربة!",
      description: `تم إضافة "${service.name}" إلى عربة التسوق`,
    });
  };

  const variantClasses = {
    primary: {
      gradient: "gold-gradient",
      icon: "text-yellow-400",
      price: "text-yellow-400",
      button: "btn-luxury",
    },
    success: {
      gradient: "luxury-gradient",
      icon: "text-green-400",
      price: "text-green-400",
      button: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white",
    },
    accent: {
      gradient: "royal-gradient",
      icon: "text-purple-400",
      price: "text-purple-400",
      button: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white",
    },
  };

  const classes = variantClasses[variant];

  return (
    <Card className="luxury-card p-8 rounded-3xl group relative overflow-hidden animate-luxury-float">
      {/* Luxury background effect */}
      <div className={`absolute inset-0 ${classes.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}></div>
      
      <CardContent className="text-center p-0 relative z-10">
        <div className={`w-20 h-20 rounded-full ${classes.gradient} flex items-center justify-center text-black text-3xl mx-auto mb-6 animate-gold-pulse group-hover:scale-110 transition-transform duration-300`}>
          <i className={`${getSpecificIcon(service.name)} animate-luxury-float`}></i>
        </div>
        
        <h4 className="text-2xl font-bold mb-4 animate-text-shimmer group-hover:scale-105 transition-transform text-gray-200">{service.name}</h4>
        
        <p className="text-gray-300 mb-6 leading-relaxed px-2 text-sm">
          {service.description}
        </p>
        
        <div className="luxury-divider mb-6"></div>
        
        <div className={`text-4xl font-bold ${classes.price} mb-8 animate-gold-pulse group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-2xl">💎</span> {service.price} ر.س
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className={`w-full ${classes.button} transition-all duration-300 rounded-2xl font-bold text-lg py-4 hover:scale-105 hover:shadow-2xl animate-luxury-glow`}
        >
          <span className="flex items-center justify-center">
            <span className="ml-2">🛒</span>
            إضافة للعربة
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}
