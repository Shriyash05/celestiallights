-- Create a temporary policy to allow anyone to upload for testing
-- We'll remove this once authentication is working properly

CREATE POLICY "Temporary: Anyone can upload project images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'project-images');

-- Also create a policy for anyone to read while testing
CREATE POLICY "Temporary: Anyone can view project images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'project-images');