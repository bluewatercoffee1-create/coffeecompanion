import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  display_name?: string;
  avatar_url?: string;
  background_url?: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      toast.error('Please sign in to update profile');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      toast.success('Profile updated successfully!');
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const uploadFile = async (file: File, bucket: 'profile-pictures' | 'profile-backgrounds') => {
    if (!user) {
      toast.error('Please sign in to upload files');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      return null;
    }
  };

  const updateAvatar = async (file: File) => {
    const avatarUrl = await uploadFile(file, 'profile-pictures');
    if (avatarUrl) {
      await updateProfile({ avatar_url: avatarUrl });
    }
  };

  const updateBackground = async (file: File) => {
    const backgroundUrl = await uploadFile(file, 'profile-backgrounds');
    if (backgroundUrl) {
      await updateProfile({ background_url: backgroundUrl });
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      await fetchProfile();
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  return {
    profile,
    loading,
    updateProfile,
    updateAvatar,
    updateBackground,
    refetch: fetchProfile
  };
};