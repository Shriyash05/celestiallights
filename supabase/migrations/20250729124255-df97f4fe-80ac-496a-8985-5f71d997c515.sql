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