import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Tag, 
  CheckCircle, 
  ShoppingBag, 
  Building2, 
  Smartphone, 
  Upload, 
  FileText,
  Copy,
  AlertCircle,
  Loader2,
  X,
  Image as ImageIcon
} from "lucide-react";
import { SiPaypal } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";

type PaymentMethodType = "bank_transfer" | "paypal" | "etisalat_cash";
type PaymentMethod = PaymentMethodType | null;

interface BankTransferConfig {
  type: "bank_transfer";
  id: "bank_transfer";
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

interface PayPalConfig {
  type: "paypal";
  id: "paypal";
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  email: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

interface EtisalatCashConfig {
  type: "etisalat_cash";
  id: "etisalat_cash";
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  phoneNumber: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

type PaymentMethodConfig = BankTransferConfig | PayPalConfig | EtisalatCashConfig;

const BANK_TRANSFER_CONFIG: BankTransferConfig = {
  type: "bank_transfer",
  id: "bank_transfer",
  name: "تحويل بنكي",
  icon: Building2,
  description: "التحويل البنكي المباشر",
  accountNumber: "EG420059003800000200013934156",
  bankName: "البنك الأهلي المصري",
  accountName: "شركة معك للخدمات الرقمية",
  color: "from-blue-500 to-blue-700",
  borderColor: "border-blue-500/30",
  bgColor: "bg-blue-500/10"
};

const PAYPAL_CONFIG: PayPalConfig = {
  type: "paypal",
  id: "paypal",
  name: "PayPal",
  icon: SiPaypal,
  description: "الدفع عبر PayPal",
  email: "payments@ma3k.com",
  color: "from-[#003087] to-[#009cde]",
  borderColor: "border-[#009cde]/30",
  bgColor: "bg-[#009cde]/10"
};

const ETISALAT_CASH_CONFIG: EtisalatCashConfig = {
  type: "etisalat_cash",
  id: "etisalat_cash",
  name: "اتصالات كاش",
  icon: Smartphone,
  description: "الدفع عبر اتصالات كاش",
  phoneNumber: "01155201921",
  color: "from-orange-500 to-red-600",
  borderColor: "border-orange-500/30",
  bgColor: "bg-orange-500/10"
};

const PAYMENT_METHODS: PaymentMethodConfig[] = [
  BANK_TRANSFER_CONFIG,
  PAYPAL_CONFIG,
  ETISALAT_CASH_CONFIG
];

export default function PaymentPage() {
  const [, setLocation] = useLocation();
  const { cart, clearCart } = useCart();
  const { user, userType } = useAuth();
  const { toast } = useToast();
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);
  
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (user) {
      setCustomerName(user.fullName || "");
      setCustomerEmail(user.email || "");
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "الملف كبير جداً",
          description: "يرجى اختيار ملف أقل من 5 ميجابايت",
          variant: "destructive"
        });
        return;
      }

      setReceiptFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الرقم إلى الحافظة",
    });
  };

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
        title: "تم تطبيق الخصم!",
        description: `خصم ${discountPercent}% - تم توفير ${calculatedDiscount} جنيه`,
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

  const validateForm = () => {
    if (!customerName.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال الاسم", variant: "destructive" });
      return false;
    }
    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      toast({ title: "خطأ", description: "يرجى إدخال بريد إلكتروني صحيح", variant: "destructive" });
      return false;
    }
    if (!customerPhone.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال رقم الهاتف", variant: "destructive" });
      return false;
    }
    if (!selectedMethod) {
      toast({ title: "خطأ", description: "يرجى اختيار طريقة الدفع", variant: "destructive" });
      return false;
    }
    if (!receiptFile) {
      toast({ title: "خطأ", description: "يرجى رفع إيصال التحويل", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      for (const item of cart) {
        const orderData = {
          clientId: userType === "client" ? user?.id : undefined,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          serviceId: item.id,
          serviceName: item.name,
          price: item.price,
          description: `${item.name} ${discountAmount > 0 ? `- خصم ${discountPercentage}%` : ""}`,
          paymentMethod: selectedMethod,
          paymentReceiptUrl: receiptPreview,
          paymentReceiptFileName: receiptFile?.name,
          paymentNotes: paymentNotes.trim(),
          discountCode: discountCode || undefined,
          discountAmount: discountAmount,
          finalAmount: Math.round(finalPrice / cart.length),
        };

        await apiRequest("POST", "/api/orders", orderData);
      }

      toast({
        title: "تم إرسال الطلب بنجاح!",
        description: "سيتم مراجعة إيصال الدفع والتواصل معك قريباً",
      });

      clearCart();
      setTimeout(() => {
        setLocation(userType === "client" ? "/client-dashboard" : "/");
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

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#2d8a7a] to-[#5cb85c] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2d8a7a] via-[#5cb85c] to-[#6ec4a3] mb-3" data-testid="text-payment-title">
              إتمام عملية الدفع
            </h1>
            <p className="text-xl text-muted-foreground">
              اختر طريقة الدفع المناسبة لك وأرفق إيصال التحويل
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                بيانات العميل
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">الاسم الكامل *</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    data-testid="input-customer-name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">البريد الإلكتروني *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="example@email.com"
                    data-testid="input-customer-email"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="customerPhone">رقم الهاتف *</Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    data-testid="input-customer-phone"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                اختر طريقة الدفع
              </h2>
              <div className="grid gap-4">
                {Object.values(PAYMENT_METHODS).map((method) => {
                  const IconComponent = method.icon;
                  const isSelected = selectedMethod === method.id;
                  
                  return (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? `${method.borderColor} ${method.bgColor} ring-2 ring-offset-2 ring-primary/20` 
                          : "border-border hover:border-primary/30"
                      }`}
                      data-testid={`payment-method-${method.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{method.name}</h3>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                        }`}>
                          {isSelected && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                        </div>
                      </div>

                      {isSelected && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 p-4 rounded-lg bg-background/50"
                        >
                          {method.type === "bank_transfer" && (
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-card rounded-lg">
                                  <span className="text-sm text-muted-foreground">رقم الحساب:</span>
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm font-mono" dir="ltr">{method.accountNumber}</code>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      onClick={() => copyToClipboard(method.accountNumber)}
                                      data-testid="button-copy-account"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-card rounded-lg">
                                  <span className="text-sm text-muted-foreground">البنك:</span>
                                  <span className="font-medium">{method.bankName}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-card rounded-lg">
                                  <span className="text-sm text-muted-foreground">اسم الحساب:</span>
                                  <span className="font-medium">{method.accountName}</span>
                                </div>
                              </div>
                          )}
                          {method.type === "paypal" && (
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-card rounded-lg">
                                  <span className="text-sm text-muted-foreground">البريد الإلكتروني:</span>
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm font-mono">{method.email}</code>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      onClick={() => copyToClipboard(method.email)}
                                      data-testid="button-copy-paypal"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  قم بإرسال المبلغ إلى هذا الحساب ثم أرفق إيصال التحويل أدناه
                                </p>
                              </div>
                          )}
                          {method.type === "etisalat_cash" && (
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-card rounded-lg">
                                  <span className="text-sm text-muted-foreground">رقم الهاتف:</span>
                                  <div className="flex items-center gap-2">
                                    <code className="text-lg font-mono font-bold" dir="ltr">{method.phoneNumber}</code>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      onClick={() => copyToClipboard(method.phoneNumber)}
                                      data-testid="button-copy-etisalat"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  قم بتحويل المبلغ عبر اتصالات كاش ثم أرفق إيصال التحويل أدناه
                                </p>
                              </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            {selectedMethod && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    رفع إيصال التحويل *
                  </h2>
                  <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <p className="text-sm text-amber-500">
                      يجب رفع إيصال التحويل لإتمام الطلب. سيتم مراجعته والتواصل معك خلال 24 ساعة.
                    </p>
                  </div>

                  {!receiptPreview ? (
                    <div 
                      className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        data-testid="input-receipt-file"
                      />
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="font-medium mb-1">اضغط لرفع إيصال التحويل</p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG, PDF (الحد الأقصى 5 ميجابايت)
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="border rounded-xl overflow-hidden">
                        {receiptFile?.type.startsWith("image/") ? (
                          <img 
                            src={receiptPreview} 
                            alt="إيصال التحويل" 
                            className="w-full max-h-64 object-contain bg-muted"
                          />
                        ) : (
                          <div className="p-6 flex items-center gap-4 bg-muted">
                            <FileText className="w-12 h-12 text-primary" />
                            <div>
                              <p className="font-medium">{receiptFile?.name}</p>
                              <p className="text-sm text-muted-foreground">PDF Document</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 left-2"
                        onClick={removeReceipt}
                        data-testid="button-remove-receipt"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <div className="mt-4">
                    <Label htmlFor="paymentNotes">ملاحظات إضافية (اختياري)</Label>
                    <Textarea
                      id="paymentNotes"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      placeholder="أي ملاحظات تريد إضافتها..."
                      className="mt-2"
                      data-testid="input-payment-notes"
                    />
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
              
              <div className="space-y-3 mb-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg" data-testid={`cart-item-${idx}`}>
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-primary font-bold">{item.price} جنيه</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>المجموع الفرعي</span>
                  <span>{subtotal} جنيه</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>الخصم ({discountPercentage}%)</span>
                    <span>-{discountAmount} جنيه</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>الإجمالي</span>
                  <span className="text-primary">{finalPrice} جنيه</span>
                </div>
              </div>

              <div className="mt-6">
                <Label className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4" />
                  كود الخصم
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="MA3K2030"
                    data-testid="input-discount-code"
                  />
                  <Button
                    onClick={handleApplyDiscount}
                    variant="outline"
                    disabled={isValidatingDiscount}
                    data-testid="button-apply-discount"
                  >
                    {isValidatingDiscount ? <Loader2 className="w-4 h-4 animate-spin" /> : "تطبيق"}
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleSubmitOrder}
                disabled={isProcessing || !selectedMethod || !receiptFile}
                className="w-full mt-6 bg-gradient-to-r from-[#2d8a7a] to-[#5cb85c] hover:from-[#247064] hover:to-[#4a9a4a]"
                size="lg"
                data-testid="button-submit-order"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    جاري إرسال الطلب...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 ml-2" />
                    تأكيد الطلب وإرسال الإيصال
                  </>
                )}
              </Button>

              {!selectedMethod && (
                <p className="text-center text-sm text-muted-foreground mt-3">
                  يرجى اختيار طريقة الدفع أولاً
                </p>
              )}
              {selectedMethod && !receiptFile && (
                <p className="text-center text-sm text-amber-500 mt-3">
                  يرجى رفع إيصال التحويل لإتمام الطلب
                </p>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
