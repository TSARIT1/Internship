const net = require('net');
const tls = require('tls');

function testSmtp(host, port) {
    return new Promise((resolve, reject) => {
        const socket = net.createConnection(port, host, () => {
            console.log(`Connected to ${host}:${port}`);
        });

        socket.on('data', (data) => {
            console.log(`${host} response:`, data.toString().trim());
            socket.end();
            resolve(true);
        });

        socket.on('error', (err) => {
            console.error(`${host} error:`, err.message);
            reject(err);
        });

        socket.setTimeout(5000, () => {
            console.log(`${host} timeout`);
            socket.destroy();
            resolve(false);
        });
    });
}

async function main() {
    console.log('Testing SMTP Servers...');
    await testSmtp('smtp.zoho.in', 587).catch(() => {});
    await testSmtp('smtp.zoho.com', 587).catch(() => {});
    console.log('Done.');
}

main();
