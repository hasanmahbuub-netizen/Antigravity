const fs = require('fs');

async function comprehensiveDiagnosis() {
    console.log('🔍 COMPREHENSIVE LOGIN SYSTEM DIAGNOSIS\n');
    console.log('='.repeat(60));

    const token = 'sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c';
    const projectRef = 'lvysvebakhwidqxztrvd';

    // TEST 1: Verify Supabase Auth is accessible
    console.log('\n1️⃣ TESTING SUPABASE AUTH ENDPOINT');
    console.log('-'.repeat(60));
    try {
        const authHealth = await fetch('https://lvysvebakhwidqxztrvd.supabase.co/auth/v1/health', {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2eXN2ZWJha2h3aWRxeHp0cnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNTQ4MTEsImV4cCI6MjA4MTYzMDgxMX0.KNJNWew_q4QYLru17U1P8_plV1_KJPAVqcZvKjaKvYg'
            }
        });
        const health = await authHealth.json();
        console.log('✅ Auth endpoint healthy:', health.version);
    } catch (err) {
        console.log('❌ Auth endpoint error:', err.message);
    }

    // TEST 2: Check if users exist
    console.log('\n2️⃣ CHECKING USERS IN DATABASE');
    console.log('-'.repeat(60));
    const checkUsers = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT 
          email,
          email_confirmed_at IS NOT NULL as confirmed,
          created_at::text
        FROM auth.users
        ORDER BY created_at DESC;
      `
        })
    });
    const users = await checkUsers.json();
    console.log('Users in database:', JSON.stringify(users, null, 2));

    // TEST 3: Check profiles table
    console.log('\n3️⃣ CHECKING PROFILES TABLE');
    console.log('-'.repeat(60));
    const checkProfiles = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT 
          u.email,
          p.full_name,
          p.madhab,
          CASE WHEN p.id IS NULL THEN '❌' ELSE '✅' END as has_profile
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.id;
      `
        })
    });
    const profiles = await checkProfiles.json();
    console.log('User profiles:', JSON.stringify(profiles, null, 2));

    // TEST 4: Check RLS policies
    console.log('\n4️⃣ CHECKING RLS POLICIES');
    console.log('-'.repeat(60));
    const checkRLS = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT 
          tablename,
          policyname,
          cmd,
          qual
        FROM pg_policies
        WHERE schemaname = 'public'
        ORDER BY tablename, policyname;
      `
        })
    });
    const policies = await checkRLS.json();
    console.log('RLS Policies:', JSON.stringify(policies, null, 2));

    // TEST 5: Simulate login attempt
    console.log('\n5️⃣ SIMULATING LOGIN ATTEMPT');
    console.log('-'.repeat(60));
    const loginAttempt = await fetch('https://lvysvebakhwidqxztrvd.supabase.co/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2eXN2ZWJha2h3aWRxeHp0cnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNTQ4MTEsImV4cCI6MjA4MTYzMDgxMX0.KNJNWew_q4QYLru17U1P8_plV1_KJPAVqcZvKjaKvYg',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'mhbbanik@gmail.com',
            password: 'test123',
            gotrue_meta_security: {}
        })
    });

    console.log('Login response status:', loginAttempt.status);
    const loginResult = await loginAttempt.json();

    if (loginAttempt.ok) {
        console.log('✅ Login successful!');
        console.log('Access token received:', loginResult.access_token ? 'YES' : 'NO');
    } else {
        console.log('❌ Login failed:', loginResult.error_description || loginResult.msg);
    }

    console.log('\n' + '='.repeat(60));
    console.log('DIAGNOSIS COMPLETE');
    console.log('='.repeat(60));
}

comprehensiveDiagnosis().catch(console.error);
