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
          setProjects((prev) => [(payload.new as any) as PortfolioProject, ...prev]); // Cast to any
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
          setProjects((prev) => prev.filter((project) => project.id !== (payload.old as any).id)); // Cast to any
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
          setProducts((prev) => [(payload.new as any) as Product, ...prev]); // Cast to any
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
          setProducts((prev) => prev.filter((product) => product.id !== (payload.old as any).id)); // Cast to any
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, loading };
};

// Function to add a new portfolio project
export const addPortfolioProject = async (project: Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .insert([{ ...project, id: crypto.randomUUID() }])
    .select('*') // Select all fields to get complete project data including videos
    .single();

  if (error) {
    throw new Error(error.message);
  }

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

  return true;
};

// Function to add a new product
export const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([{ ...product, id: crypto.randomUUID() }])
    .select('id') // Only select ID to bypass PostgREST schema cache issues
    .single();

  if (error) {
    throw new Error(error.message);
  }

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

  return true;
};