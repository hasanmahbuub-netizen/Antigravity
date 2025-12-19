const fs = require('fs');

async function testRealLogin() {
    console.log('🔍 TESTING LOGIN WITH REAL CREDENTIALS\n');
    console.log('='.repeat(60));

    const email = 'mhbbanik@gmail.com';
    const password = 'Anik2020';

    // Test 1: Direct API login
    console.log('1️⃣ TESTING DIRECT API LOGIN');
    console.log('-'.repeat(60));

    const loginResponse = await fetch('https://lvysvebakhwidqxztrvd.supabase.co/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2eXN2ZWJha2h3aWRxeHp0cnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNTQ4MTEsImV4cCI6MjA4MTYzMDgxMX0.KNJNWew_q4QYLru17U1P8_plV1_KJPAVqcZvKjaKvYg',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    console.log('Status:', loginResponse.status);
    const loginData = await loginResponse.json();

    if (loginResponse.ok) {
        console.log('✅ LOGIN SUCCESSFUL!');
        console.log('User ID:', loginData.user?.id);
        console.log('Email:', loginData.user?.email);
        console.log('Access Token:', loginData.access_token ? 'Received' : 'Missing');
        console.log('Refresh Token:', loginData.refresh_token ? 'Received' : 'Missing');
    } else {
        console.log('❌ LOGIN FAILED');
        console.log('Error:', loginData.error_description || loginData.msg || loginData.error);
        console.log('Full response:', JSON.stringify(loginData, null, 2));
    }

    // Test 2: Check user status in database
    console.log('\n2️⃣ CHECKING USER STATUS IN DATABASE');
    console.log('-'.repeat(60));

    const token = 'sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c';
    const projectRef = 'lvysvebakhwidqxztrvd';

    const checkUser = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT 
          id,
          email,
          email_confirmed_at IS NOT NULL as email_confirmed,
          phone_confirmed_at IS NOT NULL as phone_confirmed,
          banned_until,
          deleted_at,
          created_at::text
        FROM auth.users
        WHERE email = '${email}';
      `
        })
    });

    const userData = await checkUser.json();
    console.log('User data:', JSON.stringify(userData, null, 2));

    // Test 3: Check if profile exists
    console.log('\n3️⃣ CHECKING USER PROFILE');
    console.log('-'.repeat(60));

    const checkProfile = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT 
          p.*
        FROM public.profiles p
        JOIN auth.users u ON p.id = u.id
        WHERE u.email = '${email}';
      `
        })
    });

    const profileData = await checkProfile.json();
    console.log('Profile data:', JSON.stringify(profileData, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('DIAGNOSIS COMPLETE');
    console.log('='.repeat(60));
}

testRealLogin().catch(console.error);
