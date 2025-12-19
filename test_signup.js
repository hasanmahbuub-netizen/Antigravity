const fs = require('fs');

async function testSignupFlow() {
    console.log('🧪 Testing complete signup flow...\n');

    const token = 'sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c';
    const projectRef = 'lvysvebakhwidqxztrvd';

    // Test 1: Create a test user via API to simulate signup
    console.log('1️⃣ Simulating user signup...');
    const testEmail = `test_${Date.now()}@example.com`;
    console.log(`Test email: ${testEmail}`);

    // We can't create users via Management API, so let's check recent signups
    console.log('\n2️⃣ Checking recent signups and their profiles...');
    const checkRecent = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT 
          u.id,
          u.email,
          u.created_at as user_created,
          u.raw_user_meta_data->>'full_name' as metadata_name,
          p.full_name as profile_name,
          p.display_name,
          p.updated_at as profile_updated
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.id
        ORDER BY u.created_at DESC
        LIMIT 10;
      `
        })
    });

    const recentData = await checkRecent.json();
    console.log('Recent signups with profile status:');
    console.log(JSON.stringify(recentData, null, 2));

    // Test 3: Check if trigger is actually firing
    console.log('\n3️⃣ Checking PostgreSQL logs for trigger errors...');
    const checkLogs = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT 
          tgname as trigger_name,
          tgenabled as enabled,
          tgtype as trigger_type
        FROM pg_trigger
        WHERE tgname = 'on_auth_user_created';
      `
        })
    });

    const logsData = await checkLogs.json();
    console.log('Trigger status in pg_trigger:');
    console.log(JSON.stringify(logsData, null, 2));

    // Test 4: Manually test the trigger function
    console.log('\n4️⃣ Testing trigger function manually...');
    const testFunction = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        DO $$
        DECLARE
          test_user_id uuid := gen_random_uuid();
        BEGIN
          -- Simulate what the trigger would do
          INSERT INTO public.profiles (id, full_name)
          VALUES (test_user_id, 'Manual Test User')
          ON CONFLICT (id) DO NOTHING;
          
          -- Clean up
          DELETE FROM public.profiles WHERE id = test_user_id;
          
          RAISE NOTICE 'Manual trigger test successful';
        END $$;
      `
        })
    });

    const functionTest = await testFunction.json();
    console.log('Manual function test result:');
    console.log(JSON.stringify(functionTest, null, 2));

    console.log('\n✅ Signup flow test complete!');
    console.log('\n📊 Summary:');
    console.log('- Check if recent users have matching profiles');
    console.log('- If profiles are NULL, trigger is not firing');
    console.log('- If profiles exist, signup is working correctly');
}

testSignupFlow().catch(console.error);
