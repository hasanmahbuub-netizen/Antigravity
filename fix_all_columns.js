const fs = require('fs');

async function getCompleteSchema() {
    console.log('📋 Getting complete database schema...\n');

    const token = 'sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c';
    const projectRef = 'lvysvebakhwidqxztrvd';

    // Get ALL columns from profiles table
    const getSchema = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'profiles'
        ORDER BY ordinal_position;
      `
        })
    });

    const schemaData = await getSchema.json();
    console.log('Complete profiles table schema:');
    console.log(JSON.stringify(schemaData, null, 2));

    // Now add missing columns
    console.log('\n🔧 Adding missing columns...\n');

    const fixSchema = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        -- Add updated_at if missing
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'updated_at'
          ) THEN
            ALTER TABLE public.profiles 
            ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
          END IF;
        END $$;
        
        -- Add arabic_level if missing
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'arabic_level'
          ) THEN
            ALTER TABLE public.profiles ADD COLUMN arabic_level text;
          END IF;
        END $$;
        
        -- Add primary_goal if missing
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'primary_goal'
          ) THEN
            ALTER TABLE public.profiles ADD COLUMN primary_goal text;
          END IF;
        END $$;
        
        -- Add daily_goal_minutes if missing
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'daily_goal_minutes'
          ) THEN
            ALTER TABLE public.profiles ADD COLUMN daily_goal_minutes integer DEFAULT 10;
          END IF;
        END $$;
        
        -- Add avatar_url if missing
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'avatar_url'
          ) THEN
            ALTER TABLE public.profiles ADD COLUMN avatar_url text;
          END IF;
        END $$;
      `
        })
    });

    const fixResult = await fixSchema.json();
    console.log('Schema fix result:', JSON.stringify(fixResult, null, 2));

    // Verify final schema
    console.log('\n✅ Verifying final schema...\n');
    const verifySchema = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT column_name, data_type, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'profiles'
        ORDER BY ordinal_position;
      `
        })
    });

    const finalSchema = await verifySchema.json();
    console.log('Final schema:');
    console.log(JSON.stringify(finalSchema, null, 2));
}

getCompleteSchema().catch(console.error);
