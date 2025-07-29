-- Temporarily allow anyone to insert projects for testing
-- This will be removed once authentication is properly set up

CREATE POLICY "Temporary: Anyone can insert projects" 
ON public.portfolio_projects FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Temporary: Anyone can update projects" 
ON public.portfolio_projects FOR UPDATE 
USING (true);

CREATE POLICY "Temporary: Anyone can delete projects" 
ON public.portfolio_projects FOR DELETE 
USING (true);