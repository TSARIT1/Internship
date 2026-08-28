const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();

function uploadDir(sftp, localDir, remoteDir) {
    return new Promise((resolve, reject) => {
        sftp.mkdir(remoteDir, (err) => {
            const files = fs.readdirSync(localDir);
            let count = files.length;
            if (count === 0) return resolve();

            files.forEach(file => {
                const localPath = path.join(localDir, file);
                const remotePath = path.posix.join(remoteDir, file);
                const stat = fs.statSync(localPath);

                if (stat.isDirectory()) {
                    uploadDir(sftp, localPath, remotePath).then(() => {
                        count--;
                        if (count === 0) resolve();
                    }).catch(reject);
                } else {
                    sftp.fastPut(localPath, remotePath, (err) => {
                        if (err) return reject(err);
                        console.log(`Uploaded: ${remotePath}`);
                        count--;
                        if (count === 0) resolve();
                    });
                }
            });
        });
    });
}

conn.on('ready', () => {
    console.log('SSH Connection ready for Frontend Dist upload.');
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        console.log('Uploading frontend/dist to /var/www/internship/frontend/dist...');
        uploadDir(sftp, path.join(__dirname, 'frontend', 'dist'), '/var/www/internship/frontend/dist')
            .then(() => {
                console.log('✅ Frontend dist uploaded successfully!');
                conn.end();
            })
            .catch(e => {
                console.error('SFTP upload error:', e);
                conn.end();
            });
    });
}).connect({
    host: '72.62.228.102',
    port: 22,
    username: 'root',
    password: 'Tsarit@12345'
});
