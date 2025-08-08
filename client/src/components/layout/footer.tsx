import { Link } from "wouter";
import Logo from "@/components/ui/logo";
import { CONTACT_INFO } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <div className="flex items-center space-x-reverse space-x-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl animate-glow-pulse">
                  م
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">معك</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              🎨 نُصمم أحلامك الرقمية ونحولها إلى واقع احترافي بإبداع لا محدود
            </p>
            <div className="flex space-x-reverse space-x-4">
              {[
                { icon: 'fab fa-twitter', color: 'hover:text-blue-400' },
                { icon: 'fab fa-linkedin', color: 'hover:text-blue-500' },
                { icon: 'fab fa-github', color: 'hover:text-purple-400' },
                { icon: 'fab fa-instagram', color: 'hover:text-pink-400' },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-gray-300 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm`}
                >
                  <i className={`${social.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <h4 className="text-xl font-bold mb-6 text-blue-300 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full ml-3 animate-pulse"></span>
              🎯 خدماتنا
            </h4>
            <ul className="space-y-3 text-gray-300">
              {[
                { text: '🌐 تصميم المواقع', href: '/services' },
                { text: '📱 تطبيقات الجوال', href: '/services' },
                { text: '🛒 المتاجر الإلكترونية', href: '/services' },
                { text: '🎓 المنصات التعليمية', href: '/services' },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="hover:text-blue-300 hover:translate-x-2 transition-all duration-300 block py-1"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <h4 className="text-xl font-bold mb-6 text-purple-300 flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full ml-3 animate-pulse"></span>
              🛠️ الأدوات
            </h4>
            <ul className="space-y-3 text-gray-300">
              {[
                { text: '⚡ أداة دمج الأكواد', href: '/tools' },
                { text: '🎨 مولد الشعارات', href: '#' },
                { text: '🌈 مختبر الألوان', href: '#' },
                { text: '💰 حاسبة الأسعار', href: '#' },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="hover:text-purple-300 hover:translate-x-2 transition-all duration-300 block py-1"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <h4 className="text-xl font-bold mb-6 text-green-300 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full ml-3 animate-pulse"></span>
              🔗 روابط مهمة
            </h4>
            <ul className="space-y-3 text-gray-300">
              {[
                { text: '📜 شروط الاستخدام', href: '/privacy' },
                { text: '🔒 سياسة الخصوصية', href: '/privacy' },
                { text: '📧 تواصل معنا', href: `mailto:${CONTACT_INFO.EMAIL}` },
                { text: '🎨 معرض الأعمال', href: '/portfolio' },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="hover:text-green-300 hover:translate-x-2 transition-all duration-300 block py-1"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

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
