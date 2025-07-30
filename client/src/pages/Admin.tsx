import { useState } from 'react';
import { Redirect } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Edit, Trash2, Star, X } from 'lucide-react';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FileUpload } from '@/components/FileUpload';
import type { PortfolioProject, Product } from '@shared/schema';

// Form schemas
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  features: z.string().min(1, 'Features are required'),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  technicalSpecifications: z.string().min(1, 'Technical specifications are required'),
  imageUrl: z.string().optional(),
  images: z.array(z.string()).default([]),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'projects' | 'products'>('projects');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Use TanStack Query for data fetching
  const { data: projects = [], isLoading: projectsLoading } = useQuery<PortfolioProject[]>({
    queryKey: ['/api/portfolio-projects'],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Mutations
  const createProjectMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/portfolio-projects', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        features: data.features.split(',').map((f: string) => f.trim()),
      }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio-projects'] });
      toast({ title: 'Project created successfully' });
      setShowForm(false);
    },
    onError: () => {
      toast({ title: 'Failed to create project', variant: 'destructive' });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        technicalSpecifications: data.technicalSpecifications.split(',').map((s: string) => s.trim()),
      }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: 'Product created successfully' });
      setShowForm(false);
    },
    onError: () => {
      toast({ title: 'Failed to create product', variant: 'destructive' });
    },
  });

  // Delete mutations
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/portfolio-projects/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio-projects'] });
      toast({ title: 'Project deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete project', variant: 'destructive' });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/products/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: 'Product deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete product', variant: 'destructive' });
    },
  });

  // Forms
  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      location: '',
      features: '',
      imageUrl: '',
      videoUrl: '',
      images: [],
      videos: [],
      isPublished: true,
      isFeatured: false,
    },
  });

  const productForm = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      technicalSpecifications: '',
      imageUrl: '',
      images: [],
      isPublished: true,
      isFeatured: false,
    },
  });

  const onSubmitProject = (data: any) => {
    // Set main image URL from uploaded images if not manually provided
    if (!data.imageUrl && data.images && data.images.length > 0) {
      data.imageUrl = data.images[0];
    }
    // Set main video URL from uploaded videos if not manually provided
    if (!data.videoUrl && data.videos && data.videos.length > 0) {
      data.videoUrl = data.videos[0];
    }
    createProjectMutation.mutate(data);
  };

  const onSubmitProduct = (data: any) => {
    // Set main image URL from uploaded images if not manually provided
    if (!data.imageUrl && data.images && data.images.length > 0) {
      data.imageUrl = data.images[0];
    }
    createProductMutation.mutate(data);
  };

  // Handle file uploads
  const handleProjectFilesUploaded = (files: any[]) => {
    const images = files.filter(f => f.mimetype.startsWith('image/')).map(f => f.url);
    const videos = files.filter(f => f.mimetype.startsWith('video/')).map(f => f.url);
    
    const currentImages = projectForm.getValues('images') || [];
    const currentVideos = projectForm.getValues('videos') || [];
    
    projectForm.setValue('images', [...currentImages, ...images]);
    projectForm.setValue('videos', [...currentVideos, ...videos]);
  };

  const handleProductFilesUploaded = (files: any[]) => {
    const images = files.filter(f => f.mimetype.startsWith('image/')).map(f => f.url);
    
    const currentImages = productForm.getValues('images') || [];
    productForm.setValue('images', [...currentImages, ...images]);
  };

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
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>

            <div className="grid gap-4">
              {projects.map((project: PortfolioProject) => (
                <Card key={project.id} className="p-4">
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
                        onClick={() => setEditingProject(project)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Project
                  </Button>
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
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="grid gap-4">
              {products.map((product: Product) => (
                <Card key={product.id} className="p-4">
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
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Project Form */}
        {showForm && activeTab === 'projects' && (
          <Card className="mt-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Project</h3>
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <Form {...projectForm}>
              <form onSubmit={projectForm.handleSubmit(onSubmitProject)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={projectForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={projectForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="residential">Residential</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="outdoor">Outdoor</SelectItem>
                              <SelectItem value="architectural">Architectural</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={projectForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={projectForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={projectForm.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Features (comma separated)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Smart controls, Energy efficient, Custom design" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* File Upload Section */}
                <div className="space-y-4">
                  <FileUpload
                    onFilesUploaded={handleProjectFilesUploaded}
                    accept="image/*,video/*"
                    maxFiles={10}
                    multiple={true}
                    label="Upload Project Images & Videos"
                  />
                </div>

                {/* Manual URL inputs (optional) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={projectForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://... or leave blank to use first uploaded image" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={projectForm.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Video URL (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://... or leave blank to use first uploaded video" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <FormField
                    control={projectForm.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <FormLabel>Published</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={projectForm.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <FormLabel>Featured</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createProjectMutation.isPending}>
                    {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        )}

        {/* Product Form */}
        {showForm && activeTab === 'products' && (
          <Card className="mt-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Product</h3>
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <Form {...productForm}>
              <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={productForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={productForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="led-strips">LED Strips</SelectItem>
                              <SelectItem value="spotlights">Spotlights</SelectItem>
                              <SelectItem value="panels">Panels</SelectItem>
                              <SelectItem value="outdoor">Outdoor</SelectItem>
                              <SelectItem value="smart">Smart Lighting</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={productForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={productForm.control}
                  name="technicalSpecifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technical Specifications (comma separated)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} placeholder="3000K color temperature, 120° beam angle, IP65 rated" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload Section */}
                <div className="space-y-4">
                  <FileUpload
                    onFilesUploaded={handleProductFilesUploaded}
                    accept="image/*"
                    maxFiles={5}
                    multiple={true}
                    label="Upload Product Images"
                  />
                </div>

                <FormField
                  control={productForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Image URL (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://... or leave blank to use first uploaded image" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-4">
                  <FormField
                    control={productForm.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <FormLabel>Published</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={productForm.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="rounded"
                          />
                        </FormControl>
                        <FormLabel>Featured</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createProductMutation.isPending}>
                    {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        )}

        {/* Edit modals placeholder */}
        {editingProject && (
          <Card className="mt-6 p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Project: {editingProject.title}</h3>
            <p className="text-muted-foreground">
              Edit functionality will be implemented with proper update mutations.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setEditingProject(null)}
            >
              Close
            </Button>
          </Card>
        )}

        {editingProduct && (
          <Card className="mt-6 p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Product: {editingProduct.title}</h3>
            <p className="text-muted-foreground">
              Edit functionality will be implemented with proper update mutations.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setEditingProduct(null)}
            >
              Close
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;