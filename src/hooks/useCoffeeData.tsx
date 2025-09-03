import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CoffeeEntry {
  id: string;
  coffee_name: string;
  roaster: string;
  origin: string;
  process: string;
  roast_level: string;
  brew_method: string;
  grind_size: string;
  water_temp: number;
  brew_time: string;
  ratio: string;
  rating: number;
  tasting_notes?: string;
  flavor_profile: string[];
  price?: number;
  created_at: string;
  updated_at: string;
}

export interface CoffeeEntryInput {
  coffee_name: string;
  roaster: string;
  origin: string;
  process: string;
  roast_level: string;
  brew_method: string;
  grind_size: string;
  water_temp: number;
  brew_time: string;
  ratio: string;
  rating: number;
  tasting_notes?: string;
  flavor_profile: string[];
  price?: number;
}

export const useCoffeeEntries = () => {
  const [entries, setEntries] = useState<CoffeeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEntries = async () => {
    if (!user) {
      setEntries([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('coffee_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load coffee entries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addEntry = async (entry: CoffeeEntryInput) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add entries",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('coffee_entries')
        .insert([{ ...entry, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setEntries([data, ...entries]);
      toast({
        title: "Success",
        description: "Coffee entry added successfully",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add coffee entry",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEntry = async (id: string, entry: CoffeeEntryInput) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update entries",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('coffee_entries')
        .update(entry)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setEntries(entries.map(e => e.id === id ? data : e));
      toast({
        title: "Success",
        description: "Coffee entry updated successfully",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update coffee entry",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
    refetch: fetchEntries,
  };
};