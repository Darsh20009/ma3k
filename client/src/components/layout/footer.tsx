import { Link } from "wouter";
import Logo from "@/components/ui/logo";
import { CONTACT_INFO } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center space-x-reverse space-x-2 px-6 py-3 glass-morphism rounded-full">
              <span className="text-lg font-semibold text-white">&copy; 2025 معك - جميع الحقوق محفوظة</span>
            </div>
          </div>
          <p className="text-gray-300 text-lg">
            صُنع بـ <i className="fas fa-heart text-red-400 animate-pulse mx-2"></i> و إبداع لا محدود
            <span className="block mt-2 text-blue-300">🚀 لمساعدتك في تحقيق أحلامك الرقمية</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
