export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      reservations: {
        Row: {
          created_at: string | null
          guest_firstname: string | null
          guest_surname: string | null
          id: number
          is_guest: boolean
          seat: number
          show: number
          user: string
        }
        Insert: {
          created_at?: string | null
          guest_firstname?: string | null
          guest_surname?: string | null
          id?: number
          is_guest?: boolean
          seat: number
          show: number
          user: string
        }
        Update: {
          created_at?: string | null
          guest_firstname?: string | null
          guest_surname?: string | null
          id?: number
          is_guest?: boolean
          seat?: number
          show?: number
          user?: string
        }
      }
      shows: {
        Row: {
          created_at: string | null
          date: string
          id: number
          movie_description: string | null
          movie_poster: string | null
          movie_title: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: number
          movie_description?: string | null
          movie_poster?: string | null
          movie_title: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: number
          movie_description?: string | null
          movie_poster?: string | null
          movie_title?: string
        }
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
