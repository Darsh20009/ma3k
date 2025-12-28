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
    { href: "/pricing", label: "الأسعار" },
    { href: "/faq", label: "الأسئلة الشائعة" },
    { href: "/portfolio", label: "أعمالنا" },
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

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "py-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-sm border-b border-border/50" 
            : "py-5 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
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

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`text-sm font-medium transition-colors cursor-pointer hover:text-primary ${
                      isActive(link.href) ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link href="/cart">
                <div className="relative p-2 cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 min-w-[16px] flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground">
                      {totalItems}
                    </Badge>
                  )}
                </div>
              </Link>

              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-medium">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href={getDashboardLink()}>
                      <DropdownMenuItem className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>لوحة التحكم</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">تسجيل الدخول</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">ابدأ الآن</Button>
                  </Link>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[72px] z-40 lg:hidden bg-background border-b border-border shadow-lg p-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-lg font-medium transition-colors ${
                      isActive(link.href) ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
              <hr className="my-2 border-border" />
              {!isAuthenticated && (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">تسجيل الدخول</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">ابدأ الآن</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
