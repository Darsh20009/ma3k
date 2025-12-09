import { Link } from "wouter";
import { Phone, Mail, MapPin, Globe, Clock, ArrowUp } from "lucide-react";
import { SiWhatsapp, SiInstagram, SiX, SiLinkedin } from "react-icons/si";
import logoImage from "@assets/Screenshot 2025-01-18 200736_1760982548460.png";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { href: "/services", label: "خدماتنا" },
    { href: "/courses", label: "الدورات التدريبية" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "تواصل معنا" },
    { href: "/portfolio", label: "أعمالنا" },
  ];

  const services = [
    { href: "/services", label: "تصميم المواقع" },
    { href: "/services", label: "المتاجر الإلكترونية" },
    { href: "/services", label: "المنصات التعليمية" },
    { href: "/services", label: "تطوير التطبيقات" },
  ];

  const socialLinks = [
    { icon: SiWhatsapp, href: "https://wa.me/", label: "واتساب" },
    { icon: SiInstagram, href: "https://instagram.com/", label: "انستقرام" },
    { icon: SiX, href: "https://x.com/", label: "إكس" },
    { icon: SiLinkedin, href: "https://linkedin.com/", label: "لينكدإن" },
  ];

  return (
    <footer 
      className="relative overflow-hidden"
      style={{ background: "var(--ma3k-darker)" }}
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logoImage} 
                alt="معك" 
                className="w-12 h-12 rounded-full object-cover"
                style={{ border: "2px solid rgba(79, 169, 152, 0.3)" }}
              />
              <span 
                className="text-xl font-bold"
                style={{ color: "var(--ma3k-beige)" }}
              >
                معك
              </span>
            </div>
            <p 
              className="text-sm leading-relaxed mb-4"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              شريكك الموثوق في التحول الرقمي. نقدم حلول رقمية متكاملة تساعدك على تحقيق أهدافك.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ 
                    background: "rgba(79, 169, 152, 0.1)",
                    color: "var(--ma3k-beige-dark)"
                  }}
                  aria-label={social.label}
                  data-testid={`social-${social.label}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              className="text-base font-semibold mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              روابط سريعة
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span
                      className="text-sm transition-colors cursor-pointer hover:underline"
                      style={{ color: "var(--ma3k-beige-dark)" }}
                      data-testid={`footer-link-${link.label}`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 
              className="text-base font-semibold mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              خدماتنا
            </h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link href={service.href}>
                    <span
                      className="text-sm transition-colors cursor-pointer hover:underline"
                      style={{ color: "var(--ma3k-beige-dark)" }}
                    >
                      {service.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 
              className="text-base font-semibold mb-4"
              style={{ color: "var(--ma3k-beige)" }}
            >
              تواصل معنا
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(79, 169, 152, 0.1)" }}
                >
                  <Mail className="w-4 h-4" style={{ color: "var(--ma3k-green)" }} />
                </div>
                <span 
                  className="text-sm"
                  style={{ color: "var(--ma3k-beige-dark)" }}
                >
                  info@ma3k.com
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(79, 169, 152, 0.1)" }}
                >
                  <Phone className="w-4 h-4" style={{ color: "var(--ma3k-green)" }} />
                </div>
                <span 
                  className="text-sm"
                  style={{ color: "var(--ma3k-beige-dark)" }}
                >
                  +966 50 000 0000
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(79, 169, 152, 0.1)" }}
                >
                  <Clock className="w-4 h-4" style={{ color: "var(--ma3k-green)" }} />
                </div>
                <span 
                  className="text-sm"
                  style={{ color: "var(--ma3k-beige-dark)" }}
                >
                  24/7 متاحون دائماً
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div 
        className="border-t"
        style={{ borderColor: "rgba(79, 169, 152, 0.15)" }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p 
              className="text-sm text-center md:text-right"
              style={{ color: "var(--ma3k-beige-dark)" }}
            >
              جميع الحقوق محفوظة &copy; {new Date().getFullYear()} معك
            </p>
            
            <div className="flex items-center gap-4">
              <Link href="/privacy">
                <span 
                  className="text-sm cursor-pointer hover:underline"
                  style={{ color: "var(--ma3k-beige-dark)" }}
                >
                  سياسة الخصوصية
                </span>
              </Link>
              
              <button
                onClick={scrollToTop}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{ 
                  background: "rgba(79, 169, 152, 0.1)",
                  color: "var(--ma3k-beige)"
                }}
                aria-label="العودة للأعلى"
                data-testid="button-scroll-top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
