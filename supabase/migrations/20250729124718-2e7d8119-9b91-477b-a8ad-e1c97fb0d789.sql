-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Anyone can view published products" 
ON public.products 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Only admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update products" 
ON public.products 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Only admins can delete products" 
ON public.products 
FOR DELETE 
USING (public.is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample products
INSERT INTO public.products (title, category, description, price, features, image_url, is_featured) VALUES
('Smart LED Panels', 'Smart Lighting', 'Advanced LED panels with smart controls and customizable lighting effects for modern spaces.', 299.99, ARRAY['WiFi Enabled', 'Color Changing', 'Voice Control', 'Energy Efficient'], NULL, true),
('Commercial Floodlights', 'Outdoor Lighting', 'High-performance LED floodlights designed for commercial and industrial applications.', 199.99, ARRAY['IP65 Waterproof', '50,000 Hour Lifespan', 'Motion Sensor', 'Adjustable Brightness'], NULL, false),
('Residential Track Lighting', 'Indoor Lighting', 'Elegant track lighting system perfect for highlighting artwork and architectural features.', 149.99, ARRAY['Adjustable Heads', 'Dimmable', 'Easy Installation', 'Modern Design'], NULL, true),
('Solar Street Lights', 'Solar Lighting', 'Eco-friendly solar-powered street lights with automatic dusk-to-dawn operation.', 399.99, ARRAY['Solar Powered', 'Motion Detection', 'Weather Resistant', 'Remote Monitoring'], NULL, false),
('Pendant Light Collection', 'Decorative Lighting', 'Designer pendant lights that add elegance and style to any interior space.', 89.99, ARRAY['Multiple Styles', 'Adjustable Height', 'Energy Efficient', 'Premium Materials'], NULL, true);