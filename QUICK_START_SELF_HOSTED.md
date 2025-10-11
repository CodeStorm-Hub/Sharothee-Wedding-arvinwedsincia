# Self-Hosted Runner Deployment - Quick Start

**🚀 Deploy your Next.js wedding website with automated GitHub Actions in 30 minutes!**

## Prerequisites Checklist

- [ ] VPS server with SSH access (31.97.189.238)
- [ ] Ubuntu 20.04+ installed
- [ ] Root or sudo privileges
- [ ] Domain pointed to VPS (arvinwedsincia.com)
- [ ] GitHub repository admin access

## Step-by-Step Setup (30 Minutes)

### Phase 1: VPS Setup (10 minutes)

1. **SSH into your VPS**
   ```bash
   ssh root@31.97.189.238
   ```

2. **Run automated setup script**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   apt install -y nodejs git mysql-server nginx
   
   # Install PM2
   npm install -g pm2
   
   # Verify
   node --version  # Should be v20.x
   npm --version   # Should be 10.x+
   pm2 --version
   ```

3. **Configure MySQL**
   ```bash
   mysql -u root -p
   ```
   
   ```sql
   CREATE DATABASE wedding_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'wedding_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
   GRANT ALL PRIVILEGES ON wedding_db.* TO 'wedding_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Create deployment directory**
   ```bash
   mkdir -p /var/www/Sharothee-Wedding/client
   ```

### Phase 2: GitHub Runner Setup (10 minutes)

1. **Create runner user** (recommended)
   ```bash
   adduser runner
   usermod -aG sudo runner
   su - runner
   ```

2. **Download and configure runner**
   
   Go to GitHub: **Settings → Actions → Runners → New self-hosted runner**
   
   Copy the commands shown and run on VPS:
   
   ```bash
   mkdir -p ~/actions-runner && cd ~/actions-runner
   
   # Download (use URL from GitHub)
   curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
     https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
   
   tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz
   
   # Configure (use token from GitHub)
   ./config.sh --url https://github.com/CodeStorm-Hub/Sharothee-Wedding-arvinwedsincia \
     --token YOUR_TOKEN_HERE
   
   # When prompted:
   # Runner name: vps-production-runner
   # Labels: vps,production,wedding
   ```

3. **Install as service**
   ```bash
   sudo ./svc.sh install
   sudo ./svc.sh start
   sudo ./svc.sh status  # Should show "active (running)"
   ```

4. **Verify in GitHub**
   - Go to repository **Settings → Actions → Runners**
   - Should see "vps-production-runner" with green "Idle" status

### Phase 3: Configure Secrets (5 minutes)

Go to GitHub: **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

```
DATABASE_URL=mysql://wedding_user:YOUR_PASSWORD@localhost:3306/wedding_db
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://arvinwedsincia.com
GMAIL_USER=codestromhub@gmail.com
GMAIL_APP_PASSWORD=rfmltjgaqdtzqhpv
GMAIL_FROM=arvincia@sparrow-group.com
TEST_EMAIL_TO=arvincia@sparrow-group.com
ADMIN_EMAIL=admin@wedding.com
ADMIN_PASSWORD=<your-secure-password>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

### Phase 4: Deploy! (5 minutes)

1. **Trigger deployment**
   ```bash
   # On your local machine
   git push origin main
   ```
   
   Or manually:
   - Go to **Actions** tab
   - Select "Deploy to Self-Hosted VPS"
   - Click "Run workflow"
   - Select "main" branch
   - Click "Run workflow"

2. **Monitor deployment**
   - Watch progress in GitHub Actions tab
   - Build: ~5-10 minutes
   - Deploy: ~3-5 minutes

3. **Verify deployment**
   ```bash
   # On VPS
   pm2 status
   curl http://localhost:3000/api/health
   ```
   
   Visit: https://arvinwedsincia.com

## Testing Checklist

- [ ] Homepage loads: https://arvinwedsincia.com
- [ ] All images display correctly
- [ ] RSVP form works
- [ ] Contact form works
- [ ] Email received at arvincia@sparrow-group.com
- [ ] No console errors
- [ ] Mobile responsive

## Common Commands

### On VPS

```bash
# Check application status
pm2 status
pm2 logs sharothee-wedding --lines 50

# Restart application
pm2 restart sharothee-wedding

# Check runner status
sudo systemctl status actions.runner.*

# View deployment logs
pm2 logs sharothee-wedding | tail -100
```

### On Local Machine

```bash
# Deploy to production
git push origin main

# Manual deployment
# Go to Actions → Deploy to Self-Hosted VPS → Run workflow

# Check workflow status
# Go to Actions tab in GitHub
```

## What Happens on Each Deployment?

1. **Build Job** (Ubuntu Runner):
   - ✅ Checkout code
   - ✅ Install dependencies
   - ✅ Run linter, type check, tests
   - ✅ Build application
   - ✅ Create deployment package
   - ✅ Upload to GitHub

2. **Deploy Job** (Self-Hosted Runner):
   - ✅ Download package
   - ✅ Backup current version
   - ✅ Extract new version
   - ✅ Setup environment
   - ✅ Install dependencies
   - ✅ Run migrations
   - ✅ Build on server
   - ✅ Restart PM2
   - ✅ Verify health

3. **Notify Job** (Ubuntu Runner):
   - ✅ Send status notification

## Success Indicators

✅ Green checkmark in GitHub Actions  
✅ PM2 status: "online"  
✅ Website accessible at https://arvinwedsincia.com  
✅ Email forms working  
✅ Images loading  
✅ No errors in logs  

## Troubleshooting

### Deployment Fails

```bash
# Check runner
sudo systemctl status actions.runner.*

# Check PM2 logs
pm2 logs sharothee-wedding --err

# Check disk space
df -h

# Restart runner if needed
cd ~/actions-runner
sudo ./svc.sh restart
```

### Application Not Responding

```bash
# Check PM2
pm2 status

# Restart application
pm2 restart sharothee-wedding

# Check logs
pm2 logs sharothee-wedding --lines 100

# Check port
netstat -tuln | grep 3000
```

### Email Not Working

```bash
# Check environment variables
cd /var/www/Sharothee-Wedding/client
grep GMAIL .env.local

# Test email
npm run email:test

# Check logs for email errors
pm2 logs sharothee-wedding | grep -i email
```

## Next Steps After Initial Setup

1. **Configure Nginx** (if not done):
   ```bash
   sudo cp /var/www/Sharothee-Wedding/nginx-site.conf /etc/nginx/sites-available/arvinwedsincia.com
   sudo ln -s /etc/nginx/sites-available/arvinwedsincia.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

2. **Setup SSL**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d arvinwedsincia.com -d www.arvinwedsincia.com
   ```

3. **Configure firewall**:
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

4. **Test everything** using `DEPLOYMENT_TESTING.md`

5. **Monitor regularly**:
   ```bash
   pm2 monit  # Real-time monitoring
   ```

## 📚 Full Documentation

- **Complete Setup**: `SELF_HOSTED_RUNNER_SETUP.md`
- **Workflow Details**: `SELF_HOSTED_DEPLOYMENT.md`
- **Testing Guide**: `DEPLOYMENT_TESTING.md`
- **Quick Checklist**: `DEPLOYMENT_CHECKLIST_SELF_HOSTED.md`

## 🆘 Need Help?

- **Email**: codestromhub@gmail.com
- **Emergency**: arvincia@sparrow-group.com
- **Check GitHub Actions logs** in repository
- **Check PM2 logs** on server

---

**Estimated Total Time**: 30 minutes  
**Difficulty**: Intermediate  
**Prerequisites**: Basic Linux and Git knowledge  
**Result**: Automated CI/CD deployment to production! 🎉
