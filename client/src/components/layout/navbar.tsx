import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, ChevronDown, LogOut, LayoutDashboard, BookOpen, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logoImage from "@assets/Screenshot 2025-01-18 200736_1760982548460.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const { totalItems } = useCart();
  const { user, isAuthenticated, userType, logout } = useAuth();
  
  const cartItemsCount = totalItems;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/services", label: "الخدمات" },
    { href: "/courses", label: "الدورات" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const getDashboardLink = () => {
    if (userType === "student") return "/student-dashboard";
    if (userType === "client") return "/client-dashboard";
    if (userType === "employee") return "/employee-dashboard-new";
    return "/";
  };

  const getInitials = (name: string) => {
    if (!name) return "م";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2);
  };

  const getUserTypeLabel = () => {
    if (userType === "student") return "طالب";
    if (userType === "client") return "عميل";
    if (userType === "employee") return "موظف";
    return "";
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "py-2" : "py-3"
        }`}
        style={{ 
          background: isScrolled 
            ? "rgba(13, 25, 25, 0.95)" 
            : "rgba(13, 25, 25, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: isScrolled ? "1px solid rgba(79, 169, 152, 0.15)" : "none"
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div
                className="flex items-center gap-3 cursor-pointer"
                data-testid="link-logo"
              >
                <img 
                  src={logoImage} 
                  alt="معك" 
                  className="w-12 h-12 rounded-full object-cover"
                  style={{
                    border: "2px solid rgba(79, 169, 152, 0.3)"
                  }}
                />
                <span 
                  className="text-xl font-bold hidden sm:block"
                  style={{ color: "var(--ma3k-beige)" }}
                >
                  معك
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive(link.href)
                        ? ""
                        : "hover:bg-white/5"
                    }`}
                    style={{
                      color: isActive(link.href) ? "var(--ma3k-green)" : "var(--ma3k-beige-dark)",
                      background: isActive(link.href) ? "rgba(16, 185, 129, 0.1)" : "transparent"
                    }}
                    data-testid={`link-${link.label}`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Cart */}
              <Link href="/cart">
                <div
                  className="relative p-2 rounded-lg transition-colors cursor-pointer hover:bg-white/5"
                  data-testid="button-cart"
                >
                  <ShoppingCart className="w-5 h-5" style={{ color: "var(--ma3k-beige)" }} />
                  {cartItemsCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0"
                      style={{
                        background: "var(--ma3k-green)",
                        color: "var(--ma3k-darker)"
                      }}
                      data-testid="text-cart-count"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </div>
              </Link>

              {/* User Menu or Login Button */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="gap-2 px-2"
                      style={{
                        color: "var(--ma3k-beige)",
                      }}
                      data-testid="button-user-menu"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback 
                          className="text-xs font-bold"
                          style={{
                            background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                            color: "white"
                          }}
                        >
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden xl:flex flex-col items-start">
                        <span className="text-sm font-medium" style={{ color: "var(--ma3k-beige)" }}>
                          {user.fullName}
                        </span>
                        <span className="text-xs" style={{ color: "var(--ma3k-beige-dark)" }}>
                          {getUserTypeLabel()}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4" style={{ color: "var(--ma3k-beige-dark)" }} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56"
                    style={{
                      background: "var(--ma3k-darker)",
                      border: "1px solid rgba(79, 169, 152, 0.2)"
                    }}
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium" style={{ color: "var(--ma3k-beige)" }}>
                        مرحباً، {user.fullName}
                      </p>
                      <p className="text-xs" style={{ color: "var(--ma3k-beige-dark)" }}>
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator style={{ background: "rgba(79, 169, 152, 0.15)" }} />
                    
                    <Link href={getDashboardLink()}>
                      <DropdownMenuItem 
                        className="cursor-pointer gap-2"
                        style={{ color: "var(--ma3k-beige)" }}
                        data-testid="menu-dashboard"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        لوحة التحكم
                      </DropdownMenuItem>
                    </Link>
                    
                    {userType === "student" && (
                      <Link href="/my-courses">
                        <DropdownMenuItem 
                          className="cursor-pointer gap-2"
                          style={{ color: "var(--ma3k-beige)" }}
                          data-testid="menu-my-courses"
                        >
                          <BookOpen className="w-4 h-4" />
                          دوراتي
                        </DropdownMenuItem>
                      </Link>
                    )}
                    
                    {userType === "client" && (
                      <Link href="/my-projects">
                        <DropdownMenuItem 
                          className="cursor-pointer gap-2"
                          style={{ color: "var(--ma3k-beige)" }}
                          data-testid="menu-my-projects"
                        >
                          <Briefcase className="w-4 h-4" />
                          مشاريعي
                        </DropdownMenuItem>
                      </Link>
                    )}
                    
                    <DropdownMenuSeparator style={{ background: "rgba(79, 169, 152, 0.15)" }} />
                    
                    <DropdownMenuItem 
                      className="cursor-pointer gap-2 text-red-400"
                      onClick={handleLogout}
                      data-testid="menu-logout"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    style={{
                      borderColor: "rgba(79, 169, 152, 0.3)",
                      color: "var(--ma3k-beige)",
                      background: "transparent"
                    }}
                    data-testid="button-login"
                  >
                    <User className="w-4 h-4" />
                    تسجيل الدخول
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Mobile Cart */}
              <Link href="/cart">
                <div
                  className="relative p-2 rounded-lg cursor-pointer"
                  data-testid="button-cart-mobile"
                >
                  <ShoppingCart className="w-5 h-5" style={{ color: "var(--ma3k-beige)" }} />
                  {cartItemsCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 text-xs min-w-[16px] h-[16px] flex items-center justify-center p-0"
                      style={{
                        background: "var(--ma3k-green)",
                        color: "var(--ma3k-darker)"
                      }}
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </div>
              </Link>

              {/* Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/5"
                data-testid="button-menu-toggle"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" style={{ color: "var(--ma3k-beige)" }} />
                ) : (
                  <Menu className="w-6 h-6" style={{ color: "var(--ma3k-beige)" }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(0, 0, 0, 0.5)" }}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 lg:hidden overflow-y-auto"
              style={{ 
                background: "var(--ma3k-darker)",
                borderRight: "1px solid rgba(79, 169, 152, 0.15)"
              }}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: "1px solid rgba(79, 169, 152, 0.15)" }}>
                  <div className="flex items-center gap-3">
                    <img 
                      src={logoImage} 
                      alt="معك" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span 
                      className="text-lg font-bold"
                      style={{ color: "var(--ma3k-beige)" }}
                    >
                      معك
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/5"
                  >
                    <X className="w-5 h-5" style={{ color: "var(--ma3k-beige)" }} />
                  </button>
                </div>

                {/* User Info (Mobile) */}
                {isAuthenticated && user && (
                  <div 
                    className="mb-4 p-3 rounded-lg"
                    style={{ background: "rgba(79, 169, 152, 0.1)" }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback 
                          className="text-sm font-bold"
                          style={{
                            background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                            color: "white"
                          }}
                        >
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--ma3k-beige)" }}>
                          {user.fullName}
                        </p>
                        <p className="text-xs" style={{ color: "var(--ma3k-beige-dark)" }}>
                          {getUserTypeLabel()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-1">
                  {navLinks.map((link, index) => (
                    <Link key={link.href} href={link.href}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors cursor-pointer ${
                          isActive(link.href) ? "" : "hover:bg-white/5"
                        }`}
                        style={{
                          color: isActive(link.href) ? "var(--ma3k-green)" : "var(--ma3k-beige-dark)",
                          background: isActive(link.href) ? "rgba(16, 185, 129, 0.1)" : "transparent"
                        }}
                        data-testid={`mobile-link-${link.label}`}
                      >
                        {link.label}
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* User Actions */}
                <div className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(79, 169, 152, 0.15)" }}>
                  {isAuthenticated && user ? (
                    <div className="space-y-2">
                      <Link href={getDashboardLink()}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                          style={{ color: "var(--ma3k-beige)" }}
                          onClick={() => setIsMenuOpen(false)}
                          data-testid="mobile-menu-dashboard"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          لوحة التحكم
                        </Button>
                      </Link>
                      
                      {userType === "student" && (
                        <Link href="/my-courses">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2"
                            style={{ color: "var(--ma3k-beige)" }}
                            onClick={() => setIsMenuOpen(false)}
                            data-testid="mobile-menu-my-courses"
                          >
                            <BookOpen className="w-4 h-4" />
                            دوراتي
                          </Button>
                        </Link>
                      )}
                      
                      {userType === "client" && (
                        <Link href="/my-projects">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2"
                            style={{ color: "var(--ma3k-beige)" }}
                            onClick={() => setIsMenuOpen(false)}
                            data-testid="mobile-menu-my-projects"
                          >
                            <Briefcase className="w-4 h-4" />
                            مشاريعي
                          </Button>
                        </Link>
                      )}
                      
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-red-400"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        data-testid="mobile-menu-logout"
                      >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login">
                      <Button
                        className="w-full gap-2"
                        style={{
                          background: "linear-gradient(135deg, var(--ma3k-teal), var(--ma3k-green))",
                          color: "white"
                        }}
                        onClick={() => setIsMenuOpen(false)}
                        data-testid="mobile-button-login"
                      >
                        <User className="w-4 h-4" />
                        تسجيل الدخول
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
