const https = require('https');
const fs = require('fs');

const token = 'k9ouUFgOiSrYYSoVK9VkQ4K0';
const projectId = 'prj_G9ozPN3zSnLjSfNUAlow9T47Ubob';

async function fetchEnv() {
    const options = {
        hostname: 'api.vercel.com',
        path: `/v9/projects/${projectId}/env`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            fs.writeFileSync('c:\\Users\\HP\\Downloads\\OS\\vercel_env_dump.json', data);
            console.log('✅ Env dump saved to vercel_env_dump.json');
        });
    });

    req.on('error', (e) => {
        console.error('Error:', e);
    });

    req.end();
}

fetchEnv();
