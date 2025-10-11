# GitHub Self-Hosted Runner Deployment

This document explains the automated deployment workflow for the Sharothee Wedding Website using GitHub Actions with a self-hosted runner.

## 🎯 Overview

The deployment workflow (`.github/workflows/deploy-self-hosted.yml`) automates the entire deployment process from code push to live website, ensuring:

- ✅ **Automated builds** on every push to main
- ✅ **Continuous testing** with linting, type checking, and unit tests
- ✅ **Zero-downtime deployments** with PM2 reload
- ✅ **Automatic backups** before each deployment
- ✅ **Health checks** to verify deployment success
- ✅ **Email notifications** on deployment status
- ✅ **Working email forms** (RSVP and Contact)
- ✅ **Optimized image serving**

## 📊 Workflow Architecture

```
┌─────────────────┐
│   Push to Main  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Build Job      │ (Ubuntu Runner)
│  - Checkout     │
│  - Install deps │
│  - Lint & Test  │
│  - Build app    │
│  - Create pkg   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Deploy Job     │ (Self-Hosted Runner)
│  - Download pkg │
│  - Backup old   │
│  - Extract new  │
│  - Setup env    │
│  - Build server │
│  - Run migr.    │
│  - Restart PM2  │
│  - Verify       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Notify Job     │ (Ubuntu Runner)
│  - Send status  │
│  - Update logs  │
└─────────────────┘
```

## 🔄 Workflow Jobs

### 1. Build Job (Ubuntu Runner)

**Purpose**: Build and test the application in a clean environment

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Create temporary environment file for build validation
5. Generate Prisma client
6. Run linter (`npm run lint`)
7. Run type checker (`npm run type-check`)
8. Run tests (`npm test`)
9. Build application (`npm run build`)
10. Verify build artifacts
11. Create deployment package (excludes node_modules, .git, etc.)
12. Upload artifact to GitHub

**Duration**: ~5-10 minutes

### 2. Deploy Job (Self-Hosted Runner)

**Purpose**: Deploy the built application to the production server

**Steps**:
1. Download deployment package from artifacts
2. Prepare deployment directory
3. Create backup of current deployment (keeps last 3)
4. Extract deployment package
5. Setup production environment variables from GitHub Secrets
6. Install production dependencies (`npm ci --omit=dev`)
7. Generate Prisma client
8. Run database migrations (`prisma migrate deploy`)
9. Build application on server
10. Restart/reload PM2 process
11. Verify deployment (health checks)
12. Display deployment information
13. Cleanup temporary files

**Duration**: ~3-5 minutes

### 3. Notify Job (Ubuntu Runner)

**Purpose**: Send deployment status notification

**Steps**:
1. Collect build and deploy status
2. Create status message
3. Send notification (console log + issue comment if applicable)

**Duration**: <1 minute

## 🔧 Configuration

### Workflow Triggers

The workflow runs on:

1. **Push to main branch** with changes in:
   - `client/**` directory
   - `.github/workflows/deploy-self-hosted.yml` file

2. **Manual trigger** (workflow_dispatch):
   - Go to Actions tab
   - Select workflow
   - Click "Run workflow"
   - Choose environment (production/staging)

### Environment Variables

Defined in workflow:
- `NODE_VERSION`: '20'
- `WORKING_DIRECTORY`: './client'
- `DEPLOY_PATH`: '/var/www/Sharothee-Wedding/client'
- `PM2_APP_NAME`: 'sharothee-wedding'

### Required GitHub Secrets

Must be configured in repository Settings → Secrets:

#### Database
- `DATABASE_URL`: MySQL connection string

#### Authentication
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `NEXTAUTH_URL`: Production URL (https://arvinwedsincia.com)
- `ADMIN_EMAIL`: Admin login email
- `ADMIN_PASSWORD`: Admin login password

#### Email Service
- `GMAIL_USER`: Gmail account for sending emails
- `GMAIL_APP_PASSWORD`: Gmail app-specific password
- `GMAIL_FROM`: From email address (optional)
- `TEST_EMAIL_TO`: Test recipient email

#### Media Upload
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## 🚀 Deployment Process

### Automatic Deployment

1. Make changes to code in `client/` directory
2. Commit and push to main:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. GitHub Actions automatically triggers
4. Monitor progress in Actions tab
5. Deployment completes in ~8-15 minutes
6. Website updates automatically

### Manual Deployment

1. Go to GitHub repository
2. Click **Actions** tab
3. Select **Deploy to Self-Hosted VPS**
4. Click **Run workflow**
5. Select branch (main)
6. Choose environment (production)
7. Click **Run workflow**
8. Monitor progress

## ✅ Deployment Verification

The workflow automatically verifies deployment:

### Automated Checks

1. **Build artifacts verification**:
   - `.next` directory exists
   - `BUILD_ID` file present
   - Build manifest valid

2. **Application health**:
   - HTTP response code 200/301/302
   - API health endpoint responds
   - PM2 process running

3. **Health check endpoint** (`/api/health`):
   ```json
   {
     "status": "healthy",
     "timestamp": "2025-10-11T20:00:00.000Z",
     "uptime": 123456,
     "database": {
       "status": "connected",
       "latency": 45
     }
   }
   ```

### Manual Verification

After deployment, verify:

```bash
# SSH into server
ssh runner@31.97.189.238

# Check PM2 status
pm2 status
pm2 info sharothee-wedding

# Check application health
curl http://localhost:3000/api/health

# View recent logs
pm2 logs sharothee-wedding --lines 50

# Test from browser
curl https://arvinwedsincia.com
```

### Testing Checklist

- [ ] Homepage loads: https://arvinwedsincia.com
- [ ] All images display correctly
- [ ] RSVP form works and sends email
- [ ] Contact form works and sends email
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Admin login works (if applicable)

## 🔄 Rollback Procedure

If deployment fails or issues arise:

### Automatic Rollback

The workflow creates backups automatically:
- Location: `/var/www/Sharothee-Wedding_backup_YYYYMMDD_HHMMSS`
- Retention: Last 3 backups

### Manual Rollback

```bash
# SSH into server
ssh runner@31.97.189.238

# Stop current application
pm2 stop sharothee-wedding

# Find latest backup
ls -lt /var/www/Sharothee-Wedding_backup_* | head -1

# Restore backup (example)
sudo mv /var/www/Sharothee-Wedding /var/www/Sharothee-Wedding_failed
sudo cp -r /var/www/Sharothee-Wedding_backup_20251011_200000 /var/www/Sharothee-Wedding

# Restart application
cd /var/www/Sharothee-Wedding/client
pm2 restart sharothee-wedding

# Verify
curl http://localhost:3000/api/health
```

## 📊 Monitoring

### GitHub Actions Logs

View in repository:
1. Go to **Actions** tab
2. Click on workflow run
3. Click on job (Build/Deploy/Notify)
4. View step logs

### Server Logs

```bash
# PM2 application logs
pm2 logs sharothee-wedding --lines 100

# PM2 real-time monitoring
pm2 monit

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u actions.runner.* -f
```

## 🛠️ Troubleshooting

### Build Fails

**Symptoms**: Build job fails in GitHub Actions

**Solutions**:
1. Check linter errors: Fix code style issues
2. Check type errors: Fix TypeScript issues
3. Check test failures: Fix failing tests
4. Check build logs in Actions tab

### Deploy Fails

**Symptoms**: Deploy job fails in GitHub Actions

**Solutions**:
1. Check runner status: `sudo systemctl status actions.runner.*`
2. Check disk space: `df -h`
3. Check PM2 logs: `pm2 logs sharothee-wedding`
4. Verify secrets are set correctly
5. Check database connection

### Application Not Responding

**Symptoms**: Health check fails, website down

**Solutions**:
```bash
# Check PM2 status
pm2 status

# View error logs
pm2 logs sharothee-wedding --err

# Restart application
pm2 restart sharothee-wedding

# Check port
netstat -tuln | grep 3000

# Check Nginx
sudo systemctl status nginx
sudo nginx -t
```

### Email Forms Not Working

**Symptoms**: Form submits but email not received

**Solutions**:
1. Verify Gmail credentials in secrets
2. Check application logs for email errors:
   ```bash
   pm2 logs sharothee-wedding | grep -i email
   ```
3. Test email manually:
   ```bash
   cd /var/www/Sharothee-Wedding/client
   npm run email:test
   ```
4. Verify Gmail App Password is correct
5. Check spam folder

### Images Not Loading

**Symptoms**: Broken images on website

**Solutions**:
1. Check file permissions:
   ```bash
   ls -la /var/www/Sharothee-Wedding/client/public/images
   ```
2. Check Nginx configuration:
   ```bash
   sudo nginx -t
   ```
3. Check Nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```
4. Verify image paths in code
5. Test direct URL access

## 🔐 Security

### Best Practices

1. **Secrets Management**:
   - Never commit secrets to git
   - Use GitHub Secrets for all sensitive data
   - Rotate secrets regularly

2. **Server Security**:
   - Keep software updated
   - Use firewall (UFW)
   - Monitor logs for suspicious activity
   - Regular security audits

3. **Access Control**:
   - Limit SSH access
   - Use strong passwords
   - Regular backup verification

### Secret Rotation

To rotate a secret:
1. Update in GitHub Secrets
2. Trigger manual deployment
3. Verify application works
4. Update documentation

## 📈 Performance

### Optimization

The deployment includes:
- Production build optimization
- Gzip compression (Nginx)
- Static asset caching
- Image optimization
- Code splitting
- Tree shaking

### Monitoring

```bash
# Check build size
du -sh /var/www/Sharothee-Wedding/client/.next

# Monitor resource usage
htop

# Check memory usage
pm2 describe sharothee-wedding

# Application metrics
curl http://localhost:3000/api/health
```

## 📚 Related Documentation

- **Setup Guide**: `SELF_HOSTED_RUNNER_SETUP.md`
- **Quick Checklist**: `DEPLOYMENT_CHECKLIST_SELF_HOSTED.md`
- **VPS Deployment**: `docs/copilot's docs/HOSTINGER_VPS_DEPLOYMENT_PLAN.md`
- **GitHub Actions**: `.github/workflows/deploy-self-hosted.yml`

## 🆘 Support

For issues or questions:
- **Email**: codestromhub@gmail.com
- **Emergency**: arvincia@sparrow-group.com
- **GitHub Actions Logs**: Check Actions tab
- **Server Logs**: SSH and check PM2 logs

---

**Last Updated**: October 2025  
**Status**: ✅ Production Ready  
**Live URL**: https://arvinwedsincia.com
