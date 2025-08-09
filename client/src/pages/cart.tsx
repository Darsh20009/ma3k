import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";

export default function Cart() {
  const [, setLocation] = useLocation();
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  const handleProceedToPayment = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert("يرجى ملء جميع البيانات المطلوبة");
      return;
    }
    
    // Store customer info in localStorage for payment page
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    localStorage.setItem('cartItems', JSON.stringify(items));
    
    // Check if website specifications already exist
    const existingSpecs = localStorage.getItem('websiteSpecs') || localStorage.getItem('websiteSpecifications');
    
    // Check if any item is a website service
    const hasWebsiteService = items.some(item => 
      item.service.name.includes('موقع') || 
      item.service.name.includes('تطبيق') || 
      item.service.name.includes('متجر') ||
      item.service.id === '1' || item.service.id === '2' || item.service.id === '3'
    );
    
    if (hasWebsiteService && !existingSpecs) {
      // Redirect to website specifications page first if no specs exist
      setLocation('/website-specifications');
    } else {
      // Go directly to payment
      setLocation('/payment');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 relative">
        <div className="absolute inset-0 holographic-bg"></div>
        
        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="luxury-card p-12 rounded-3xl">
              <div className="mb-8">
                <div className="w-32 h-32 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6 animate-luxury-float">
                  <ShoppingBag className="w-16 h-16 text-black" />
                </div>
                <h1 className="text-4xl font-bold animate-text-shimmer mb-4 text-gray-200">
                  🛒 عربة التسوق فارغة
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  ابدأ بإضافة الخدمات الفخمة التي تحتاجها!
                </p>
              </div>
              
              <Link href="/services">
                <Button className="btn-luxury px-8 py-4 text-lg font-bold rounded-2xl">
                  <ArrowRight className="w-5 h-5 ml-2" />
                  🛍️ تصفح الخدمات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      <div className="absolute inset-0 luxury-bg"></div>
      
      {/* Luxury Header */}
      <section className="dark-gradient text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 luxury-bg opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-text-shimmer">
            🛒 عربة التسوق
          </h1>
          <div className="luxury-divider mb-6"></div>
          <p className="text-xl opacity-90">
            مراجعة طلباتك وإكمال بياناتك للمتابعة
          </p>
          
          <div className="mt-8 flex justify-center">
            <div className="luxury-card px-8 py-4 rounded-2xl border-2 border-yellow-400/30">
              <span className="text-2xl font-bold text-yellow-400">
                {totalItems} عنصر • {totalPrice} ر.س
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="luxury-card p-8 rounded-3xl mb-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-200">📦 العناصر المحددة</h2>
                  <Button 
                    onClick={clearCart}
                    variant="outline" 
                    className="text-red-400 hover:text-red-300 border-red-400/30 hover:border-red-300/50 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    مسح الكل
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.service.id} className="luxury-card p-6 rounded-2xl border border-yellow-400/20">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-xl gold-gradient flex items-center justify-center text-black text-2xl animate-gold-pulse">
                          ⭐
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-200 mb-2">
                            {item.service.name}
                          </h3>
                          <p className="text-gray-300 mb-3">
                            {item.service.description}
                          </p>
                          {item.customization && (
                            <p className="text-sm text-yellow-400 font-medium">
                              🎨 ملاحظات: {item.customization}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-400 mb-4">
                            {item.service.price} ر.س
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Button
                              onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                              size="sm"
                              variant="outline"
                              className="w-10 h-10 rounded-full"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            
                            <span className="w-12 text-center font-bold text-lg">
                              {item.quantity}
                            </span>
                            
                            <Button
                              onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                              size="sm"
                              className="w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Button
                            onClick={() => removeFromCart(item.service.id)}
                            variant="ghost"
                            size="sm"
                            className="mt-3 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            <Trash2 className="w-4 h-4 ml-1" />
                            إزالة
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Link href="/services">
                <Button variant="outline" className="w-full py-4 text-lg rounded-2xl">
                  <ArrowLeft className="w-5 h-5 ml-2" />
                  ← العودة للتسوق
                </Button>
              </Link>
            </div>

            {/* Customer Info & Summary */}
            <div className="space-y-8">
              
              {/* Customer Information */}
              <div className="luxury-card p-8 rounded-3xl">
                <h3 className="text-2xl font-bold mb-6 text-center text-yellow-400">
                  👤 بياناتك
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏷️ الاسم الكامل *
                    </label>
                    <Input
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="أدخل اسمك الكامل"
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📧 البريد الإلكتروني *
                    </label>
                    <Input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="example@email.com"
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📱 رقم الهاتف / واتساب *
                    </label>
                    <Input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="05xxxxxxxx"
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📝 ملاحظات إضافية
                    </label>
                    <Textarea
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="أي متطلبات خاصة أو ملاحظات..."
                      className="rounded-xl resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="luxury-card p-8 rounded-3xl border-2 border-yellow-400/30">
                <h3 className="text-2xl font-bold mb-6 text-center text-yellow-400">
                  📊 ملخص الطلب
                </h3>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.service.id} className="flex justify-between items-center">
                      <span className="text-gray-700">
                        {item.service.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {item.service.price * item.quantity} ر.س
                      </span>
                    </div>
                  ))}
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">المجموع الفرعي:</span>
                    <span className="font-bold">{totalPrice} ر.س</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>رسوم المعالجة:</span>
                    <span>مجاناً</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center text-2xl font-bold text-yellow-400">
                    <span>المجموع النهائي:</span>
                    <span>{totalPrice} ر.س</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full mt-8 btn-luxury py-4 text-lg font-bold rounded-2xl"
                  disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone}
                >
                  <ArrowRight className="w-5 h-5 ml-2" />
                  👑 المتابعة للدفع
                </Button>
                
                <p className="text-center text-sm text-gray-600 mt-4">
                  🔒 معاملة آمنة ومحمية
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}