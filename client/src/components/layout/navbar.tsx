import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Menu, ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();

  const navItems = [
    { href: "/", label: "الرئيسية" },
    { href: "/services", label: "خدماتنا" },
    { href: "/tools", label: "الأدوات" },
    { href: "/portfolio", label: "أعمالنا" },
    { href: "/invoices", label: "الفواتير" },
    { href: "#contact", label: "تواصل معنا" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav className="luxury-card border-b border-yellow-400/20 shadow-2xl sticky top-0 z-50 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-18">
          {/* Enhanced Logo */}
          <Link href="/" className="transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-reverse space-x-2">
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-xl animate-gold-pulse">
                م
              </div>
              <span className="text-2xl font-bold animate-text-shimmer">معك</span>
            </div>
          </Link>

          {/* Enhanced Desktop Menu */}
          <div className="hidden md:flex items-center space-x-reverse space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 font-medium hover:scale-105 ${
                  isActive(item.href) 
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg" 
                    : "text-gray-200 hover:bg-gradient-to-r hover:from-yellow-100/20 hover:to-yellow-200/20 hover:text-yellow-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative">
                <Button variant="outline" className="relative p-3 rounded-full hover:scale-110 transition-all duration-300 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="cart-badge">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              
              <Link href="/welcome">
                <Button className="btn-luxury hover:scale-110 transition-all duration-300 rounded-xl px-6 py-3 font-bold">
                  👑 ابدأ رحلتك
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] luxury-card border-r border-yellow-400/20">
              <div className="flex flex-col space-y-6 mt-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-2xl mx-auto mb-3 animate-gold-pulse">
                    م
                  </div>
                  <h3 className="text-xl font-bold animate-text-shimmer">معك</h3>
                </div>
                
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-lg font-medium transition-all duration-300 px-4 py-3 rounded-xl ${
                      isActive(item.href) 
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg" 
                        : "text-gray-200 hover:bg-gradient-to-r hover:from-yellow-100/20 hover:to-yellow-200/20 hover:text-yellow-400"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <div className="space-y-4">
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full py-4 font-bold text-lg rounded-xl relative border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
                      <ShoppingCart className="w-5 h-5 ml-2" />
                      🛒 عربة التسوق
                      {totalItems > 0 && (
                        <span className="cart-badge">
                          {totalItems}
                        </span>
                      )}
                    </Button>
                  </Link>
                  
                  <Link href="/welcome" onClick={() => setIsOpen(false)}>
                    <Button className="w-full btn-luxury rounded-xl py-4 font-bold text-lg">
                      👑 ابدأ رحلتك
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
