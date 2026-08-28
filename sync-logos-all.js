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
  
  const cmd = `
    SOURCE_LOGO="/var/www/tsaritservices/frontend/public/logo-main.jpeg"
    SOURCE_LOGO_JPG="/var/www/tsaritservices/frontend/public/logo.jpg"
    
    echo "=== Source Logo Details ==="
    ls -la "$SOURCE_LOGO" "$SOURCE_LOGO_JPG"

    echo "=== 1. Copying logo to Internship portal ==="
    mkdir -p /var/www/internship/frontend/dist/
    cp -v "$SOURCE_LOGO" /var/www/internship/frontend/dist/logo-main.jpeg
    cp -v "$SOURCE_LOGO" /var/www/internship/frontend/dist/tsar-logo.jpg
    cp -v "$SOURCE_LOGO_JPG" /var/www/internship/frontend/dist/logo.jpg

    echo "=== 2. Copying logo to all web roots in /var/www ==="
    for site in billing hms hmst; do
      if [ -d "/var/www/$site" ]; then
        echo "Updating site: /var/www/$site"
        # copy to root
        cp -v "$SOURCE_LOGO" "/var/www/$site/logo-main.jpeg" 2>/dev/null || true
        cp -v "$SOURCE_LOGO" "/var/www/$site/tsar-logo.jpg" 2>/dev/null || true
        cp -v "$SOURCE_LOGO_JPG" "/var/www/$site/logo.jpg" 2>/dev/null || true
        
        # copy to subdirectories
        for subdir in $(find "/var/www/$site" -type d -name "public" -o -type d -name "dist" -o -type d -name "assets" -o -type d -name "img" -o -type d -name "images" 2>/dev/null); do
          echo "  -> target: $subdir"
          cp -v "$SOURCE_LOGO" "$subdir/logo-main.jpeg"
          cp -v "$SOURCE_LOGO" "$subdir/tsar-logo.jpg"
          cp -v "$SOURCE_LOGO_JPG" "$subdir/logo.jpg"
        done
      fi
    done

    echo "=== SUCCESS: All sites synced with main site logo ==="
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log(`Command closed with code ${code}`);
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    }).stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });
  });
}).connect(config);
