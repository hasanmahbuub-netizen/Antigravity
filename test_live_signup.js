const fs = require('fs');

async function testLiveSignup() {
    console.log('🧪 Testing if trigger creates profiles for new signups...\n');

    const token = 'sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c';
    const projectRef = 'lvysvebakhwidqxztrvd';

    // Check the most recent users and their profiles
    console.log('Checking recent signups and profile creation...\n');

    const checkSignups = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
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
          u.created_at::text as user_created,
          u.raw_user_meta_data->>'full_name' as metadata_name,
          p.full_name,
          p.display_name,
          p.madhab,
          CASE 
            WHEN p.id IS NULL THEN '❌ NO PROFILE'
            ELSE '✅ PROFILE EXISTS'
          END as profile_status
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.id
        ORDER BY u.created_at DESC
        LIMIT 15;
      `
        })
    });

    const signupsData = await checkSignups.json();
    console.log('Recent signups with profile status:');
    console.log(JSON.stringify(signupsData, null, 2));

    // Count how many users have profiles
    const countCheck = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT 
          COUNT(DISTINCT u.id) as total_users,
          COUNT(DISTINCT p.id) as users_with_profiles,
          COUNT(DISTINCT u.id) - COUNT(DISTINCT p.id) as users_without_profiles
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.id;
      `
        })
    });

    const countData = await countCheck.json();
    console.log('\n📊 Profile Coverage:');
    console.log(JSON.stringify(countData, null, 2));

    console.log('\n💡 Next Steps:');
    console.log('1. Try creating a NEW account on https://imanos-web.vercel.app/signup');
    console.log('2. Run this script again to see if a profile was created');
    console.log('3. If profile appears, trigger is working! ✅');
    console.log('4. If no profile, trigger is still not firing ❌');
}

testLiveSignup().catch(console.error);
