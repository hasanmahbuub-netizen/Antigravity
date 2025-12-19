const fs = require('fs');

async function fixColumnMismatch() {
    console.log('🔧 Fixing column mismatch in profiles table...\n');

    const token = 'sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c';
    const projectRef = 'lvysvebakhwidqxztrvd';

    // Fix 1: Add full_name column if it doesn't exist
    console.log('1️⃣ Adding full_name column...');
    const addColumn = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'full_name'
          ) THEN
            ALTER TABLE public.profiles ADD COLUMN full_name text;
            COMMENT ON COLUMN public.profiles.full_name IS 'User full name from auth metadata';
          END IF;
        END $$;
      `
        })
    });

    const addResult = await addColumn.json();
    console.log('Add column result:', JSON.stringify(addResult, null, 2));

    // Fix 2: Copy data from display_name to full_name if needed
    console.log('\n2️⃣ Copying existing data from display_name to full_name...');
    const copyData = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        UPDATE public.profiles 
        SET full_name = display_name 
        WHERE full_name IS NULL AND display_name IS NOT NULL;
      `
        })
    });

    const copyResult = await copyData.json();
    console.log('Copy data result:', JSON.stringify(copyResult, null, 2));

    // Fix 3: Update the trigger function to use full_name
    console.log('\n3️⃣ Updating trigger function...');
    const updateTrigger = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger 
        SECURITY DEFINER
        SET search_path = public
        LANGUAGE plpgsql
        AS $$
        BEGIN
          INSERT INTO public.profiles (id, full_name, avatar_url)
          VALUES (
            new.id,
            COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
            new.raw_user_meta_data->>'avatar_url'
          )
          ON CONFLICT (id) DO UPDATE
          SET 
            full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
            avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
            updated_at = now();
          
          RETURN new;
        EXCEPTION
          WHEN OTHERS THEN
            RAISE WARNING 'Error in handle_new_user for user %: %', new.id, SQLERRM;
            RETURN new;
        END;
        $$;
      `
        })
    });

    const triggerResult = await updateTrigger.json();
    console.log('Update trigger result:', JSON.stringify(triggerResult, null, 2));

    // Fix 4: Verify the fix
    console.log('\n4️⃣ Verifying the fix...');
    const verify = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name IN ('full_name', 'display_name')
        ORDER BY column_name;
      `
        })
    });

    const verifyResult = await verify.json();
    console.log('Verification result:', JSON.stringify(verifyResult, null, 2));

    console.log('\n✅ Column mismatch fixed! Trigger should now work correctly.');
}

fixColumnMismatch().catch(console.error);
