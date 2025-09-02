import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CuppingSession {
  id: string;
  coffee_name: string;
  roaster: string;
  origin: string;
  process: string;
  roast_level: string;
  roast_date?: string;
  cupping_protocol: string;
  total_score: number;
  final_rating: string;
  fragrance: number;
  flavor: number;
  aftertaste: number;
  acidity: number;
  body: number;
  balance: number;
  sweetness: number;
  clean_cup: number;
  uniformity: number;
  overall: number;
  notes_dry?: string;
  notes_crust?: string;
  notes_flavor?: string;
  notes_finish?: string;
  notes_overall?: string;
  defects: string[];
  recommendations?: string;
  created_at: string;
}

export interface CuppingSessionInput {
  coffee_name: string;
  roaster: string;
  origin: string;
  process: string;
  roast_level: string;
  roast_date?: string;
  cupping_protocol: string;
  total_score: number;
  final_rating: string;
  fragrance: number;
  flavor: number;
  aftertaste: number;
  acidity: number;
  body: number;
  balance: number;
  sweetness: number;
  clean_cup: number;
  uniformity: number;
  overall: number;
  notes_dry?: string;
  notes_crust?: string;
  notes_flavor?: string;
  notes_finish?: string;
  notes_overall?: string;
  defects: string[];
  recommendations?: string;
}

export const useCuppingSessions = () => {
  const [sessions, setSessions] = useState<CuppingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSessions = async () => {
    if (!user) {
      setSessions([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cupping_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load cupping sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSession = async (session: CuppingSessionInput) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add sessions",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cupping_sessions')
        .insert([{ ...session, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setSessions([data, ...sessions]);
      toast({
        title: "Success",
        description: "Cupping session saved successfully",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save cupping session",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  return {
    sessions,
    isLoading,
    addSession,
    refetch: fetchSessions,
  };
};