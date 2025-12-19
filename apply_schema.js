const fs = require('fs');

async function applySchema() {
    const sql = fs.readFileSync('supabase_schema.sql', 'utf8');

    console.log('Applying production database schema...');

    const response = await fetch('https://api.supabase.com/v1/projects/lvysvebakhwidqxztrvd/database/query', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sql })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Failed to apply schema:', JSON.stringify(data, null, 2));
        process.exit(1);
    }

    console.log('✅ Schema applied successfully!');
    console.log('Response:', JSON.stringify(data, null, 2));
}

applySchema().catch(console.error);
