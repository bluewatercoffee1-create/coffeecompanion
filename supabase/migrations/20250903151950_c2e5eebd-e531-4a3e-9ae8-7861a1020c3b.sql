-- Add foreign key relationship between community_brew_guides and profiles
ALTER TABLE public.community_brew_guides 
ADD CONSTRAINT community_brew_guides_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add trigger to automatically update updated_at column
DROP TRIGGER IF EXISTS update_community_brew_guides_updated_at ON public.community_brew_guides;
CREATE TRIGGER update_community_brew_guides_updated_at
  BEFORE UPDATE ON public.community_brew_guides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger to update likes count when guide_likes are added/removed
DROP TRIGGER IF EXISTS update_likes_count_trigger ON public.guide_likes;
CREATE TRIGGER update_likes_count_trigger
  AFTER INSERT OR DELETE ON public.guide_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_likes_count();