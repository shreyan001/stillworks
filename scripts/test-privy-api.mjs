import fs from 'node:fs';
import path from 'node:path';

const APP_ID = 'cmw4v8tzn00a80gjpdl7nqdxj';
const APP_SECRET = 'privy_app_secret_42gJonYyEEdugpwLsjqEYHyQ7wybcDoT45SJKjrnEwmFXxkT1ZKdxdGvk3a4DBWCZ4jq8xUJZGSAKgYNXCRt2VCC';

const basicAuth = Buffer.from(`${APP_ID}:${APP_SECRET}`).toString('base64');

async function testPrivy() {
  console.log('Testing Privy Server API connection...');
  console.log(`App ID: ${APP_ID}`);

  try {
    const resUsers = await fetch('https://auth.privy.io/api/v1/users', {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'privy-app-id': APP_ID,
      },
    });

    console.log(`Users endpoint status: ${resUsers.status} ${resUsers.statusText}`);
    const usersData = await resUsers.json();
    console.log('Users response preview:', JSON.stringify(usersData).slice(0, 300));

    // Cache the response offline in data/privy-cache.json
    const cacheDir = path.resolve('app/src/data');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    const cachePath = path.join(cacheDir, 'privy-offline-cache.json');
    const offlinePayload = {
      appId: APP_ID,
      fetchedAt: new Date().toISOString(),
      offlineStatus: 'Synchronized & Cached Locally',
      usersCount: Array.isArray(usersData?.data) ? usersData.data.length : 0,
      data: usersData,
    };
    fs.writeFileSync(cachePath, JSON.stringify(offlinePayload, null, 2), 'utf8');
    console.log(`✅ Offline contact & wallet cache stored at: ${cachePath}`);
  } catch (err) {
    console.error('Privy fetch error:', err.message);
  }
}

testPrivy();
