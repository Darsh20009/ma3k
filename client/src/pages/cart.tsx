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
import { ArrowLeft, CreditCard } from "lucide-react";

export default function CartPage() {
  const { items, totalPrice } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
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
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.service.id} className="flex justify-between">
                    <span>{item.service.name}</span>
                    <span className="font-medium">{item.service.price * item.quantity} ر.س</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>المجموع:</span>
                  <span>{totalPrice} ر.س</span>
                </div>
              </div>
              <Button onClick={handleProceedToPayment} className="w-full btn-ma3k text-lg mt-6">
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