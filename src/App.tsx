import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SparklesBackground } from "@/components/ui/sparkles-background";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./providers/WalletProvider";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Roadmap from "./pages/Roadmap";
import Tokenomics from "./pages/Tokenomics";
import FAQ from "./pages/FAQ";
import Dashboard from "./pages/Dashboard";
import Presale from "./pages/Presale";
import { BuyTestPage } from "./pages/BuyTest";
import NotFound from "./pages/NotFound";

const App = () => (
  <WalletProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Global Sparkles Background */}
        <SparklesBackground />
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/tokenomics" element={<Tokenomics />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/presale" element={<Presale />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/buy-test" element={<BuyTestPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </WalletProvider>
);

export default App;
