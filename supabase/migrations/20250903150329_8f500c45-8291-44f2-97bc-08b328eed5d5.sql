-- Create guide_likes table for user favorites
CREATE TABLE public.guide_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  guide_id UUID NOT NULL REFERENCES public.community_brew_guides(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, guide_id)
);

-- Enable RLS
ALTER TABLE public.guide_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for guide_likes
CREATE POLICY "Users can view their own likes" 
ON public.guide_likes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own likes" 
ON public.guide_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.guide_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update likes count
CREATE OR REPLACE FUNCTION public.update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_brew_guides 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.guide_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_brew_guides 
    SET likes_count = GREATEST(0, likes_count - 1) 
    WHERE id = OLD.guide_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for automatic likes count updates
CREATE TRIGGER update_likes_count_on_insert
  AFTER INSERT ON public.guide_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_likes_count();

CREATE TRIGGER update_likes_count_on_delete
  AFTER DELETE ON public.guide_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_likes_count();

-- Fix the profiles policy to allow public viewing for community guides
CREATE POLICY "Profiles are viewable for community guides" 
ON public.profiles 
FOR SELECT 
USING (true);