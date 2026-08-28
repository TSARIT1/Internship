const { Client } = require('ssh2');

const config = {
  host: '72.62.228.102',
  port: 22,
  username: 'root',
  password: 'Tsarit@12345'
};

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection ready.');
  
  const cmd = `python3 -c "
import urllib.request, json
url = 'http://127.0.0.1:8000/api/chat'
payload = {
    'model': 'llama3.2:1b',
    'messages': [{'role': 'user', 'content': 'You are RAKI AI. Introduce yourself in 2 sentences and write a clean Python function that reverses a string.'}]
}
req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as resp:
        print(resp.read().decode())
except Exception as e:
    print('Error:', e)
"`;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      console.log('Finished with code:', code);
      conn.end();
    }).on('data', (d) => {
      process.stdout.write(d.toString());
    }).stderr.on('data', (d) => {
      process.stderr.write(d.toString());
    });
  });
}).connect(config);
