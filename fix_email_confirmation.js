const fs = require('fs');

async function fixSupabaseEmailSettings() {
    console.log('🔧 Fixing Supabase Email Confirmation Settings...\n');

    const token = 'sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c';
    const projectRef = 'lvysvebakhwidqxztrvd';

    // Step 1: Disable email confirmation requirement
    console.log('1️⃣ Disabling email confirmation requirement...');
    const disableConfirmation = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            DISABLE_SIGNUP: false,
            ENABLE_SIGNUP: true,
            MAILER_AUTOCONFIRM: true,  // Auto-confirm emails
            SITE_URL: 'https://imanos-web.vercel.app',
            REDIRECT_URLS: ['https://imanos-web.vercel.app/**']
        })
    });

    const confirmResult = await disableConfirmation.json();
    console.log('Email confirmation disabled:', JSON.stringify(confirmResult, null, 2));

    // Step 2: Confirm all existing unconfirmed users
    console.log('\n2️⃣ Auto-confirming existing users...');
    const confirmUsers = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
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
          confirmed_at = COALESCE(confirmed_at, now())
        WHERE email_confirmed_at IS NULL;
      `
        })
    });

    const confirmUsersResult = await confirmUsers.json();
    console.log('Users confirmed:', JSON.stringify(confirmUsersResult, null, 2));

    // Step 3: Verify users can now login
    console.log('\n3️⃣ Checking user status...');
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
          email_confirmed_at,
          confirmed_at,
          CASE 
            WHEN email_confirmed_at IS NOT NULL THEN '✅ CONFIRMED'
            ELSE '❌ NOT CONFIRMED'
          END as status
        FROM auth.users
        ORDER BY created_at DESC;
      `
        })
    });

    const usersStatus = await checkUsers.json();
    console.log('User confirmation status:', JSON.stringify(usersStatus, null, 2));

    console.log('\n✅ Email confirmation fixed!');
    console.log('📝 Users can now login without email confirmation.');
    console.log('🔗 Site URL set to: https://imanos-web.vercel.app');
}

fixSupabaseEmailSettings().catch(console.error);
