import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Get environment variables with fallbacks for better error messages
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Better error message if missing
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || 'MISSING')
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING')

    // For development, provide clear instructions
    if (typeof window === 'undefined') {
        throw new Error(
            'Supabase environment variables are not set. ' +
            'Create a .env.local file with:\\n' +
            'NEXT_PUBLIC_SUPABASE_URL=your-url\\n' +
            'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key'
        )
    }
}

console.log('✅ Supabase browser client initializing...')
console.log('URL:', supabaseUrl)

// Use createBrowserClient from @supabase/ssr for cookie-based session storage
// This ensures the session is available to middleware and server components
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)

