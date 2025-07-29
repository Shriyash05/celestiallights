-- First, ensure the logged-in users have admin profiles
INSERT INTO public.profiles (id, email, role)
VALUES 
  ('10c866a7-9913-42f3-b0dc-f7ed753cda55', 'shrimhatre00@gmail.com', 'admin'),
  ('6a3ed747-4554-4527-9a28-a2e3828da454', 'attharvchauudharri9@gmail.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Remove all temporary insecure policies
DROP POLICY IF EXISTS "Temporary: Anyone can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Temporary: Anyone can view project images" ON storage.objects;
DROP POLICY IF EXISTS "Temporary: Anyone can insert projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Temporary: Anyone can update projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Temporary: Anyone can delete projects" ON public.portfolio_projects;

-- Restore secure admin-only policies for portfolio projects
-- (keeping the existing "Anyone can view published projects" policy)

-- Ensure we have the proper admin function with correct search path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Recreate admin-only policies for portfolio projects
CREATE POLICY "Only admins can insert projects" 
ON public.portfolio_projects FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update projects" 
ON public.portfolio_projects FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Only admins can delete projects" 
ON public.portfolio_projects FOR DELETE 
USING (public.is_admin());

-- Ensure storage policies are also admin-only (these should already exist)
-- The "Anyone can view project images" policy should remain for public viewing