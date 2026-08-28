#!/bin/bash
set -e

echo "=========================================================="
echo "🚀 TSAR IT INTERNSHIP DEPLOYMENT (internship.tsaritservices.com)"
echo "=========================================================="

# 1. Check Docker and Docker Compose
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

# 2. Build and launch Docker Containers
echo "Building and starting Docker containers..."
docker compose down || true
docker compose build --no-cache
docker compose up -d

# 3. Configure Nginx and SSL
echo "Setting up Nginx & SSL Certificate..."
sudo cp nginx/internship.tsaritservices.com.conf /etc/nginx/sites-available/internship.tsaritservices.com.conf
sudo ln -sf /etc/nginx/sites-available/internship.tsaritservices.com.conf /etc/nginx/sites-enabled/

# 4. Obtain SSL Certificate via Certbot if not already present
if [ ! -f /etc/letsencrypt/live/internship.tsaritservices.com/fullchain.pem ]; then
    echo "Requesting SSL Certificate from Let's Encrypt..."
    sudo certbot --nginx -d internship.tsaritservices.com --non-interactive --agree-tos -m info@tsaritservices.com --redirect
fi

# 5. Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

echo "=========================================================="
echo "✅ DEPLOYMENT COMPLETE! Live at https://internship.tsaritservices.com"
echo "=========================================================="
