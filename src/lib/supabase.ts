import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    throw new Error('Supabase configuration error');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

// Create browser client - @supabase/ssr handles cookies automatically
export const supabase = createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
);
