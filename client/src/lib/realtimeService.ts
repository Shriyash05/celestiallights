import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

// Import types from schema to ensure consistency
import type { PortfolioProject as SchemaPortfolioProject, Product as SchemaProduct } from '@shared/schema';

export type PortfolioProject = SchemaPortfolioProject;
export type Product = SchemaProduct;

// Hook for real-time portfolio projects
export const useRealtimePortfolioProjects = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching projects:', error);
          return;
        }

        setProjects(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();

    // Manual event listeners as fallback for real-time
    const handleProjectAdded = (event: CustomEvent) => {
      console.log('Manual project add event received:', event.detail);
      setProjects((prev) => [event.detail, ...prev]);
    };

    const handleProjectDeleted = (event: CustomEvent) => {
      console.log('Manual project delete event received:', event.detail);
      setProjects((prev) => prev.filter((project) => project.id !== event.detail.id));
    };

    window.addEventListener('portfolioProjectAdded', handleProjectAdded as EventListener);
    window.addEventListener('portfolioProjectDeleted', handleProjectDeleted as EventListener);

    // Subscribe to real-time changes
    const channel = supabase
      .channel('portfolio-projects-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'portfolio_projects',
        },
        (payload) => {
          console.log('Real-time INSERT received:', payload);
          setProjects((prev) => [(payload.new as any) as PortfolioProject, ...prev]);
          setLoading(false);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'portfolio_projects',
        },
        (payload) => {
          console.log('Real-time UPDATE received:', payload);
          setProjects((prev) =>
            prev.map((project) =>
              project.id === (payload.new as any).id ? ((payload.new as any) as PortfolioProject) : project
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'portfolio_projects',
        },
        (payload) => {
          console.log('Real-time DELETE received:', payload);
          setProjects((prev) => prev.filter((project) => project.id !== (payload.old as any).id));
        }
      )
      .subscribe((status, err) => {
        console.log('Portfolio subscription status:', status, err);
      });

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('portfolioProjectAdded', handleProjectAdded as EventListener);
      window.removeEventListener('portfolioProjectDeleted', handleProjectDeleted as EventListener);
    };
  }, []);

  return { projects, loading };
};

// Hook for real-time products
export const useRealtimeProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          return;
        }

        setProducts(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();

    // Manual event listeners as fallback for real-time
    const handleProductAdded = (event: CustomEvent) => {
      console.log('Manual product add event received:', event.detail);
      setProducts((prev) => [event.detail, ...prev]);
    };

    const handleProductDeleted = (event: CustomEvent) => {
      console.log('Manual product delete event received:', event.detail);
      setProducts((prev) => prev.filter((product) => product.id !== event.detail.id));
    };

    window.addEventListener('productAdded', handleProductAdded as EventListener);
    window.addEventListener('productDeleted', handleProductDeleted as EventListener);

    // Subscribe to real-time changes
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Real-time Product INSERT received:', payload);
          setProducts((prev) => [(payload.new as any) as Product, ...prev]);
          setLoading(false);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Real-time Product UPDATE received:', payload);
          setProducts((prev) =>
            prev.map((product) =>
              product.id === (payload.new as any).id ? ((payload.new as any) as Product) : product
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Real-time Product DELETE received:', payload);
          setProducts((prev) => prev.filter((product) => product.id !== (payload.old as any).id));
        }
      )
      .subscribe((status, err) => {
        console.log('Products subscription status:', status, err);
      });

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('productAdded', handleProductAdded as EventListener);
      window.removeEventListener('productDeleted', handleProductDeleted as EventListener);
    };
  }, []);

  return { products, loading };
};

// Function to add a new portfolio project
export const addPortfolioProject = async (project: Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .insert([{ ...project, id: crypto.randomUUID() }])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Trigger a manual broadcast for immediate update if realtime is not working
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('portfolioProjectAdded', { detail: data }));
  }, 100);

  return data;
};

// Function to update a portfolio project
export const updatePortfolioProject = async (id: string, updates: Partial<PortfolioProject>) => {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Function to delete a portfolio project
export const deletePortfolioProject = async (id: string) => {
  const { error } = await supabase
    .from('portfolio_projects')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  // Trigger manual update
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('portfolioProjectDeleted', { detail: { id } }));
  }, 100);

  return true;
};

// Function to add a new product
export const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([{ ...product, id: crypto.randomUUID() }])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Trigger a manual broadcast for immediate update if realtime is not working
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('productAdded', { detail: data }));
  }, 100);

  return data;
};

// Function to update a product
export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Function to delete a product
export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  // Trigger manual update
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('productDeleted', { detail: { id } }));
  }, 100);

  return true;
};