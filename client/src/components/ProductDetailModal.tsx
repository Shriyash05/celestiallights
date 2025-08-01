import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, X, Zap, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { Product } from '@shared/schema';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideInterval, setSlideInterval] = useState<NodeJS.Timeout | null>(null);

  const allImages = product?.images && product.images.length > 0 
    ? product.images 
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

  // Reset slideshow when modal opens/closes or product changes
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

  // Reset current image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsPlaying(false);
  }, [product?.id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const toggleSlideshow = () => {
    setIsPlaying(!isPlaying);
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold">{product.title}</DialogTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="capitalize">{product.category}</span>
              {product.isFeatured && (
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
          {allImages.length > 0 ? (
            <div className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                <div className="relative w-full h-full">
                  {allImages.map((image, index) => (
                    <div
                      key={`image-${index}`}
                      className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                        index === currentImageIndex 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 scale-105'
                      }`}
                    >
                      <img
                        src={String(image)}
                        alt={`${product.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('Image failed to load:', image);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
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
                        src={String(image)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No images available for this product
            </div>
          )}

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Product Overview</h3>
              <DialogDescription className="text-base leading-relaxed">
                {product.description}
              </DialogDescription>
            </div>

            {/* Structured Technical Specifications */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>Technical Specifications</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Dimensions */}
                {product.dimensions && typeof product.dimensions === 'object' && Object.keys(product.dimensions as Record<string, any>).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Dimensions</h4>
                    <div className="space-y-1">
                      {(product.dimensions as Record<string, any>)?.length && (
                        <div className="flex justify-between">
                          <span>Length:</span>
                          <span className="font-medium">{String((product.dimensions as Record<string, any>).length)}</span>
                        </div>
                      )}
                      {(product.dimensions as Record<string, any>)?.width && (
                        <div className="flex justify-between">
                          <span>Width:</span>
                          <span className="font-medium">{String((product.dimensions as Record<string, any>).width)}</span>
                        </div>
                      )}
                      {(product.dimensions as Record<string, any>)?.height && (
                        <div className="flex justify-between">
                          <span>Height:</span>
                          <span className="font-medium">{String((product.dimensions as Record<string, any>).height)}</span>
                        </div>
                      )}
                      {(product.dimensions as Record<string, any>)?.weight && (
                        <div className="flex justify-between">
                          <span>Weight:</span>
                          <span className="font-medium">{String((product.dimensions as Record<string, any>).weight)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Physical Properties */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Physical Properties</h4>
                  <div className="space-y-1">
                    {product.bodyColor && (
                      <div className="flex justify-between">
                        <span>Body Color:</span>
                        <span className="font-medium">{product.bodyColor}</span>
                      </div>
                    )}
                    {product.material && (
                      <div className="flex justify-between">
                        <span>Material:</span>
                        <span className="font-medium">{product.material}</span>
                      </div>
                    )}
                    {product.ipRating && (
                      <div className="flex justify-between">
                        <span>IP Rating:</span>
                        <span className="font-medium">{product.ipRating}</span>
                      </div>
                    )}
                    {product.mountingType && (
                      <div className="flex justify-between">
                        <span>Mounting Type:</span>
                        <span className="font-medium">{product.mountingType}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lighting Performance */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Lighting Performance</h4>
                  <div className="space-y-1">
                    {product.beamAngle && (
                      <div className="flex justify-between">
                        <span>Beam Angle:</span>
                        <span className="font-medium">{product.beamAngle}</span>
                      </div>
                    )}
                    {product.colorTemperature && (
                      <div className="flex justify-between">
                        <span>Color Temperature:</span>
                        <span className="font-medium">{product.colorTemperature}</span>
                      </div>
                    )}
                    {product.lumensOutput && (
                      <div className="flex justify-between">
                        <span>Lumens Output:</span>
                        <span className="font-medium">{product.lumensOutput}</span>
                      </div>
                    )}
                    {product.powerConsumption && (
                      <div className="flex justify-between">
                        <span>Power Consumption:</span>
                        <span className="font-medium">{product.powerConsumption}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Control & Warranty */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Control & Warranty</h4>
                  <div className="space-y-1">
                    {product.controlType && (
                      <div className="flex justify-between">
                        <span>Control Type:</span>
                        <span className="font-medium">{product.controlType}</span>
                      </div>
                    )}
                    {product.warrantyPeriod && (
                      <div className="flex justify-between">
                        <span>Warranty:</span>
                        <span className="font-medium">{product.warrantyPeriod}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Certifications */}
              {product.certifications && product.certifications.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {String(cert)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Legacy Technical Specifications */}
              {(product.technicalSpecifications || []).length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">Additional Specifications</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {(product.technicalSpecifications || []).map((spec, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{String(spec)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Category:</span>
                <Badge variant="secondary" className="capitalize">
                  {product.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={product.isPublished ? "default" : "secondary"}>
                  {product.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;