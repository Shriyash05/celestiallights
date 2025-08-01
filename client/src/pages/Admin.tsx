import { useState } from 'react';
import { Redirect } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Star } from 'lucide-react';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { PortfolioProject, Product } from '@shared/schema';
import AddProjectModal from '@/components/AddProjectModal';
import AddProductModal from '@/components/AddProductModal';
import {
  useRealtimePortfolioProjects,
  useRealtimeProducts,
  deletePortfolioProject,
  deleteProduct
} from '@/lib/realtimeService';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'projects' | 'products'>('projects');

  // Use real-time data fetching
  const { projects, loading: projectsLoading } = useRealtimePortfolioProjects();
  const { products, loading: productsLoading } = useRealtimeProducts();

  // Delete mutations
  const deleteProjectMutation = useMutation({
    mutationFn: deletePortfolioProject,
    onSuccess: () => {
      toast({ title: 'Project deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete project', variant: 'destructive' });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast({ title: 'Product deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete product', variant: 'destructive' });
    },
  });

  // Redirect if not admin
  if (!loading && (!user || !isAdmin)) {
    return <Redirect to="/auth" />;
  }

  if (loading || projectsLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Site
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Welcome, {user?.email}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'projects' ? 'default' : 'outline'}
            onClick={() => setActiveTab('projects')}
          >
            Portfolio Projects ({projects.length})
          </Button>
          <Button
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
          >
            Products ({products.length})
          </Button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Portfolio Projects</h2>
              <AddProjectModal
                trigger={
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                }
              />
            </div>

            <div className="grid gap-4">
              {projects.map((project: any) => (
                <Card key={`project-${project.id}`} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{project.title}</h3>
                        {project.isFeatured && (
                          <Badge variant="default">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant={project.isPublished ? "default" : "secondary"}>
                          {project.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Category: {project.category}</span>
                        <span>Location: {project.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this project?')) {
                            deleteProjectMutation.mutate(project.id);
                          }
                        }}
                        disabled={deleteProjectMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {projects.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No projects found</p>
                  <AddProjectModal
                    trigger={
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Project
                      </Button>
                    }
                  />
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Products</h2>
              <AddProductModal
                trigger={
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                }
              />
            </div>

            <div className="grid gap-4">
              {products.map((product: any) => (
                <Card key={`product-${product.id}`} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{product.title}</h3>
                        {product.isFeatured && (
                          <Badge variant="default">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant={product.isPublished ? "default" : "secondary"}>
                          {product.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Category: {product.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this product?')) {
                            deleteProductMutation.mutate(product.id);
                          }
                        }}
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {products.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No products found</p>
                  <AddProductModal
                    trigger={
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Product
                      </Button>
                    }
                  />
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;