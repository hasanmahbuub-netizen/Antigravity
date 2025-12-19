const fs = require('fs');

async function updateVercelEnvAndRedeploy() {
    console.log('🔧 Updating Vercel Environment Variables and Redeploying...\n');

    const token = 'k9ouUFgOiSrYYSoVK9VkQ4K0';
    const projectId = 'prj_G9ozPN3zSnLjSfNUAlow9T47Ubob';

    // Step 1: Get existing environment variables
    console.log('1️⃣ Getting existing environment variables...');
    const getEnvResponse = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const envData = await getEnvResponse.json();
    console.log('Found', envData.envs?.length || 0, 'environment variables');

    // Step 2: Delete and recreate each variable
    const varsToUpdate = {
        'NEXT_PUBLIC_SUPABASE_URL': 'https://lvysvebakhwidqxztrvd.supabase.co',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2eXN2ZWJha2h3aWRxeHp0cnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNTQ4MTEsImV4cCI6MjA4MTYzMDgxMX0.KNJNWew_q4QYLru17U1P8_plV1_KJPAVqcZvKjaKvYg',
        'NEXT_PUBLIC_GEMINI_API_KEY': 'AIzaSyDLHYIjvKGXUWdFZtal_8XHNCAqgOWAZWY'
    };

    console.log('\n2️⃣ Updating environment variables...');
    for (const [key, value] of Object.entries(varsToUpdate)) {
        // Find existing variable
        const existingVar = envData.envs?.find(env => env.key === key);

        if (existingVar) {
            console.log(`\nUpdating ${key}...`);

            // Delete old variable
            const deleteResponse = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env/${existingVar.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (deleteResponse.ok) {
                console.log(`  ✅ Deleted old ${key}`);
            }

            // Create new variable
            const createResponse = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    key: key,
                    value: value,
                    type: 'plain',
                    target: ['production', 'preview', 'development']
                })
            });

            if (createResponse.ok) {
                console.log(`  ✅ Created new ${key}`);
            } else {
                const error = await createResponse.text();
                console.log(`  ❌ Failed to create ${key}:`, error);
            }
        }
    }

    // Step 3: Trigger redeploy using hook
    console.log('\n3️⃣ Triggering production redeploy...');

    // Get deployments to find the latest one
    const deploymentsResponse = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const deployments = await deploymentsResponse.json();

    if (deployments.deployments && deployments.deployments.length > 0) {
        const latestDeployment = deployments.deployments[0];

        // Redeploy the latest deployment
        const redeployResponse = await fetch(`https://api.vercel.com/v13/deployments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                deploymentId: latestDeployment.uid,
                name: 'imanos-web',
                target: 'production'
            })
        });

        if (redeployResponse.ok) {
            const newDeployment = await redeployResponse.json();
            console.log('✅ Redeploy triggered!');
            console.log('Deployment ID:', newDeployment.id);
            console.log('URL:', `https://${newDeployment.url}`);
        } else {
            const error = await redeployResponse.text();
            console.log('❌ Redeploy failed:', error);
            console.log('\n📝 Manual redeploy: Go to Vercel dashboard and click "Redeploy"');
        }
    }

    console.log('\n✅ Environment variables updated!');
    console.log('📝 Wait 2-3 minutes for deployment to complete.');
    console.log('🔗 Check: https://vercel.com/hasanmahbuub-2230s-projects/imanos-web');
}

updateVercelEnvAndRedeploy().catch(console.error);
