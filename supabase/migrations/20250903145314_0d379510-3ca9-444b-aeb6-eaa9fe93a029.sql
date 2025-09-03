-- Create community_brew_guides table for public user-created guides
CREATE TABLE public.community_brew_guides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  method TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Medium',
  brew_time TEXT NOT NULL,
  target_flavor TEXT NOT NULL,
  description TEXT NOT NULL,
  water_temp INTEGER NOT NULL,
  grind_size TEXT NOT NULL,
  ratio TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  science TEXT,
  flavor_profile TEXT[],
  tips TEXT[],
  is_public BOOLEAN NOT NULL DEFAULT false,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.community_brew_guides ENABLE ROW LEVEL SECURITY;

-- Create policies for community guides
CREATE POLICY "Users can view public community guides" 
ON public.community_brew_guides 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can view their own community guides" 
ON public.community_brew_guides 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own community guides" 
ON public.community_brew_guides 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community guides" 
ON public.community_brew_guides 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community guides" 
ON public.community_brew_guides 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_community_brew_guides_updated_at
BEFORE UPDATE ON public.community_brew_guides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on public guides
CREATE INDEX idx_community_brew_guides_public ON public.community_brew_guides(is_public, created_at DESC);
CREATE INDEX idx_community_brew_guides_method ON public.community_brew_guides(method) WHERE is_public = true;