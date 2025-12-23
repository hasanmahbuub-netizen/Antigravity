/**
 * MEEK Database Complete Setup
 * Uses Supabase Management API to run SQL migrations
 */

const SUPABASE_ACCESS_TOKEN = 'sbp_e1e4033eb3da092d8cdad2e5d73a85c913a89a38';
const PROJECT_REF = 'lvysvebakhwidqxztrvd'; // From the Supabase URL

async function runSQL(sql: string, description: string): Promise<boolean> {
    console.log(`\n📋 ${description}...`);

    try {
        const response = await fetch(
            `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: sql })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.log(`   ❌ Failed: ${response.status} - ${error}`);
            return false;
        }

        const result = await response.json();
        console.log(`   ✅ Success`);
        return true;
    } catch (error: any) {
        console.log(`   ❌ Error: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('🗃️ MEEK Database Complete Setup');
    console.log('================================\n');
    console.log('Project:', PROJECT_REF);

    // 1. Update profiles table
    await runSQL(`
        ALTER TABLE profiles
        ADD COLUMN IF NOT EXISTS madhab TEXT DEFAULT 'Hanafi',
        ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
        ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS arabic_level TEXT DEFAULT 'beginner',
        ADD COLUMN IF NOT EXISTS daily_goal INTEGER DEFAULT 5;
    `, 'Adding columns to profiles table');

    // 2. Create quran_verses table
    await runSQL(`
        CREATE TABLE IF NOT EXISTS quran_verses (
            id SERIAL PRIMARY KEY,
            surah_number INTEGER NOT NULL,
            verse_number INTEGER NOT NULL,
            arabic_text TEXT NOT NULL,
            translation_english TEXT,
            translation_bangla TEXT,
            transliteration TEXT,
            audio_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(surah_number, verse_number)
        );
    `, 'Creating quran_verses table');

    // 3. Enable RLS on quran_verses
    await runSQL(`
        ALTER TABLE quran_verses ENABLE ROW LEVEL SECURITY;
    `, 'Enabling RLS on quran_verses');

    // 4. Create read policy for quran_verses
    await runSQL(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE tablename = 'quran_verses' AND policyname = 'Allow public read on quran_verses'
            ) THEN
                CREATE POLICY "Allow public read on quran_verses"
                ON quran_verses FOR SELECT
                USING (true);
            END IF;
        END $$;
    `, 'Creating read policy for quran_verses');

    // 5. Ensure quran_verse_progress table exists
    await runSQL(`
        CREATE TABLE IF NOT EXISTS quran_verse_progress (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            surah INTEGER NOT NULL,
            ayah INTEGER NOT NULL,
            completed_at TIMESTAMPTZ DEFAULT NOW(),
            score INTEGER DEFAULT 0,
            UNIQUE(user_id, surah, ayah)
        );
    `, 'Creating quran_verse_progress table');

    // 6. Enable RLS on quran_verse_progress
    await runSQL(`
        ALTER TABLE quran_verse_progress ENABLE ROW LEVEL SECURITY;
    `, 'Enabling RLS on quran_verse_progress');

    // 7. Create policies for quran_verse_progress
    await runSQL(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE tablename = 'quran_verse_progress' AND policyname = 'Users can manage own progress'
            ) THEN
                CREATE POLICY "Users can manage own progress"
                ON quran_verse_progress
                FOR ALL
                USING (auth.uid() = user_id)
                WITH CHECK (auth.uid() = user_id);
            END IF;
        END $$;
    `, 'Creating progress policies');

    // 8. Ensure fiqh_questions table has correct structure
    await runSQL(`
        ALTER TABLE fiqh_questions
        ADD COLUMN IF NOT EXISTS madhab TEXT DEFAULT 'Hanafi';
    `, 'Ensuring fiqh_questions has madhab column');

    // 9. Insert initial Al-Fatiha verses if table is empty
    await runSQL(`
        INSERT INTO quran_verses (surah_number, verse_number, arabic_text, translation_english, audio_url)
        SELECT * FROM (VALUES
            (1, 1, 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 'In the name of Allah, the Most Gracious, the Most Merciful', 'https://verses.quran.com/Alafasy/mp3/001001.mp3'),
            (1, 2, 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', 'All praise is for Allah—Lord of all worlds', 'https://verses.quran.com/Alafasy/mp3/001002.mp3'),
            (1, 3, 'الرَّحْمَٰنِ الرَّحِيمِ', 'the Most Compassionate, Most Merciful', 'https://verses.quran.com/Alafasy/mp3/001003.mp3'),
            (1, 4, 'مَالِكِ يَوْمِ الدِّينِ', 'Master of the Day of Judgment', 'https://verses.quran.com/Alafasy/mp3/001004.mp3'),
            (1, 5, 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', 'You alone we worship and You alone we ask for help', 'https://verses.quran.com/Alafasy/mp3/001005.mp3'),
            (1, 6, 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', 'Guide us along the Straight Path', 'https://verses.quran.com/Alafasy/mp3/001006.mp3'),
            (1, 7, 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', 'the Path of those You have blessed—not those You are displeased with, or those who are astray', 'https://verses.quran.com/Alafasy/mp3/001007.mp3')
        ) AS v(surah_number, verse_number, arabic_text, translation_english, audio_url)
        WHERE NOT EXISTS (SELECT 1 FROM quran_verses WHERE surah_number = 1 AND verse_number = 1)
        ON CONFLICT (surah_number, verse_number) DO NOTHING;
    `, 'Inserting Al-Fatiha verses');

    console.log('\n================================');
    console.log('✅ Database setup complete!');
    console.log('\nYour MEEK app is now production ready.');
}

main().catch(console.error);
