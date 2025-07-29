import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Building, Home, Smartphone, ArrowRight } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Lightbulb,
      title: "LED Lighting Solutions",
      description: "High-efficiency LED systems designed for optimal performance and longevity.",
      features: ["Energy-efficient designs", "Long lifespan", "Custom color temperatures", "Dimming capabilities"],
      applications: "Perfect for residential, commercial, and industrial applications"
    },
    {
      icon: Building,
      title: "Architectural Lighting",
      description: "Dramatic lighting designs that enhance architectural features and create visual impact.",
      features: ["Facade illumination", "Landscape lighting", "Accent lighting", "Custom fixtures"],
      applications: "Hotels, offices, retail spaces, and public buildings"
    },
    {
      icon: Home,
      title: "Custom Lighting Solutions",
      description: "Bespoke lighting designs tailored to your specific requirements and vision.",
      features: ["Made-to-order fixtures", "Unique designs", "Brand integration", "Artistic elements"],
      applications: "Luxury residences, boutique hotels, and signature spaces"
    },
    {
      icon: Smartphone,
      title: "Smart Lighting Systems",
      description: "Intelligent lighting with automation, remote control, and energy optimization.",
      features: ["IoT integration", "Mobile app control", "Scheduling", "Energy monitoring"],
      applications: "Smart homes, modern offices, and automated facilities"
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Our Services</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Comprehensive Lighting
            <span className="text-primary"> Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From concept to installation, we deliver end-to-end lighting solutions that combine 
            innovative technology with exceptional craftsmanship.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="border-0 bg-card hover:bg-card/80 transition-all duration-300 group hover:shadow-elegant">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <p className="text-muted-foreground">{service.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Key Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold mb-2">Applications:</h4>
                  <p className="text-sm text-muted-foreground">{service.applications}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Overview */}
        <div className="bg-gradient-hero rounded-3xl p-12 border border-primary/20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Our Design Process</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every project follows our proven methodology to ensure exceptional results
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", desc: "Understanding your vision and requirements" },
              { step: "02", title: "Design", desc: "Creating custom lighting solutions" },
              { step: "03", title: "Manufacturing", desc: "Precision CNC machining and assembly" },
              { step: "04", title: "Installation", desc: "Professional setup and commissioning" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;