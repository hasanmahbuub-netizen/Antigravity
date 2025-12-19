import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

console.log('🏗️ INITIALIZING SUPABASE CLIENT');
console.log('🔗 URL:', supabaseUrl);
console.log('🔑 Key present:', !!supabaseAnonKey);

// Simple client with default settings
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
console.log('✅ SUPABASE CLIENT CREATED');
