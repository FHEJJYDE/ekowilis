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
      admin_emails: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          logo_url: string | null
          name: string
          order_index: number
          sector: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          logo_url?: string | null
          name: string
          order_index?: number
          sector?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          logo_url?: string | null
          name?: string
          order_index?: number
          sector?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_info: {
        Row: {
          branch_office: string | null
          email: string | null
          founded_year: string | null
          head_office: string | null
          id: number
          mission: string | null
          name: string
          phone: string | null
          rc_number: string | null
          short_name: string
          story: string | null
          tagline: string | null
          updated_at: string
          vision: string | null
        }
        Insert: {
          branch_office?: string | null
          email?: string | null
          founded_year?: string | null
          head_office?: string | null
          id?: number
          mission?: string | null
          name?: string
          phone?: string | null
          rc_number?: string | null
          short_name?: string
          story?: string | null
          tagline?: string | null
          updated_at?: string
          vision?: string | null
        }
        Update: {
          branch_office?: string | null
          email?: string | null
          founded_year?: string | null
          head_office?: string | null
          id?: number
          mission?: string | null
          name?: string
          phone?: string | null
          rc_number?: string | null
          short_name?: string
          story?: string | null
          tagline?: string | null
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      credentials: {
        Row: {
          created_at: string
          document_url: string | null
          id: string
          is_published: boolean
          issuer: string | null
          order_index: number
          reference: string | null
          title: string
          updated_at: string
          year: string | null
        }
        Insert: {
          created_at?: string
          document_url?: string | null
          id?: string
          is_published?: boolean
          issuer?: string | null
          order_index?: number
          reference?: string | null
          title: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          created_at?: string
          document_url?: string | null
          id?: string
          is_published?: boolean
          issuer?: string | null
          order_index?: number
          reference?: string | null
          title?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      equipment: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_published: boolean
          name: string
          order_index: number
          quantity: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          name: string
          order_index?: number
          quantity?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          name?: string
          order_index?: number
          quantity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      hero: {
        Row: {
          cta_href: string | null
          cta_label: string | null
          eyebrow: string | null
          id: number
          image_url: string | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          cta_href?: string | null
          cta_label?: string | null
          eyebrow?: string | null
          id?: number
          image_url?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          cta_href?: string | null
          cta_label?: string | null
          eyebrow?: string | null
          id?: number
          image_url?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          created_at: string
          filename: string
          id: string
          mime_type: string | null
          public_url: string
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          filename: string
          id?: string
          mime_type?: string | null
          public_url: string
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          filename?: string
          id?: string
          mime_type?: string | null
          public_url?: string
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          client: string | null
          cover_url: string | null
          created_at: string
          gallery: string[]
          id: string
          is_published: boolean
          location: string | null
          order_index: number
          scope: string[]
          slug: string
          status: string | null
          summary: string | null
          title: string
          updated_at: string
          year: string | null
        }
        Insert: {
          category?: string | null
          client?: string | null
          cover_url?: string | null
          created_at?: string
          gallery?: string[]
          id?: string
          is_published?: boolean
          location?: string | null
          order_index?: number
          scope?: string[]
          slug: string
          status?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          category?: string | null
          client?: string | null
          cover_url?: string | null
          created_at?: string
          gallery?: string[]
          id?: string
          is_published?: boolean
          location?: string | null
          order_index?: number
          scope?: string[]
          slug?: string
          status?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      quote_submissions: {
        Row: {
          budget: string | null
          created_at: string
          email: string
          id: string
          is_read: boolean
          location: string | null
          message: string | null
          name: string
          phone: string | null
          project_type: string | null
          scope: string | null
          timeline: string | null
        }
        Insert: {
          budget?: string | null
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          location?: string | null
          message?: string | null
          name: string
          phone?: string | null
          project_type?: string | null
          scope?: string | null
          timeline?: string | null
        }
        Update: {
          budget?: string | null
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          location?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          project_type?: string | null
          scope?: string | null
          timeline?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_published: boolean
          order_index: number
          slug: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          group_name: string
          id: string
          is_published: boolean
          name: string
          order_index: number
          photo_url: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          group_name?: string
          id?: string
          is_published?: boolean
          name: string
          order_index?: number
          photo_url?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          group_name?: string
          id?: string
          is_published?: boolean
          name?: string
          order_index?: number
          photo_url?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
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
