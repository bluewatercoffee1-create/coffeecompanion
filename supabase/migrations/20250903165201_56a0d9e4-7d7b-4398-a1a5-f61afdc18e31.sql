-- Create storage buckets for profile customization
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-pictures', 'profile-pictures', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-backgrounds', 'profile-backgrounds', true);

-- Add profile image columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN avatar_url TEXT,
ADD COLUMN background_url TEXT;

-- Create storage policies for profile pictures
CREATE POLICY "Profile pictures are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload their own profile picture" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile picture" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile picture" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for profile backgrounds
CREATE POLICY "Profile backgrounds are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-backgrounds');

CREATE POLICY "Users can upload their own profile background" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile background" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile background" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);