import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, X, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { PortfolioProject } from '@shared/schema';

interface ProjectDetailModalProps {
  project: PortfolioProject | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal = ({ project, isOpen, onClose }: ProjectDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideInterval, setSlideInterval] = useState<NodeJS.Timeout | null>(null);

  const allImages = project?.images && project.images.length > 0 
    ? project.images 
    : [];

  // Slideshow functionality
  useEffect(() => {
    if (isPlaying && allImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 3000); // Change image every 3 seconds
      setSlideInterval(interval);
      return () => clearInterval(interval);
    } else if (slideInterval) {
      clearInterval(slideInterval);
      setSlideInterval(null);
    }
  }, [isPlaying, allImages.length]);

  // Reset slideshow when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const toggleSlideshow = () => {
    setIsPlaying(!isPlaying);
  };

  if (!project) {
    return null;
  }



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{project.location}</span>
              {project.isFeatured && (
                <Badge variant="default" className="ml-2">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Slideshow */}
          {allImages.length > 0 && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                <div className="relative w-full h-full">
                  {allImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                        index === currentImageIndex 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 scale-105'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${project.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                {allImages.length > 1 && (
                  <>
                    {/* Navigation Arrows */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    
                    {/* Slideshow Controls */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={toggleSlideshow}
                        className="bg-black/50 hover:bg-black/70 text-white"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    {/* Image Counter with Progress */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                      <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {allImages.length}
                      </div>
                      {isPlaying && (
                        <div className="w-8 h-1 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full animate-[progress_3s_linear_infinite]"></div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-primary shadow-md' 
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Video Section */}
          {project.videoUrl && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Video</h3>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  src={project.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">About This Project</h3>
              <DialogDescription className="text-base leading-relaxed">
                {project.description}
              </DialogDescription>
            </div>

            {project.features && project.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {project.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Category:</span>
                <Badge variant="secondary" className="capitalize">
                  {project.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={project.isPublished ? "default" : "secondary"}>
                  {project.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;