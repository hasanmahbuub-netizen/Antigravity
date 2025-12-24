// Run SQL Migration for MEEK Dual Engine Architecture
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lvysvebakhwidqxztrvd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2eXN2ZWJha2h3aWRxeHp0cnZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA1NDgxMSwiZXhwIjoyMDgxNjMwODExfQ.rAjRuACGbPvHwkt2tVmdCmJ64GcQCNV-oc9XMN0HtbA';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
});

async function runMigration() {
    console.log('🚀 Running MEEK Dual Engine Migration...\n');

    // Test connection first
    const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

    if (testError && testError.code !== 'PGRST116') {
        console.error('❌ Connection test failed:', testError.message);
        return;
    }
    console.log('✅ Connected to Supabase\n');

    // Check if quran_tafsir table exists by trying to query it
    const { error: tafsirCheck } = await supabase
        .from('quran_tafsir')
        .select('id')
        .limit(1);

    if (tafsirCheck && tafsirCheck.code === '42P01') {
        console.log('📝 quran_tafsir table does not exist - needs to be created via SQL Editor');
        console.log('\nPlease run the following SQL in Supabase SQL Editor:');
        console.log('─'.repeat(50));
        console.log(`
CREATE TABLE IF NOT EXISTS quran_tafsir (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  surah_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  tafsir_english TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(surah_number, verse_number)
);

CREATE INDEX IF NOT EXISTS idx_tafsir_verse ON quran_tafsir(surah_number, verse_number);
ALTER TABLE quran_tafsir ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Public read access" ON quran_tafsir FOR SELECT USING (true);
CREATE POLICY "Service role insert" ON quran_tafsir FOR INSERT WITH CHECK (true);
        `);
        console.log('─'.repeat(50));
    } else if (!tafsirCheck) {
        console.log('✅ quran_tafsir table already exists');
    }

    // Check fiqh_questions columns by inserting test data
    console.log('\n📋 Checking fiqh_questions table...');

    // Try to check if columns exist by querying
    const { data: fiqhData, error: fiqhError } = await supabase
        .from('fiqh_questions')
        .select('response_time_ms, hallucination_risk, confidence_level')
        .limit(1);

    if (fiqhError && fiqhError.message.includes('column')) {
        console.log('📝 fiqh_questions needs new columns - run in SQL Editor:');
        console.log('─'.repeat(50));
        console.log(`
ALTER TABLE fiqh_questions
ADD COLUMN IF NOT EXISTS response_time_ms INTEGER,
ADD COLUMN IF NOT EXISTS hallucination_risk TEXT,
ADD COLUMN IF NOT EXISTS confidence_level TEXT;
        `);
        console.log('─'.repeat(50));
    } else {
        console.log('✅ fiqh_questions columns exist or table is ready');
    }

    console.log('\n✅ Migration check complete!');
    console.log('\n📌 Summary:');
    console.log('   - If tables/columns are missing, run the SQL above in Supabase SQL Editor');
    console.log('   - The app will work with or without these - they enable caching features');
}

runMigration().catch(console.error);
