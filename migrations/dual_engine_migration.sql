-- MEEK Dual Engine Architecture - Database Migration
-- Run this in Supabase SQL Editor

-- Create quran_tafsir table for caching tafsir content
CREATE TABLE IF NOT EXISTS quran_tafsir (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  surah_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  tafsir_english TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(surah_number, verse_number)
);

-- Create index for fast lookup
CREATE INDEX IF NOT EXISTS idx_tafsir_verse ON quran_tafsir(surah_number, verse_number);

-- Add new columns to fiqh_questions for tracking
ALTER TABLE fiqh_questions
ADD COLUMN IF NOT EXISTS response_time_ms INTEGER,
ADD COLUMN IF NOT EXISTS hallucination_risk TEXT,
ADD COLUMN IF NOT EXISTS confidence_level TEXT;

-- Enable RLS on quran_tafsir
ALTER TABLE quran_tafsir ENABLE ROW LEVEL SECURITY;

-- Public read access for tafsir (everyone can read)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'quran_tafsir' AND policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access" ON quran_tafsir FOR SELECT USING (true);
  END IF;
END $$;

-- Service role can insert/update tafsir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'quran_tafsir' AND policyname = 'Service role can insert/update'
  ) THEN
    CREATE POLICY "Service role can insert/update" ON quran_tafsir FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- Also allow authenticated users to insert tafsir (for caching)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'quran_tafsir' AND policyname = 'Authenticated users can insert'
  ) THEN
    CREATE POLICY "Authenticated users can insert" ON quran_tafsir FOR INSERT WITH CHECK (true);
  END IF;
END $$;
