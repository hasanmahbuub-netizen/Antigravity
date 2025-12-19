const fs = require('fs');

async function testSupabaseConnection() {
    console.log('🔍 Testing Supabase Connection from Production...\n');

    // Test 1: Check if environment variables are accessible
    console.log('1️⃣ Checking environment variables...');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (hidden)' : 'NOT SET');
    console.log('NEXT_PUBLIC_GEMINI_API_KEY:', process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'SET (hidden)' : 'NOT SET');

    // Test 2: Try to connect to Supabase directly
    console.log('\n2️⃣ Testing direct Supabase connection...');
    const supabaseUrl = 'https://lvysvebakhwidqxztrvd.supabase.co';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2eXN2ZWJha2h3aWRxeHp0cnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNTQ4MTEsImV4cCI6MjA4MTYzMDgxMX0.KNJNWew_q4QYLru17U1P8_plV1_KJPAVqcZvKjaKvYg';

    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=*&limit=1`, {
            headers: {
                'apikey': anonKey,
                'Authorization': `Bearer ${anonKey}`
            }
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Supabase connection works!');
            console.log('Sample data:', JSON.stringify(data, null, 2));
        } else {
            const error = await response.text();
            console.log('❌ Supabase connection failed:', error);
        }
    } catch (err) {
        console.log('❌ Connection error:', err.message);
    }

    // Test 3: Try auth endpoint
    console.log('\n3️⃣ Testing Supabase Auth endpoint...');
    try {
        const authResponse = await fetch(`${supabaseUrl}/auth/v1/health`, {
            headers: {
                'apikey': anonKey
            }
        });

        console.log('Auth health status:', authResponse.status);
        if (authResponse.ok) {
            const health = await authResponse.json();
            console.log('✅ Auth endpoint healthy:', JSON.stringify(health, null, 2));
        }
    } catch (err) {
        console.log('❌ Auth endpoint error:', err.message);
    }
}

testSupabaseConnection().catch(console.error);
