import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ProductsSection from "@/components/ProductsSection";
import PortfolioSection from "@/components/PortfolioSection";
import TechnologySection from "@/components/TechnologySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import LightTrail from "@/components/LightTrail";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Light-themed animated background */}
      <AnimatedBackground autoRotate={true} rotationInterval={20000} />
      
      {/* Interactive light trail that follows mouse */}
      <LightTrail intensity={25} color="#FFD700" duration={1200} />
      
      {/* Main content with higher z-index */}
      <div className="relative z-20">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProductsSection />
        <PortfolioSection />
        <TechnologySection />
        <ContactSection />
        <Footer />
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;
