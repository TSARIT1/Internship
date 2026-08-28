const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
  host: '72.62.228.102',
  port: 22,
  username: 'root',
  password: 'Tsarit@12345'
};

function uploadFile(sftp, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    sftp.fastPut(localPath, remotePath, (err) => {
      if (err) reject(err);
      else {
        console.log(`Uploaded: ${remotePath}`);
        resolve();
      }
    });
  });
}

function ensureRemoteDir(sftp, remoteDir) {
  return new Promise((resolve) => {
    sftp.mkdir(remoteDir, () => resolve());
  });
}

async function uploadDir(sftp, localDir, remoteDir) {
  await ensureRemoteDir(sftp, remoteDir);
  const entries = fs.readdirSync(localDir, { withFileTypes: true });

  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const remotePath = `${remoteDir}/${entry.name}`;

    if (entry.isDirectory()) {
      await uploadDir(sftp, localPath, remotePath);
    } else {
      await uploadFile(sftp, localPath, remotePath);
    }
  }
}

async function main() {
  const conn = new Client();
  conn.on('ready', () => {
    console.log('SSH Connection ready for RAKI AI upload.');
    conn.sftp(async (err, sftp) => {
      if (err) throw err;
      try {
        const localRakiAi = path.join(__dirname, 'raki-ai');
        const remoteRakiAi = '/var/www/raki-ai';
        console.log('Uploading raki-ai directory to /var/www/raki-ai...');
        await uploadDir(sftp, localRakiAi, remoteRakiAi);
        console.log('✅ Upload completed successfully!');
        
        // Also upload updated root docker-compose.yml
        await uploadFile(sftp, path.join(__dirname, 'docker-compose.yml'), '/var/www/internship/docker-compose.yml');
        console.log('✅ Updated /var/www/internship/docker-compose.yml');

        conn.end();
      } catch (e) {
        console.error('Upload error:', e);
        conn.end();
      }
    });
  }).connect(config);
}

main();
