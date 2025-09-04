-- This script aligns the database with the current schema expectations
-- Run this directly in your Supabase SQL editor

-- First, let's see what tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Create the correct tables if they don't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    location TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    "videoUrl" TEXT,
    videos TEXT[] DEFAULT '{}',
    "isPublished" BOOLEAN DEFAULT true,
    "isFeatured" BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    "technicalSpecifications" TEXT[] NOT NULL DEFAULT '{}',
    "imageUrl" TEXT,
    images TEXT[] DEFAULT '{}',
    "isPublished" BOOLEAN DEFAULT true,
    "isFeatured" BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Technical specification fields
    dimensions JSONB DEFAULT '{}',
    "bodyColor" TEXT,
    "beamAngle" TEXT,
    "powerConsumption" TEXT,
    "ipRating" TEXT,
    "colorTemperature" TEXT,
    "lumensOutput" TEXT,
    material TEXT,
    "mountingType" TEXT,
    "controlType" TEXT,
    "warrantyPeriod" TEXT,
    certifications TEXT[] DEFAULT '{}'
);

-- Drop the conflicting user_roles table and related objects if they exist
-- (Only run this if you're sure you don't need the existing data)
-- DROP FUNCTION IF EXISTS has_role(uuid, app_role) CASCADE;
-- DROP TYPE IF EXISTS app_role CASCADE;
-- DROP TABLE IF EXISTS user_roles CASCADE;

-- Insert some sample data for testing (optional)
-- INSERT INTO profiles (email, role) VALUES 
-- ('admin@celestiallights.com', 'admin')
-- ON CONFLICT (email) DO NOTHING;
