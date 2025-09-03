-- Add foreign key constraints to link tables properly
ALTER TABLE public.user_posts 
ADD CONSTRAINT user_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.friendships 
ADD CONSTRAINT friendships_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.friendships 
ADD CONSTRAINT friendships_friend_id_fkey 
FOREIGN KEY (friend_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.post_likes 
ADD CONSTRAINT post_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.post_likes 
ADD CONSTRAINT post_likes_post_id_fkey 
FOREIGN KEY (post_id) REFERENCES public.user_posts(id) ON DELETE CASCADE;

ALTER TABLE public.post_comments 
ADD CONSTRAINT post_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.post_comments 
ADD CONSTRAINT post_comments_post_id_fkey 
FOREIGN KEY (post_id) REFERENCES public.user_posts(id) ON DELETE CASCADE;