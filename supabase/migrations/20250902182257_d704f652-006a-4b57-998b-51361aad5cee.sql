-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create coffee entries table for journal
CREATE TABLE public.coffee_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  coffee_name TEXT NOT NULL,
  roaster TEXT NOT NULL,
  origin TEXT NOT NULL,
  process TEXT NOT NULL,
  roast_level TEXT NOT NULL,
  brew_method TEXT NOT NULL,
  grind_size TEXT NOT NULL,
  water_temp INTEGER NOT NULL,
  brew_time TEXT NOT NULL,
  ratio TEXT NOT NULL,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  tasting_notes TEXT,
  flavor_profile TEXT[] DEFAULT '{}',
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cupping sessions table
CREATE TABLE public.cupping_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  coffee_name TEXT NOT NULL,
  roaster TEXT NOT NULL,
  origin TEXT NOT NULL,
  process TEXT NOT NULL,
  roast_level TEXT NOT NULL,
  roast_date DATE,
  cupping_protocol TEXT NOT NULL,
  total_score DECIMAL(4,2),
  final_rating TEXT,
  -- Individual scores
  fragrance DECIMAL(3,2) CHECK (fragrance >= 0 AND fragrance <= 10),
  flavor DECIMAL(3,2) CHECK (flavor >= 0 AND flavor <= 10),
  aftertaste DECIMAL(3,2) CHECK (aftertaste >= 0 AND aftertaste <= 10),
  acidity DECIMAL(3,2) CHECK (acidity >= 0 AND acidity <= 10),
  body DECIMAL(3,2) CHECK (body >= 0 AND body <= 10),
  balance DECIMAL(3,2) CHECK (balance >= 0 AND balance <= 10),
  sweetness DECIMAL(3,2) CHECK (sweetness >= 0 AND sweetness <= 10),
  clean_cup DECIMAL(3,2) CHECK (clean_cup >= 0 AND clean_cup <= 10),
  uniformity DECIMAL(3,2) CHECK (uniformity >= 0 AND uniformity <= 10),
  overall DECIMAL(3,2) CHECK (overall >= 0 AND overall <= 10),
  -- Tasting notes
  notes_dry TEXT,
  notes_crust TEXT,
  notes_flavor TEXT,
  notes_finish TEXT,
  notes_overall TEXT,
  defects TEXT[] DEFAULT '{}',
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cupping_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Coffee entries policies
CREATE POLICY "Users can view their own coffee entries" ON public.coffee_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own coffee entries" ON public.coffee_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coffee entries" ON public.coffee_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coffee entries" ON public.coffee_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Cupping sessions policies
CREATE POLICY "Users can view their own cupping sessions" ON public.cupping_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cupping sessions" ON public.cupping_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cupping sessions" ON public.cupping_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cupping sessions" ON public.cupping_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coffee_entries_updated_at
  BEFORE UPDATE ON public.coffee_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cupping_sessions_updated_at
  BEFORE UPDATE ON public.cupping_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();