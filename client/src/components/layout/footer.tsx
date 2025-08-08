import { Link } from "wouter";
import Logo from "@/components/ui/logo";
import { CONTACT_INFO } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-6">
              <Logo isDark />
            </div>
            <p className="text-gray-400 mb-4">
              نُصمم أحلامك الرقمية ونحولها إلى واقع احترافي
            </p>
            <div className="flex space-x-reverse space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">خدماتنا</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  تصميم المواقع
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  تطبيقات الجوال
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  المتاجر الإلكترونية
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  المنصات التعليمية
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">الأدوات</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/tools"
                  className="hover:text-white transition-colors"
                >
                  أداة دمج الأكواد
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  مولد الشعارات
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  مختبر الألوان
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  حاسبة الأسعار
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">روابط مهمة</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  شروط الاستخدام
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.EMAIL}`}
                  className="hover:text-white transition-colors"
                >
                  تواصل معنا
                </a>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="hover:text-white transition-colors"
                >
                  معرض الأعمال
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 معك - جميع الحقوق محفوظة</p>
          <p className="mt-2">
            صُنع بـ <i className="fas fa-heart text-red-500"></i> لمساعدتك في
            تحقيق أحلامك الرقمية
          </p>
        </div>
      </div>
    </footer>
  );
}
