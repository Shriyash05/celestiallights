-- Remove price column and update products table structure for technical specifications
ALTER TABLE public.products DROP COLUMN IF EXISTS price;

-- Rename features column to technical_specifications for clarity
ALTER TABLE public.products RENAME COLUMN features TO technical_specifications;

-- Update any existing sample data to reflect technical specifications format
UPDATE public.products 
SET technical_specifications = ARRAY[
  'LED Technology: High-efficiency LEDs',
  'Power Consumption: Energy-efficient design',
  'Lifespan: 50,000+ hours',
  'Installation: Professional installation recommended'
] 
WHERE technical_specifications = '{}' OR technical_specifications IS NULL;