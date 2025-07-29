-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create portfolio projects table
CREATE TABLE public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('residential', 'commercial', 'hospitality', 'industrial')),
  description TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  location TEXT NOT NULL,
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on portfolio projects
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for portfolio projects
CREATE POLICY "Anyone can view published projects" ON public.portfolio_projects
  FOR SELECT USING (is_published = true);

CREATE POLICY "Only admins can insert projects" ON public.portfolio_projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update projects" ON public.portfolio_projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete projects" ON public.portfolio_projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample portfolio data
INSERT INTO public.portfolio_projects (title, category, description, features, location, is_published) VALUES
  ('Luxury Residential Complex', 'residential', 'Smart LED integration with automated control systems for modern living spaces.', '{"Smart Controls","Energy Efficient","Custom Design"}', 'Mumbai, Maharashtra', true),
  ('Corporate Headquarters', 'commercial', 'Architectural facade lighting creating a stunning nighttime landmark.', '{"Facade Lighting","RGB Controls","Weather Resistant"}', 'Pune, Maharashtra', true),
  ('Hotel Ambience Project', 'hospitality', 'Sophisticated lighting design enhancing guest experience and brand identity.', '{"Mood Lighting","Dimming Systems","Brand Integration"}', 'Goa', true),
  ('Industrial Facility', 'industrial', 'High-performance LED solutions for 24/7 industrial operations.', '{"High Durability","Low Maintenance","Safety Compliant"}', 'Chennai, Tamil Nadu', true);