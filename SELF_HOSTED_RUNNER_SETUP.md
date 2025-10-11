# Self-Hosted Runner Setup Guide

This guide explains how to set up a GitHub self-hosted runner on your VPS for automated deployment of the Sharothee Wedding Website.

## 🎯 Overview

The self-hosted runner allows GitHub Actions to deploy directly to your VPS server, providing:
- ✅ Automated deployments on every push to main
- ✅ Full control over the deployment environment
- ✅ Direct access to server resources (database, files, etc.)
- ✅ No need for manual SSH deployments
- ✅ Working email forms (RSVP, Contact)
- ✅ Properly serving images and static assets

## 📋 Prerequisites

Before setting up the runner, ensure you have:

1. **VPS Server Access**
   - SSH access to your VPS (31.97.189.238)
   - Root or sudo privileges
   - Ubuntu 20.04+ recommended

2. **Server Requirements**
   - Minimum 2GB RAM
   - 50GB+ storage
   - Node.js 20.x installed
   - MySQL server installed and configured
   - Nginx installed
   - PM2 process manager

3. **GitHub Repository Access**
   - Admin access to the repository
   - Ability to create repository secrets

## 🔧 Part 1: VPS Server Setup

### Step 1: Connect to VPS

```bash
ssh root@31.97.189.238
# Enter password: ..Tensorflow2022carbon@..
```

### Step 2: Install Required Software

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Verify Node.js installation
node --version  # Should be v20.x
npm --version   # Should be 10.x+

# Install PM2 globally (if not already installed)
npm install -g pm2

# Install MySQL (if not already installed)
apt install -y mysql-server

# Install Nginx (if not already installed)
apt install -y nginx

# Install Git
apt install -y git curl wget
```

### Step 3: Configure MySQL Database

```bash
# Secure MySQL installation (if not done)
mysql_secure_installation

# Create wedding database
mysql -u root -p
```

```sql
-- Create database
CREATE DATABASE wedding_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated user
CREATE USER 'wedding_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';

-- Grant permissions
GRANT ALL PRIVILEGES ON wedding_db.* TO 'wedding_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### Step 4: Create Deployment Directory

```bash
# Create application directory
sudo mkdir -p /var/www/Sharothee-Wedding/client

# Set proper ownership (replace 'runner' with your runner user)
sudo chown -R runner:runner /var/www/Sharothee-Wedding
```

### Step 5: Configure Nginx

```bash
# Copy nginx configuration
sudo cp /var/www/Sharothee-Wedding/nginx-site.conf /etc/nginx/sites-available/arvinwedsincia.com

# Enable the site
sudo ln -sf /etc/nginx/sites-available/arvinwedsincia.com /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 6: Set up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d arvinwedsincia.com -d www.arvinwedsincia.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## 🤖 Part 2: GitHub Self-Hosted Runner Setup

### Step 1: Create Runner User (Recommended)

```bash
# Create dedicated user for the runner
sudo adduser runner
# Set a strong password

# Add to sudo group
sudo usermod -aG sudo runner

# Switch to runner user
su - runner
```

### Step 2: Download and Configure Runner

1. Go to your GitHub repository: `https://github.com/CodeStorm-Hub/Sharothee-Wedding-arvinwedsincia`

2. Navigate to: **Settings** → **Actions** → **Runners** → **New self-hosted runner**

3. Select **Linux** and **x64** architecture

4. Follow the on-screen instructions to download and configure:

```bash
# Create a folder for the runner
mkdir -p ~/actions-runner && cd ~/actions-runner

# Download the latest runner package (replace URL with the one from GitHub)
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure the runner
./config.sh --url https://github.com/CodeStorm-Hub/Sharothee-Wedding-arvinwedsincia --token YOUR_TOKEN_HERE

# When prompted:
# - Enter the name of the runner group: [Press Enter for default]
# - Enter the name of runner: vps-production-runner
# - Enter any additional labels: vps,production,wedding
# - Enter name of work folder: [Press Enter for default: _work]
```

### Step 3: Install Runner as a Service

```bash
# Install the service
sudo ./svc.sh install

# Start the service
sudo ./svc.sh start

# Check status
sudo ./svc.sh status

# Enable auto-start on boot
sudo systemctl enable actions.runner.*
```

### Step 4: Verify Runner Installation

1. Go back to GitHub repository **Settings** → **Actions** → **Runners**
2. You should see your runner listed with a green "Idle" status
3. If the runner shows as "Offline", check the logs:

```bash
# View runner logs
sudo journalctl -u actions.runner.* -f
```

## 🔐 Part 3: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Required Secrets:

1. **DATABASE_URL**
   ```
   mysql://wedding_user:YOUR_DB_PASSWORD@localhost:3306/wedding_db
   ```

2. **NEXTAUTH_SECRET**
   ```bash
   # Generate with:
   openssl rand -base64 32
   ```

3. **NEXTAUTH_URL**
   ```
   https://arvinwedsincia.com
   ```

4. **GMAIL_USER**
   ```
   codestromhub@gmail.com
   ```

5. **GMAIL_APP_PASSWORD**
   ```
   rfmltjgaqdtzqhpv
   ```

6. **GMAIL_FROM** (Optional)
   ```
   arvincia@sparrow-group.com
   ```

7. **TEST_EMAIL_TO**
   ```
   arvincia@sparrow-group.com
   ```

8. **ADMIN_EMAIL**
   ```
   admin@wedding.com
   ```

9. **ADMIN_PASSWORD**
   ```
   YOUR_SECURE_ADMIN_PASSWORD
   ```

10. **CLOUDINARY_CLOUD_NAME**
    ```
    your-cloudinary-cloud-name
    ```

11. **CLOUDINARY_API_KEY**
    ```
    your-cloudinary-api-key
    ```

12. **CLOUDINARY_API_SECRET**
    ```
    your-cloudinary-api-secret
    ```

### How to Add Secrets:

1. Go to repository **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter name (e.g., `DATABASE_URL`)
5. Enter value
6. Click **Add secret**
7. Repeat for all secrets above

## 🚀 Part 4: Deploy the Application

### Initial Deployment

Once the runner is configured and secrets are set:

1. **Trigger deployment** by pushing to main branch:
   ```bash
   git add .
   git commit -m "Set up self-hosted runner deployment"
   git push origin main
   ```

2. **Monitor deployment**:
   - Go to **Actions** tab in GitHub
   - Click on the running workflow
   - Watch the build and deployment progress

3. **Verify deployment**:
   - Visit: https://arvinwedsincia.com
   - Test RSVP form submission
   - Test Contact form submission
   - Check that images load correctly
   - Verify admin login works

### Manual Deployment Trigger

You can also trigger deployment manually:

1. Go to **Actions** tab
2. Select **Deploy to Self-Hosted VPS** workflow
3. Click **Run workflow**
4. Select branch (main)
5. Click **Run workflow**

## 🔍 Part 5: Verification & Testing

### Check Application Status

```bash
# SSH into VPS
ssh runner@31.97.189.238

# Check PM2 status
pm2 status

# View application logs
pm2 logs sharothee-wedding --lines 50

# Check if application is responding
curl http://localhost:3000

# Check Nginx status
sudo systemctl status nginx

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Test Email Forms

1. **Test RSVP Form**:
   - Visit: https://arvinwedsincia.com/rsvp
   - Fill out the form
   - Submit
   - Check email at arvincia@sparrow-group.com

2. **Test Contact Form**:
   - Visit: https://arvinwedsincia.com/contact
   - Fill out the form
   - Submit
   - Check email at arvincia@sparrow-group.com

### Test Image Loading

1. Visit homepage: https://arvinwedsincia.com
2. Check that all images load:
   - Hero image
   - Timeline images
   - Gallery images
   - Event images

## 🛠️ Part 6: Maintenance & Troubleshooting

### Common Issues

#### Runner Not Connecting

```bash
# Check runner service status
sudo systemctl status actions.runner.*

# Restart runner service
sudo ./svc.sh stop
sudo ./svc.sh start

# Check runner logs
sudo journalctl -u actions.runner.* -f
```

#### Application Not Starting

```bash
# Check PM2 logs
pm2 logs sharothee-wedding --lines 100

# Restart application
pm2 restart sharothee-wedding

# Check environment variables
cd /var/www/Sharothee-Wedding/client
cat .env.local
```

#### Email Forms Not Working

```bash
# Check environment variables
cd /var/www/Sharothee-Wedding/client
grep GMAIL .env.local

# Test email sending
npm run email:test

# Check application logs
pm2 logs sharothee-wedding | grep -i email
```

#### Images Not Loading

```bash
# Check Nginx configuration
sudo nginx -t

# Check file permissions
ls -la /var/www/Sharothee-Wedding/client/public/images

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Useful Commands

```bash
# Stop runner
sudo ./svc.sh stop

# Start runner
sudo ./svc.sh start

# Restart runner
sudo ./svc.sh stop
sudo ./svc.sh start

# View runner logs
sudo journalctl -u actions.runner.* -f

# Update runner
cd ~/actions-runner
./config.sh remove
# Download new version
# Run config.sh again
sudo ./svc.sh install
sudo ./svc.sh start
```

### Backup Strategy

```bash
# Manual backup
cd /var/www
sudo tar -czf Sharothee-Wedding-backup-$(date +%Y%m%d).tar.gz Sharothee-Wedding/

# Automated backups are created during deployment
# Location: /var/www/Sharothee-Wedding_backup_*
# Retention: Last 3 backups
```

### Rollback to Previous Version

```bash
# Stop current application
pm2 stop sharothee-wedding

# Find backup directory
ls -lt /var/www/Sharothee-Wedding_backup_* | head -1

# Restore from backup
sudo mv /var/www/Sharothee-Wedding /var/www/Sharothee-Wedding_failed
sudo cp -r /var/www/Sharothee-Wedding_backup_YYYYMMDD_HHMMSS /var/www/Sharothee-Wedding

# Restart application
cd /var/www/Sharothee-Wedding/client
pm2 restart sharothee-wedding
```

## 📊 Monitoring

### Application Monitoring

```bash
# Real-time PM2 monitoring
pm2 monit

# Application metrics
pm2 describe sharothee-wedding

# Resource usage
htop
```

### Log Monitoring

```bash
# Application logs (real-time)
pm2 logs sharothee-wedding --lines 100 -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -f
```

## 🔒 Security Best Practices

1. **Keep software updated**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use firewall**:
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. **Regular backups**: Automated during deployment, keep 3 most recent

4. **Monitor logs**: Check for suspicious activity regularly

5. **Secure secrets**: Never commit secrets to repository, use GitHub Secrets

6. **Update SSL certificates**: Auto-renewed by Certbot

## 📚 Additional Resources

- [GitHub Actions Self-Hosted Runners](https://docs.github.com/en/actions/hosting-your-own-runners)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 🆘 Support

For issues or questions:
- Email: codestromhub@gmail.com
- Check GitHub Actions logs in the repository
- Review PM2 logs on the server
- Check Nginx logs for HTTP errors

---

**Last Updated**: October 2025  
**Status**: ✅ Production Ready  
**Live URL**: https://arvinwedsincia.com
