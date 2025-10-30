import { Link } from "react-router-dom";
import { Twitter, Send, MessageCircle, Rocket } from "lucide-react";
import { Boxes } from "@/components/ui/background-boxes";
import logo from "/memelogo.png";

const Footer = () => {
  return (
    <footer className="relative bg-card border-t border-border sparkles-hidden overflow-hidden">
      {/* Background Boxes */}
      <div className="absolute inset-0 w-full h-full bg-card z-0 [mask-image:radial-gradient(transparent,white)]" />
      <Boxes />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="MemeChain" className="h-10 w-10" />
              <span className="text-xl font-bold text-gradient">MemeChain</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The Blockchain That Memes Harder Than You Do!
            </p>
            <div className="flex items-center justify-center">
              <Rocket className="w-4 h-4 text-primary" />
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                <Send size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link to="/tokenomics" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Tokenomics
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Whitepaper
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Brand Assets
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest updates
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 MemeChain. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
