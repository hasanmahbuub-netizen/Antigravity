const fs = require('fs');

async function verifyDatabaseConnection() {
    console.log('🔍 Verifying Supabase Database Connection...\n');

    const token = 'sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c';
    const projectRef = 'lvysvebakhwidqxztrvd';

    // 1. Check if trigger exists
    console.log('1️⃣ Checking if handle_new_user trigger exists...');
    const checkTrigger = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT 
          trigger_name, 
          event_manipulation, 
          action_statement,
          action_timing
        FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created';
      `
        })
    });

    const triggerData = await checkTrigger.json();
    console.log('Trigger status:', JSON.stringify(triggerData, null, 2));

    // 2. Check if profiles table exists and has correct columns
    console.log('\n2️⃣ Checking profiles table structure...');
    const checkTable = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'profiles'
        ORDER BY ordinal_position;
      `
        })
    });

    const tableData = await checkTable.json();
    console.log('Profiles table columns:', JSON.stringify(tableData, null, 2));

    // 3. Check recent auth.users entries
    console.log('\n3️⃣ Checking recent auth.users entries...');
    const checkUsers = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT id, email, created_at, raw_user_meta_data
        FROM auth.users
        ORDER BY created_at DESC
        LIMIT 5;
      `
        })
    });

    const usersData = await checkUsers.json();
    console.log('Recent users:', JSON.stringify(usersData, null, 2));

    // 4. Check if profiles were created for those users
    console.log('\n4️⃣ Checking if profiles exist for recent users...');
    const checkProfiles = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT id, full_name, madhab, created_at
        FROM public.profiles
        ORDER BY updated_at DESC
        LIMIT 5;
      `
        })
    });

    const profilesData = await checkProfiles.json();
    console.log('Recent profiles:', JSON.stringify(profilesData, null, 2));

    // 5. Check trigger function definition
    console.log('\n5️⃣ Checking trigger function definition...');
    const checkFunction = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT routine_definition
        FROM information_schema.routines
        WHERE routine_name = 'handle_new_user';
      `
        })
    });

    const functionData = await checkFunction.json();
    console.log('Function definition:', JSON.stringify(functionData, null, 2));

    console.log('\n✅ Database verification complete!');
}

verifyDatabaseConnection().catch(console.error);
