import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Edit, Trash2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  is_published: boolean;
  is_featured: boolean;
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
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      setProducts(data || []);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      
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
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    let finalImageUrl = formData.image_url;
    
    // If there's a file to upload, upload it first
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      } else {
        setUploading(false);
        return; // Stop if upload failed
      }
    }
    
    const projectData = {
      ...formData,
      image_url: finalImageUrl,
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
    
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      } else {
        setUploading(false);
        return;
      }
    }
    
    const productData = {
      ...productFormData,
      image_url: finalImageUrl,
      technical_specifications: productFormData.technical_specifications.split(',').map(spec => spec.trim()).filter(spec => spec),
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
      is_published: true,
      is_featured: false,
    });
    setImageFile(null);
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
    });
    setImageFile(null);
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
                        }
                      }}
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
                        }
                      }}
                      placeholder="https://example.com/image.jpg"
                      disabled={!!imageFile}
                    />
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
                
                <div className="space-y-2">
                  <Label htmlFor="product-specs">Technical Specifications (comma-separated)</Label>
                  <Input
                    id="product-specs"
                    value={productFormData.technical_specifications}
                    onChange={(e) => setProductFormData({ ...productFormData, technical_specifications: e.target.value })}
                    placeholder="IP65 Rated, 120 LEDs/m, 24V DC"
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-image-file">Upload Image from Device</Label>
                    <Input
                      id="product-image-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setImageFile(file || null);
                        if (file) {
                          setProductFormData({ ...productFormData, image_url: '' });
                        }
                      }}
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
                    <Label htmlFor="product-image-url">Image URL</Label>
                    <Input
                      id="product-image-url"
                      value={productFormData.image_url}
                      onChange={(e) => {
                        setProductFormData({ ...productFormData, image_url: e.target.value });
                        if (e.target.value) {
                          setImageFile(null);
                        }
                      }}
                      placeholder="https://example.com/image.jpg"
                      disabled={!!imageFile}
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