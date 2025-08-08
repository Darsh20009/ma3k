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
      border: "border-t-4 border-primary-500",
      icon: "text-primary-500",
      price: "text-primary-600",
      button: "bg-primary-500 hover:bg-primary-600",
    },
    success: {
      border: "border-t-4 border-success-500",
      icon: "text-success-500",
      price: "text-success-600",
      button: "bg-success-500 hover:bg-success-600",
    },
    accent: {
      border: "border-t-4 border-accent-500",
      icon: "text-accent-500",
      price: "text-accent-600",
      button: "bg-accent-500 hover:bg-accent-600",
    },
  };

  const classes = variantClasses[variant];

  return (
    <Card className={`service-card bg-white rounded-xl shadow-lg p-6 ${classes.border} hover:shadow-xl transition-all duration-300`}>
      <CardContent className="text-center p-0">
        <i className={`${getSpecificIcon(service.name)} ${classes.icon} text-4xl mb-4`}></i>
        <h4 className="text-xl font-bold mb-3">{service.name}</h4>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {service.description}
        </p>
        <div className={`text-3xl font-bold ${classes.price} mb-4`}>
          {service.price} ر.س
        </div>
        <Button 
          onClick={() => onOrder(service)}
          className={`w-full text-white ${classes.button} transition-colors`}
        >
          اطلب الآن
        </Button>
      </CardContent>
    </Card>
  );
}
