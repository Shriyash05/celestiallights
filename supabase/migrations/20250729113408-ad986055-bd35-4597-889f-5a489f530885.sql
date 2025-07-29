-- Add featured field to portfolio projects for homepage highlighting
ALTER TABLE public.portfolio_projects 
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Create index for featured projects for better performance
CREATE INDEX idx_portfolio_projects_featured ON public.portfolio_projects(is_featured, is_published);

-- Update existing projects - let's feature the first two projects as examples
UPDATE public.portfolio_projects 
SET is_featured = true 
WHERE id IN (
  SELECT id FROM public.portfolio_projects 
  ORDER BY created_at ASC 
  LIMIT 2
);