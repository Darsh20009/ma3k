import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
  onOrder: (service: Service) => void;
  variant?: "primary" | "success" | "accent";
}

export default function ServiceCard({ service, onOrder, variant = "primary" }: ServiceCardProps) {
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

  const variantClasses = {
    primary: {
      border: "border-t-4 border-blue-500 ring-2 ring-blue-100",
      icon: "text-blue-500",
      price: "text-blue-600",
      button: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    },
    success: {
      border: "border-t-4 border-green-500 ring-2 ring-green-100",
      icon: "text-green-500",
      price: "text-green-600",
      button: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    },
    accent: {
      border: "border-t-4 border-purple-500 ring-2 ring-purple-100",
      icon: "text-purple-500",
      price: "text-purple-600",
      button: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    },
  };

  const classes = variantClasses[variant];

  return (
    <Card className={`service-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 ${classes.border} hover:shadow-2xl creative-hover glass-effect transition-all duration-500 group relative overflow-hidden`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl"></div>
      </div>
      
      <CardContent className="text-center p-0 relative z-10">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${classes.icon.replace('text-', 'bg-').replace('-500', '-100')} mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <i className={`${getSpecificIcon(service.name)} ${classes.icon} text-2xl group-hover:animate-bounce`}></i>
        </div>
        
        <h4 className="text-xl font-bold mb-4 group-hover:text-gray-800 transition-colors">{service.name}</h4>
        
        <p className="text-gray-600 mb-6 text-sm leading-relaxed px-2 group-hover:text-gray-700">
          {service.description}
        </p>
        
        <div className={`text-3xl font-bold ${classes.price} mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-lg">💰</span> {service.price} ر.س
        </div>
        
        <Button 
          onClick={() => onOrder(service)}
          className={`w-full text-white ${classes.button} transition-all duration-300 rounded-xl font-bold text-lg py-3 hover:scale-105 hover:shadow-lg relative overflow-hidden group/btn`}
        >
          <span className="relative z-10 flex items-center justify-center">
            <span className="ml-2">🚀</span>
            اطلب الآن
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
        </Button>
      </CardContent>
    </Card>
  );
}
