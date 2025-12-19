const fs = require('fs');

async function permanentlyDisableEmailConfirm() {
    console.log('🔧 PERMANENTLY DISABLING EMAIL CONFIRMATION\n');
    console.log('='.repeat(60));

    const token = 'sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c';
    const projectRef = 'lvysvebakhwidqxztrvd';

    // The issue: MAILER_AUTOCONFIRM keeps reverting to false
    // Solution: Use SQL to directly modify auth config

    console.log('1️⃣ DISABLING EMAIL CONFIRMATION VIA SQL');
    console.log('-'.repeat(60));

    const disableConfirm = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        -- Update auth config to disable email confirmation
        UPDATE auth.config
        SET value = 'false'::jsonb
        WHERE parameter = 'email_confirm_required';
        
        -- Also set autoconfirm to true
        UPDATE auth.config
        SET value = 'true'::jsonb
        WHERE parameter = 'mailer_autoconfirm';
      `
        })
    });

    const sqlResult = await disableConfirm.json();
    console.log('SQL result:', JSON.stringify(sqlResult, null, 2));

    // Confirm ALL users again
    console.log('\n2️⃣ CONFIRMING ALL USERS AGAIN');
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
        SET 
          email_confirmed_at = COALESCE(email_confirmed_at, now()),
          phone_confirmed_at = COALESCE(phone_confirmed_at, now())
        WHERE email_confirmed_at IS NULL OR phone_confirmed_at IS NULL
        RETURNING email;
      `
        })
    });

    const confirmResult = await confirmAll.json();
    console.log('Confirmed users:', JSON.stringify(confirmResult, null, 2));

    // Test login
    console.log('\n3️⃣ TESTING LOGIN');
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
        const data = await testLogin.json();
        console.log('✅ LOGIN SUCCESSFUL');
        console.log('User:', data.user?.email);
    } else {
        const error = await testLogin.json();
        console.log('❌ LOGIN FAILED:', error.error_description || error.msg);
    }

    console.log('\n' + '='.repeat(60));
    console.log('DONE');
    console.log('='.repeat(60));
}

permanentlyDisableEmailConfirm().catch(console.error);
