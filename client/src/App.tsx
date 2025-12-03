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
import CertSearch from "@/pages/cert-search";
import EmployeeProfile from "@/pages/employee-profile";
import WebsiteForm from "@/pages/website-form";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen royal-gradient">
      <Navbar />
      <ContactFloat />
      <Switch>
        <Route path="/" component={HomeNew} />
        <Route path="/digital-welcome" component={DigitalWelcome} />
        <Route path="/splash" component={SplashScreen} />
        <Route path="/welcome" component={WelcomeNew} />
        <Route path="/services" component={ServicesComplete} />
        <Route path="/cart" component={Cart} />
        <Route path="/payment" component={CreativePayment} />
        <Route path="/about" component={About} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/contact" component={Contact} />
        <Route path="/courses" component={CoursesComplete} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/my-courses" component={MyCoursesComplete} />
        <Route path="/my-projects" component={MyProjectsComplete} />
        <Route path="/client-dashboard" component={ClientDashboard} />
        <Route path="/employee-dashboard-new" component={EmployeeDashboardNew} />
        <Route path="/cert-search" component={CertSearch} />
        <Route path="/employee-profile" component={EmployeeProfile} />
        <Route path="/employee-login" component={EmployeeLogin} />
        <Route path="/employee-dashboard" component={EmployeeDashboard} />
        <Route path="/code-tool" component={CodeTool} />
        <Route path="/ma3k-meet" component={Ma3kMeet} />
        <Route path="/website-form" component={WebsiteForm} />
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
