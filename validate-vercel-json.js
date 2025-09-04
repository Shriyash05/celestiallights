const fs = require('fs');

try {
  const vercelConfig = fs.readFileSync('vercel.json', 'utf8');
  const parsed = JSON.parse(vercelConfig);
  console.log('✅ vercel.json is valid JSON');
  console.log('Configuration:', JSON.stringify(parsed, null, 2));
} catch (error) {
  console.error('❌ vercel.json has invalid JSON:', error.message);
  process.exit(1);
}
