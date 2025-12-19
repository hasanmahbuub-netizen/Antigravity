import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasGeminiKey: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT_SET',
        // Don't expose the actual keys, just first/last chars
        supabaseKeyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length - 10)}`
            : 'NOT_SET',
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
}
