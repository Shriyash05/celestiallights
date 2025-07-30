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
import { ArrowLeft, Plus, Edit, Trash2, Star } from 'lucide-react';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { PortfolioProject, Product } from '@shared/schema';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  location: string;
  image_url?: string;
  is_published: boolean;
  is_featured: boolean;
}

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

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'projects' | 'products'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    features: '',
    location: '',
    image_url: '',
    video_url: '',
    is_published: true,
    is_featured: false,
  });
  const [productFormData, setProductFormData] = useState({
    title: '',
    category: '',
    description: '',
    technical_specifications: '',
    image_url: '',
    is_published: true,
    is_featured: false,
    // Dimensions
    length: '',
    width: '',
    height: '',
    weight: '',
    // Physical properties
    body_color: '',
    material: '',
    ip_rating: '',
    mounting_type: '',
    // Lighting specs
    beam_angle: '',
    color_temperature: '',
    lumens_output: '',
    power_consumption: '',
    // Control & warranty
    control_type: '',
    warranty_period: '',
    certifications: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // All hooks must be called before any early returns
  useEffect(() => {
    fetchProjects();
    fetchProducts();
  }, []);

  // Redirect if not admin (after all hooks are called)
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/auth" replace />;
  }

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching projects",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProjects(data || []);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching products",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Transform the data to match our interface
      const transformedProducts = (data || []).map(product => ({
        ...product,
        dimensions: (product.dimensions as any) || {},
        certifications: product.certifications || [],
        technical_specifications: product.technical_specifications || [],
      }));
      setProducts(transformedProducts);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file);

      if (uploadError) {
        toast({
          title: "Error uploading image",
          description: uploadError.message,
          variant: "destructive",
        });
        return null;
      }

      const { data } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const uploadMultipleImages = async (files: FileList): Promise<string[]> => {
    const uploadPromises = Array.from(files).map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
  };

  const uploadVideo = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `video-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-videos')
        .upload(fileName, file);

      if (uploadError) {
        toast({
          title: "Error uploading video",
          description: uploadError.message,
          variant: "destructive",
        });
        return null;
      }

      const { data } = supabase.storage
        .from('project-videos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Error uploading video",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    let finalImageUrl = formData.image_url;
    let finalImages: string[] = [];
    let finalVideoUrl = formData.video_url;
    
    // Handle multiple image uploads
    if (imageFiles && imageFiles.length > 0) {
      const uploadedUrls = await uploadMultipleImages(imageFiles);
      if (uploadedUrls.length > 0) {
        finalImages = uploadedUrls;
        finalImageUrl = uploadedUrls[0]; // Set first image as main image for legacy support
      } else {
        setUploading(false);
        return;
      }
    }
    // Handle single file upload (legacy)
    else if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
        finalImages = [uploadedUrl];
      } else {
        setUploading(false);
        return;
      }
    }
    
    // Handle video upload
    if (videoFile) {
      const uploadedVideoUrl = await uploadVideo(videoFile);
      if (uploadedVideoUrl) {
        finalVideoUrl = uploadedVideoUrl;
      } else {
        setUploading(false);
        return;
      }
    }
    
    const projectData = {
      ...formData,
      image_url: finalImageUrl,
      images: finalImages,
      video_url: finalVideoUrl,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('portfolio_projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) {
          toast({
            title: "Error updating project",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Project updated successfully",
          });
          resetForm();
          fetchProjects();
        }
      } else {
        const { error } = await supabase
          .from('portfolio_projects')
          .insert([projectData]);

        if (error) {
          toast({
            title: "Error creating project",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Project created successfully",
          });
          resetForm();
          fetchProjects();
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      features: project.features.join(', '),
      location: project.location,
      image_url: project.image_url || '',
      video_url: project.video_url || '',
      is_published: project.is_published,
      is_featured: project.is_featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Project deleted successfully",
      });
      fetchProjects();
    }
  };

  const toggleFeatured = async (project: Project) => {
    const { error } = await supabase
      .from('portfolio_projects')
      .update({ is_featured: !project.is_featured })
      .eq('id', project.id);

    if (error) {
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Project ${!project.is_featured ? 'featured' : 'unfeatured'} successfully`,
      });
      fetchProjects();
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    let finalImageUrl = productFormData.image_url;
    let finalImages: string[] = [];
    
    // Handle multiple file uploads
    if (imageFiles && imageFiles.length > 0) {
      const uploadedUrls = await uploadMultipleImages(imageFiles);
      if (uploadedUrls.length > 0) {
        finalImages = uploadedUrls;
        finalImageUrl = uploadedUrls[0]; // Set first image as main image for legacy support
      } else {
        setUploading(false);
        return;
      }
    }
    // Handle single file upload (legacy)
    else if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
        finalImages = [uploadedUrl];
      } else {
        setUploading(false);
        return;
      }
    }
    
    const productData = {
      title: productFormData.title,
      category: productFormData.category,
      description: productFormData.description,
      technical_specifications: productFormData.technical_specifications.split(',').map(spec => spec.trim()).filter(spec => spec),
      image_url: finalImageUrl,
      images: finalImages,
      is_published: productFormData.is_published,
      is_featured: productFormData.is_featured,
      dimensions: {
        length: productFormData.length || undefined,
        width: productFormData.width || undefined,
        height: productFormData.height || undefined,
        weight: productFormData.weight || undefined,
      },
      body_color: productFormData.body_color || undefined,
      beam_angle: productFormData.beam_angle || undefined,
      power_consumption: productFormData.power_consumption || undefined,
      ip_rating: productFormData.ip_rating || undefined,
      color_temperature: productFormData.color_temperature || undefined,
      lumens_output: productFormData.lumens_output || undefined,
      material: productFormData.material || undefined,
      mounting_type: productFormData.mounting_type || undefined,
      control_type: productFormData.control_type || undefined,
      warranty_period: productFormData.warranty_period || undefined,
      certifications: productFormData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert),
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) {
          toast({
            title: "Error updating product",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Product updated successfully",
          });
          resetProductForm();
          fetchProducts();
        }
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) {
          toast({
            title: "Error creating product",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Product created successfully",
          });
          resetProductForm();
          fetchProducts();
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const handleProductEdit = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      title: product.title,
      category: product.category,
      description: product.description,
      technical_specifications: product.technical_specifications.join(', '),
      image_url: product.image_url || '',
      is_published: product.is_published,
      is_featured: product.is_featured,
      // Dimensions
      length: product.dimensions?.length || '',
      width: product.dimensions?.width || '',
      height: product.dimensions?.height || '',
      weight: product.dimensions?.weight || '',
      // Physical properties
      body_color: product.body_color || '',
      material: product.material || '',
      ip_rating: product.ip_rating || '',
      mounting_type: product.mounting_type || '',
      // Lighting specs
      beam_angle: product.beam_angle || '',
      color_temperature: product.color_temperature || '',
      lumens_output: product.lumens_output || '',
      power_consumption: product.power_consumption || '',
      // Control & warranty
      control_type: product.control_type || '',
      warranty_period: product.warranty_period || '',
      certifications: (product.certifications || []).join(', '),
    });
    setActiveTab('products');
    setShowForm(true);
  };

  const handleProductDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Product deleted successfully",
      });
      fetchProducts();
    }
  };

  const toggleProductFeatured = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_featured: !product.is_featured })
      .eq('id', product.id);

    if (error) {
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Product ${!product.is_featured ? 'featured' : 'unfeatured'} successfully`,
      });
      fetchProducts();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      features: '',
      location: '',
      image_url: '',
      video_url: '',
      is_published: true,
      is_featured: false,
    });
    setImageFile(null);
    setImageFiles(null);
    setVideoFile(null);
    setEditingProject(null);
    setShowForm(false);
  };

  const resetProductForm = () => {
    setProductFormData({
      title: '',
      category: '',
      description: '',
      technical_specifications: '',
      image_url: '',
      is_published: true,
      is_featured: false,
      // Dimensions
      length: '',
      width: '',
      height: '',
      weight: '',
      // Physical properties
      body_color: '',
      material: '',
      ip_rating: '',
      mounting_type: '',
      // Lighting specs
      beam_angle: '',
      color_temperature: '',
      lumens_output: '',
      power_consumption: '',
      // Control & warranty
      control_type: '',
      warranty_period: '',
      certifications: '',
    });
    setImageFile(null);
    setImageFiles(null);
    setVideoFile(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex bg-muted rounded-lg p-1">
              <Button 
                variant={activeTab === 'projects' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </Button>
              <Button 
                variant={activeTab === 'products' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setActiveTab('products')}
              >
                Products
              </Button>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add {activeTab === 'projects' ? 'Project' : 'Product'}
            </Button>
          </div>
        </div>

        {showForm && activeTab === 'projects' && (
          <Card>
            <CardHeader>
              <CardTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</CardTitle>
              <CardDescription>
                {editingProject ? 'Update project details' : 'Create a new portfolio project'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="features">Features (comma-separated)</Label>
                    <Input
                      id="features"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="Smart Controls, Energy Efficient"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image_files_multiple">Upload Multiple Images from Device</Label>
                    <Input
                      id="image_files_multiple"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        setImageFiles(files);
                        if (files && files.length > 0) {
                          setFormData({ ...formData, image_url: '' });
                          setImageFile(null);
                        }
                      }}
                    />
                    {imageFiles && imageFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Selected {imageFiles.length} image{imageFiles.length > 1 ? 's' : ''}:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(imageFiles).map((file, index) => (
                            <div key={index} className="text-xs bg-muted px-2 py-1 rounded">
                              {file.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-px bg-border flex-1" />
                    <span className="text-xs text-muted-foreground px-2">OR SINGLE IMAGE</span>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image_file">Upload Image from Device</Label>
                    <Input
                      id="image_file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setImageFile(file || null);
                        if (file) {
                          setFormData({ ...formData, image_url: '' }); // Clear URL when file is selected
                          setImageFiles(null); // Clear multiple files when single file is selected
                        }
                      }}
                      disabled={!!(imageFiles && imageFiles.length > 0)}
                    />
                    {imageFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {imageFile.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-px bg-border flex-1" />
                    <span className="text-xs text-muted-foreground px-2">OR</span>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value });
                        if (e.target.value) {
                          setImageFile(null); // Clear file when URL is entered
                          setImageFiles(null); // Clear multiple files when URL is entered
                        }
                      }}
                      placeholder="https://example.com/image.jpg"
                      disabled={!!(imageFile || (imageFiles && imageFiles.length > 0))}
                    />
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-medium">Video Upload</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="video_file">Upload Video from Device</Label>
                      <Input
                        id="video_file"
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setVideoFile(file || null);
                          if (file) {
                            setFormData({ ...formData, video_url: '' }); // Clear URL when file is selected
                          }
                        }}
                      />
                      {videoFile && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {videoFile.name}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="h-px bg-border flex-1" />
                      <span className="text-xs text-muted-foreground px-2">OR</span>
                      <div className="h-px bg-border flex-1" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="video_url">Video URL</Label>
                      <Input
                        id="video_url"
                        value={formData.video_url}
                        onChange={(e) => {
                          setFormData({ ...formData, video_url: e.target.value });
                          if (e.target.value) {
                            setVideoFile(null); // Clear file when URL is entered
                          }
                        }}
                        placeholder="https://example.com/video.mp4"
                        disabled={!!videoFile}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : editingProject ? 'Update Project' : 'Create Project'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} disabled={uploading}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {showForm && activeTab === 'products' && (
          <Card>
            <CardHeader>
              <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
              <CardDescription>
                {editingProduct ? 'Update product details' : 'Create a new product'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-title">Title</Label>
                    <Input
                      id="product-title"
                      value={productFormData.title}
                      onChange={(e) => setProductFormData({ ...productFormData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-category">Category</Label>
                    <Select value={productFormData.category} onValueChange={(value) => setProductFormData({ ...productFormData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="led-strips">LED Strips</SelectItem>
                        <SelectItem value="smart-lighting">Smart Lighting</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="controllers">Controllers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    required
                  />
                </div>
                
                {/* Basic Technical Specifications */}
                <div className="space-y-2">
                  <Label htmlFor="product-specs">Legacy Technical Specifications (comma-separated)</Label>
                  <Input
                    id="product-specs"
                    value={productFormData.technical_specifications}
                    onChange={(e) => setProductFormData({ ...productFormData, technical_specifications: e.target.value })}
                    placeholder="IP65 Rated, 120 LEDs/m, 24V DC"
                  />
                </div>

                {/* Structured Technical Specifications */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Detailed Technical Specifications</h3>
                  
                  {/* Dimensions Section */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-muted-foreground">Dimensions</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="length">Length</Label>
                        <Input
                          id="length"
                          value={productFormData.length}
                          onChange={(e) => setProductFormData({ ...productFormData, length: e.target.value })}
                          placeholder="e.g. 1000mm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width">Width</Label>
                        <Input
                          id="width"
                          value={productFormData.width}
                          onChange={(e) => setProductFormData({ ...productFormData, width: e.target.value })}
                          placeholder="e.g. 10mm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          value={productFormData.height}
                          onChange={(e) => setProductFormData({ ...productFormData, height: e.target.value })}
                          placeholder="e.g. 3mm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          value={productFormData.weight}
                          onChange={(e) => setProductFormData({ ...productFormData, weight: e.target.value })}
                          placeholder="e.g. 50g/m"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Physical Properties Section */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-muted-foreground">Physical Properties</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="body-color">Body Color</Label>
                        <Select value={productFormData.body_color} onValueChange={(value) => setProductFormData({ ...productFormData, body_color: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select body color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="black">Black</SelectItem>
                            <SelectItem value="white">White</SelectItem>
                            <SelectItem value="silver">Silver</SelectItem>
                            <SelectItem value="bronze">Bronze</SelectItem>
                            <SelectItem value="gold">Gold</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="material">Material</Label>
                        <Select value={productFormData.material} onValueChange={(value) => setProductFormData({ ...productFormData, material: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aluminum">Aluminum</SelectItem>
                            <SelectItem value="plastic">Plastic</SelectItem>
                            <SelectItem value="glass">Glass</SelectItem>
                            <SelectItem value="silicone">Silicone</SelectItem>
                            <SelectItem value="copper">Copper</SelectItem>
                            <SelectItem value="steel">Steel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ip-rating">IP Rating</Label>
                        <Select value={productFormData.ip_rating} onValueChange={(value) => setProductFormData({ ...productFormData, ip_rating: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select IP rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IP20">IP20 - Indoor use</SelectItem>
                            <SelectItem value="IP44">IP44 - Splash resistant</SelectItem>
                            <SelectItem value="IP54">IP54 - Dust/water resistant</SelectItem>
                            <SelectItem value="IP65">IP65 - Waterproof</SelectItem>
                            <SelectItem value="IP67">IP67 - Submersible</SelectItem>
                            <SelectItem value="IP68">IP68 - Fully submersible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mounting-type">Mounting Type</Label>
                        <Select value={productFormData.mounting_type} onValueChange={(value) => setProductFormData({ ...productFormData, mounting_type: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mounting type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="surface">Surface Mount</SelectItem>
                            <SelectItem value="recessed">Recessed</SelectItem>
                            <SelectItem value="pendant">Pendant</SelectItem>
                            <SelectItem value="track">Track Mount</SelectItem>
                            <SelectItem value="magnetic">Magnetic</SelectItem>
                            <SelectItem value="adhesive">Adhesive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Lighting Performance Section */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-muted-foreground">Lighting Performance</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="beam-angle">Beam Angle</Label>
                        <Input
                          id="beam-angle"
                          value={productFormData.beam_angle}
                          onChange={(e) => setProductFormData({ ...productFormData, beam_angle: e.target.value })}
                          placeholder="e.g. 120°, 60°, Adjustable"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color-temp">Color Temperature</Label>
                        <Select value={productFormData.color_temperature} onValueChange={(value) => setProductFormData({ ...productFormData, color_temperature: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color temperature" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2700K">2700K - Warm White</SelectItem>
                            <SelectItem value="3000K">3000K - Soft White</SelectItem>
                            <SelectItem value="4000K">4000K - Natural White</SelectItem>
                            <SelectItem value="5000K">5000K - Cool White</SelectItem>
                            <SelectItem value="6500K">6500K - Daylight</SelectItem>
                            <SelectItem value="RGB">RGB - Full Color</SelectItem>
                            <SelectItem value="RGBW">RGBW - RGB + White</SelectItem>
                            <SelectItem value="Tunable">Tunable White</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lumens">Lumens Output</Label>
                        <Input
                          id="lumens"
                          value={productFormData.lumens_output}
                          onChange={(e) => setProductFormData({ ...productFormData, lumens_output: e.target.value })}
                          placeholder="e.g. 1000lm/m, 500lm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="power">Power Consumption</Label>
                        <Input
                          id="power"
                          value={productFormData.power_consumption}
                          onChange={(e) => setProductFormData({ ...productFormData, power_consumption: e.target.value })}
                          placeholder="e.g. 12W/m, 24W"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Control & Warranty Section */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-muted-foreground">Control & Warranty</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="control-type">Control Type</Label>
                        <Select value={productFormData.control_type} onValueChange={(value) => setProductFormData({ ...productFormData, control_type: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select control type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual Switch</SelectItem>
                            <SelectItem value="remote">Remote Control</SelectItem>
                            <SelectItem value="app">App Controlled</SelectItem>
                            <SelectItem value="voice">Voice Control</SelectItem>
                            <SelectItem value="dimmer">Dimmer Compatible</SelectItem>
                            <SelectItem value="dmx">DMX Compatible</SelectItem>
                            <SelectItem value="smart">Smart Home Integration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="warranty">Warranty Period</Label>
                        <Select value={productFormData.warranty_period} onValueChange={(value) => setProductFormData({ ...productFormData, warranty_period: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select warranty period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-year">1 Year</SelectItem>
                            <SelectItem value="2-years">2 Years</SelectItem>
                            <SelectItem value="3-years">3 Years</SelectItem>
                            <SelectItem value="5-years">5 Years</SelectItem>
                            <SelectItem value="lifetime">Lifetime</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Certifications Section */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-muted-foreground">Certifications</h4>
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                      <Input
                        id="certifications"
                        value={productFormData.certifications}
                        onChange={(e) => setProductFormData({ ...productFormData, certifications: e.target.value })}
                        placeholder="e.g. CE, RoHS, FCC, UL Listed"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-images-multiple">Upload Multiple Images from Device</Label>
                    <Input
                      id="product-images-multiple"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        setImageFiles(files);
                        if (files && files.length > 0) {
                          setProductFormData({ ...productFormData, image_url: '' });
                          setImageFile(null);
                        }
                      }}
                    />
                    {imageFiles && imageFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Selected {imageFiles.length} image{imageFiles.length > 1 ? 's' : ''}:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(imageFiles).map((file, index) => (
                            <div key={index} className="text-xs bg-muted px-2 py-1 rounded">
                              {file.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-px bg-border flex-1" />
                    <span className="text-xs text-muted-foreground px-2">OR SINGLE IMAGE</span>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="product-image-file">Upload Single Image from Device</Label>
                    <Input
                      id="product-image-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setImageFile(file || null);
                        if (file) {
                          setProductFormData({ ...productFormData, image_url: '' });
                          setImageFiles(null);
                        }
                      }}
                      disabled={!!(imageFiles && imageFiles.length > 0)}
                    />
                    {imageFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {imageFile.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-px bg-border flex-1" />
                    <span className="text-xs text-muted-foreground px-2">OR URL</span>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="product-image-url">Image URL</Label>
                    <Input
                      id="product-image-url"
                      value={productFormData.image_url}
                      onChange={(e) => {
                        setProductFormData({ ...productFormData, image_url: e.target.value });
                        if (e.target.value) {
                          setImageFile(null);
                          setImageFiles(null);
                        }
                      }}
                      placeholder="https://example.com/image.jpg"
                      disabled={!!(imageFile || (imageFiles && imageFiles.length > 0))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetProductForm} disabled={uploading}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'projects' && (
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Projects</CardTitle>
              <CardDescription>Manage your portfolio projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={project.is_published ? "default" : "secondary"}>
                          {project.is_published ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant={project.is_featured ? "default" : "outline"} className="capitalize">
                          {project.is_featured ? "★ Featured" : project.category}
                        </Badge>
                        <Button
                          variant={project.is_featured ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFeatured(project)}
                          title={project.is_featured ? "Remove from featured" : "Add to featured"}
                        >
                          <Star className={`w-4 h-4 ${project.is_featured ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(project)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'products' && (
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{product.title}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={product.is_published ? "default" : "secondary"}>
                          {product.is_published ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant={product.is_featured ? "default" : "outline"}>
                          {product.is_featured ? "★ Featured" : "Regular"}
                        </Badge>
                        <Button
                          variant={product.is_featured ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleProductFeatured(product)}
                          title={product.is_featured ? "Remove from featured" : "Add to featured"}
                        >
                          <Star className={`w-4 h-4 ${product.is_featured ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProductEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProductDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{product.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {(product.technical_specifications || []).map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;