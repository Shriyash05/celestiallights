import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Filter } from "lucide-react";
import residentialImage from "@/assets/residential-lighting.jpg";
import commercialImage from "@/assets/commercial-project.jpg";

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Luxury Residential Complex",
      category: "residential",
      image: residentialImage,
      description: "Smart LED integration with automated control systems for modern living spaces.",
      features: ["Smart Controls", "Energy Efficient", "Custom Design"],
      location: "Mumbai, Maharashtra"
    },
    {
      id: 2,
      title: "Corporate Headquarters",
      category: "commercial",
      image: commercialImage,
      description: "Architectural facade lighting creating a stunning nighttime landmark.",
      features: ["Facade Lighting", "RGB Controls", "Weather Resistant"],
      location: "Pune, Maharashtra"
    },
    {
      id: 3,
      title: "Hotel Ambience Project",
      category: "hospitality",
      image: residentialImage,
      description: "Sophisticated lighting design enhancing guest experience and brand identity.",
      features: ["Mood Lighting", "Dimming Systems", "Brand Integration"],
      location: "Goa"
    },
    {
      id: 4,
      title: "Industrial Facility",
      category: "industrial",
      image: commercialImage,
      description: "High-performance LED solutions for 24/7 industrial operations.",
      features: ["High Durability", "Low Maintenance", "Safety Compliant"],
      location: "Chennai, Tamil Nadu"
    }
  ];

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "residential", label: "Residential" },
    { id: "commercial", label: "Commercial" },
    { id: "hospitality", label: "Hospitality" },
    { id: "industrial", label: "Industrial" }
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Our Portfolio</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Illuminating Success
            <span className="text-primary"> Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our diverse portfolio of lighting projects that showcase innovation, 
            quality, and the transformative power of exceptional illumination.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className="transition-all duration-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {filteredProjects.map((project, index) => (
            <Card key={project.id} className="overflow-hidden border-0 bg-background hover:shadow-elegant transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Button 
                  variant="glow" 
                  size="icon"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.location}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {project.category}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-hero rounded-3xl p-12 border border-primary/20">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how we can transform your space with custom lighting solutions 
              that exceed your expectations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                View Full Portfolio
              </Button>
              <Button variant="premium" size="lg">
                Request Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;