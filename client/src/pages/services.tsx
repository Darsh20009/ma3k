
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShoppingCart, Filter, Search, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@shared/schema";

export default function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<"all" | "low" | "mid" | "high">("all");

  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const handleOrderService = (service: Service) => {
    addToCart(service);
    
    toast({
      title: "تم إضافة الخدمة للسلة",
      description: `تم إضافة ${service.name} إلى سلة التسوق`,
    });
  };

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(services.map(s => s.category)))];

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange === "low") matchesPrice = service.price <= 1000;
    else if (priceRange === "mid") matchesPrice = service.price > 1000 && service.price <= 5000;
    else if (priceRange === "high") matchesPrice = service.price > 5000;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div 
            className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full mx-auto mb-4"
            style={{ borderColor: "var(--ma3k-green)", borderTopColor: "transparent" }}
          ></div>
          <p style={{ color: "var(--ma3k-beige-dark)" }}>جاري تحميل الخدمات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 
              className="luxury-h1 mb-6"
              style={{ color: "var(--ma3k-green)" }}
            >
              خدماتنا الرقمية
            </h1>
            <p 
              className="text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              اكتشف مجموعة واسعة من الخدمات الرقمية المتقدمة التي نقدمها لتحقيق أهدافك وتطوير عملك
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 mb-8"
          >
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن خدمة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 bg-gray-800/50 border-gray-600 text-white"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white focus:border-amber-400"
              >
                <option value="all">جميع الفئات</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Price Range */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as any)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white focus:border-amber-400"
              >
                <option value="all">جميع الأسعار</option>
                <option value="low">أقل من 1,000 ريال</option>
                <option value="mid">1,000 - 5,000 ريال</option>
                <option value="high">أكثر من 5,000 ريال</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex-1"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex-1"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="secondary" 
                style={{ 
                  backgroundColor: "var(--ma3k-green-light)", 
                  color: "var(--ma3k-green)" 
                }}
              >
                {filteredServices.length} خدمة متوفرة
              </Badge>
              {searchTerm && (
                <Badge 
                  variant="outline" 
                  style={{ borderColor: "var(--ma3k-beige-dark)" }}
                >
                  البحث: {searchTerm}
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge 
                  variant="outline" 
                  style={{ borderColor: "var(--ma3k-beige-dark)" }}
                >
                  الفئة: {selectedCategory}
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Services Grid/List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === "grid" 
              ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }
          >
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={viewMode === "grid" ? { y: -8 } : { x: 8 }}
                className={`glass-card rounded-2xl p-6 group hover:shadow-2xl transition-all duration-500 ${
                  viewMode === "list" ? "flex items-center justify-between" : ""
                }`}
              >
                <div className={viewMode === "list" ? "flex-1" : ""}>
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-amber-400/10 text-amber-400 text-xs">
                      {service.category}
                    </Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-400">
                        {service.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">ريال</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {viewMode === "grid" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOrderService(service)}
                      className="luxury-btn w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-3 px-6 rounded-full shadow-xl"
                    >
                      <ShoppingCart className="w-4 h-4 ml-2" />
                      أضف للسلة
                    </motion.button>
                  )}
                </div>

                {viewMode === "list" && (
                  <div className="flex items-center gap-4 mr-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOrderService(service)}
                      className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-2 px-4 rounded-full shadow-xl"
                    >
                      <ShoppingCart className="w-4 h-4 ml-1" />
                      أضف للسلة
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-300 mb-4">لم يتم العثور على خدمات</h3>
              <p className="text-gray-400 mb-6">جرب تعديل معايير البحث أو الفلترة</p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setPriceRange("all");
                }}
                className="luxury-btn bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold"
              >
                إعادة تعيين الفلاتر
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
