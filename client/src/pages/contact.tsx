import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MessageCircle, CheckCircle, Clock, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    contactMethod: "email"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Logic for submission...
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      toast({ title: "تم الإرسال بنجاح" });
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <Badge className="px-4 py-1 rounded-full">تواصل معنا</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold">نحن هنا لمساعدتك</h1>
          <p className="text-xl text-muted-foreground">اترك رسالتك وسنعود إليك في أسرع وقت ممكن</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <Card className="luxury-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">الاسم الكامل</label>
                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="أدخل اسمك" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">رقم الجوال</label>
                <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="05xxxxxxxx" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">الرسالة</label>
                <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="كيف يمكننا مساعدتك؟" rows={5} required />
              </div>
              <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
              </Button>
            </form>
          </Card>

          <div className="space-y-8">
            {[
              { title: "البريد الإلكتروني", desc: "info@ma3k.com", icon: Mail },
              { title: "واتساب", desc: "+966 50 000 0000", icon: MessageCircle },
              { title: "أوقات العمل", desc: "نعمل على مدار الساعة لخدمتكم", icon: Clock },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-center p-6 luxury-card">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
