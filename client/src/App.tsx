import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import WelcomeNew from "@/pages/welcome-new";
import Services from "@/pages/services";
import ServicesNew from "@/pages/services-new";
import Cart from "@/pages/cart";
import Payment from "@/pages/payment";
import SimplePayment from "@/pages/simple-payment";
import CreativePayment from "@/pages/creative-payment";
import AboutUs from "@/pages/about-us";
import WebsiteForm from "@/pages/website-form";
import WebsiteSpecifications from "@/pages/website-specifications";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen royal-gradient">
      <Navbar />
      <Switch>
        <Route path="/" component={WelcomeNew} />
        <Route path="/home-old" component={Home} />
        <Route path="/services" component={ServicesNew} />
        <Route path="/services-old" component={Services} />
        <Route path="/website-form" component={WebsiteForm} />
        <Route path="/website-specifications" component={WebsiteSpecifications} />
        <Route path="/cart" component={Cart} />
        <Route path="/payment" component={CreativePayment} />
        <Route path="/payment-simple" component={SimplePayment} />
        <Route path="/payment-old" component={Payment} />
        <Route path="/about" component={AboutUs} />
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
