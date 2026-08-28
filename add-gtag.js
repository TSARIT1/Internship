const { runSSHCommand } = require('./deploy-vps.js');
const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  console.log('======================================================');
  console.log('🚀 INJECTING GOOGLE TAG (G-2458LL4PJQ) TO ALL SITES');
  console.log('======================================================\n');

  const gtagSnippet = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-2458LL4PJQ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-2458LL4PJQ');
</script>`;

  // 1. Inject into main site on VPS
  console.log('1. Updating /var/www/tsaritservices/frontend/index.html on VPS...');
  const vpsScript = `
python3 -c "
with open('/var/www/tsaritservices/frontend/index.html', 'r') as f:
    content = f.read()

tag = '''${gtagSnippet}'''

if 'G-2458LL4PJQ' not in content:
    content = content.replace('<head>', '<head>\\n    ' + tag)
    with open('/var/www/tsaritservices/frontend/index.html', 'w') as f:
        f.write(content)
    print('Google Tag successfully added to main site index.html')
else:
    print('Google Tag already present in main site')
"
cd /var/www/tsaritservices && docker compose build tsarit-frontend && docker compose up -d tsarit-frontend
`;

  await runSSHCommand(vpsScript);

  // 2. Build local internship frontend and upload dist/index.html
  console.log('2. Building local internship frontend...');
  execSync('npm run build', { cwd: path.resolve('frontend'), stdio: 'inherit' });

  console.log('3. Uploading dist/index.html to /var/www/internship/frontend/dist/index.html...');
  const conn = new Client();
  await new Promise((resolve, reject) => {
    conn.on('ready', () => {
      conn.sftp((err, sftp) => {
        if (err) return reject(err);
        sftp.fastPut(path.resolve('frontend/dist/index.html'), '/var/www/internship/frontend/dist/index.html', (err2) => {
          conn.end();
          if (err2) return reject(err2);
          console.log('Uploaded index.html to internship site!');
          resolve();
        });
      });
    }).connect({
      host: '72.62.228.102',
      port: 22,
      username: 'root',
      password: 'Tsarit@12345'
    });
  });

  // 4. Verify Live Google Tag on both sites
  console.log('4. Verifying live sites for Google Analytics Tag...');
  const rMain = await fetch('https://tsaritservices.com/');
  const mainHtml = await rMain.text();
  console.log('https://tsaritservices.com -> Google Tag Present:', mainHtml.includes('G-2458LL4PJQ') ? '✅ YES' : '❌ NO');

  const rIntern = await fetch('https://internship.tsaritservices.com/');
  const internHtml = await rIntern.text();
  console.log('https://internship.tsaritservices.com -> Google Tag Present:', internHtml.includes('G-2458LL4PJQ') ? '✅ YES' : '❌ NO');

  console.log('\n======================================================');
  console.log('🎉 GOOGLE ANALYTICS G-2458LL4PJQ IS LIVE ON ALL SITES!');
  console.log('======================================================');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
