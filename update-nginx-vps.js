const { Client } = require('ssh2');

const conn = new Client();

const nginxConfig = `server {
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

    location /raki-ai/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_buffering off;
        client_max_body_size 100M;
    }

    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/internship.tsaritservices.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/internship.tsaritservices.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = internship.tsaritservices.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    listen [::]:80;
    server_name internship.tsaritservices.com;
    return 404;
}
`;

const rynatyNginxConfig = `server {
    server_name rynatyai.com www.rynatyai.com;

    client_max_body_size 64M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    # RAKI AI Core Endpoint
    location /raki-ai/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_buffering off;
    }

    # 1. Real-Time Server-Sent Events (SSE) AI Streaming Endpoint
    location /api/v1/ai/chat/stream {
        proxy_pass http://127.0.0.1:8081/api/v1/ai/chat/stream;
        proxy_http_version 1.1;

        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding on;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Tenant-ID $http_x_tenant_id;
    }

    # 2. Backend REST API & OpenAPI docs
    location /api/ {
        proxy_pass http://127.0.0.1:8081/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Tenant-ID $http_x_tenant_id;
        proxy_read_timeout 120s;
    }

    location /v3/api-docs {
        proxy_pass http://127.0.0.1:8081/v3/api-docs;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /swagger-ui/ {
        proxy_pass http://127.0.0.1:8081/swagger-ui/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /swagger-ui.html {
        proxy_pass http://127.0.0.1:8081/swagger-ui.html;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 3. React Frontend Web Application
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl; # managed by Certbot
    listen [::]:443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/rynatyai.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/rynatyai.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.rynatyai.com) {
        return 301 https://$host$request_uri;
    }

    if ($host = rynatyai.com) {
        return 301 https://$host$request_uri;
    }

    server_name rynatyai.com www.rynatyai.com;
    listen 80;
    listen [::]:80;
    return 404;
}
`;

conn.on('ready', () => {
    console.log('SSH Connection ready for Nginx update.');
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        const stream1 = sftp.createWriteStream('/etc/nginx/sites-available/internship.tsaritservices.com');
        stream1.end(nginxConfig, () => {
            console.log('✅ Updated /etc/nginx/sites-available/internship.tsaritservices.com');
            
            const stream2 = sftp.createWriteStream('/etc/nginx/sites-available/rynatyai.com');
            stream2.end(rynatyNginxConfig, () => {
                console.log('✅ Updated /etc/nginx/sites-available/rynatyai.com');
                
                conn.exec('nginx -t && systemctl reload nginx', (err, stream) => {
                    if (err) throw err;
                    stream.on('data', (d) => process.stdout.write(d.toString()));
                    stream.on('close', () => {
                        console.log('✅ Nginx tested and reloaded successfully!');
                        conn.end();
                    });
                });
            });
        });
    });
}).connect({
    host: '72.62.228.102',
    port: 22,
    username: 'root',
    password: 'Tsarit@12345'
});
