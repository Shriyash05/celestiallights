import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import Counter from "@/components/Counter";
import heroImage from "@/assets/hero-lighting.jpg";

const HeroSection = () => {
  const handleRequestConsultation = async () => {
    // Open WhatsApp chat
    window.open('https://wa.me/918976453765', '_blank');
    
    // Send quote email
    try {
      const response = await fetch('/functions/v1/send-quote-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectType: 'Consultation Request',
          customerName: 'Website Visitor',
        }),
      });
      
      if (response.ok) {
        console.log('Quote email sent successfully');
      }
    } catch (error) {
      console.error('Error sending quote email:', error);
    }
  };
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Celestial Lights architectural installation" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-left">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              24+ Years of Excellence
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Make Your
              <span className="block text-transparent bg-gradient-accent bg-clip-text">
                Ambience Heavenly
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Transform spaces with bespoke LED and architectural lighting solutions. 
              From design to installation, we craft illumination that inspires.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/portfolio">
              <Button variant="hero" size="lg" className="group">
                Explore Our Portfolio
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="premium" size="lg" onClick={handleRequestConsultation}>
              Request Consultation
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3 mx-auto">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <Counter 
                end={24} 
                suffix="+" 
                className="text-2xl font-bold text-primary"
                duration={2500}
              />
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3 mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <Counter 
                end={500} 
                suffix="+" 
                className="text-2xl font-bold text-primary"
                duration={3000}
              />
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3 mx-auto">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <Counter 
                end={100} 
                suffix="%" 
                className="text-2xl font-bold text-primary"
                duration={2000}
              />
              <div className="text-sm text-muted-foreground">Custom Solutions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;