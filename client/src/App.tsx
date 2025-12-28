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
import FAQ from "@/pages/faq";
import Pricing from "@/pages/pricing";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <ContactFloat />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomeNew} />
          <Route path="/about" component={About} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/contact" component={Contact} />
          <Route path="/services" component={ServicesComplete} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/faq" component={FAQ} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/employee-login" component={EmployeeLogin} />
          <Route path="/client-dashboard" component={ClientDashboard} />
          <Route path="/dashboard" component={ClientDashboard} />
          <Route path="/cart" component={Cart} />
          <Route path="/payment" component={CreativePayment} />
          <Route path="/my-projects" component={MyProjectsComplete} />
          <Route path="/employee-dashboard" component={EmployeeDashboardNew} />
          <Route path="/employee-profile" component={EmployeeProfile} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
          <Route path="/student-dashboard" component={StudentDashboard} />
          <Route path="/my-courses" component={MyCoursesComplete} />
          <Route path="/cert-search" component={CertSearch} />
          <Route path="/website-form" component={WebsiteForm} />
          <Route path="/educational-website-form" component={EducationalWebsiteForm} />
          <Route path="/thank-you" component={ThankYou} />
          <Route path="/welcome" component={WelcomeNew} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
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
