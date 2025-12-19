export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    avatar_url: string | null
                    madhab: string | null
                    arabic_level: string | null
                    primary_goal: string | null
                    daily_goal_minutes: number | null
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    avatar_url?: string | null
                    madhab?: string | null
                    arabic_level?: string | null
                    primary_goal?: string | null
                    daily_goal_minutes?: number | null
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    madhab?: string | null
                    arabic_level?: string | null
                    primary_goal?: string | null
                    daily_goal_minutes?: number | null
                    updated_at?: string
                }
            }
            quran_verse_progress: {
                Row: {
                    id: number
                    user_id: string
                    surah: number
                    ayah: number
                    completed_at: string
                }
                Insert: {
                    id?: number
                    user_id: string
                    surah: number
                    ayah: number
                    completed_at?: string
                }
                Update: {
                    id?: number
                    user_id?: string
                    surah?: number
                    ayah?: number
                    completed_at?: string
                }
            }
            recitation_attempts: {
                Row: {
                    id: number
                    user_id: string
                    surah: number
                    ayah: number
                    feedback: Json | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    user_id: string
                    surah: number
                    ayah: number
                    feedback?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    user_id?: string
                    surah?: number
                    ayah?: number
                    feedback?: Json | null
                    created_at?: string
                }
            }
            fiqh_questions: {
                Row: {
                    id: number
                    user_id: string
                    question: string
                    answer: Json | null
                    madhab: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    user_id: string
                    question: string
                    answer?: Json | null
                    madhab?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    user_id?: string
                    question?: string
                    answer?: Json | null
                    madhab?: string | null
                    created_at?: string
                }
            }
        }
    }
}
