
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      <div className="absolute inset-0 luxury-bg"></div>
      
      {/* Hero Section */}
      <section className="dark-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 luxury-bg opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-text-shimmer">
            💳 طرق الدفع المتاحة
          </h1>
          <div className="luxury-divider mb-6"></div>
          <p className="text-xl opacity-90 mb-8">
            اختر الطريقة الأنسب لك لإتمام عملية الدفع
          </p>
          <Badge variant="secondary" className="text-lg px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold">
            رقم الطلب: {orderNumber}
          </Badge>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Packages Section */}
          <div className="luxury-card p-8 rounded-3xl mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-200">📦 باقات الخدمات والأسعار</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg, index) => (
                <div key={index} className="luxury-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 border border-yellow-400/20">
                  <h3 className="font-bold text-xl mb-3 text-yellow-400">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-white mb-4">{pkg.price} ريال</div>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {paymentMethods.map((method) => (
              <div key={method.id} className="luxury-card p-8 rounded-3xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`${method.color} p-4 rounded-full text-white`}>
                    <method.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-200">{method.title}</h3>
                </div>
                
                <div className="space-y-6">
                  {method.accounts && method.accounts.map((account, index) => (
                    <div key={index} className="luxury-card p-6 rounded-2xl border border-blue-400/30">
                      <div className="font-semibold text-blue-400 mb-4 text-lg">{account.bank}</div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">رقم الآيبان:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(account.iban, `آيبان ${account.bank}`)}
                            className="flex items-center gap-2 text-gray-200 hover:text-white"
                          >
                            {copied === `آيبان ${account.bank}` ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                            {account.iban}
                          </Button>
                        </div>
                        <div className="text-sm font-medium text-gray-300">{account.name}</div>
                      </div>
                    </div>
                  ))}

                  {method.wallets && method.wallets.map((wallet, index) => (
                    <div key={index} className="luxury-card p-6 rounded-2xl border border-green-400/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{wallet.logo}</span>
                          <span className="font-semibold text-green-400 text-lg">{wallet.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(wallet.number, wallet.name)}
                          className="flex items-center gap-2 text-gray-200 hover:text-white"
                        >
                          {copied === wallet.name ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          {wallet.number}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="luxury-card p-8 rounded-3xl">
            <h2 className="text-3xl font-bold text-center text-gray-200 mb-8">📋 تعليمات الدفع</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-8">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">1️⃣</span>
                </div>
                <h3 className="font-bold text-xl text-yellow-400">اختر طريقة الدفع</h3>
                <p className="text-gray-300">
                  اختر الطريقة الأنسب لك من التحويل البنكي أو المحافظ الرقمية
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">2️⃣</span>
                </div>
                <h3 className="font-bold text-xl text-blue-400">أرسل إيصال الدفع</h3>
                <p className="text-gray-300">
                  أرسل صورة إيصال التحويل مع رقم الطلب عبر واتساب
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">3️⃣</span>
                </div>
                <h3 className="font-bold text-xl text-green-400">ابدأ العمل</h3>
                <p className="text-gray-300">
                  سنبدأ العمل على مشروعك فور تأكيد استلام الدفع
                </p>
              </div>
            </div>
            
            <Separator className="my-8 bg-gray-600" />
            
            <div className="text-center">
              <Button
                onClick={() => {
                  const message = `مرحباً! تم إرسال الدفع لمشروع الموقع
رقم الطلب: ${orderNumber}
مرفق إيصال التحويل`;
                  window.open(`https://wa.me/966532441566?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg px-10 py-4 rounded-2xl hover:scale-105 transition-all duration-300 mb-6"
              >
                📱 إرسال إيصال الدفع عبر واتساب
              </Button>
              <p className="text-gray-400">
                📞 للاستفسارات: 966532441566 | 📧 ma3k.2025@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
