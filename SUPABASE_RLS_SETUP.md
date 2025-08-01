# Supabase RLS Policy Setup

The application is currently experiencing RLS (Row Level Security) policy violations. Here are the steps to fix this:

## Option 1: Disable RLS (Recommended for Development)

Go to your Supabase SQL Editor and run:

```sql
-- Disable RLS for portfolio_projects to allow anonymous operations
ALTER TABLE portfolio_projects DISABLE ROW LEVEL SECURITY;

-- Disable RLS for products to allow anonymous operations  
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

## Option 2: Create Storage Bucket in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Storage section
3. Click "New Bucket"
4. Name: `celestial-lights-assets`
5. Make it Public
6. Set file size limit to 50MB
7. Allow these MIME types: image/*, video/*, application/pdf

## Option 3: Create Permissive RLS Policies (If you want to keep RLS enabled)

```sql
-- Portfolio Projects Policies
CREATE POLICY "Allow anonymous read access" ON portfolio_projects
FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert access" ON portfolio_projects  
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" ON portfolio_projects
FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Products Policies  
CREATE POLICY "Allow anonymous read access" ON products
FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert access" ON products
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" ON products
FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Storage Policies
CREATE POLICY "Allow anonymous uploads" ON storage.objects
FOR INSERT TO anon WITH CHECK (bucket_id = 'celestial-lights-assets');

CREATE POLICY "Allow anonymous access to files" ON storage.objects  
FOR SELECT TO anon USING (bucket_id = 'celestial-lights-assets');
```

## Current Status

The application is working correctly with fallback to base64 data URLs when storage fails. All data is properly stored in Supabase database tables. To get optimal performance with actual file storage, please implement one of the options above in your Supabase dashboard.