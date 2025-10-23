import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CreditCard, Tag, CheckCircle, ShoppingBag } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { apiRequest } from "@/lib/queryClient";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || import.meta.env.PAYPAL_CLIENT_ID || "";

export default function PaymentPage() {
  const [, setLocation] = useLocation();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const finalPrice = Math.max(0, subtotal - discountAmount);

  useEffect(() => {
    if (cart.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "يرجى إضافة خدمات قبل المتابعة للدفع",
        variant: "destructive"
      });
      setLocation("/services");
    }
  }, [cart, setLocation, toast]);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كود الخصم",
        variant: "destructive"
      });
      return;
    }

    setIsValidatingDiscount(true);
    try {
      const response = await apiRequest("POST", "/api/discount-codes/validate", { code: discountCode });
      const data = await response.json();
      
      const discountPercent = data.discountPercentage || 0;
      const calculatedDiscount = Math.round((subtotal * discountPercent) / 100);
      
      setDiscountPercentage(discountPercent);
      setDiscountAmount(calculatedDiscount);
      
      toast({
        title: "تم تطبيق الخصم! 🎉",
        description: `خصم ${discountPercent}% - تم توفير ${calculatedDiscount} ريال`,
      });
    } catch (error) {
      setDiscountAmount(0);
      setDiscountPercentage(0);
      toast({
        title: "كود غير صحيح",
        description: "كود الخصم غير صالح أو منتهي الصلاحية",
        variant: "destructive"
      });
    } finally {
      setIsValidatingDiscount(false);
    }
  };

  const handleOrderSuccess = async (paymentMethod: string, paymentDetails?: any) => {
    setIsProcessing(true);

    try {
      for (const item of cart) {
        const orderData = {
          customerName: "عميل",
          customerEmail: "customer@example.com",
          customerPhone: "+966XXXXXXXXX",
          serviceName: item.name,
          price: finalPrice > 0 ? Math.round(finalPrice / cart.length) : 0,
          description: `${item.name} ${discountAmount > 0 ? `- خصم ${discountPercentage}%` : ''}`,
          paymentMethod: paymentMethod,
        };

        const orderResponse = await apiRequest("POST", "/api/orders", orderData);
        const order = await orderResponse.json();
        
        if (paymentMethod === "PayPal" || paymentMethod === "Free (Discount)") {
          await apiRequest("PUT", `/api/orders/${order.id}/payment`, {
            paymentMethod,
            paymentStatus: "completed"
          });
        }
      }

      toast({
        title: "تم إتمام الطلب بنجاح! 🎉",
        description: "شكراً لثقتك في معك",
      });

      clearCart();
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    } catch (error) {
      console.error("Order creation error:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل إنشاء الطلب، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!PAYPAL_CLIENT_ID) {
    return (
      <div className="min-h-screen royal-gradient pt-24 pb-20 px-4 flex items-center justify-center">
        <div className="glass-card p-8 rounded-3xl border-2 border-red-500/20 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">خطأ في الإعداد</h2>
          <p className="text-gray-300">
            معرف PayPal غير مكون. يرجى التواصل مع الدعم الفني.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "SAR" }}>
      <div className="min-h-screen royal-gradient pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mx-auto mb-6 flex items-center justify-center teal-glow">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-green-400 to-amber-400 mb-3">
                إتمام الطلب
              </h1>
              <p className="text-xl text-gray-300">
                أنت على بعد خطوة واحدة من تحقيق مشروعك
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="glass-card p-8 rounded-3xl border-2 border-green-500/20">
                <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  اختر طريقة الدفع
                </h2>
                <div className="space-y-6">
                  <div className="p-6 border-2 border-blue-500/30 hover:border-blue-400 bg-blue-500/10 rounded-2xl transition-all">
                    <h3 className="font-bold text-xl text-blue-400 mb-2 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      الدفع عبر PayPal
                    </h3>
                    <p className="text-gray-300 mb-4">
                      الدفع الآمن والمباشر باستخدام بطاقات الائتمان أو PayPal.
                    </p>
                    {finalPrice === 0 ? (
                      <Button
                        onClick={() => handleOrderSuccess("Free (Discount)")}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                        data-testid="button-free-order"
                      >
                        <CheckCircle className="ml-2"/> تأكيد الطلب المجاني
                      </Button>
                    ) : (
                      <PayPalButtons
                        key={finalPrice}
                        style={{ layout: "vertical", label: "pay" }}
                        disabled={isProcessing}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [{
                              amount: {
                                value: finalPrice.toString(),
                                currency_code: "SAR"
                              }
                            }]
                          });
                        }}
                        onApprove={async (data, actions) => {
                          const details = await actions.order?.capture();
                          handleOrderSuccess("PayPal", details);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="glass-card p-8 rounded-3xl border-2 border-amber-500/20">
                <h2 className="text-2xl font-bold text-amber-400 mb-6">ملخص الطلب</h2>
                
                <div className="space-y-3 mb-6">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-white">{item.name}</span>
                      <span className="text-green-400 font-bold">{item.price} ريال</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-6 bg-gray-600" />

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-400">
                    <span>المجموع</span>
                    <span>{subtotal} ريال</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>الخصم</span>
                      <span>-{discountAmount} ريال</span>
                    </div>
                  )}
                  <Separator className="my-3 bg-gray-600" />
                  <div className="flex justify-between text-2xl font-bold text-amber-400">
                    <span>الإجمالي</span>
                    <span>{finalPrice} ريال</span>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-white mb-2 block flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    كود الخصم
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="MA3K2030"
                      className="bg-gray-800/50 border-gray-600 text-white"
                      data-testid="input-discount-code"
                    />
                    <Button
                      onClick={handleApplyDiscount}
                      variant="outline"
                      className="text-amber-400 border-amber-500"
                      disabled={isValidatingDiscount}
                      data-testid="button-apply-discount"
                    >
                      {isValidatingDiscount ? "جاري التحقق..." : "تطبيق"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
