const fs = require('fs');

async function run() {
    const sql = fs.readFileSync('fix_supabase_schema.sql', 'utf8');
    const response = await fetch('https://api.supabase.com/v1/projects/lvysvebakhwidqxztrvd/database/query', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sql })
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    if (!response.ok) process.exit(1);
}

run();
