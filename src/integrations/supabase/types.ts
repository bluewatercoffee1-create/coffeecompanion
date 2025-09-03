export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      coffee_entries: {
        Row: {
          brew_method: string
          brew_time: string
          coffee_name: string
          created_at: string | null
          flavor_profile: string[] | null
          grind_size: string
          id: string
          origin: string
          price: number | null
          process: string
          rating: number | null
          ratio: string
          roast_level: string
          roaster: string
          tasting_notes: string | null
          updated_at: string | null
          user_id: string
          water_temp: number
        }
        Insert: {
          brew_method: string
          brew_time: string
          coffee_name: string
          created_at?: string | null
          flavor_profile?: string[] | null
          grind_size: string
          id?: string
          origin: string
          price?: number | null
          process: string
          rating?: number | null
          ratio: string
          roast_level: string
          roaster: string
          tasting_notes?: string | null
          updated_at?: string | null
          user_id: string
          water_temp: number
        }
        Update: {
          brew_method?: string
          brew_time?: string
          coffee_name?: string
          created_at?: string | null
          flavor_profile?: string[] | null
          grind_size?: string
          id?: string
          origin?: string
          price?: number | null
          process?: string
          rating?: number | null
          ratio?: string
          roast_level?: string
          roaster?: string
          tasting_notes?: string | null
          updated_at?: string | null
          user_id?: string
          water_temp?: number
        }
        Relationships: [
          {
            foreignKeyName: "coffee_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_brew_guides: {
        Row: {
          brew_time: string
          created_at: string
          description: string
          difficulty: string
          flavor_profile: string[] | null
          grind_size: string
          id: string
          is_public: boolean
          likes_count: number
          method: string
          name: string
          ratio: string
          science: string | null
          steps: Json
          target_flavor: string
          tips: string[] | null
          updated_at: string
          user_id: string
          water_temp: number
        }
        Insert: {
          brew_time: string
          created_at?: string
          description: string
          difficulty?: string
          flavor_profile?: string[] | null
          grind_size: string
          id?: string
          is_public?: boolean
          likes_count?: number
          method: string
          name: string
          ratio: string
          science?: string | null
          steps?: Json
          target_flavor: string
          tips?: string[] | null
          updated_at?: string
          user_id: string
          water_temp: number
        }
        Update: {
          brew_time?: string
          created_at?: string
          description?: string
          difficulty?: string
          flavor_profile?: string[] | null
          grind_size?: string
          id?: string
          is_public?: boolean
          likes_count?: number
          method?: string
          name?: string
          ratio?: string
          science?: string | null
          steps?: Json
          target_flavor?: string
          tips?: string[] | null
          updated_at?: string
          user_id?: string
          water_temp?: number
        }
        Relationships: [
          {
            foreignKeyName: "community_brew_guides_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cupping_sessions: {
        Row: {
          acidity: number | null
          aftertaste: number | null
          balance: number | null
          body: number | null
          clean_cup: number | null
          coffee_name: string
          created_at: string | null
          cupping_protocol: string
          defects: string[] | null
          final_rating: string | null
          flavor: number | null
          fragrance: number | null
          id: string
          notes_crust: string | null
          notes_dry: string | null
          notes_finish: string | null
          notes_flavor: string | null
          notes_overall: string | null
          origin: string
          overall: number | null
          process: string
          recommendations: string | null
          roast_date: string | null
          roast_level: string
          roaster: string
          sweetness: number | null
          total_score: number | null
          uniformity: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          acidity?: number | null
          aftertaste?: number | null
          balance?: number | null
          body?: number | null
          clean_cup?: number | null
          coffee_name: string
          created_at?: string | null
          cupping_protocol: string
          defects?: string[] | null
          final_rating?: string | null
          flavor?: number | null
          fragrance?: number | null
          id?: string
          notes_crust?: string | null
          notes_dry?: string | null
          notes_finish?: string | null
          notes_flavor?: string | null
          notes_overall?: string | null
          origin: string
          overall?: number | null
          process: string
          recommendations?: string | null
          roast_date?: string | null
          roast_level: string
          roaster: string
          sweetness?: number | null
          total_score?: number | null
          uniformity?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          acidity?: number | null
          aftertaste?: number | null
          balance?: number | null
          body?: number | null
          clean_cup?: number | null
          coffee_name?: string
          created_at?: string | null
          cupping_protocol?: string
          defects?: string[] | null
          final_rating?: string | null
          flavor?: number | null
          fragrance?: number | null
          id?: string
          notes_crust?: string | null
          notes_dry?: string | null
          notes_finish?: string | null
          notes_flavor?: string | null
          notes_overall?: string | null
          origin?: string
          overall?: number | null
          process?: string
          recommendations?: string | null
          roast_date?: string | null
          roast_level?: string
          roaster?: string
          sweetness?: number | null
          total_score?: number | null
          uniformity?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cupping_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      guide_likes: {
        Row: {
          created_at: string
          guide_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          guide_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          guide_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_likes_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "community_brew_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
