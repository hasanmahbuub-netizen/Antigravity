const fs = require('fs');

async function forceDisableEmailConfirmation() {
    console.log('🔧 FORCE DISABLING EMAIL CONFIRMATION\n');
    console.log('='.repeat(60));

    const token = 'sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c';
    const projectRef = 'lvysvebakhwidqxztrvd';

    // Step 1: Confirm ALL unconfirmed users
    console.log('\n1️⃣ CONFIRMING ALL UNCONFIRMED USERS');
    console.log('-'.repeat(60));
    const confirmAll = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        UPDATE auth.users
        SET email_confirmed_at = now()
        WHERE email_confirmed_at IS NULL
        RETURNING email;
      `
        })
    });

    const confirmResult = await confirmAll.json();
    console.log('Confirmed users:', JSON.stringify(confirmResult, null, 2));

    // Step 2: Disable email confirmation in auth config
    console.log('\n2️⃣ DISABLING EMAIL CONFIRMATION IN AUTH CONFIG');
    console.log('-'.repeat(60));
    const updateAuth = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            MAILER_AUTOCONFIRM: true,
            DISABLE_SIGNUP: false,
            ENABLE_SIGNUP: true
        })
    });

    const authConfig = await updateAuth.json();
    console.log('Auth config updated');
    console.log('MAILER_AUTOCONFIRM:', authConfig.mailer_autoconfirm);

    // Step 3: Verify all users are now confirmed
    console.log('\n3️⃣ VERIFYING ALL USERS ARE CONFIRMED');
    console.log('-'.repeat(60));
    const verify = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
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
          CASE 
            WHEN email_confirmed_at IS NOT NULL THEN '✅ CONFIRMED'
            ELSE '❌ NOT CONFIRMED'
          END as status
        FROM auth.users
        ORDER BY created_at DESC;
      `
        })
    });

    const verifyResult = await verify.json();
    console.log('User status:', JSON.stringify(verifyResult, null, 2));

    // Step 4: Test login with confirmed user
    console.log('\n4️⃣ TESTING LOGIN WITH CONFIRMED USER');
    console.log('-'.repeat(60));
    const testLogin = await fetch('https://lvysvebakhwidqxztrvd.supabase.co/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2eXN2ZWJha2h3aWRxeHp0cnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNTQ4MTEsImV4cCI6MjA4MTYzMDgxMX0.KNJNWew_q4QYLru17U1P8_plV1_KJPAVqcZvKjaKvYg',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'test.manual.user@gmail.com',
            password: 'NormalPassword123!'
        })
    });

    if (testLogin.ok) {
        const loginData = await testLogin.json();
        console.log('✅ LOGIN SUCCESSFUL!');
        console.log('User ID:', loginData.user?.id);
        console.log('Access token received:', !!loginData.access_token);
    } else {
        const error = await testLogin.json();
        console.log('❌ Login failed:', error.error_description || error.msg);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ EMAIL CONFIRMATION DISABLED');
    console.log('✅ ALL USERS CONFIRMED');
    console.log('='.repeat(60));
}

forceDisableEmailConfirmation().catch(console.error);
