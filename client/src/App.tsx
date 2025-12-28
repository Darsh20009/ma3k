import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ContactFloat from "@/components/layout/contact-float";
import HomeNew from "@/pages/home-new";
import SplashScreen from "@/pages/splash-screen";
import WelcomeNew from "@/pages/welcome-new";
import DigitalWelcome from "@/pages/digital-welcome";
import ServicesComplete from "@/pages/services-complete";
import Cart from "@/pages/cart";
import CreativePayment from "@/pages/creative-payment";
import About from "@/pages/about";
import PrivacyPolicy from "@/pages/privacy-policy";
import Portfolio from "@/pages/portfolio";
import Contact from "@/pages/contact";
import EmployeeLogin from "@/pages/employee-login";
import EmployeeDashboard from "@/pages/employee-dashboard";
import CodeTool from "@/pages/code-tool";
import Ma3kMeet from "@/pages/ma3k-meet";
import CoursesComplete from "@/pages/courses-complete";
import Login from "@/pages/login";
import Register from "@/pages/register";
import MyCoursesComplete from "@/pages/my-courses-complete";
import MyProjectsComplete from "@/pages/my-projects-complete";
import ClientDashboard from "@/pages/client-dashboard";
import EmployeeDashboardNew from "@/pages/employee-dashboard-new";
import AdminDashboard from "@/pages/admin-dashboard";
import CertSearch from "@/pages/cert-search";
import EmployeeProfile from "@/pages/employee-profile";
import WebsiteForm from "@/pages/website-form";
import EducationalWebsiteForm from "@/pages/educational-website-form";
import StudentDashboard from "@/pages/student-dashboard";
import ThankYou from "@/pages/thank-you";
import OpenLife from "@/pages/openlife";
import NotFound from "@/pages/not-found";

/**
 * Main Router
 * Ma3k Company Platform - Unified Routes
 * 
 * Route organization:
 * - Public pages: /
 * - Client portal: /client/*
 * - Employee portal: /employee/*
 * - Student portal: /student/*
 * - Authentication: /login, /register, /employee-login
 */
function Router() {
  return (
    <div className="min-h-screen royal-gradient">
      <Navbar />
      <ContactFloat />
      <Switch>
        {/* === PUBLIC PAGES === */}
        <Route path="/" component={HomeNew} />
        <Route path="/about" component={About} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/contact" component={Contact} />
        <Route path="/services" component={ServicesComplete} />

        {/* === AUTHENTICATION === */}
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/employee-login" component={EmployeeLogin} />

        {/* === CLIENT PORTAL === */}
        <Route path="/client-dashboard" component={ClientDashboard} />
        <Route path="/dashboard" component={ClientDashboard} />
        <Route path="/client" component={ClientDashboard} />
        <Route path="/cart" component={Cart} />
        <Route path="/payment" component={CreativePayment} />
        <Route path="/my-projects" component={MyProjectsComplete} />

        {/* === EMPLOYEE PORTAL === */}
        <Route path="/employee-dashboard" component={EmployeeDashboardNew} />
        <Route path="/employee-profile" component={EmployeeProfile} />
        <Route path="/admin-dashboard" component={AdminDashboard} />

        {/* === STUDENT PORTAL === */}
        <Route path="/student-dashboard" component={StudentDashboard} />
        <Route path="/courses" component={CoursesComplete} />
        <Route path="/my-courses" component={MyCoursesComplete} />
        <Route path="/cert-search" component={CertSearch} />

        {/* === SERVICE FORMS === */}
        <Route path="/website-form" component={WebsiteForm} />
        <Route path="/educational-website-form" component={EducationalWebsiteForm} />

        {/* === TOOLS & FEATURES === */}
        <Route path="/code-tool" component={CodeTool} />
        <Route path="/ma3k-meet" component={Ma3kMeet} />

        {/* === UTILITY PAGES === */}
        <Route path="/thank-you" component={ThankYou} />
        <Route path="/welcome" component={WelcomeNew} />

        {/* === DEPRECATED (for backwards compatibility) === */}
        <Route path="/digital-welcome" component={DigitalWelcome} />
        <Route path="/splash" component={SplashScreen} />
        <Route path="/openlife" component={OpenLife} />

        {/* === 404 FALLBACK === */}
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
