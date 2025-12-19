const fs = require('fs');

async function monitorDeployment() {
    console.log('📊 Monitoring Vercel Deployment...\n');

    const token = 'k9ouUFgOiSrYYSoVK9VkQ4K0';
    const deploymentId = 'dpl_6pjBfvrgCBWvyXUktnqFrLStYuRQ';

    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max

    while (attempts < maxAttempts) {
        const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const deployment = await response.json();

        console.log(`[${new Date().toLocaleTimeString()}] Status: ${deployment.readyState}`);

        if (deployment.readyState === 'READY') {
            console.log('\n✅ Deployment complete!');
            console.log('URL:', `https://${deployment.url}`);
            console.log('Production URL: https://imanos-web.vercel.app');
            return true;
        } else if (deployment.readyState === 'ERROR') {
            console.log('\n❌ Deployment failed!');
            console.log('Error:', deployment.error);
            return false;
        }

        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        attempts++;
    }

    console.log('\n⏱️ Timeout waiting for deployment');
    return false;
}

monitorDeployment().catch(console.error);
