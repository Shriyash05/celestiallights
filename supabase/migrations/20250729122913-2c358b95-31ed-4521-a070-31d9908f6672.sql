-- Check if there are any profiles and make sure the current user has admin role
-- First, let's create a more robust check for admin access in storage policies

-- Drop existing admin policies for storage objects
DROP POLICY IF EXISTS "Admins can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project images" ON storage.objects;

-- Create a security definer function to check admin status safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate storage policies using the safer function
CREATE POLICY "Admins can upload project images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'project-images' 
  AND public.is_admin()
);

CREATE POLICY "Admins can update project images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'project-images' 
  AND public.is_admin()
);

CREATE POLICY "Admins can delete project images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'project-images' 
  AND public.is_admin()
);

-- Also ensure current authenticated user has admin role (if a profile exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid()) THEN
    INSERT INTO public.profiles (id, email, role)
    SELECT auth.uid(), auth.email(), 'admin'
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
  END IF;
END $$;