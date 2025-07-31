import { useState } from 'react';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import type { Product } from '@shared/schema';
import ProductDetailModal from './ProductDetailModal';
import CallUsButton from '@/components/CallUsButton';
import { useRealtimeProducts } from '@/lib/realtimeService';

const ProductsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { products: allProducts = [], loading } = useRealtimeProducts();

  // Filter featured products
  const products = allProducts.filter(product => product.isFeatured).slice(0, 3);

  const getProductImage = (product: Product) => {
    // Always use the first image from images array if available (consistent main image)
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    // Fallback to imageUrl (legacy support)
    if (product.imageUrl) return product.imageUrl;
    
    // Consistent fallback images based on category (prevent random images)
    const fallbackImages: Record<string, string> = {
      'Smart Lighting': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
      'Outdoor Lighting': 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop',
      'Indoor Lighting': 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop',
      'Solar Lighting': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop',
      'Decorative Lighting': 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=800&h=600&fit=crop'
    };
    
    return fallbackImages[product.category] || fallbackImages['Indoor Lighting'];
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <section id="products" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover our most popular lighting solutions designed to transform any space.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="h-64 bg-muted"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-16 bg-muted rounded mb-4"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover our most popular lighting solutions designed to transform any space with cutting-edge technology and elegant design.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No featured products available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-card cursor-pointer"
                  onClick={() => handleProductClick(product as Product)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={getProductImage(product as Product)}
                      alt={product.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="secondary" size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {/* Show key technical specs */}
                      {product.colorTemperature && (
                        <Badge variant="outline" className="text-xs">
                          {product.colorTemperature}
                        </Badge>
                      )}
                      {product.lumensOutput && (
                        <Badge variant="outline" className="text-xs">
                          {product.lumensOutput}
                        </Badge>
                      )}
                      {product.ipRating && (
                        <Badge variant="outline" className="text-xs">
                          IP{product.ipRating}
                        </Badge>
                      )}
                      {product.powerConsumption && (
                        <Badge variant="outline" className="text-xs">
                          {product.powerConsumption}
                        </Badge>
                      )}
                      {/* Fallback to technicalSpecifications if no structured specs */}
                      {!product.colorTemperature && !product.lumensOutput && !product.ipRating && !product.powerConsumption && 
                       (product.technicalSpecifications || []).slice(0, 3).map((spec: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
 
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <span className="text-sm text-muted-foreground">Click to view details</span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center gap-4">
                <Link to="/products">
                  <Button size="lg" className="group">
                    View All Products
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <CallUsButton
                  variant="outline"
                  size="lg"
                  children="Call Us"
                />
              </div>
            </div>
          </>
        )}
      </div>
      
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default ProductsSection;