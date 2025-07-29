-- Add structured technical specification fields to products table
ALTER TABLE public.products 
ADD COLUMN dimensions JSONB DEFAULT '{}',
ADD COLUMN body_color TEXT,
ADD COLUMN beam_angle TEXT,
ADD COLUMN power_consumption TEXT,
ADD COLUMN ip_rating TEXT,
ADD COLUMN color_temperature TEXT,
ADD COLUMN lumens_output TEXT,
ADD COLUMN material TEXT,
ADD COLUMN mounting_type TEXT,
ADD COLUMN control_type TEXT,
ADD COLUMN warranty_period TEXT,
ADD COLUMN certifications TEXT[];

-- Update existing products to have empty arrays for certifications
UPDATE public.products 
SET certifications = '{}' 
WHERE certifications IS NULL;