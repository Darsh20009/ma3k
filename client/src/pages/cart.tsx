import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, CreditCard, Check, X } from "lucide-react";

export default function CartPage() {
  const { items, totalPrice, discountedPrice, discountCode, setDiscountCode } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [discountInput, setDiscountInput] = useState("");
  const [validateLoading, setValidateLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  // محاولة استرجاع البيانات عند تحميل الصفحة
  useEffect(() => {
    const savedCustomer = localStorage.getItem('customerInfo');
    if (savedCustomer) {
      setCustomerInfo(JSON.parse(savedCustomer));
    }
  }, []);

  const handleValidateDiscount = async () => {
    if (!discountInput.trim()) {
      toast({ title: "أدخل كود الخصم", variant: "destructive" });
      return;
    }
    
    try {
      setValidateLoading(true);
      const response = await apiRequest("POST", "/api/discount-codes/validate", { code: discountInput });
      const discount = await response.json();
      setDiscountCode(discount);
      setDiscountInput("");
      toast({
        title: "✅ تم تطبيق الخصم بنجاح!",
        description: `توفير: ${(totalPrice - discountedPrice)} ر.س (${discount.discountPercentage}% خصم)`
      });
    } catch {
      toast({
        title: "❌ كود غير صحيح",
        description: "كود الخصم غير صالح أو منتهي الصلاحية",
        variant: "destructive"
      });
    } finally {
      setValidateLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى ملء الاسم ورقم الهاتف للمتابعة.",
        variant: "destructive"
      });
      return;
    }

    // حفظ البيانات في localStorage لتستخدمها صفحة الدفع
    localStorage.setItem('cartItems', JSON.stringify(items));
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    if (discountCode) {
      localStorage.setItem('discountCode', JSON.stringify(discountCode));
    }

    // التوجيه إلى صفحة الدفع
    setLocation('/payment');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">عربة التسوق فارغة</h1>
        <Link href="/services">
          <Button variant="link" className="mt-4">العودة للخدمات</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">إتمام الطلب</h1>
        <p className="text-muted-foreground mt-1">اكمل بياناتك لمراجعة طرق الدفع</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Customer Info Form */}
        <Card className="card-ma3k">
          <CardHeader>
            <CardTitle>بيانات العميل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">الاسم الكامل *</Label>
              <Input id="name" value={customerInfo.name} onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
              <Input id="email" type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <Input id="phone" type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="notes">فكرة المشروع (اختياري)</Label>
              <Textarea id="notes" placeholder="صف لنا فكرتك..." value={customerInfo.notes} onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))} />
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <div className="sticky top-8">
          <Card className="card-ma3k">
            <CardHeader>
              <CardTitle>ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.service.id} className="flex justify-between">
                    <span>{item.service.name}</span>
                    <span className="font-medium">{item.service.price * item.quantity} ر.س</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي:</span>
                  <span>{totalPrice} ر.س</span>
                </div>
              </div>

              {/* Discount Code Section */}
              <Card className="bg-secondary/10 border-secondary p-4">
                <Label htmlFor="discount" className="text-sm font-semibold">كود الخصم</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="discount"
                    placeholder="أدخل الكود هنا"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    disabled={validateLoading || !!discountCode}
                    data-testid="input-discount-code"
                  />
                  <Button
                    onClick={handleValidateDiscount}
                    variant={discountCode ? "default" : "outline"}
                    disabled={validateLoading || !!discountCode}
                    data-testid="button-apply-discount"
                  >
                    {validateLoading ? "..." : discountCode ? <Check className="w-4 h-4" /> : "تطبيق"}
                  </Button>
                </div>
                {discountCode && (
                  <div className="mt-2 p-2 bg-green-500/10 rounded border border-green-500/30 flex justify-between items-center">
                    <span className="text-green-700 text-sm">✓ تم تطبيق {discountCode.discountPercentage}% خصم</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDiscountCode(null)}
                      data-testid="button-remove-discount"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </Card>

              {discountCode && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>المجموع قبل الخصم:</span>
                      <span>{totalPrice} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 font-semibold">
                      <span>التوفير:</span>
                      <span>-{totalPrice - discountedPrice} ر.س</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-bold text-green-600">
                      <span>المجموع بعد الخصم:</span>
                      <span>{discountedPrice} ر.س</span>
                    </div>
                  </div>
                </>
              )}

              <Button onClick={handleProceedToPayment} className="w-full btn-ma3k text-lg">
                <CreditCard className="w-5 h-5 ml-2" />
                المتابعة للدفع
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}