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
      assets: {
        Row: {
          asset_tag: string
          assigned_to_person: string | null
          assigned_to_project_id: string | null
          category: string | null
          created_at: string
          current_location_id: string | null
          current_value: number | null
          hours_meter: number | null
          id: string
          image_url: string | null
          last_service_at: string | null
          linked_equipment_id: string | null
          make: string | null
          model: string | null
          name: string
          next_service_due_at: string | null
          next_service_due_hours: number | null
          notes: string | null
          odometer: number | null
          purchase_cost: number | null
          purchase_date: string | null
          serial_number: string | null
          status: Database["public"]["Enums"]["inv_asset_status"]
          updated_at: string
          year: number | null
        }
        Insert: {
          asset_tag: string
          assigned_to_person?: string | null
          assigned_to_project_id?: string | null
          category?: string | null
          created_at?: string
          current_location_id?: string | null
          current_value?: number | null
          hours_meter?: number | null
          id?: string
          image_url?: string | null
          last_service_at?: string | null
          linked_equipment_id?: string | null
          make?: string | null
          model?: string | null
          name: string
          next_service_due_at?: string | null
          next_service_due_hours?: number | null
          notes?: string | null
          odometer?: number | null
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["inv_asset_status"]
          updated_at?: string
          year?: number | null
        }
        Update: {
          asset_tag?: string
          assigned_to_person?: string | null
          assigned_to_project_id?: string | null
          category?: string | null
          created_at?: string
          current_location_id?: string | null
          current_value?: number | null
          hours_meter?: number | null
          id?: string
          image_url?: string | null
          last_service_at?: string | null
          linked_equipment_id?: string | null
          make?: string | null
          model?: string | null
          name?: string
          next_service_due_at?: string | null
          next_service_due_hours?: number | null
          notes?: string | null
          odometer?: number | null
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["inv_asset_status"]
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_assigned_to_project_id_fkey"
            columns: ["assigned_to_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_current_location_id_fkey"
            columns: ["current_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_linked_equipment_id_fkey"
            columns: ["linked_equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
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
      consumables: {
        Row: {
          category: string | null
          created_at: string
          default_location_id: string | null
          id: string
          image_url: string | null
          name: string
          notes: string | null
          quantity_on_hand: number
          reorder_point: number
          reorder_quantity: number
          sku: string | null
          supplier: string | null
          unit: string
          unit_cost: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          default_location_id?: string | null
          id?: string
          image_url?: string | null
          name: string
          notes?: string | null
          quantity_on_hand?: number
          reorder_point?: number
          reorder_quantity?: number
          sku?: string | null
          supplier?: string | null
          unit?: string
          unit_cost?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          default_location_id?: string | null
          id?: string
          image_url?: string | null
          name?: string
          notes?: string | null
          quantity_on_hand?: number
          reorder_point?: number
          reorder_quantity?: number
          sku?: string | null
          supplier?: string | null
          unit?: string
          unit_cost?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumables_default_location_id_fkey"
            columns: ["default_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
        ]
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
      inventory_locations: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          notes: string | null
          type: Database["public"]["Enums"]["inv_location_type"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          type?: Database["public"]["Enums"]["inv_location_type"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          type?: Database["public"]["Enums"]["inv_location_type"]
          updated_at?: string
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          created_at: string
          from_location_id: string | null
          id: string
          item_id: string
          item_kind: Database["public"]["Enums"]["inv_item_kind"]
          note: string | null
          occurred_at: string
          performed_by: string | null
          performed_by_name: string | null
          project_id: string | null
          quantity: number | null
          to_location_id: string | null
          txn_type: Database["public"]["Enums"]["inv_txn_type"]
        }
        Insert: {
          created_at?: string
          from_location_id?: string | null
          id?: string
          item_id: string
          item_kind: Database["public"]["Enums"]["inv_item_kind"]
          note?: string | null
          occurred_at?: string
          performed_by?: string | null
          performed_by_name?: string | null
          project_id?: string | null
          quantity?: number | null
          to_location_id?: string | null
          txn_type: Database["public"]["Enums"]["inv_txn_type"]
        }
        Update: {
          created_at?: string
          from_location_id?: string | null
          id?: string
          item_id?: string
          item_kind?: Database["public"]["Enums"]["inv_item_kind"]
          note?: string | null
          occurred_at?: string
          performed_by?: string | null
          performed_by_name?: string | null
          project_id?: string | null
          quantity?: number | null
          to_location_id?: string | null
          txn_type?: Database["public"]["Enums"]["inv_txn_type"]
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_logs: {
        Row: {
          asset_id: string
          cost: number | null
          created_at: string
          hours_at_service: number | null
          id: string
          next_due_at: string | null
          next_due_hours: number | null
          notes: string | null
          parts_used: Json | null
          performed_at: string
          performed_by: string | null
          type: Database["public"]["Enums"]["inv_maint_type"]
          updated_at: string
        }
        Insert: {
          asset_id: string
          cost?: number | null
          created_at?: string
          hours_at_service?: number | null
          id?: string
          next_due_at?: string | null
          next_due_hours?: number | null
          notes?: string | null
          parts_used?: Json | null
          performed_at?: string
          performed_by?: string | null
          type?: Database["public"]["Enums"]["inv_maint_type"]
          updated_at?: string
        }
        Update: {
          asset_id?: string
          cost?: number | null
          created_at?: string
          hours_at_service?: number | null
          id?: string
          next_due_at?: string | null
          next_due_hours?: number | null
          notes?: string | null
          parts_used?: Json | null
          performed_at?: string
          performed_by?: string | null
          type?: Database["public"]["Enums"]["inv_maint_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
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
      project_material_allocations: {
        Row: {
          consumable_id: string
          created_at: string
          id: string
          note: string | null
          project_id: string
          quantity_allocated: number
          quantity_used: number
          status: Database["public"]["Enums"]["inv_alloc_status"]
          updated_at: string
        }
        Insert: {
          consumable_id: string
          created_at?: string
          id?: string
          note?: string | null
          project_id: string
          quantity_allocated?: number
          quantity_used?: number
          status?: Database["public"]["Enums"]["inv_alloc_status"]
          updated_at?: string
        }
        Update: {
          consumable_id?: string
          created_at?: string
          id?: string
          note?: string | null
          project_id?: string
          quantity_allocated?: number
          quantity_used?: number
          status?: Database["public"]["Enums"]["inv_alloc_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_material_allocations_consumable_id_fkey"
            columns: ["consumable_id"]
            isOneToOne: false
            referencedRelation: "consumables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_material_allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
      tools: {
        Row: {
          category: string | null
          checked_out_at: string | null
          checked_out_to: string | null
          condition: string | null
          created_at: string
          current_location_id: string | null
          expected_return_at: string | null
          id: string
          image_url: string | null
          name: string
          notes: string | null
          purchase_cost: number | null
          purchase_date: string | null
          status: Database["public"]["Enums"]["inv_tool_status"]
          tool_tag: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          checked_out_at?: string | null
          checked_out_to?: string | null
          condition?: string | null
          created_at?: string
          current_location_id?: string | null
          expected_return_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          notes?: string | null
          purchase_cost?: number | null
          purchase_date?: string | null
          status?: Database["public"]["Enums"]["inv_tool_status"]
          tool_tag: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          checked_out_at?: string | null
          checked_out_to?: string | null
          condition?: string | null
          created_at?: string
          current_location_id?: string | null
          expected_return_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          notes?: string | null
          purchase_cost?: number | null
          purchase_date?: string | null
          status?: Database["public"]["Enums"]["inv_tool_status"]
          tool_tag?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tools_current_location_id_fkey"
            columns: ["current_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      inv_alloc_status:
        | "planned"
        | "allocated"
        | "partial"
        | "completed"
        | "cancelled"
      inv_asset_status:
        | "available"
        | "in_use"
        | "maintenance"
        | "leased_out"
        | "retired"
      inv_item_kind: "asset" | "consumable" | "tool"
      inv_location_type: "yard" | "site" | "warehouse" | "vehicle" | "other"
      inv_maint_type: "service" | "repair" | "inspection"
      inv_tool_status:
        | "available"
        | "checked_out"
        | "maintenance"
        | "lost"
        | "retired"
      inv_txn_type:
        | "receive"
        | "issue"
        | "transfer"
        | "return"
        | "adjust"
        | "waste"
        | "status_change"
        | "checkout"
        | "checkin"
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
      inv_alloc_status: [
        "planned",
        "allocated",
        "partial",
        "completed",
        "cancelled",
      ],
      inv_asset_status: [
        "available",
        "in_use",
        "maintenance",
        "leased_out",
        "retired",
      ],
      inv_item_kind: ["asset", "consumable", "tool"],
      inv_location_type: ["yard", "site", "warehouse", "vehicle", "other"],
      inv_maint_type: ["service", "repair", "inspection"],
      inv_tool_status: [
        "available",
        "checked_out",
        "maintenance",
        "lost",
        "retired",
      ],
      inv_txn_type: [
        "receive",
        "issue",
        "transfer",
        "return",
        "adjust",
        "waste",
        "status_change",
        "checkout",
        "checkin",
      ],
    },
  },
} as const
