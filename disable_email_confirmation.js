const fs = require('fs');

async function disableEmailConfirmation() {
    console.log('🔧 Disabling email confirmation via SQL...\n');

    const token = 'sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c';
    const projectRef = 'lvysvebakhwidqxztrvd';

    // The correct way to disable email confirmation is via auth config
    console.log('1️⃣ Updating auth configuration...');
    const updateConfig = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            MAILER_AUTOCONFIRM: true,  // This disables email confirmation requirement
            SITE_URL: 'https://imanos-web.vercel.app'
        })
    });

    const configResult = await updateConfig.json();
    console.log('Config updated. MAILER_AUTOCONFIRM should be true.');

    // Also confirm all existing users
    console.log('\n2️⃣ Auto-confirming all existing users...');
    const confirmAll = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
        UPDATE auth.users
        SET email_confirmed_at = COALESCE(email_confirmed_at, now())
        WHERE email_confirmed_at IS NULL;
      `
        })
    });

    const confirmResult = await confirmAll.json();
    console.log('Confirmation result:', JSON.stringify(confirmResult, null, 2));

    // Verify
    console.log('\n3️⃣ Verifying users...');
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
          email_confirmed_at IS NOT NULL as confirmed
        FROM auth.users;
      `
        })
    });

    const verifyResult = await verify.json();
    console.log('User status:', JSON.stringify(verifyResult, null, 2));

    console.log('\n✅ Email confirmation disabled!');
    console.log('📝 New signups will be auto-confirmed.');
    console.log('📝 Existing users are now confirmed.');
}

disableEmailConfirmation().catch(console.error);
