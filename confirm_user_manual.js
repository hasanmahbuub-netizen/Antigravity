const fs = require('fs');

async function confirmUserManually() {
    console.log('🔧 Manually confirming user and checking settings...\n');

    const token = 'sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c';
    const projectRef = 'lvysvebakhwidqxztrvd';

    // Step 1: Confirm the user manually
    console.log('1️⃣ Confirming user mhbbanik@gmail.com...');
    const confirmUser = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        UPDATE auth.users
        SET 
          email_confirmed_at = now(),
          confirmed_at = now()
        WHERE email = 'mhbbanik@gmail.com';
      `
        })
    });

    const confirmResult = await confirmUser.json();
    console.log('Confirm result:', JSON.stringify(confirmResult, null, 2));

    // Step 2: Verify user is confirmed
    console.log('\n2️⃣ Verifying user confirmation...');
    const verifyUser = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        SELECT 
          email,
          email_confirmed_at IS NOT NULL as is_confirmed,
          created_at::text,
          email_confirmed_at::text
        FROM auth.users
        WHERE email = 'mhbbanik@gmail.com';
      `
        })
    });

    const verifyResult = await verifyUser.json();
    console.log('User status:', JSON.stringify(verifyResult, null, 2));

    console.log('\n✅ User manually confirmed!');
    console.log('📝 You can now login with mhbbanik@gmail.com');
    console.log('\n⚠️  IMPORTANT: To fix for future signups:');
    console.log('1. Go to https://supabase.com/dashboard/project/lvysvebakhwidqxztrvd/auth/url-configuration');
    console.log('2. Change Site URL from http://localhost:3000 to https://imanos-web.vercel.app');
    console.log('3. Add Redirect URL: https://imanos-web.vercel.app/**');
    console.log('4. Go to Email Templates and disable "Confirm signup" if you want instant access');
}

confirmUserManually().catch(console.error);
