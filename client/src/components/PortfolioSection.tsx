import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Filter, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { PortfolioProject } from "@/lib/realtimeService";
import residentialImage from "@/assets/residential-lighting.jpg";
import commercialImage from "@/assets/commercial-project.jpg";
import ProjectDetailModal from "./ProjectDetailModal";
import QuoteModal from "@/components/QuoteModal";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimePortfolioProjects } from "@/lib/realtimeService";

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const { projects, loading } = useRealtimePortfolioProjects();

  // Filter only featured projects for the section
  const featuredProjects = projects.filter(project => project.isFeatured);
  // Non-featured projects only show when logged in
  const nonFeaturedProjects = projects.filter(project => !project.isFeatured);

  // Fallback images
  const getProjectImage = (project: PortfolioProject) => {
    // Use first image from images array if available
    if (project.images && project.images.length > 0) {
      return project.images[0];
    }
    // Fallback to imageUrl
    if (project.imageUrl) return project.imageUrl;
    // Final fallback to default images
    return project.category === 'residential' || project.category === 'hospitality'
      ? residentialImage
      : commercialImage;
  };

  const handleProjectClick = (project: PortfolioProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const filters = [
    { id: "all", label: "Ongoing Projects" },
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

        {/* Featured Projects Section */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <Badge variant="default" className="mb-4">★ Featured Projects</Badge>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Spotlight Projects</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <Card
                  key={`featured-${project.id}`}
                  className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5 hover:shadow-elegant transition-all duration-300 group cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={getProjectImage(project)}
                      alt={project.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        ★ Featured
                      </Badge>
                    </div>
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
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
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

            {/* View Full Portfolio Button */}
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg" className="group">
                <Link to="/portfolio" className="inline-flex items-center">
                  View Full Portfolio
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Additional Projects (only visible when logged in) */}
        {user && nonFeaturedProjects.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-4">Additional Projects</Badge>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">More Recent Work</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {nonFeaturedProjects.slice(0, 6).map((project) => (
                <Card
                  key={`additional-${project.id}`}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={getProjectImage(project)}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-semibold mb-1">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">{project.location}</p>
                      </div>
                      <Badge variant="outline" className="capitalize text-xs">
                        {project.category}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden border-0 bg-background">
                <div className="w-full h-64 bg-muted animate-pulse" />
                <CardContent className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden border-0 bg-background hover:shadow-elegant transition-all duration-300 group cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={getProjectImage(project)}
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
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
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
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No projects found for this category.</p>
            </div>
          )}
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
              <Link to="/portfolio">
                <Button variant="premium" size="lg">
                  View Full Portfolio
                </Button>
              </Link>
              <QuoteModal
                type="consultation"
                trigger={
                  <Button variant="premium" size="lg">
                    Request Consultation
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
      
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default PortfolioSection;