import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Zap, Shield, Wrench, Wifi, BarChart3 } from "lucide-react";

const TechnologySection = () => {
  const technologies = [
    {
      icon: Wrench,
      title: "Precision CNC Machining",
      description: "State-of-the-art CNC machines ensure perfect tolerances and superior finish quality for every component.",
      benefits: ["±0.01mm precision", "Consistent quality", "Complex geometries", "Superior surface finish"]
    },
    {
      icon: Cpu,
      title: "Advanced Automation",
      description: "Automated manufacturing processes reduce human error and increase production efficiency.",
      benefits: ["Consistent output", "Reduced lead times", "24/7 production", "Quality assurance"]
    },
    {
      icon: Wifi,
      title: "Smart Controls",
      description: "IoT-enabled lighting systems with wireless connectivity for remote monitoring and control.",
      benefits: ["Remote operation", "Real-time monitoring", "Predictive maintenance", "Energy optimization"]
    },
    {
      icon: Zap,
      title: "Energy Efficiency",
      description: "Latest LED technology combined with smart power management for maximum energy savings.",
      benefits: ["Up to 80% energy savings", "Extended lifespan", "Reduced heat generation", "Lower maintenance costs"]
    },
    {
      icon: Shield,
      title: "Durability Engineering",
      description: "Robust designs tested for harsh environments with IP65+ ratings and extended warranties.",
      benefits: ["Weather resistant", "Corrosion protection", "Shock resistance", "5+ year warranty"]
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Built-in sensors and data analytics provide insights into usage patterns and optimization opportunities.",
      benefits: ["Usage tracking", "Performance metrics", "Maintenance alerts", "Cost analysis"]
    }
  ];

  const innovations = [
    "Proprietary thermal management systems",
    "Custom LED driver circuits",
    "Wireless mesh networking",
    "AI-powered dimming algorithms",
    "Modular design architecture",
    "Advanced optics engineering"
  ];

  return (
    <section id="technology" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Technology & Innovation</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Cutting-Edge
            <span className="text-primary"> Technology</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We leverage the latest in manufacturing technology, smart systems, and energy-efficient 
            designs to deliver lighting solutions that set new industry standards.
          </p>
        </div>

        {/* Technology Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {technologies.map((tech, index) => (
            <Card key={index} className="border-0 bg-card hover:bg-card/80 transition-all duration-300 group hover:shadow-elegant">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <tech.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{tech.title}</CardTitle>
                <p className="text-muted-foreground">{tech.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tech.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Innovation Showcase */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Our Innovation Advantage</h3>
            <p className="text-lg text-muted-foreground mb-8">
              With 24+ years of engineering excellence, we continuously push the boundaries 
              of what's possible in lighting technology. Our R&D investments ensure we stay 
              ahead of industry trends and deliver future-ready solutions.
            </p>
            
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">Recent Innovations:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {innovations.map((innovation, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-muted-foreground">{innovation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-hero rounded-3xl p-8 border border-primary/20">
            <h4 className="text-2xl font-bold mb-6 text-center">Technology Benefits</h4>
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">80%</div>
                <div className="text-sm text-muted-foreground">Energy Savings</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Hours Lifespan</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">±0.01mm</div>
                <div className="text-sm text-muted-foreground">Precision</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">IP65+</div>
                <div className="text-sm text-muted-foreground">Protection Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Flow */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">Manufacturing Excellence</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Design", desc: "CAD modeling and optimization", icon: "🎨" },
              { title: "Machining", desc: "Precision CNC manufacturing", icon: "⚙️" },
              { title: "Assembly", desc: "Quality-controlled assembly", icon: "🔧" },
              { title: "Testing", desc: "Rigorous quality testing", icon: "✅" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {step.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;