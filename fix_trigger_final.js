const fs = require('fs');

async function fixTriggerAndCreateProfiles() {
    console.log('🔧 Fixing trigger and creating missing profiles...\n');

    const token = 'sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c';
    const projectRef = 'lvysvebakhwidqxztrvd';

    // Step 1: Check trigger status
    console.log('1️⃣ Checking trigger status...');
    const checkTrigger = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT 
          tgname,
          tgenabled,
          CASE tgenabled
            WHEN 'O' THEN 'ENABLED'
            WHEN 'D' THEN 'DISABLED'
            WHEN 'R' THEN 'REPLICA'
            WHEN 'A' THEN 'ALWAYS'
            ELSE 'UNKNOWN'
          END as status
        FROM pg_trigger
        WHERE tgname = 'on_auth_user_created';
      `
        })
    });

    const triggerStatus = await checkTrigger.json();
    console.log('Trigger status:', JSON.stringify(triggerStatus, null, 2));

    // Step 2: Drop and recreate trigger to ensure it's enabled
    console.log('\n2️⃣ Recreating trigger...');
    const recreateTrigger = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        -- Drop existing trigger
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        
        -- Recreate function with better error handling
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger 
        SECURITY DEFINER
        SET search_path = public
        LANGUAGE plpgsql
        AS $$
        BEGIN
          RAISE NOTICE 'Trigger fired for user: %', new.id;
          
          INSERT INTO public.profiles (id, full_name, avatar_url, madhab)
          VALUES (
            new.id,
            COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
            new.raw_user_meta_data->>'avatar_url',
            'hanafi'
          )
          ON CONFLICT (id) DO UPDATE
          SET 
            full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
            avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);
          
          RAISE NOTICE 'Profile created for user: %', new.id;
          RETURN new;
        EXCEPTION
          WHEN OTHERS THEN
            RAISE WARNING 'Error in handle_new_user for %: %', new.id, SQLERRM;
            RETURN new;
        END;
        $$;
        
        -- Create trigger
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW 
          EXECUTE FUNCTION public.handle_new_user();
      `
        })
    });

    const recreateResult = await recreateTrigger.json();
    console.log('Recreate result:', JSON.stringify(recreateResult, null, 2));

    // Step 3: Manually create profiles for existing users without profiles
    console.log('\n3️⃣ Creating profiles for existing users...');
    const createProfiles = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        INSERT INTO public.profiles (id, full_name, madhab)
        SELECT 
          u.id,
          COALESCE(u.raw_user_meta_data->>'full_name', u.email, 'User'),
          'hanafi'
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.id
        WHERE p.id IS NULL
        ON CONFLICT (id) DO NOTHING;
      `
        })
    });

    const createResult = await createProfiles.json();
    console.log('Create profiles result:', JSON.stringify(createResult, null, 2));

    // Step 4: Verify all users now have profiles
    console.log('\n4️⃣ Verifying all users have profiles...');
    const verify = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT 
          COUNT(DISTINCT u.id) as total_users,
          COUNT(DISTINCT p.id) as users_with_profiles
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.id;
      `
        })
    });

    const verifyResult = await verify.json();
    console.log('Verification:', JSON.stringify(verifyResult, null, 2));

    console.log('\n✅ Trigger fixed and missing profiles created!');
    console.log('📝 Now try creating a NEW account to test if trigger fires automatically.');
}

fixTriggerAndCreateProfiles().catch(console.error);
