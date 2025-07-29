import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  technical_specifications: string[];
  image_url?: string;
  images?: string[];
  is_published: boolean;
  is_featured: boolean;
  dimensions?: { length?: string; width?: string; height?: string; weight?: string };
  body_color?: string;
  beam_angle?: string;
  power_consumption?: string;
  ip_rating?: string;
  color_temperature?: string;
  lumens_output?: string;
  material?: string;
  mounting_type?: string;
  control_type?: string;
  warranty_period?: string;
  certifications?: string[];
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const allImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image_url 
    ? [product.image_url] 
    : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold">{product.title}</DialogTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="capitalize">{product.category}</span>
                {product.is_featured && (
                  <Badge variant="default" className="ml-2">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          {allImages.length > 0 && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${product.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={prevImage}
                    >
                      ←
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={nextImage}
                    >
                      →
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {allImages.length}
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
                Technical Specifications
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Dimensions */}
                {product.dimensions && Object.keys(product.dimensions).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Dimensions</h4>
                    <div className="space-y-1">
                      {product.dimensions.length && (
                        <div className="flex justify-between">
                          <span>Length:</span>
                          <span className="font-medium">{product.dimensions.length}</span>
                        </div>
                      )}
                      {product.dimensions.width && (
                        <div className="flex justify-between">
                          <span>Width:</span>
                          <span className="font-medium">{product.dimensions.width}</span>
                        </div>
                      )}
                      {product.dimensions.height && (
                        <div className="flex justify-between">
                          <span>Height:</span>
                          <span className="font-medium">{product.dimensions.height}</span>
                        </div>
                      )}
                      {product.dimensions.weight && (
                        <div className="flex justify-between">
                          <span>Weight:</span>
                          <span className="font-medium">{product.dimensions.weight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Physical Properties */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Physical Properties</h4>
                  <div className="space-y-1">
                    {product.body_color && (
                      <div className="flex justify-between">
                        <span>Body Color:</span>
                        <span className="font-medium">{product.body_color}</span>
                      </div>
                    )}
                    {product.material && (
                      <div className="flex justify-between">
                        <span>Material:</span>
                        <span className="font-medium">{product.material}</span>
                      </div>
                    )}
                    {product.ip_rating && (
                      <div className="flex justify-between">
                        <span>IP Rating:</span>
                        <span className="font-medium">{product.ip_rating}</span>
                      </div>
                    )}
                    {product.mounting_type && (
                      <div className="flex justify-between">
                        <span>Mounting Type:</span>
                        <span className="font-medium">{product.mounting_type}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lighting Performance */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Lighting Performance</h4>
                  <div className="space-y-1">
                    {product.beam_angle && (
                      <div className="flex justify-between">
                        <span>Beam Angle:</span>
                        <span className="font-medium">{product.beam_angle}</span>
                      </div>
                    )}
                    {product.color_temperature && (
                      <div className="flex justify-between">
                        <span>Color Temperature:</span>
                        <span className="font-medium">{product.color_temperature}</span>
                      </div>
                    )}
                    {product.lumens_output && (
                      <div className="flex justify-between">
                        <span>Lumens Output:</span>
                        <span className="font-medium">{product.lumens_output}</span>
                      </div>
                    )}
                    {product.power_consumption && (
                      <div className="flex justify-between">
                        <span>Power Consumption:</span>
                        <span className="font-medium">{product.power_consumption}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Control & Warranty */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Control & Warranty</h4>
                  <div className="space-y-1">
                    {product.control_type && (
                      <div className="flex justify-between">
                        <span>Control Type:</span>
                        <span className="font-medium">{product.control_type}</span>
                      </div>
                    )}
                    {product.warranty_period && (
                      <div className="flex justify-between">
                        <span>Warranty:</span>
                        <span className="font-medium">{product.warranty_period}</span>
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
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Legacy Technical Specifications */}
              {(product.technical_specifications || []).length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">Additional Specifications</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {(product.technical_specifications || []).map((spec, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{spec}</span>
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
                <Badge variant={product.is_published ? "default" : "secondary"}>
                  {product.is_published ? "Published" : "Draft"}
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