const fs = require('fs');

async function setVercelEnvVars() {
    console.log('🔧 Setting Vercel Environment Variables...\n');

    const token = 'k9ouUFgOiSrYYSoVK9VkQ4K0';
    const projectId = 'imanos-web';

    // Get project details first
    console.log('1️⃣ Getting project details...');
    const projectsResponse = await fetch('https://api.vercel.com/v9/projects', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const projects = await projectsResponse.json();
    console.log('Projects found:', projects.projects?.length || 0);

    const project = projects.projects?.find(p => p.name === 'imanos-web');
    if (!project) {
        console.log('❌ Project not found!');
        console.log('Available projects:', projects.projects?.map(p => p.name).join(', '));
        return;
    }

    console.log('✅ Found project:', project.name, '(ID:', project.id, ')');

    // Environment variables to set
    const envVars = [
        {
            key: 'NEXT_PUBLIC_SUPABASE_URL',
            value: 'https://lvysvebakhwidqxztrvd.supabase.co',
            type: 'plain',
            target: ['production', 'preview', 'development']
        },
        {
            key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2eXN2ZWJha2h3aWRxeHp0cnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNTQ4MTEsImV4cCI6MjA4MTYzMDgxMX0.KNJNWew_q4QYLru17U1P8_plV1_KJPAVqcZvKjaKvYg',
            type: 'plain',
            target: ['production', 'preview', 'development']
        },
        {
            key: 'NEXT_PUBLIC_GEMINI_API_KEY',
            value: 'AIzaSyDLHYIjvKGXUWdFZtal_8XHNCAqgOWAZWY',
            type: 'plain',
            target: ['production', 'preview', 'development']
        }
    ];

    // Set each environment variable
    console.log('\n2️⃣ Setting environment variables...');
    for (const envVar of envVars) {
        console.log(`\nSetting ${envVar.key}...`);

        const response = await fetch(`https://api.vercel.com/v10/projects/${project.id}/env`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(envVar)
        });

        if (response.ok) {
            const result = await response.json();
            console.log(`✅ ${envVar.key} set successfully`);
        } else {
            const error = await response.text();
            console.log(`❌ Failed to set ${envVar.key}:`, error);
        }
    }

    // Trigger redeploy
    console.log('\n3️⃣ Triggering production redeploy...');
    const deployResponse = await fetch(`https://api.vercel.com/v13/deployments`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: project.name,
            project: project.id,
            target: 'production',
            gitSource: {
                type: 'github',
                ref: 'main',
                repoId: project.link?.repoId
            }
        })
    });

    if (deployResponse.ok) {
        const deployment = await deployResponse.json();
        console.log('✅ Deployment triggered!');
        console.log('Deployment URL:', deployment.url);
        console.log('Status:', deployment.readyState);
    } else {
        const error = await deployResponse.text();
        console.log('❌ Deployment failed:', error);
    }

    console.log('\n✅ Environment variables set and deployment triggered!');
    console.log('📝 Wait 2-3 minutes for deployment to complete.');
    console.log('🔗 Check status: https://vercel.com/hasanmahbuub-2230s-projects/imanos-web');
}

setVercelEnvVars().catch(console.error);
