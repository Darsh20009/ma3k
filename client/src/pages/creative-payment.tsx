// pages/payment.tsx

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { CreditCard, MessageSquare, Tag, CheckCircle } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// ... (بقية الإعدادات والمتغيرات تبقى كما هي)
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "YOUR_CLIENT_ID";
const WHATSAPP_NUMBER = "+201155201921";

export default function PaymentPage() {
  // ... (كل الأكواد المنطقية داخل الدالة تبقى كما هي بدون تغيير)
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalPrice = Math.max(0, subtotal - discountAmount);
  // ... etc

  // التغيير فقط في الجزء الخاص بالعرض (return)
  return (
    <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "SAR" }}>
      <div className="min-h-screen royal-gradient pt-20 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-ma3k-beige mb-3">
                إتمام الطلب
              </h1>
              <p className="text-xl text-ma3k-beige-dark">
                أنت على بعد خطوة واحدة من تحقيق مشروعك
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {/* Payment Options */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="glass-card p-8 rounded-3xl">
                <h2 className="text-2xl font-bold text-white mb-6">اختر طريقة الدفع</h2>
                <div className="space-y-6">
                  {/* WhatsApp Option */}
                  <div className="p-4 border-2 border-transparent hover:border-green-400 bg-white/5 rounded-2xl transition-all">
                    <h3 className="font-bold text-lg text-green-400 mb-2">الدفع عبر واتساب</h3>
                    <p className="text-ma3k-beige-dark mb-4">
                      للدفع عبر STC Pay أو التحويل البنكي. سيتم توجيهك للمحادثة مع كامل تفاصيل الطلب.
                    </p>
                    <Button onClick={handleWhatsAppPayment} className="bg-green-500 hover:bg-green-600 text-white w-full">
                      <MessageSquare className="ml-2"/> إكمال عبر واتساب
                    </Button>
                  </div>
                  {/* PayPal Option */}
                  <div className="p-4 border-2 border-transparent hover:border-blue-400 bg-white/5 rounded-2xl transition-all">
                    <h3 className="font-bold text-lg text-blue-400 mb-2">الدفع عبر الموقع (PayPal)</h3>
                    <p className="text-ma3k-beige-dark mb-4">
                      الدفع الآمن والمباشر باستخدام PayPal.
                    </p>
                    {finalPrice === 0 ? (
                      <Button onClick={() => handleOrderSuccess("Free (Discount)")} className="w-full btn-ma3k">
                        <CheckCircle className="ml-2"/> تأكيد الطلب المجاني
                      </Button>
                    ) : (
                      <PayPalButtons key={finalPrice} style={{ layout: "vertical", label: "pay" }} disabled={isProcessing} createOrder={(data, actions) => actions.order.create({ purchase_units: [{ amount: { value: finalPrice.toString(), currency_code: "SAR" } }] })} onApprove={async (data, actions) => { const details = await actions.order.capture(); handleOrderSuccess("PayPal", details); }}/>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 sticky top-24"
            >
              <div className="glass-card p-8 rounded-3xl">
                <h2 className="text-2xl font-bold text-white mb-6">ملخص الطلب</h2>
                {/* ... The rest of the summary JSX ... */}
                 <div className="flex justify-between text-2xl font-bold text-ma3k-green mt-3">
                  <span>الإجمالي</span>
                  <span>{finalPrice} ر.س</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}