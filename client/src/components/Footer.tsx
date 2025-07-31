import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin, Lightbulb } from "lucide-react";
import QuoteModal from "@/components/QuoteModal";
import CallUsButton from "@/components/CallUsButton";

const Footer = () => {

  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Technology", href: "#technology" },
    { name: "Contact", href: "#contact" }
  ];

  const services = [
    "LED Lighting Solutions",
    "Architectural Lighting",
    "Custom Lighting Design",
    "Smart Lighting Systems",
    "CNC Machining Services"
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Lightbulb className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-xl font-bold">Celestial Lights</h3>
                <p className="text-xs text-muted-foreground">by Siddhivinayak Engineering</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Transforming spaces through innovative LED and architectural lighting solutions. 
              24+ years of precision engineering excellence.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+91 89764 53765</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">info.celestiallight@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">Mumbai, Maharashtra</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service} className="text-muted-foreground text-sm">
                  {service}
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Get Started</h4>
            <p className="text-muted-foreground mb-6">
              Ready to illuminate your project? Contact us for a free consultation.
            </p>
            <div className="space-y-4">
              <QuoteModal 
                type="quote"
                trigger={
                  <Button variant="outline" className="w-full">
                    Request Quote
                  </Button>
                }
              />
              <QuoteModal 
                type="consultation"
                trigger={
                  <Button variant="outline" className="w-full">
                    Schedule Consultation
                  </Button>
                }
              />
              <CallUsButton 
                variant="outline" 
                className="w-full"
                children="Call Us Now"
              />
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © Celestial Lights. A subsidiary of Siddhivinayak Engineering. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Careers
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;