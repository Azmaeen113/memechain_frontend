import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import logo from "/memelogo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHeroSection, setIsHeroSection] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/") {
        const heroSection = document.querySelector('section');
        if (heroSection) {
          const rect = heroSection.getBoundingClientRect();
          setIsHeroSection(rect.top <= 0 && rect.bottom > 0);
        }
      } else {
        setIsHeroSection(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Roadmap", path: "/roadmap" },
    { name: "Tokenomics", path: "/tokenomics" },
    { name: "FAQ", path: "/faq" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isHeroSection 
        ? 'bg-transparent backdrop-blur-none border-transparent' 
        : 'bg-card/10 backdrop-blur-xl border-b border-white/20 shadow-lg'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={logo} 
              alt="MemeChain" 
              className="h-10 w-10 md:h-12 md:w-12 animate-float"
            />
            <span className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
              isHeroSection ? 'text-white drop-shadow-lg' : 'text-gradient'
            }`}>
              MemeChain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) 
                    ? (isHeroSection ? "text-white drop-shadow-lg" : "text-primary")
                    : (isHeroSection ? "text-white/80 drop-shadow-lg" : "text-muted-foreground")
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Connect Wallet Button */}
            <ConnectWalletButton 
              variant="nav" 
              className={isHeroSection ? "backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" : ""}
            />
            
            <Link to="/presale">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
                Join Presale
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors duration-300 ${
              isHeroSection ? 'text-white drop-shadow-lg' : 'text-foreground'
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive(link.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Connect Wallet Button */}
            <div className="py-2">
              <ConnectWalletButton 
                variant="default" 
                size="sm"
                className="w-full"
              />
            </div>
            
            <Link to="/presale" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Join Presale
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
