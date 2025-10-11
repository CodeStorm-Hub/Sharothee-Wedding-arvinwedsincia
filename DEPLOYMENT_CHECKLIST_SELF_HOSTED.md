# Self-Hosted Runner Deployment - Quick Start Checklist

This is a quick reference checklist for setting up and deploying the wedding website using GitHub self-hosted runner.

## ✅ Pre-Deployment Checklist

### 1. VPS Server Setup
- [ ] VPS accessible via SSH (31.97.189.238)
- [ ] Node.js 20.x installed
- [ ] MySQL server installed and configured
- [ ] Nginx installed and configured
- [ ] PM2 installed globally
- [ ] SSL certificates configured (Let's Encrypt)
- [ ] Firewall configured (ports 22, 80, 443)

### 2. Database Setup
- [ ] MySQL database created: `wedding_db`
- [ ] MySQL user created: `wedding_user`
- [ ] Database permissions granted
- [ ] Connection string tested

### 3. GitHub Runner Setup
- [ ] Runner user created on VPS
- [ ] Runner downloaded and configured
- [ ] Runner installed as service
- [ ] Runner shows as "Idle" in GitHub
- [ ] Runner auto-starts on boot

### 4. GitHub Secrets Configuration
- [ ] DATABASE_URL configured
- [ ] NEXTAUTH_SECRET generated and configured
- [ ] NEXTAUTH_URL configured (https://arvinwedsincia.com)
- [ ] GMAIL_USER configured
- [ ] GMAIL_APP_PASSWORD configured
- [ ] GMAIL_FROM configured
- [ ] TEST_EMAIL_TO configured
- [ ] ADMIN_EMAIL configured
- [ ] ADMIN_PASSWORD configured
- [ ] CLOUDINARY_CLOUD_NAME configured
- [ ] CLOUDINARY_API_KEY configured
- [ ] CLOUDINARY_API_SECRET configured

### 5. Workflow Configuration
- [ ] `.github/workflows/deploy-self-hosted.yml` exists
- [ ] Workflow permissions configured
- [ ] Environment protection rules set (optional)

## 🚀 Deployment Steps

### Initial Deployment

1. **Verify runner is online**
   ```bash
   # On VPS
   sudo systemctl status actions.runner.*
   ```

2. **Push to trigger deployment**
   ```bash
   git add .
   git commit -m "Initial deployment setup"
   git push origin main
   ```

3. **Monitor deployment**
   - Go to GitHub Actions tab
   - Watch the workflow progress
   - Build should complete in ~5-10 minutes
   - Deploy should complete in ~3-5 minutes

4. **Verify deployment**
   ```bash
   # On VPS
   pm2 status
   pm2 logs sharothee-wedding --lines 50
   curl http://localhost:3000/api/health
   ```

### Testing Checklist

- [ ] Homepage loads: https://arvinwedsincia.com
- [ ] All navigation links work
- [ ] Images load correctly
  - [ ] Hero image
  - [ ] Timeline images
  - [ ] Gallery images
  - [ ] Event images
- [ ] RSVP form works
  - [ ] Form displays correctly
  - [ ] Validation works
  - [ ] Submission succeeds
  - [ ] Email received at arvincia@sparrow-group.com
- [ ] Contact form works
  - [ ] Form displays correctly
  - [ ] Validation works
  - [ ] Submission succeeds
  - [ ] Email received at arvincia@sparrow-group.com
- [ ] Admin panel accessible (if implemented)
  - [ ] Login works
  - [ ] Dashboard loads
  - [ ] RSVP management works
- [ ] API health check passes: https://arvinwedsincia.com/api/health

## 🔧 Common Setup Commands

### On VPS

```bash
# Check runner status
sudo systemctl status actions.runner.*

# View runner logs
sudo journalctl -u actions.runner.* -f

# Restart runner
sudo ./svc.sh stop
sudo ./svc.sh start

# Check PM2 status
pm2 status

# View application logs
pm2 logs sharothee-wedding --lines 100

# Restart application
pm2 restart sharothee-wedding

# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check application health
curl http://localhost:3000/api/health
```

### On Local Machine

```bash
# Test build locally before deployment
cd client
npm install
npm run build

# Run locally
npm run dev

# Test production build locally
npm run build
npm start
```

## 📋 Troubleshooting Quick Reference

### Runner Not Connecting
```bash
# Check service
sudo systemctl status actions.runner.*

# Restart service
sudo ./svc.sh stop
sudo ./svc.sh start

# Check logs
sudo journalctl -u actions.runner.* -f
```

### Deployment Fails
```bash
# Check GitHub Actions logs in browser
# Check PM2 logs on server
pm2 logs sharothee-wedding --lines 100

# Check build artifacts
ls -la /var/www/Sharothee-Wedding/client/.next

# Verify environment variables
cd /var/www/Sharothee-Wedding/client
cat .env.local | head -10
```

### Application Not Starting
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs sharothee-wedding --err

# Try manual start
cd /var/www/Sharothee-Wedding/client
npm start

# Check port availability
netstat -tuln | grep 3000
```

### Email Forms Not Working
```bash
# Check environment variables
cd /var/www/Sharothee-Wedding/client
grep GMAIL .env.local

# Check logs for email errors
pm2 logs sharothee-wedding | grep -i email

# Test email manually
npm run email:test
```

### Images Not Loading
```bash
# Check file permissions
ls -la /var/www/Sharothee-Wedding/client/public/images

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test direct file access
curl -I https://arvinwedsincia.com/images/hero-image.jpg
```

## 🔐 Security Verification

- [ ] SSL certificate valid (https with lock icon)
- [ ] Firewall active and configured
- [ ] Database accessible only from localhost
- [ ] Environment variables secure (not in git)
- [ ] Admin credentials strong
- [ ] Nginx security headers configured
- [ ] Regular backups enabled
- [ ] Auto-updates for critical packages

## 📊 Performance Checks

- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Database query time < 100ms
- [ ] Images optimized and loading
- [ ] No console errors
- [ ] Mobile responsive working
- [ ] Forms submit quickly

## 📝 Post-Deployment Tasks

- [ ] Test all features thoroughly
- [ ] Send test RSVP
- [ ] Send test contact message
- [ ] Check email delivery
- [ ] Verify admin access
- [ ] Test on mobile devices
- [ ] Share URL with stakeholders
- [ ] Document any custom configurations
- [ ] Set up monitoring (optional)
- [ ] Configure backups schedule

## 🎉 Success Indicators

✅ All checks above should be completed  
✅ Website accessible at https://arvinwedsincia.com  
✅ Email forms working perfectly  
✅ Images loading correctly  
✅ No errors in logs  
✅ PM2 showing healthy status  
✅ GitHub Actions showing green checkmarks  

## 📞 Support Contacts

- **Technical Issues**: codestromhub@gmail.com
- **Emergency Contact**: arvincia@sparrow-group.com
- **GitHub Actions Logs**: Check Actions tab in repository
- **Server Logs**: SSH into VPS and check PM2 logs

---

**Quick Reference Documentation**:
- Full Setup Guide: `SELF_HOSTED_RUNNER_SETUP.md`
- VPS Deployment: `docs/copilot's docs/HOSTINGER_VPS_DEPLOYMENT_PLAN.md`
- Workflow File: `.github/workflows/deploy-self-hosted.yml`

**Last Updated**: October 2025  
**Status**: ✅ Ready for Deployment
