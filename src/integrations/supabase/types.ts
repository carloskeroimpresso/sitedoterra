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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          id: string
          notes: string | null
          slot_id: string | null
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          slot_id?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          slot_id?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "schedule_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_items: {
        Row: {
          active: boolean
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          badge: string | null
          bg_gradient: string | null
          category: string | null
          created_at: string
          description: string | null
          emoji: string | null
          external_link: string | null
          has_price: boolean
          id: string
          image_url: string | null
          name: string
          price: string
          promo_price: string | null
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          badge?: string | null
          bg_gradient?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          emoji?: string | null
          external_link?: string | null
          has_price?: boolean
          id?: string
          image_url?: string | null
          name: string
          price: string
          promo_price?: string | null
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          badge?: string | null
          bg_gradient?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          emoji?: string | null
          external_link?: string | null
          has_price?: boolean
          id?: string
          image_url?: string | null
          name?: string
          price?: string
          promo_price?: string | null
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          extra_contacts: Json | null
          full_name: string | null
          id: string
          phone: string | null
          role_text: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          extra_contacts?: Json | null
          full_name?: string | null
          id: string
          phone?: string | null
          role_text?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          extra_contacts?: Json | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role_text?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      schedule_slots: {
        Row: {
          created_at: string
          id: string
          slot_date: string
          slot_time: string
          status: Database["public"]["Enums"]["slot_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          slot_date: string
          slot_time: string
          status?: Database["public"]["Enums"]["slot_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          slot_date?: string
          slot_time?: string
          status?: Database["public"]["Enums"]["slot_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string | null
          consultant_photo_url: string | null
          created_at: string
          favicon_url: string | null
          footer_links: Json | null
          footer_text: string | null
          id: string
          instagram_handle: string | null
          logo_dark_url: string | null
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          sections_config: Json | null
          site_name: string | null
          updated_at: string
          user_id: string
          video_url: string | null
          whatsapp_number: string | null
        }
        Insert: {
          accent_color?: string | null
          consultant_photo_url?: string | null
          created_at?: string
          favicon_url?: string | null
          footer_links?: Json | null
          footer_text?: string | null
          id?: string
          instagram_handle?: string | null
          logo_dark_url?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          sections_config?: Json | null
          site_name?: string | null
          updated_at?: string
          user_id: string
          video_url?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          accent_color?: string | null
          consultant_photo_url?: string | null
          created_at?: string
          favicon_url?: string | null
          footer_links?: Json | null
          footer_text?: string | null
          id?: string
          instagram_handle?: string | null
          logo_dark_url?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          sections_config?: Json | null
          site_name?: string | null
          updated_at?: string
          user_id?: string
          video_url?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          active: boolean
          created_at: string
          featured: boolean
          id: string
          initials: string | null
          location: string | null
          name: string
          sort_order: number
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          featured?: boolean
          id?: string
          initials?: string | null
          location?: string | null
          name: string
          sort_order?: number
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          featured?: boolean
          id?: string
          initials?: string | null
          location?: string | null
          name?: string
          sort_order?: number
          text?: string
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
      appointment_status: "pending" | "confirmed" | "cancelled" | "completed"
      slot_status: "available" | "booked" | "blocked"
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
    Enums: {
      appointment_status: ["pending", "confirmed", "cancelled", "completed"],
      slot_status: ["available", "booked", "blocked"],
    },
  },
} as const

// ---- TIPOS ADICIONAIS (sistema multi-tenant) ----
export interface Plan {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number | null;
  features: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PlatformSettings {
  id: string;
  stripe_public_key: string | null;
  stripe_secret_key: string | null;
  mp_access_token: string | null;
  mp_public_key: string | null;
  platform_name: string | null;
  support_email: string | null;
  created_at: string;
  updated_at: string;
}
