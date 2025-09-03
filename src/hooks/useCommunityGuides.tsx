import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CommunityBrewGuide {
  id: string;
  user_id: string;
  name: string;
  method: string;
  difficulty: string;
  brew_time: string;
  target_flavor: string;
  description: string;
  water_temp: number;
  grind_size: string;
  ratio: string;
  steps: Array<{
    step: number;
    instruction: string;
    duration?: string;
    temperature?: number;
  }>;
  science?: string;
  flavor_profile?: string[];
  tips?: string[];
  is_public: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string;
  } | null;
}

export const useCommunityGuides = () => {
  const [guides, setGuides] = useState<CommunityBrewGuide[]>([]);
  const [myGuides, setMyGuides] = useState<CommunityBrewGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPublicGuides = async () => {
    try {
      const { data, error } = await supabase
        .from('community_brew_guides')
        .select(`
          *,
          profiles!inner(display_name)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuides((data || []).map(guide => ({
        ...guide,
        steps: (guide.steps as any[]).map((step: any) => ({
          step: step.step || 1,
          instruction: step.instruction || '',
          duration: step.duration,
          temperature: step.temperature
        })),
        flavor_profile: guide.flavor_profile || [],
        tips: guide.tips || [],
        profiles: guide.profiles && typeof guide.profiles === 'object' ? guide.profiles : null
      })));
    } catch (error) {
      console.error('Error fetching public guides:', error);
      toast.error('Failed to load community guides');
    }
  };

  const fetchMyGuides = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('community_brew_guides')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyGuides((data || []).map(guide => ({
        ...guide,
        steps: (guide.steps as any[]).map((step: any) => ({
          step: step.step || 1,
          instruction: step.instruction || '',
          duration: step.duration,
          temperature: step.temperature
        })),
        flavor_profile: guide.flavor_profile || [],
        tips: guide.tips || []
      })));
    } catch (error) {
      console.error('Error fetching my guides:', error);
      toast.error('Failed to load your guides');
    }
  };

  const createGuide = async (guideData: Omit<CommunityBrewGuide, 'id' | 'user_id' | 'likes_count' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Please sign in to create a guide');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('community_brew_guides')
        .insert([{
          ...guideData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Brew guide created successfully!');
      await fetchMyGuides();
      if (guideData.is_public) {
        await fetchPublicGuides();
      }
      return data;
    } catch (error) {
      console.error('Error creating guide:', error);
      toast.error('Failed to create guide');
    }
  };

  const updateGuide = async (id: string, updates: Partial<CommunityBrewGuide>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_brew_guides')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Guide updated successfully!');
      await fetchMyGuides();
      await fetchPublicGuides();
    } catch (error) {
      console.error('Error updating guide:', error);
      toast.error('Failed to update guide');
    }
  };

  const deleteGuide = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_brew_guides')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Guide deleted successfully!');
      await fetchMyGuides();
      await fetchPublicGuides();
    } catch (error) {
      console.error('Error deleting guide:', error);
      toast.error('Failed to delete guide');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPublicGuides(), fetchMyGuides()]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    guides,
    myGuides,
    loading,
    createGuide,
    updateGuide,
    deleteGuide,
    refetch: () => Promise.all([fetchPublicGuides(), fetchMyGuides()])
  };
};