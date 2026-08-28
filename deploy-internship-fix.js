const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
  host: '72.62.228.102',
  port: 22,
  username: 'root',
  password: 'Tsarit@12345'
};

function uploadDirectory(sftp, localDir, remoteDir, callback) {
  fs.readdir(localDir, { withFileTypes: true }, (err, entries) => {
    if (err) return callback(err);

    let count = entries.length;
    if (count === 0) return callback(null);

    entries.forEach(entry => {
      const localPath = path.join(localDir, entry.name);
      const remotePath = `${remoteDir}/${entry.name}`;

      if (entry.isDirectory()) {
        sftp.mkdir(remotePath, () => {
          uploadDirectory(sftp, localPath, remotePath, (e) => {
            if (e) console.error('Dir err:', e);
            count--;
            if (count === 0) callback(null);
          });
        });
      } else {
        sftp.fastPut(localPath, remotePath, (fErr) => {
          if (fErr) console.error('File put error:', fErr);
          count--;
          if (count === 0) callback(null);
        });
      }
    });
  });
}

async function main() {
  const conn = new Client();
  conn.on('ready', () => {
    console.log('SFTP connected to VPS...');
    conn.sftp((err, sftp) => {
      if (err) throw err;

      // 1. Upload backend JAR
      const localJar = 'd:/TSAR IT Internship New/backend/target/backend-0.0.1-SNAPSHOT.jar';
      const remoteJar = '/var/www/internship/backend/app.jar';
      console.log('Uploading backend JAR...');
      sftp.fastPut(localJar, remoteJar, (jarErr) => {
        if (jarErr) throw jarErr;
        console.log('✅ Backend JAR uploaded successfully!');

        // 2. Upload frontend dist
        const localDist = 'd:/TSAR IT Internship New/frontend/dist';
        const remoteDist = '/var/www/internship/frontend/dist';
        console.log('Uploading frontend dist...');
        uploadDirectory(sftp, localDist, remoteDist, (distErr) => {
          if (distErr) throw distErr;
          console.log('✅ Frontend dist uploaded successfully!');

          // 3. Restart systemd service
          console.log('Restarting tsar-internship backend service on VPS...');
          conn.exec('systemctl restart tsar-internship.service', (execErr, stream) => {
            if (execErr) throw execErr;
            stream.on('close', () => {
              console.log('🎉 tsar-internship.service restarted live!');
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
