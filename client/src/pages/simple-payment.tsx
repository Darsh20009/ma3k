import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Building2, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SimplePayment() {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const paymentMethods = [
    {
      id: 'bank',
      title: 'تحويل بنكي',
      icon: Building2,
      color: 'bg-blue-500',
      accounts: [
        { bank: 'البنك الأهلي السعودي', iban: 'SA80 1000 0000 0000 0000 0001', name: 'منصة معك للخدمات الرقمية' },
        { bank: 'بنك الراجحي', iban: 'SA12 8000 0000 0000 0000 0002', name: 'منصة معك للخدمات الرقمية' }
      ]
    },
    {
      id: 'wallet',
      title: 'المحافظ الرقمية',
      icon: Smartphone,
      color: 'bg-green-500',
      wallets: [
        { name: 'STC Pay', number: '966532441566', logo: '📱' },
        { name: 'UR Pay', number: '966532441566', logo: '💳' },
        { name: 'Alinma Pay', number: '966532441566', logo: '🏦' }
      ]
    }
  ];

  const packages = [
    { name: 'موقع بسيط', price: '400-800', features: ['تصميم بسيط', 'صفحات محدودة', 'تجاوب مع الجوال'] },
    { name: 'موقع متوسط', price: '800-1200', features: ['تصميم متقدم', 'وظائف تفاعلية', 'نظام إدارة بسيط'] },
    { name: 'موقع متقدم', price: '1200-2000', features: ['تصميم فاخر', 'وظائف متقدمة', 'نظام إدارة شامل'] },
    { name: 'مشروع مخصص', price: '2000+', features: ['حسب المتطلبات', 'تصميم فريد', 'وظائف مخصصة'] }
  ];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast({
      title: "تم النسخ!",
      description: `تم نسخ ${type} بنجاح`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const orderNumber = localStorage.getItem('websiteOrderNumber') || 'WEB-' + Date.now();

  return (
    <div className="min-h-screen royal-gradient py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <Card className="glass-card shadow-2xl border-0 mb-8">
          <CardHeader className="gold-gradient text-black text-center">
            <CardTitle className="text-3xl font-bold">💳 طرق الدفع المتاحة</CardTitle>
            <p className="text-lg mt-2">اختر الطريقة الأنسب لك لإتمام عملية الدفع</p>
            <Badge variant="secondary" className="mx-auto mt-4 text-lg px-4 py-2">
              رقم الطلب: {orderNumber}
            </Badge>
          </CardHeader>
        </Card>

        {/* Packages */}
        <Card className="glass-card shadow-2xl border-0 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-foreground">📦 باقات الخدمات والأسعار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg, index) => (
                <div key={index} className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all">
                  <h3 className="font-bold text-lg mb-2 text-primary">{pkg.name}</h3>
                  <div className="text-2xl font-bold text-accent mb-4">{pkg.price} ريال</div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Payment Methods */}
          {paymentMethods.map((method) => (
            <Card key={method.id} className="glass-card shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className={`${method.color} p-3 rounded-full text-white`}>
                    <method.icon className="w-6 h-6" />
                  </div>
                  {method.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {method.accounts && method.accounts.map((account, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="font-semibold text-blue-800 dark:text-blue-200 mb-2">{account.bank}</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">رقم الآيبان:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(account.iban, `آيبان ${account.bank}`)}
                          className="flex items-center gap-2"
                        >
                          {copied === `آيبان ${account.bank}` ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          {account.iban}
                        </Button>
                      </div>
                      <div className="text-sm font-medium">{account.name}</div>
                    </div>
                  </div>
                ))}

                {method.wallets && method.wallets.map((wallet, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{wallet.logo}</span>
                        <span className="font-semibold text-green-800 dark:text-green-200">{wallet.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(wallet.number, wallet.name)}
                        className="flex items-center gap-2"
                      >
                        {copied === wallet.name ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {wallet.number}
                      </Button>
                    </div>
                  </div>
                ))}
                
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="glass-card shadow-2xl border-0 mt-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-foreground">📋 تعليمات الدفع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">1️⃣</span>
                </div>
                <h3 className="font-bold text-lg">اختر طريقة الدفع</h3>
                <p className="text-sm text-muted-foreground">
                  اختر الطريقة الأنسب لك من التحويل البنكي أو المحافظ الرقمية
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">2️⃣</span>
                </div>
                <h3 className="font-bold text-lg">أرسل إيصال الدفع</h3>
                <p className="text-sm text-muted-foreground">
                  أرسل صورة إيصال التحويل مع رقم الطلب عبر واتساب
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">3️⃣</span>
                </div>
                <h3 className="font-bold text-lg">ابدأ العمل</h3>
                <p className="text-sm text-muted-foreground">
                  سنبدأ العمل على مشروعك فور تأكيد استلام الدفع
                </p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <Button
                onClick={() => {
                  const message = `مرحباً! تم إرسال الدفع لمشروع الموقع
رقم الطلب: ${orderNumber}
مرفق إيصال التحويل`;
                  window.open(`https://wa.me/966532441566?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="gold-gradient text-black font-bold text-lg px-8 py-4 hover:opacity-90"
              >
                📱 إرسال إيصال الدفع عبر واتساب
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                📞 للاستفسارات: 966532441566 | 📧 ma3k.2025@gmail.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}