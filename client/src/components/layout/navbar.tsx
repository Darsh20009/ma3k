import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, GraduationCap, Home, Briefcase, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import logoImage from "@assets/Screenshot 2025-01-18 200736_1760982548460.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems } = useCart();
  
  const cartItemsCount = totalItems;

  // القوائم اليمنى واليسرى مع اللوجو في المنتصف
  const leftLinks = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/services", label: "الخدمات", icon: Briefcase },
    { href: "/courses", label: "الدورات", icon: GraduationCap },
  ];

  const rightLinks = [
    { href: "/about", label: "تعرف علينا", icon: Info },
  ];

  const isActive = (path: string) => location === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 glass-morphism backdrop-blur-xl border-b"
        style={{ borderColor: "var(--ma3k-teal-light)" }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Desktop: القائمة اليسرى */}
            <div className="hidden lg:flex items-center space-x-6 space-x-reverse flex-1">
              {leftLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`relative py-2 px-4 transition-all duration-300 flex items-center gap-2 ${
                      isActive(link.href)
                        ? "font-semibold"
                        : "hover:text-ma3k-beige"
                    }`}
                    style={{
                      color: isActive(link.href) ? "var(--ma3k-green)" : "var(--ma3k-beige-dark)"
                    }}
                    data-testid={`link-${link.label}`}
                  >
                    <link.icon size={18} />
                    {link.label}
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        style={{
                          background: "linear-gradient(90deg, var(--ma3k-teal), var(--ma3k-green))"
                        }}
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Logo في المنتصف */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center mx-4"
                data-testid="link-logo"
              >
                <div className="relative">
                  <img 
                    src={logoImage} 
                    alt="معك - Ma3k" 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                    style={{
                      boxShadow: "0 0 20px var(--glow-teal), 0 0 40px var(--glow-green)"
                    }}
                  />
                  <div 
                    className="absolute -inset-1 rounded-full blur opacity-30 -z-10"
                    style={{
                      background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))"
                    }}
                  />
                </div>
              </motion.div>
            </Link>

            {/* Desktop: القائمة اليمنى */}
            <div className="hidden lg:flex items-center space-x-6 space-x-reverse flex-1 justify-end">
              {rightLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`relative py-2 px-4 transition-all duration-300 flex items-center gap-2 ${
                      isActive(link.href)
                        ? "font-semibold"
                        : "hover:text-ma3k-beige"
                    }`}
                    style={{
                      color: isActive(link.href) ? "var(--ma3k-green)" : "var(--ma3k-beige-dark)"
                    }}
                    data-testid={`link-${link.label}`}
                  >
                    <link.icon size={18} />
                    {link.label}
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="activeTabRight"
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        style={{
                          background: "linear-gradient(90deg, var(--ma3k-teal), var(--ma3k-green))"
                        }}
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              ))}

              {/* Cart Icon */}
              <Link href="/cart">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-lg glass-morphism transition-colors"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)"
                  }}
                  data-testid="button-cart"
                >
                  <ShoppingCart className="w-6 h-6" style={{ color: "var(--ma3k-beige)" }} />
                  {cartItemsCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 text-xs min-w-[20px] h-5 flex items-center justify-center p-0"
                      style={{
                        background: "var(--ma3k-green)",
                        color: "var(--ma3k-darker)"
                      }}
                      data-testid={`text-cart-count`}
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </motion.div>
              </Link>

              {/* Login Icon */}
              <Link href="/login">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass-morphism transition-colors"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)"
                  }}
                  data-testid="button-login"
                >
                  <User className="w-5 h-5" style={{ color: "var(--ma3k-beige)" }} />
                  <span style={{ color: "var(--ma3k-beige)" }} className="text-sm">تسجيل الدخول</span>
                </motion.div>
              </Link>
            </div>

            {/* Mobile: Cart & Menu Toggle */}
            <div className="flex lg:hidden items-center space-x-3 space-x-reverse">
              <Link href="/cart">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-lg glass-morphism"
                  data-testid="button-cart-mobile"
                >
                  <ShoppingCart className="w-5 h-5" style={{ color: "var(--ma3k-beige)" }} />
                  {cartItemsCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 text-xs min-w-[18px] h-4 flex items-center justify-center p-0"
                      style={{
                        background: "var(--ma3k-green)",
                        color: "var(--ma3k-darker)"
                      }}
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </motion.div>
              </Link>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg glass-morphism"
                data-testid="button-menu-toggle"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" style={{ color: "var(--ma3k-beige)" }} />
                ) : (
                  <Menu className="w-6 h-6" style={{ color: "var(--ma3k-beige)" }} />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-40 lg:hidden"
          >
            <div className="mx-4 mt-2 glass-card rounded-2xl overflow-hidden">
              <div className="py-4">
                {[...leftLinks, ...rightLinks].map((link, index) => (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-6 py-4 text-lg transition-colors ${
                        isActive(link.href)
                          ? "font-semibold"
                          : ""
                      }`}
                      style={{
                        color: isActive(link.href) ? "var(--ma3k-green)" : "var(--ma3k-beige-dark)",
                        background: isActive(link.href) ? "var(--glass-bg)" : "transparent"
                      }}
                      data-testid={`mobile-link-${link.label}`}
                    >
                      <link.icon size={20} />
                      {link.label}
                    </motion.div>
                  </Link>
                ))}
                
                <Link href="/login">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-6 py-4 text-lg"
                    style={{
                      color: location === "/login" ? "var(--ma3k-green)" : "var(--ma3k-beige-dark)",
                      background: location === "/login" ? "var(--glass-bg)" : "transparent"
                    }}
                    data-testid="mobile-link-login"
                  >
                    <User size={20} />
                    تسجيل الدخول
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
