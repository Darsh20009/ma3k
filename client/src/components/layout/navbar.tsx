import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { items } = useCart();
  
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/services", label: "الخدمات" },
    { href: "/about", label: "من نحن" }
  ];

  const isActive = (path: string) => location === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 glass-morphism backdrop-blur-xl border-b border-amber-400/20"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 space-x-reverse"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center font-bold text-xl text-black shadow-xl">
                    معك
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl blur opacity-30 -z-10"></div>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-2xl font-bold text-white">معك</h1>
                  <p className="text-sm text-gray-400">نُصمم أحلامك الرقمية</p>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`relative py-2 px-4 transition-all duration-300 ${
                      isActive(link.href)
                        ? "text-amber-400 font-semibold"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Cart & Menu Toggle */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Cart Icon */}
              <Link href="/cart">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-lg glass-morphism hover:bg-amber-400/10 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6 text-gray-300" />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-amber-400 text-black text-xs min-w-[20px] h-5 flex items-center justify-center p-0">
                      {cartItemsCount}
                    </Badge>
                  )}
                </motion.div>
              </Link>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg glass-morphism hover:bg-amber-400/10 transition-colors"
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6 text-gray-300" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-300" />
                  )}
                </motion.button>
              </div>
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
            className="fixed top-20 left-0 right-0 z-40 md:hidden"
          >
            <div className="mx-6 mt-2 glass-card rounded-2xl overflow-hidden">
              <div className="py-4">
                {navLinks.map((link, index) => (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-6 py-4 text-lg transition-colors ${
                        isActive(link.href)
                          ? "text-amber-400 font-semibold bg-amber-400/10"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}