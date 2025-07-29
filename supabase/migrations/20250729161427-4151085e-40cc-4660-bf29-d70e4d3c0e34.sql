-- Add images array field to portfolio_projects table
ALTER TABLE public.portfolio_projects 
ADD COLUMN images TEXT[] DEFAULT '{}';

-- Add images array field to products table  
ALTER TABLE public.products
ADD COLUMN images TEXT[] DEFAULT '{}';

-- Update existing records to move single image_url to images array if they exist
UPDATE public.portfolio_projects 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';

UPDATE public.products 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';