const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
  host: '72.62.228.102',
  port: 22,
  username: 'root',
  password: 'Tsarit@12345'
};

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection ready.');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    const remoteLogoMain = '/var/www/tsaritservices/frontend/public/logo-main.jpeg';
    const localPublic = path.join(__dirname, 'frontend', 'public');
    if (!fs.existsSync(localPublic)) {
      fs.mkdirSync(localPublic, { recursive: true });
    }

    const localMainJpeg = path.join(localPublic, 'logo-main.jpeg');
    const localTsarLogo = path.join(localPublic, 'tsar-logo.jpg');

    sftp.fastGet(remoteLogoMain, localMainJpeg, (err1) => {
      if (err1) console.error('Error fetching logo-main.jpeg:', err1);
      else {
        console.log('✅ Downloaded logo-main.jpeg');
        fs.copyFileSync(localMainJpeg, localTsarLogo);
        console.log('✅ Updated tsar-logo.jpg');

        const localDist = path.join(__dirname, 'frontend', 'dist');
        if (fs.existsSync(localDist)) {
          fs.copyFileSync(localMainJpeg, path.join(localDist, 'logo-main.jpeg'));
          fs.copyFileSync(localMainJpeg, path.join(localDist, 'tsar-logo.jpg'));
        }
      }
      conn.end();
    });
  });
}).connect(config);
