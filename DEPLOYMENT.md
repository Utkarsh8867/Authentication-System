# 🚀 Production Deployment Guide

This guide covers deploying the eCommerce Authentication System to a production server without Docker.

## 📋 Prerequisites

- Node.js 16+ installed on server
- MongoDB database (local or cloud)
- PM2 process manager (recommended)
- Nginx (for reverse proxy)
- SSL certificate (recommended)

## 🛠️ Server Setup

### 1. Install Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### 2. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 3. Clone and Setup Application
```bash
# Clone repository
git clone git@github.com:prasadkambale181-cmd/Authentication-System.git
cd Authentication-System

# Install dependencies
npm install --production

# Create logs directory
mkdir logs
```

## ⚙️ Environment Configuration

### 1. Create Production Environment File
Copy `.env.production` to `.env` and update with your production values:

```bash
cp .env.production .env
```

### 2. Update Environment Variables
Edit `.env` file with your production settings:

```env
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database - Use your production MongoDB URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce_prod

# JWT Secrets - Generate strong secrets
JWT_ACCESS_SECRET=your_super_secure_access_secret_minimum_32_chars
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_minimum_32_chars

# CORS - Add your domain URLs
FRONTEND_URL=https://your-frontend-domain.com
DOMAIN_URL=https://your-api-domain.com
```

### 3. Generate Strong JWT Secrets
```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🗄️ Database Setup

### 1. Setup Database with Sample Data
```bash
npm run setup-db
```

### 2. Or Create Admin Only
```bash
npm run create-admin
```

## 🚀 Application Deployment

### Option 1: Using PM2 (Recommended)

```bash
# Start application with PM2
npm run pm2:start

# Check status
pm2 status

# View logs
pm2 logs ecommerce-auth-api

# Monitor
pm2 monit
```

### Option 2: Direct Node.js

```bash
# Start in production mode
npm run prod

# Or with nohup for background process
nohup npm run prod > logs/app.log 2>&1 &
```

### PM2 Management Commands
```bash
# Restart application
npm run pm2:restart

# Stop application
npm run pm2:stop

# Delete from PM2
npm run pm2:delete

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

## 🌐 Nginx Configuration

### 1. Install Nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### 2. Create Nginx Configuration
Create `/etc/nginx/sites-available/ecommerce-api`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Enable Site
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/ecommerce-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 🔒 SSL Certificate (Let's Encrypt)

### 1. Install Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### 2. Obtain Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 3. Auto-renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Setup cron job for auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔥 Firewall Configuration

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 📊 Monitoring & Logs

### 1. Application Logs
```bash
# PM2 logs
pm2 logs ecommerce-auth-api

# Application logs
tail -f logs/combined.log
tail -f logs/err.log
tail -f logs/out.log
```

### 2. System Monitoring
```bash
# Check application status
pm2 status

# Monitor resources
pm2 monit

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Updates & Maintenance

### 1. Application Updates
```bash
# Pull latest changes
git pull origin master

# Install new dependencies
npm install --production

# Restart application
npm run pm2:restart
```

### 2. Database Backup
```bash
# MongoDB backup (if using local MongoDB)
mongodump --db ecommerce_prod --out backup/$(date +%Y%m%d)

# For MongoDB Atlas, use their backup features
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :5000
   sudo kill -9 <PID>
   ```

2. **Permission denied**
   ```bash
   sudo chown -R $USER:$USER /path/to/app
   chmod +x server.js
   ```

3. **MongoDB connection issues**
   - Check MongoDB URI in .env
   - Verify network access to MongoDB
   - Check MongoDB Atlas IP whitelist

4. **PM2 not starting**
   ```bash
   pm2 kill
   pm2 start ecosystem.config.js --env production
   ```

### Health Checks
```bash
# Check API health
curl https://your-domain.com/health

# Check application response
curl -I https://your-domain.com
```

## 📈 Performance Optimization

### 1. PM2 Cluster Mode
The ecosystem.config.js is already configured for cluster mode with `instances: 'max'`

### 2. Nginx Optimization
Add to Nginx configuration:
```nginx
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Enable caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## ✅ Deployment Checklist

- [ ] Server setup with Node.js and PM2
- [ ] Application cloned and dependencies installed
- [ ] Production environment variables configured
- [ ] Strong JWT secrets generated
- [ ] Database setup completed
- [ ] Application started with PM2
- [ ] Nginx configured and running
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Health check passing
- [ ] Logs monitoring setup
- [ ] Backup strategy implemented

Your eCommerce Authentication System is now ready for production! 🎉