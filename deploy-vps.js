const { Client } = require('ssh2');

function runSSHCommand(cmd) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      console.log('>>> RUNNING:', cmd);
      conn.exec(cmd, (err, stream) => {
        if (err) {
          conn.end();
          return reject(err);
        }
        let stdout = '';
        let stderr = '';
        stream.on('close', (code) => {
          conn.end();
          resolve({ code, stdout, stderr });
        }).on('data', (d) => {
          stdout += d;
          process.stdout.write(d);
        }).stderr.on('data', (d) => {
          stderr += d;
          process.stderr.write(d);
        });
      });
    }).on('error', (err) => {
      reject(err);
    }).connect({
      host: '72.62.228.102',
      port: 22,
      username: 'root',
      password: 'Tsarit@12345'
    });
  });
}

module.exports = { runSSHCommand };

if (require.main === module) {
  const command = process.argv.slice(2).join(' ') || 'hostname && uptime';
  runSSHCommand(command).catch(err => {
    console.error('Execution failed:', err);
    process.exit(1);
  });
}
