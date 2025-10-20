import { Link } from "wouter";
import Logo from "@/components/ui/logo";
import { CONTACT_INFO } from "@/lib/constants";

export default function Footer() {
  return (
    <footer 
      className="py-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom right, var(--ma3k-darker), var(--bg-primary))"
      }}
    >
      <div className="absolute inset-0 cyber-grid opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">

        <div 
          className="border-t mt-12 pt-8 text-center"
          style={{ borderColor: "var(--ma3k-teal-light)" }}
        >
          <div className="mb-6">
            <div 
              className="inline-flex items-center justify-center space-x-reverse space-x-2 px-6 py-3 glass-morphism rounded-full"
              style={{
                border: "1px solid var(--ma3k-green)",
                background: "linear-gradient(135deg, var(--ma3k-darker), var(--bg-primary))"
              }}
            >
              <span 
                className="text-lg font-semibold"
                style={{ color: "var(--ma3k-beige)" }}
              >
                &copy; 2025 معك - جميع الحقوق محفوظة
              </span>
            </div>
          </div>
          <p 
            className="text-lg"
            style={{ color: "var(--ma3k-beige-dark)" }}
          >
            صُنع بـ <i className="fas fa-heart animate-pulse mx-2" style={{ color: "var(--ma3k-green)" }}></i> و إبداع لا محدود
            <span 
              className="block mt-2"
              style={{ color: "var(--ma3k-teal)" }}
            >
              🚀 لمساعدتك في تحقيق أحلامك الرقمية
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
