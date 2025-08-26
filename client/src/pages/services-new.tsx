import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  CheckCircle, 
  Star, 
  Zap,
  User,
  UtensilsCrossed,
  Building,
  Code,
  Palette,
  Globe,
  MessageCircle,
  Sparkles,
  Crown,
  Gift
} from "lucide-react";
import type { Service } from "@shared/schema";

export default function ServicesNew() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { addToCart, cart } = useCart();
  const { toast } = useToast();

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = [
    { id: "all", name: "جميع الخدمات", icon: Sparkles, color: "from-amber-500 to-amber-600" },
    { id: "individual", name: "خدمات فردية", icon: User, color: "from-blue-500 to-blue-600" },
    { id: "restaurant", name: "خدمات المطاعم", icon: UtensilsCrossed, color: "from-green-500 to-green-600" },
    { id: "business", name: "خدمات الأعمال", icon: Building, color: "from-purple-500 to-purple-600" }
  ];

  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const handleAddToCart = (service: Service) => {
    addToCart(service);
    toast({
      title: "تمت الإضافة! ✨",
      description: `تم إضافة ${service.name} إلى السلة`,
    });
  };

  const isInCart = (serviceId: string) => {
    return cart.some(item => item.id === serviceId);
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case "individual": return Code;
      case "restaurant": return UtensilsCrossed;
      case "business": return Building;
      default: return Globe;
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case "individual": return "فردية";
      case "restaurant": return "مطاعم";
      case "business": return "أعمال";
      default: return "عام";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "individual": return "from-blue-500 to-blue-600";
      case "restaurant": return "from-green-500 to-green-600";
      case "business": return "from-purple-500 to-purple-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="container mx-auto px-6 py-20">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-xl">جاري تحميل الخدمات...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/20 rounded-full"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${10 + (i * 5) % 80}%`,
              top: `${10 + (i * 4) % 80}%`
            }}
          />
        ))}
      </div>

      {/* Mouse follower */}
      <div
        className="fixed pointer-events-none z-10 w-80 h-80 bg-gradient-radial from-amber-400/10 via-purple-500/5 to-transparent rounded-full blur-3xl"
        style={{
          left: mousePosition.x - 160,
          top: mousePosition.y - 160,
          transition: 'all 0.3s ease'
        }}
      />

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mb-6">
            <Sparkles className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 mb-6">
            خدماتنا المتميزة
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            اكتشف مجموعة شاملة من الحلول التقنية المبتكرة المصممة خصيصاً لتحقيق أهدافك الرقمية بأسعار تنافسية
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
              data-testid={`category-${category.id}`}
            >
              <category.icon className="w-5 h-5 ml-2" />
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => {
            const ServiceIcon = getServiceIcon(service.category);
            const categoryColor = getCategoryColor(service.category);
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 relative overflow-hidden border-0 h-full">
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-amber-400 to-purple-500 transition-opacity duration-500" />

                  {/* Discount Badge */}
                  {service.originalPrice && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
                        <Gift className="w-4 h-4 ml-1" />
                        خصم {Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}%
                      </Badge>
                    </div>
                  )}

                  {/* Service Header */}
                  <div className="relative z-10 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${categoryColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <ServiceIcon className="w-8 h-8 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-white/10 text-gray-300 border-0">
                        {getCategoryDisplayName(service.category)}
                      </Badge>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">
                      {service.name}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <div className="relative z-10 mb-6">
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                        <Star className="w-5 h-5 ml-2 text-amber-400" />
                        المميزات
                      </h4>
                      <div className="space-y-2">
                        {service.features.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="flex items-center text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400 ml-2 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                        {service.features.length > 4 && (
                          <div className="text-amber-400 text-sm font-medium">
                            +{service.features.length - 4} مميزة أخرى
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Separator className="my-6 bg-white/10" />

                  {/* Pricing */}
                  <div className="relative z-10 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {service.originalPrice && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-500 line-through text-lg">
                              {service.originalPrice} ريال
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              وفر {service.originalPrice - service.price} ريال
                            </Badge>
                          </div>
                        )}
                        <div className="text-3xl font-bold text-amber-400">
                          {service.price} ريال
                        </div>
                      </div>
                      {service.popular && (
                        <div className="flex flex-col items-center">
                          <Crown className="w-6 h-6 text-amber-400 mb-1" />
                          <span className="text-xs text-amber-400 font-bold">الأكثر طلباً</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="relative z-10">
                    <Button
                      onClick={() => handleAddToCart(service)}
                      disabled={isInCart(service.id)}
                      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                        isInCart(service.id)
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : `luxury-btn bg-gradient-to-r ${categoryColor} hover:shadow-lg transform hover:scale-105`
                      }`}
                      data-testid={`add-to-cart-${service.id}`}
                    >
                      {isInCart(service.id) ? (
                        <>
                          <CheckCircle className="w-6 h-6 ml-2" />
                          تم الإضافة
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-6 h-6 ml-2" />
                          أضف للسلة
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">لا توجد خدمات في هذه الفئة</h3>
            <p className="text-gray-400 mb-8">جرب اختيار فئة أخرى أو تصفح جميع الخدمات</p>
            <Button
              onClick={() => setSelectedCategory("all")}
              className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black"
            >
              عرض جميع الخدمات
            </Button>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-20"
        >
          <div className="glass-card rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-purple-500/5" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6">
                هل تحتاج خدمة مخصصة؟
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                نحن نقدم حلولاً مخصصة تماماً لاحتياجاتك. تحدث معنا لنناقش مشروعك الخاص
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/cart" data-testid="button-view-cart">
                  <Button className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg shadow-xl">
                    <ShoppingCart className="w-6 h-6 ml-2" />
                    عرض السلة ({cart.length})
                  </Button>
                </a>
                <a href="https://wa.me/966532441566" target="_blank" rel="noopener noreferrer" data-testid="button-custom-service">
                  <Button variant="outline" className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black py-4 px-8 rounded-full text-lg font-bold">
                    <MessageCircle className="w-6 h-6 ml-2" />
                    طلب خدمة مخصصة
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}