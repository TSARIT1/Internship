const { runSSHCommand } = require('./deploy-vps.js');

async function setup() {
  const nginxConf = `server {
    listen 80;
    listen [::]:80;
    server_name internship.tsaritservices.com;

    location / {
        root /var/www/internship/frontend/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8085/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 500M;
    }
}`;

  console.log('1. Creating folders on VPS...');
  await runSSHCommand('mkdir -p /var/www/internship/frontend/dist /var/www/internship/backend /var/www/internship/uploads');

  console.log('2. Writing Nginx config on VPS...');
  await runSSHCommand(`cat << 'EOF' > /etc/nginx/sites-available/internship.tsaritservices.com\n${nginxConf}\nEOF`);

  console.log('3. Enabling Nginx site...');
  await runSSHCommand('ln -sf /etc/nginx/sites-available/internship.tsaritservices.com /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx');

  console.log('4. Requesting SSL certificate from Certbot for internship.tsaritservices.com...');
  await runSSHCommand('certbot --nginx -d internship.tsaritservices.com --non-interactive --agree-tos -m info@tsaritservices.com --redirect');

  console.log('5. Reloading Nginx with active SSL...');
  await runSSHCommand('nginx -t && systemctl reload nginx');

  console.log('✅ SSL Setup Completed successfully!');
}

setup().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
