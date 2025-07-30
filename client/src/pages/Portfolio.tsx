import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { PortfolioProject } from "@shared/schema";
import QuoteModal from "@/components/QuoteModal";

// Import fallback images
import residentialLighting from "@/assets/residential-lighting.jpg";
import commercialProject from "@/assets/commercial-project.jpg";
import manufacturing from "@/assets/manufacturing.jpg";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: projects = [], isLoading: loading, error } = useQuery<PortfolioProject[]>({
    queryKey: ["/api/portfolio-projects"],
  });

  const getProjectImage = (project: PortfolioProject) => {
    if (project.imageUrl) {
      return project.imageUrl;
    }

    // Use fallback images based on category
    switch (project.category.toLowerCase()) {
      case "residential":
        return residentialLighting;
      case "commercial":
        return commercialProject;
      case "manufacturing":
      case "industrial":
        return manufacturing;
      default:
        return commercialProject;
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "all") return true;
    return project.category.toLowerCase() === activeFilter.toLowerCase();
  });

  const categories = ["all", ...Array.from(new Set(projects.map((p) => p.category)))];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            size="sm"
            asChild
            className="mb-8"
          >
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          </Button>
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Our Complete Portfolio
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our comprehensive collection of lighting projects across residential, commercial, and industrial sectors.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              onClick={() => setActiveFilter(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={getProjectImage(project)}
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {project.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className="bg-background/90 backdrop-blur-sm capitalize">
                      {project.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.location}
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {project.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              No projects match the selected category.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 pt-16 border-t border-border">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your lighting needs and get a custom solution designed just for you.
          </p>
          <div className="flex justify-center gap-4">
            <QuoteModal 
              trigger={
                <Button size="lg">
                  Get Free Consultation
                </Button>
              }
              type="consultation" 
            />
            <Button variant="outline" size="lg" asChild>
              <a href="tel:+1234567890">Call Us Now</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;