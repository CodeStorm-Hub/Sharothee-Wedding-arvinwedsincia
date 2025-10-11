# Testing the Self-Hosted Deployment

This guide provides comprehensive testing procedures for the self-hosted runner deployment.

## 🧪 Pre-Deployment Testing

### Local Build Testing

Before deploying, always test the build locally:

```bash
cd client

# 1. Clean previous builds
rm -rf .next
rm -rf node_modules/.cache

# 2. Install dependencies
npm ci

# 3. Create test environment
cat << EOF > .env.local
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="test-secret"
NEXTAUTH_URL="http://localhost:3000"
GMAIL_USER="test@test.com"
GMAIL_APP_PASSWORD="test-password"
CLOUDINARY_CLOUD_NAME="test"
CLOUDINARY_API_KEY="test"
CLOUDINARY_API_SECRET="test"
ADMIN_EMAIL="admin@test.com"
ADMIN_PASSWORD="test-password"
EOF

# 4. Generate Prisma client
npx prisma generate

# 5. Run linter
npm run lint

# 6. Run type check
npm run type-check

# 7. Run tests
npm test

# 8. Build application
npm run build

# 9. Verify build artifacts
ls -la .next/
cat .next/BUILD_ID
du -sh .next/
```

**Expected Results**:
- ✅ Linter passes with no errors
- ✅ Type check passes
- ✅ All tests pass
- ✅ Build completes successfully
- ✅ `.next` directory contains BUILD_ID
- ✅ Build size ~150-200MB

### Local Development Testing

Test the application locally before deployment:

```bash
cd client

# 1. Start development server
npm run dev

# 2. Visit http://localhost:3000
# 3. Test all pages and features
```

**Test Checklist**:
- [ ] Homepage loads
- [ ] Images display correctly
- [ ] Navigation works
- [ ] RSVP page accessible
- [ ] Contact page accessible
- [ ] Forms render correctly
- [ ] No console errors

## 📦 Deployment Package Testing

### Test Package Creation

```bash
cd client

# Create test deployment package
tar -czf /tmp/test-deployment.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='out' \
  --exclude='prisma/dev.db' \
  --exclude='test-results' \
  --exclude='playwright-report' \
  --exclude='.env.local' \
  --exclude='coverage' \
  .

# Check package size
du -sh /tmp/test-deployment.tar.gz

# List package contents
tar -tzf /tmp/test-deployment.tar.gz | head -20
```

**Expected Results**:
- ✅ Package size ~30-50MB
- ✅ Contains source files, .next directory
- ✅ Excludes node_modules, .git, .env.local

## 🔄 Workflow Testing

### GitHub Actions Workflow Validation

1. **Validate YAML syntax**:
   ```bash
   # Install yamllint if needed
   pip install yamllint
   
   # Validate workflow file
   yamllint .github/workflows/deploy-self-hosted.yml
   ```

2. **Check workflow in GitHub**:
   - Go to repository Actions tab
   - Look for syntax errors in workflow

3. **Test workflow manually**:
   - Go to Actions tab
   - Select "Deploy to Self-Hosted VPS"
   - Click "Run workflow"
   - Select "main" branch
   - Click "Run workflow"
   - Monitor progress

**Expected Results**:
- ✅ YAML is valid
- ✅ Workflow appears in Actions tab
- ✅ Can trigger workflow manually
- ✅ Build job starts and runs

## 🚀 Post-Deployment Testing

### Immediate Post-Deployment Checks

After deployment completes, run these checks:

#### 1. Server Access

```bash
# SSH into server
ssh runner@31.97.189.238

# Check deployment directory
ls -la /var/www/Sharothee-Wedding/client

# Check if .next directory exists
ls -la /var/www/Sharothee-Wedding/client/.next

# Check environment file (without showing secrets)
ls -la /var/www/Sharothee-Wedding/client/.env.local
```

#### 2. PM2 Status

```bash
# Check PM2 status
pm2 status

# Should show:
# ┌─────┬────────────────────┬─────────┬─────────┬──────────┐
# │ id  │ name               │ mode    │ status  │ restart  │
# ├─────┼────────────────────┼─────────┼─────────┼──────────┤
# │ 0   │ sharothee-wedding  │ fork    │ online  │ 0        │
# └─────┴────────────────────┴─────────┴─────────┴──────────┘

# View detailed info
pm2 info sharothee-wedding

# Check logs
pm2 logs sharothee-wedding --lines 50
```

**Expected Results**:
- ✅ PM2 status: "online"
- ✅ No restart loops (restart count stable)
- ✅ No error logs

#### 3. Application Health

```bash
# Test local endpoint
curl -I http://localhost:3000

# Should return:
# HTTP/1.1 200 OK
# or
# HTTP/1.1 301 Moved Permanently

# Test health endpoint
curl http://localhost:3000/api/health

# Should return JSON with:
# {
#   "status": "healthy",
#   "timestamp": "...",
#   "database": {
#     "status": "connected",
#     ...
#   }
# }
```

**Expected Results**:
- ✅ HTTP status 200 or 301
- ✅ Health endpoint returns "healthy"
- ✅ Database status: "connected"

#### 4. Nginx Status

```bash
# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# Check if site is enabled
ls -la /etc/nginx/sites-enabled/

# Test external access
curl -I https://arvinwedsincia.com
```

**Expected Results**:
- ✅ Nginx status: "active (running)"
- ✅ Configuration test successful
- ✅ Site enabled in sites-enabled
- ✅ HTTPS works (status 200)

### Functional Testing

#### 1. Homepage Testing

**URL**: https://arvinwedsincia.com

**Test Cases**:
- [ ] Page loads without errors
- [ ] Hero section displays
- [ ] Love story timeline shows
- [ ] All images load correctly
- [ ] Navigation menu works
- [ ] Footer displays
- [ ] No console errors
- [ ] Mobile responsive

**How to Test**:
```bash
# Check homepage
curl -I https://arvinwedsincia.com

# Check for broken images
curl https://arvinwedsincia.com | grep -o 'src="[^"]*"' | head -10

# Check response time
curl -o /dev/null -s -w "Response time: %{time_total}s\n" https://arvinwedsincia.com
```

#### 2. RSVP Form Testing

**URL**: https://arvinwedsincia.com/rsvp

**Test Cases**:
- [ ] Form displays correctly
- [ ] All fields render
- [ ] Validation works
- [ ] Can submit form
- [ ] Email received at arvincia@sparrow-group.com
- [ ] Confirmation shown to user
- [ ] Data saved to database

**Manual Test Steps**:
1. Visit https://arvinwedsincia.com/rsvp
2. Fill out form with test data:
   - Guest Name: Test User
   - Email: your-test-email@example.com
   - Will Attend: Yes
   - Family Side: Bride's Family
   - Guest Count: 2
   - Contact info
3. Submit form
4. Check for success message
5. Check email at arvincia@sparrow-group.com
6. Check your test email for confirmation

**Database Verification**:
```bash
# SSH into server
ssh runner@31.97.189.238

# Check database for submission
cd /var/www/Sharothee-Wedding/client
npx prisma studio

# Or query directly:
mysql -u wedding_user -p wedding_db
SELECT * FROM RSVPFormSubmission ORDER BY createdAt DESC LIMIT 5;
```

#### 3. Contact Form Testing

**URL**: https://arvinwedsincia.com/contact

**Test Cases**:
- [ ] Form displays correctly
- [ ] All fields render
- [ ] Validation works
- [ ] Can submit form
- [ ] Email received at arvincia@sparrow-group.com
- [ ] Confirmation shown to user
- [ ] Data saved to database

**Manual Test Steps**:
1. Visit https://arvinwedsincia.com/contact
2. Fill out form:
   - Name: Test User
   - Email: your-test-email@example.com
   - Subject: Test Message
   - Message: This is a test message
3. Submit form
4. Check for success message
5. Check email at arvincia@sparrow-group.com
6. Check your test email for confirmation

#### 4. Image Loading Testing

**Test Cases**:
- [ ] Hero images load
- [ ] Story timeline images load
- [ ] Gallery images load
- [ ] Event images load
- [ ] Images have correct paths
- [ ] Images optimized and fast

**How to Test**:
```bash
# Test specific image URLs
curl -I https://arvinwedsincia.com/images/hero-image.jpg
curl -I https://arvinwedsincia.com/images/gallery/gallery-1.jpg

# Check image response time
curl -o /dev/null -s -w "Image load time: %{time_total}s\n" \
  https://arvinwedsincia.com/images/gallery/gallery-1.jpg
```

#### 5. API Endpoints Testing

**Health Endpoint**:
```bash
curl https://arvinwedsincia.com/api/health | jq
```

**Contact Endpoint**:
```bash
curl -X POST https://arvinwedsincia.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Test message"
  }'
```

**RSVP Endpoint**:
```bash
curl -X POST https://arvinwedsincia.com/api/rsvp/form \
  -H "Content-Type: application/json" \
  -d '{
    "guestName": "Test Guest",
    "contact": {
      "email": "test@example.com",
      "preferred": {
        "number": "+1234567890",
        "whatsapp": true,
        "botim": false
      }
    },
    "willAttendDhaka": "yes",
    "familySide": "bride",
    "guestCountOption": "2"
  }'
```

### Performance Testing

#### Load Time Testing

```bash
# Test page load time
curl -o /dev/null -s -w "
  Response time: %{time_total}s
  Time to first byte: %{time_starttransfer}s
  DNS lookup: %{time_namelookup}s
  Connect time: %{time_connect}s
  SSL handshake: %{time_appconnect}s
\n" https://arvinwedsincia.com
```

**Expected Results**:
- ✅ Total response time < 3 seconds
- ✅ Time to first byte < 500ms
- ✅ No connection timeouts

#### Database Performance

```bash
# Check database latency from health endpoint
curl https://arvinwedsincia.com/api/health | jq '.database.latency'
```

**Expected Results**:
- ✅ Database latency < 100ms

### Email Delivery Testing

#### Test Email Configuration

```bash
# SSH into server
ssh runner@31.97.189.238
cd /var/www/Sharothee-Wedding/client

# Run email test script
npm run email:test
```

**Expected Results**:
- ✅ Test email sent successfully
- ✅ Email received at test address
- ✅ No errors in application logs

#### Production Email Test

1. Submit real RSVP form
2. Submit real Contact form
3. Check both emails received:
   - arvincia@sparrow-group.com (primary)
   - codestromhub@gmail.com (backup)
4. Verify email content correct
5. Check spam folder if needed

## 🔍 Monitoring & Logging

### Application Logs

```bash
# Real-time logs
pm2 logs sharothee-wedding --lines 100 -f

# Error logs only
pm2 logs sharothee-wedding --err --lines 50

# Save logs to file
pm2 logs sharothee-wedding --lines 1000 > ~/deployment-logs.txt
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log

# Search for errors
sudo grep -i error /var/log/nginx/error.log | tail -20
```

### System Logs

```bash
# Runner service logs
sudo journalctl -u actions.runner.* -f

# System resource usage
htop

# Disk usage
df -h

# Memory usage
free -m
```

## ✅ Success Criteria

Deployment is successful when ALL of the following are true:

### Infrastructure
- [ ] Self-hosted runner shows "Idle" in GitHub
- [ ] PM2 shows "online" status
- [ ] Nginx shows "active (running)"
- [ ] SSL certificate valid
- [ ] No critical errors in logs

### Application
- [ ] Homepage accessible and loads < 3 seconds
- [ ] All images load correctly
- [ ] No 404 errors for assets
- [ ] Health endpoint returns "healthy"
- [ ] Database connected

### Email Forms
- [ ] RSVP form submits successfully
- [ ] Contact form submits successfully
- [ ] Emails received at arvincia@sparrow-group.com
- [ ] Confirmation emails sent to users
- [ ] Data saved in database

### Performance
- [ ] Response time < 3 seconds
- [ ] API latency < 500ms
- [ ] Database latency < 100ms
- [ ] No memory leaks
- [ ] CPU usage < 80%

## 🐛 Troubleshooting Test Failures

### Build Fails
```bash
# Check build logs in GitHub Actions
# Review linter/type errors
# Fix code issues and retry
```

### Deployment Fails
```bash
# Check runner status
sudo systemctl status actions.runner.*

# Check PM2 logs
pm2 logs sharothee-wedding --err

# Check disk space
df -h

# Check environment variables
cd /var/www/Sharothee-Wedding/client
cat .env.local | head -10
```

### Email Not Working
```bash
# Check Gmail credentials
grep GMAIL /var/www/Sharothee-Wedding/client/.env.local

# Test email manually
npm run email:test

# Check application logs
pm2 logs sharothee-wedding | grep -i email
```

### Images Not Loading
```bash
# Check file permissions
ls -la /var/www/Sharothee-Wedding/client/public/images

# Check Nginx configuration
sudo nginx -t

# Test direct image access
curl -I https://arvinwedsincia.com/images/gallery/gallery-1.jpg
```

## 📊 Test Reports

### Create Test Report

After testing, create a report:

```markdown
# Deployment Test Report

**Date**: YYYY-MM-DD
**Deployment ID**: BUILD_ID from .next/BUILD_ID
**Tester**: Your Name

## Infrastructure Tests
- [ ] Runner Status: PASS/FAIL
- [ ] PM2 Status: PASS/FAIL
- [ ] Nginx Status: PASS/FAIL

## Application Tests
- [ ] Homepage: PASS/FAIL
- [ ] Images: PASS/FAIL
- [ ] API Health: PASS/FAIL

## Email Tests
- [ ] RSVP Form: PASS/FAIL
- [ ] Contact Form: PASS/FAIL
- [ ] Email Delivery: PASS/FAIL

## Performance Tests
- [ ] Load Time: X.XX seconds
- [ ] API Latency: XXX ms
- [ ] Database Latency: XX ms

## Issues Found
- Issue 1: Description
- Issue 2: Description

## Recommendations
- Recommendation 1
- Recommendation 2

## Overall Status: PASS/FAIL
```

---

**Related Documentation**:
- Setup Guide: `SELF_HOSTED_RUNNER_SETUP.md`
- Deployment Guide: `SELF_HOSTED_DEPLOYMENT.md`
- Quick Checklist: `DEPLOYMENT_CHECKLIST_SELF_HOSTED.md`
