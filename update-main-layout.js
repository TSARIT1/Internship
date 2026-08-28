const { Client } = require('ssh2');

const config = {
  host: '72.62.228.102',
  port: 22,
  username: 'root',
  password: 'Tsarit@12345'
};

const gtagTag = `        {/* Google Analytics tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2458LL4PJQ"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: \`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2458LL4PJQ');
            \`,
          }}
        />`;

async function run() {
  const conn = new Client();
  conn.on('ready', () => {
    console.log('SFTP connected...');
    conn.sftp((err, sftp) => {
      if (err) throw err;
      const remotePath = '/var/www/tsaritservices/frontend/src/app/layout.js';
      sftp.readFile(remotePath, 'utf8', (readErr, data) => {
        if (readErr) throw readErr;
        let content = data;
        if (!content.includes('G-2458LL4PJQ')) {
          content = content.replace('<head>', `<head>\n${gtagTag}`);
          sftp.writeFile(remotePath, content, (writeErr) => {
            if (writeErr) throw writeErr;
            console.log('✅ layout.js updated with Google Tag!');

            console.log('Rebuilding main site container on VPS...');
            conn.exec('cd /var/www/tsaritservices && docker compose build tsarit-frontend && docker compose up -d tsarit-frontend', (execErr, stream) => {
              if (execErr) throw execErr;
              stream.on('close', async () => {
                console.log('✅ Main site container rebuild complete!');
                conn.end();
                
                // Verify live site
                try {
                  const r = await fetch('https://tsaritservices.com/');
                  const text = await r.text();
                  console.log('https://tsaritservices.com Google Tag:', text.includes('G-2458LL4PJQ') ? '✅ LIVE & VERIFIED' : '❌ NOT FOUND');
                } catch(fe) {
                  console.log('Fetch error:', fe.message);
                }
              })
              .on('data', d => process.stdout.write(d))
              .stderr.on('data', d => process.stderr.write(d));
            });
          });
        } else {
          console.log('Google Tag already present in layout.js');
          conn.end();
        }
      });
    });
  }).connect(config);
}

run();
