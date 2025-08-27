import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import SplashScreen from "@/pages/splash-screen";
import WelcomeNew from "@/pages/welcome-new";
import Services from "@/pages/services";
import ServicesNew from "@/pages/services-new";
import Cart from "@/pages/cart";
import Payment from "@/pages/payment";
import SimplePayment from "@/pages/simple-payment";
import CreativePayment from "@/pages/creative-payment";
import About from "@/pages/about";
import PrivacyPolicy from "@/pages/privacy-policy";
import Portfolio from "@/pages/portfolio";
import Contact from "@/pages/contact";
import EmployeeLogin from "@/pages/employee-login";
import EmployeeDashboard from "@/pages/employee-dashboard";
import CodeTool from "@/pages/code-tool";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen royal-gradient">
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/splash" component={SplashScreen} />
        <Route path="/welcome" component={WelcomeNew} />
        <Route path="/home-old" component={Home} />
        <Route path="/services" component={ServicesNew} />
        <Route path="/services-old" component={Services} />
        <Route path="/cart" component={Cart} />
        <Route path="/payment" component={CreativePayment} />
        <Route path="/payment-simple" component={SimplePayment} />
        <Route path="/payment-old" component={Payment} />
        <Route path="/about" component={About} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/contact" component={Contact} />
        <Route path="/employee-login" component={EmployeeLogin} />
        <Route path="/employee-dashboard" component={EmployeeDashboard} />
        <Route path="/code-tool" component={CodeTool} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
