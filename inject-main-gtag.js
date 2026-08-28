const { runSSHCommand } = require('./deploy-vps.js');

async function main() {
  console.log('Injecting Google Tag into Next.js layout.js on VPS...');

  const pythonScript = `
with open('/var/www/tsaritservices/frontend/src/app/layout.js', 'r') as f:
    code = f.read()

gtag_jsx = """        {/* Google Analytics tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2458LL4PJQ"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: \\`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2458LL4PJQ');
            \\`,
          }}
        />
"""

if 'G-2458LL4PJQ' not in code:
    code = code.replace('<head>', '<head>\\n' + gtag_jsx)
    with open('/var/www/tsaritservices/frontend/src/app/layout.js', 'w') as f:
        f.write(code)
    print('✅ Successfully inserted Google Tag into layout.js')
else:
    print('Google Tag already in layout.js')
`;

  await runSSHCommand(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);

  console.log('Rebuilding main site container on VPS...');
  await runSSHCommand('cd /var/www/tsaritservices && docker compose build tsarit-frontend && docker compose up -d tsarit-frontend');

  console.log('Verifying live Google Tag on https://tsaritservices.com...');
  const res = await fetch('https://tsaritservices.com/');
  const html = await res.text();
  const found = html.includes('G-2458LL4PJQ');
  console.log('https://tsaritservices.com Google Tag Status:', found ? '✅ VERIFIED ACTIVE (G-2458LL4PJQ)' : '❌ NOT FOUND');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
