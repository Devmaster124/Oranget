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
      blooks: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          pack_id: string | null
          rarity: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          pack_id?: string | null
          rarity: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          pack_id?: string | null
          rarity?: string
        }
        Relationships: []
      }
      friends: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      game_session_players: {
        Row: {
          id: string
          joined_at: string | null
          position: number | null
          score: number | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          position?: number | null
          score?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          position?: number | null
          score?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_session_players_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          created_at: string | null
          current_players: number | null
          finished_at: string | null
          game_id: string | null
          host_user_id: string | null
          id: string
          max_players: number | null
          session_data: Json | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          current_players?: number | null
          finished_at?: string | null
          game_id?: string | null
          host_user_id?: string | null
          id?: string
          max_players?: number | null
          session_data?: Json | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          current_players?: number | null
          finished_at?: string | null
          game_id?: string | null
          host_user_id?: string | null
          id?: string
          max_players?: number | null
          session_data?: Json | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "mini_games"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_members: {
        Row: {
          guild_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          guild_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          guild_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guild_members_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guilds: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          member_count: number
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          member_count?: number
          name: string
          owner_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          member_count?: number
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          id: string
          text: string
          timestamp: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          text: string
          timestamp?: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          text?: string
          timestamp?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      mini_games: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          max_players: number | null
          name: string
          route: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          max_players?: number | null
          name: string
          route: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          max_players?: number | null
          name?: string
          route?: string
          type?: string
        }
        Relationships: []
      }
      packs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          orange_drip_cost: number
          rarity_weights: Json | null
          token_cost: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          orange_drip_cost?: number
          rarity_weights?: Json | null
          token_cost?: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          orange_drip_cost?: number
          rarity_weights?: Json | null
          token_cost?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          blooks_unlocked: number | null
          created_at: string | null
          id: string
          orange_drips: number | null
          profile_picture: string | null
          selected_blook_pfp: string | null
          tokens: number | null
          total_chats_participated: number | null
          total_messages_sent: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          blooks_unlocked?: number | null
          created_at?: string | null
          id: string
          orange_drips?: number | null
          profile_picture?: string | null
          selected_blook_pfp?: string | null
          tokens?: number | null
          total_chats_participated?: number | null
          total_messages_sent?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          blooks_unlocked?: number | null
          created_at?: string | null
          id?: string
          orange_drips?: number | null
          profile_picture?: string | null
          selected_blook_pfp?: string | null
          tokens?: number | null
          total_chats_participated?: number | null
          total_messages_sent?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      trade_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_id: string
          trade_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_id: string
          trade_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
          trade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_messages_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trade_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_requests: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          receiver_blooks: Json | null
          receiver_id: string
          sender_blooks: Json | null
          sender_id: string
          status: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          receiver_blooks?: Json | null
          receiver_id: string
          sender_blooks?: Json | null
          sender_id: string
          status?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          receiver_blooks?: Json | null
          receiver_id?: string
          sender_blooks?: Json | null
          sender_id?: string
          status?: string
        }
        Relationships: []
      }
      user_blooks: {
        Row: {
          blook_id: string | null
          id: string
          obtained_at: string | null
          user_id: string | null
        }
        Insert: {
          blook_id?: string | null
          id?: string
          obtained_at?: string | null
          user_id?: string | null
        }
        Update: {
          blook_id?: string | null
          id?: string
          obtained_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_blooks_blook_id_fkey"
            columns: ["blook_id"]
            isOneToOne: false
            referencedRelation: "blooks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_message_rate_limit: {
        Row: {
          created_at: string | null
          message_timestamps: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          message_timestamps?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          message_timestamps?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          created_at: string | null
          id: string | null
          profile_picture: string | null
          selected_blook_pfp: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          profile_picture?: string | null
          selected_blook_pfp?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          profile_picture?: string | null
          selected_blook_pfp?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_message_spam: {
        Args: { user_id_param: string }
        Returns: boolean
      }
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
