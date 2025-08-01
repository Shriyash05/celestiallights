-- Disable RLS for portfolio_projects to allow anonymous inserts
ALTER TABLE portfolio_projects DISABLE ROW LEVEL SECURITY;

-- Disable RLS for products to allow anonymous inserts  
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Create storage bucket and set policies
INSERT INTO storage.buckets (id, name, public, owner, created_at, updated_at)
VALUES ('celestial-lights-assets', 'celestial-lights-assets', true, null, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Enable public access to storage bucket
CREATE POLICY "Allow anonymous uploads" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'celestial-lights-assets');

CREATE POLICY "Allow anonymous access to files" ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'celestial-lights-assets');

-- Alternative: If you want to keep RLS enabled, create permissive policies
-- These policies would allow anonymous access while keeping RLS enabled

-- CREATE POLICY "Allow anonymous read access" ON portfolio_projects
-- FOR SELECT TO anon
-- USING (true);

-- CREATE POLICY "Allow anonymous insert access" ON portfolio_projects  
-- FOR INSERT TO anon
-- WITH CHECK (true);

-- CREATE POLICY "Allow anonymous update access" ON portfolio_projects
-- FOR UPDATE TO anon  
-- USING (true)
-- WITH CHECK (true);

-- CREATE POLICY "Allow anonymous delete access" ON portfolio_projects
-- FOR DELETE TO anon
-- USING (true);

-- Same policies for products table
-- CREATE POLICY "Allow anonymous read access" ON products
-- FOR SELECT TO anon
-- USING (true);

-- CREATE POLICY "Allow anonymous insert access" ON products
-- FOR INSERT TO anon
-- WITH CHECK (true);

-- CREATE POLICY "Allow anonymous update access" ON products
-- FOR UPDATE TO anon
-- USING (true)
-- WITH CHECK (true);

-- CREATE POLICY "Allow anonymous delete access" ON products
-- FOR DELETE TO anon
-- USING (true);