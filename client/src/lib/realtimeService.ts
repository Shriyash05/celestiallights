import { useEffect, useState } from 'react';
import { apiRequest } from './queryClient';

// Import types from schema to ensure consistency
import type { PortfolioProject as SchemaPortfolioProject, Product as SchemaProduct } from '@shared/schema';

export type PortfolioProject = SchemaPortfolioProject;
export type Product = SchemaProduct;

// Hook for portfolio projects using API endpoints
export const useRealtimePortfolioProjects = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data from API
    const fetchProjects = async () => {
      try {
        const data = await apiRequest('/api/portfolio-projects');
        setProjects(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();

    // Manual event listeners for updates from admin panel
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

    return () => {
      window.removeEventListener('portfolioProjectAdded', handleProjectAdded as EventListener);
      window.removeEventListener('portfolioProjectDeleted', handleProjectDeleted as EventListener);
    };
  }, []);

  return { projects, loading };
};

// Hook for products using API endpoints
export const useRealtimeProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data from API
    const fetchProducts = async () => {
      try {
        const data = await apiRequest('/api/products');
        setProducts(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();

    // Manual event listeners for updates from admin panel
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

    return () => {
      window.removeEventListener('productAdded', handleProductAdded as EventListener);
      window.removeEventListener('productDeleted', handleProductDeleted as EventListener);
    };
  }, []);

  return { products, loading };
};

// Function to add a new portfolio project
export const addPortfolioProject = async (project: Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'>) => {
  const data = await apiRequest('/api/portfolio-projects', {
    method: 'POST',
    body: JSON.stringify({ ...project, id: crypto.randomUUID() })
  });

  // Trigger a manual broadcast for immediate update
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('portfolioProjectAdded', { detail: data }));
  }, 100);

  return data;
};

// Function to update a portfolio project
export const updatePortfolioProject = async (id: string, updates: Partial<PortfolioProject>) => {
  const data = await apiRequest(`/api/portfolio-projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
  return data;
};

// Function to delete a portfolio project
export const deletePortfolioProject = async (id: string) => {
  await apiRequest(`/api/portfolio-projects/${id}`, {
    method: 'DELETE'
  });

  // Trigger manual update
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('portfolioProjectDeleted', { detail: { id } }));
  }, 100);

  return true;
};

// Function to add a new product
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const data = await apiRequest('/api/products', {
    method: 'POST',
    body: JSON.stringify({ ...product, id: crypto.randomUUID() })
  });

  // Trigger a manual broadcast for immediate update
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('productAdded', { detail: data }));
  }, 100);

  return data;
};

// Function to update a product
export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const data = await apiRequest(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
  return data;
};

// Function to delete a product
export const deleteProduct = async (id: string) => {
  await apiRequest(`/api/products/${id}`, {
    method: 'DELETE'
  });

  // Trigger manual update
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('productDeleted', { detail: { id } }));
  }, 100);

  return true;
};
