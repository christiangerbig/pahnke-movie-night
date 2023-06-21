export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      reservations: {
        Row: {
          created_at: string | null;
          guest_firstname: string | null;
          guest_surname: string | null;
          id: number;
          is_guest: boolean | null;
          seat: number;
          show: number;
          user: string;
        };
        Insert: {
          created_at?: string | null;
          guest_firstname?: string | null;
          guest_surname?: string | null;
          id?: number;
          is_guest?: boolean | null;
          seat: number;
          show: number;
          user: string;
        };
        Update: {
          created_at?: string | null;
          guest_firstname?: string | null;
          guest_surname?: string | null;
          id?: number;
          is_guest?: boolean | null;
          seat?: number;
          show?: number;
          user?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reservations_show_fkey";
            columns: ["show"];
            referencedRelation: "shows";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reservations_user_fkey";
            columns: ["user"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      shows: {
        Row: {
          created_at: string | null;
          date: string;
          id: number;
          movie_description: string | null;
          movie_poster: string;
          movie_title: string;
          time: string | null;
          reservations: number[];
        };
        Insert: {
          created_at?: string | null;
          date: string;
          id?: number;
          movie_description?: string | null;
          movie_poster?: string;
          movie_title: string;
          time?: string | null;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          id?: number;
          movie_description?: string | null;
          movie_poster?: string;
          movie_title?: string;
          time?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
