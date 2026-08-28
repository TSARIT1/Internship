const { Client } = require('ssh2');

const config = {
  host: '72.62.228.102',
  port: 22,
  username: 'root',
  password: 'Tsarit@12345'
};

async function main() {
  const conn = new Client();
  conn.on('ready', () => {
    console.log('SFTP connected to VPS...');
    conn.sftp((err, sftp) => {
      if (err) throw err;

      const navbarPath = '/var/www/tsaritservices/frontend/src/app/layout/Navbar.jsx';
      sftp.readFile(navbarPath, 'utf8', (rErr, navContent) => {
        if (rErr) throw rErr;

        // Fix duplicate closing tags
        const duplicateClosing = `                </div>
              )}
                </div>
              )}
            </div>`;

        const singleClosing = `                </div>
              )}
            </div>`;

        let updatedNav = navContent.replace(duplicateClosing, singleClosing);

        sftp.writeFile(navbarPath, updatedNav, (wErr) => {
          if (wErr) throw wErr;
          console.log('✅ Navbar.jsx duplicate closing tag fixed!');

          console.log('Rebuilding Docker container on VPS...');
          conn.exec('cd /var/www/tsaritservices && docker compose build tsarit-frontend && docker compose up -d tsarit-frontend', (execErr, stream) => {
            if (execErr) throw execErr;
            stream.on('close', () => {
              console.log('🎉 Container rebuilt successfully!');
              conn.end();
            })
            .on('data', d => process.stdout.write(d))
            .stderr.on('data', d => process.stderr.write(d));
          });
        });
      });
    });
  }).connect(config);
}

main();
