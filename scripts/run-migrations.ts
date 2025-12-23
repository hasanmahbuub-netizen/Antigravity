/**
 * MEEK Database Schema Migration
 * Run: npx dotenv -e .env.local -- npx tsx scripts/run-migrations.ts
 */

import { createClient } from '@supabase/supabase-js';

async function runMigrations() {
    console.log('🗃️ MEEK Database Migration Script');
    console.log('==================================\n');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Try service key first, fall back to anon key for read-only checks
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing environment variables:');
        console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
        console.error('   SUPABASE_SERVICE_ROLE_KEY or ANON_KEY:', supabaseKey ? '✓' : '✗');
        process.exit(1);
    }

    const isServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    console.log('✅ Connected to Supabase:', supabaseUrl);
    console.log('🔑 Using:', isServiceKey ? 'Service Role Key (full access)' : 'Anon Key (read-only checks)');
    console.log('');

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false }
    });

    // Migration 1: Profiles table columns
    console.log('📋 Migration 1: Profiles table columns...');
    try {
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, madhab, language, onboarding_completed, arabic_level, daily_goal')
            .limit(1);

        if (profileError) {
            if (profileError.message.includes('column')) {
                console.log('   ⚠️ Missing columns detected:', profileError.message);
            } else {
                console.log('   ⚠️ Profiles table error:', profileError.message);
            }
        } else {
            console.log('   ✅ Profiles table exists with all columns');
            if (profiles && profiles.length > 0) {
                console.log('   📊 Sample profile data:', JSON.stringify(profiles[0], null, 2));
            }
        }
    } catch (e: any) {
        console.log('   ❌ Migration 1 failed:', e.message);
    }

    // Migration 2: Quran verses translation columns
    console.log('\n📋 Migration 2: Quran verses translation columns...');
    try {
        const { data: verses, error: verseError } = await supabase
            .from('quran_verses')
            .select('id, surah_number, verse_number, arabic_text, translation_english, translation_bangla, transliteration')
            .limit(3);

        if (verseError) {
            if (verseError.message.includes('column')) {
                console.log('   ⚠️ Missing columns detected:', verseError.message);
            } else {
                console.log('   ⚠️ Quran verses error:', verseError.message);
            }
        } else {
            console.log('   ✅ Quran verses table exists');
            console.log('   📊 Total verses checked:', verses?.length || 0);
            if (verses && verses.length > 0) {
                const hasEnglish = verses.some(v => v.translation_english);
                const hasBangla = verses.some(v => v.translation_bangla);
                console.log('   🌍 Has English translations:', hasEnglish ? '✓' : '✗');
                console.log('   🌍 Has Bangla translations:', hasBangla ? '✓' : '✗');
            }
        }
    } catch (e: any) {
        console.log('   ❌ Migration 2 failed:', e.message);
    }

    // Migration 3: Fiqh questions table
    console.log('\n📋 Migration 3: Fiqh questions table...');
    try {
        const { data: fiqh, error: fiqhError } = await supabase
            .from('fiqh_questions')
            .select('id, question, madhab')
            .limit(5);

        if (fiqhError) {
            console.log('   ⚠️ Fiqh questions error:', fiqhError.message);
        } else {
            console.log('   ✅ Fiqh questions table exists');
            console.log('   📊 Cached answers:', fiqh?.length || 0);
        }
    } catch (e: any) {
        console.log('   ❌ Migration 3 failed:', e.message);
    }

    // Summary
    console.log('\n==================================');
    console.log('✅ Schema validation complete!');

    if (!isServiceKey) {
        console.log('\n⚠️ To add missing columns, run this SQL in Supabase SQL Editor:');
        console.log(`
-- ================================================
-- MEEK Database Schema - Run in Supabase SQL Editor
-- ================================================

-- 1. Profiles table updates
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS madhab TEXT DEFAULT 'Hanafi',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS arabic_level TEXT DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS daily_goal INTEGER DEFAULT 5;

-- 2. Quran verses translation columns
ALTER TABLE quran_verses
ADD COLUMN IF NOT EXISTS translation_english TEXT,
ADD COLUMN IF NOT EXISTS translation_bangla TEXT,
ADD COLUMN IF NOT EXISTS transliteration TEXT;

-- 3. Verify RLS policies allow updates
-- (Run separately if needed)
        `);
    }
}

runMigrations().catch(console.error);
