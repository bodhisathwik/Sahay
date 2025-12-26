import { Heart, Github, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-gradient-subtle">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/home" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <span className="bg-gradient-primary bg-clip-text text-transparent">Sahay</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Your culturally-aware wellness companion designed for Indian university students. 
              Supporting mental wellness with empathy, understanding, and practical strategies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/aichatbot" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  AI Companion
                </Link>
              </li>
              <li>
                <Link to="/wellnesswatch" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Wellness Watch
                </Link>
              </li>
              <li>
                <Link to="/clarityengine" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Clarity Engine
                </Link>
              </li>
              <li>
                <Link to="/pathways" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pathways
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@sahay.app"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Sahay. Made with care for student wellbeing.
            </p>
            <p className="text-xs text-muted-foreground">
              🚨 If you're in crisis, please call{" "}
              <a href="tel:9152987821" className="text-primary hover:underline font-semibold">
                +91-9152987821
              </a>{" "}
              (AASRA) or local emergency services immediately.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
