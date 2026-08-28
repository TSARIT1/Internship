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
  const items = fs.readdirSync(localDir);
  for (const item of items) {
    const localItem = path.join(localDir, item);
    const remoteItem = `${remoteDir}/${item}`.replace(/\\/g, '/');
    const stat = fs.statSync(localItem);
    if (stat.isDirectory()) {
      await uploadDir(sftp, localItem, remoteItem);
    } else {
      await uploadFile(sftp, localItem, remoteItem);
    }
  }
}

async function main() {
  const conn = new Client();
  conn.on('ready', () => {
    console.log('Connecting SFTP...');
    conn.sftp(async (err, sftp) => {
      if (err) throw err;
      try {
        console.log('1. Uploading frontend dist files...');
        await uploadDir(sftp, path.resolve('frontend/dist'), '/var/www/internship/frontend/dist');

        console.log('2. Uploading backend JAR...');
        await uploadFile(sftp, path.resolve('backend/target/backend-0.0.1-SNAPSHOT.jar'), '/var/www/internship/backend/app.jar');

        console.log('3. Setting up systemd service and permissions...');
        const serviceContent = `[Unit]
Description=TSAR IT Internship Spring Boot Backend
After=syslog.target network.target mysql.service

[Service]
User=root
WorkingDirectory=/var/www/internship/backend
ExecStart=/usr/bin/java -Dserver.port=8085 -Dspring.datasource.url=jdbc:mysql://localhost:3306/internship?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC -Dspring.datasource.username=root -Dspring.datasource.password=Tsarit@12345 -jar /var/www/internship/backend/app.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target`;

        conn.exec(`
          cat << 'EOF' > /etc/systemd/system/tsar-internship.service
${serviceContent}
EOF
          systemctl daemon-reload
          systemctl restart tsar-internship
          systemctl enable tsar-internship
          chmod -R 755 /var/www/internship
          nginx -t && systemctl reload nginx
        `, (execErr, stream) => {
          if (execErr) throw execErr;
          stream.on('close', () => {
            console.log('✅ Deployment to VPS completed!');
            conn.end();
          })
          .on('data', d => process.stdout.write(d))
          .stderr.on('data', d => process.stderr.write(d));
        });
      } catch (uploadErr) {
        console.error('Upload failed:', uploadErr);
        conn.end();
      }
    });
  }).connect(config);
}

main();
