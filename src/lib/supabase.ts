import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

// Simple client with default settings
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
