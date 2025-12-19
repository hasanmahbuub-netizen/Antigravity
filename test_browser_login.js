// Direct login test to bypass UI
const email = 'mhbbanik@gmail.com';
const password = 'Anik2020';

console.log('Testing direct Supabase login...');

fetch('https://lvysvebakhwidqxztrvd.supabase.co/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2eXN2ZWJha2h3aWRxeHp0cnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNTQ4MTEsImV4cCI6MjA4MTYzMDgxMX0.KNJNWew_q4QYLru17U1P8_plV1_KJPAVqcZvKjaKvYg',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
})
    .then(r => r.json())
    .then(data => {
        console.log('Direct API Result:', data);
        if (data.access_token) {
            console.log('✅ API LOGIN WORKS!');
            console.log('User:', data.user?.email);
        } else {
            console.log('❌ API LOGIN FAILED:', data.error_description || data.msg);
        }
    })
    .catch(err => console.error('API Error:', err));
