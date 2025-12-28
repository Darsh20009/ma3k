import { Link } from "wouter";
import { Phone, Mail, MapPin, Globe, Clock, ArrowUp } from "lucide-react";
import { SiWhatsapp, SiInstagram, SiX, SiLinkedin } from "react-icons/si";
import logoImage from "@assets/Screenshot 2025-01-18 200736_1760982548460.png";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-border mt-20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img 
                  src={logoImage} 
                  alt="Ma3k" 
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <span className="text-xl font-bold tracking-tight text-primary">معك</span>
              </div>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              حلول رقمية مبتكرة لمستقبل أعمالك. نساعدك في بناء هويتك الرقمية بأعلى معايير الجودة والاحترافية.
            </p>
            <div className="flex gap-4">
              {[SiWhatsapp, SiInstagram, SiX, SiLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">الروابط السريعة</h4>
            <ul className="space-y-4">
              {["الخدمات", "الأسعار", "أعمالنا", "من نحن", "تواصل معنا"].map((item, i) => (
                <li key={i}>
                  <Link href="#">
                    <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">خدماتنا</h4>
            <ul className="space-y-4">
              {["تطوير المواقع", "المتاجر الإلكترونية", "تطبيقات الجوال", "الهوية البصرية"].map((item, i) => (
                <li key={i}>
                  <Link href="#">
                    <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@ma3k.com</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>+966 50 000 0000</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>المملكة العربية السعودية، الرياض</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} معك. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <Link href="/privacy"><span className="hover:text-primary cursor-pointer">سياسة الخصوصية</span></Link>
            <Link href="/terms"><span className="hover:text-primary cursor-pointer">الشروط والأحكام</span></Link>
          </div>
          <Button variant="ghost" size="icon" onClick={scrollToTop} className="rounded-full">
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
