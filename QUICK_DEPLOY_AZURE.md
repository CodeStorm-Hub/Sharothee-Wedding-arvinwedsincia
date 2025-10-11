# 🚀 Quick Deploy to Azure - 30 Minutes

Deploy your full-stack wedding website to Microsoft Azure with database, API routes, and authentication.

## ✅ What You Get

- **Full-Stack Next.js App** with all features
- **SQLite Database** for RSVP and guest data
- **18 API Routes** working
- **Admin Dashboard** with authentication
- **Email Notifications** for forms
- **GitHub Actions** build on Ubuntu runners
- **Azure Web App** hosting (free tier available)

## ⚡ Quick Setup (30 Minutes)

### 1. Create Azure Web App (10 min)

**Portal**: https://portal.azure.com

1. Sign in (or create free account)
2. Create Resource Group: `wedding-website-rg`
3. Create Web App:
   - Name: `sharothee-wedding` (must be unique)
   - Runtime: Node 20 LTS
   - OS: Linux
   - Plan: F1 Free or B1 Basic

### 2. Configure App Settings (5 min)

In Azure Portal → Your Web App → Configuration:

```env
DATABASE_URL=file:./prisma/prod.db
NEXTAUTH_SECRET=<random-32-chars>
NEXTAUTH_URL=https://sharothee-wedding.azurewebsites.net
ADMIN_EMAIL=admin@wedding.com
ADMIN_PASSWORD=<secure-password>
GMAIL_USER=codestromhub@gmail.com
GMAIL_APP_PASSWORD=<gmail-app-password>
GMAIL_FROM=arvincia@sparrow-group.com
```

**Generate Secret**:
```bash
openssl rand -base64 32
```

### 3. Get Publish Profile (3 min)

1. In Web App → Overview
2. Click "Get publish profile"
3. Save downloaded XML file content

### 4. Add GitHub Secrets (3 min)

GitHub Repo → Settings → Secrets → Actions:

```
AZURE_WEBAPP_PUBLISH_PROFILE = <paste-entire-xml>
NEXTAUTH_SECRET = <your-secret>
NEXTAUTH_URL = https://sharothee-wedding.azurewebsites.net
ADMIN_EMAIL = admin@wedding.com
ADMIN_PASSWORD = <your-password>
GMAIL_USER = codestromhub@gmail.com
GMAIL_APP_PASSWORD = <your-app-password>
GMAIL_FROM = arvincia@sparrow-group.com
```

### 5. Update Workflow (2 min)

Edit `.github/workflows/azure-webapps-node.yml`:

```yaml
env:
  AZURE_WEBAPP_NAME: sharothee-wedding  # Your app name
```

Commit:
```bash
git add .github/workflows/azure-webapps-node.yml
git commit -m "Configure Azure deployment"
git push origin main
```

### 6. Deploy! (7 min)

**Option A**: Push to main (automatic)
```bash
git push origin main
```

**Option B**: Manual trigger
- GitHub → Actions → "Deploy to Azure Web App" → Run workflow

Monitor in Actions tab (~5-7 min build time)

### 7. Verify (5 min)

Visit: `https://sharothee-wedding.azurewebsites.net`

Test:
- [ ] Homepage loads
- [ ] RSVP form → Submit → Check email
- [ ] Admin login → Dashboard
- [ ] All images display

**Done!** ✅

## 🧪 Quick Tests

```bash
# Homepage
curl https://sharothee-wedding.azurewebsites.net

# Health check
curl https://sharothee-wedding.azurewebsites.net/api/health

# Admin (should redirect to login)
curl https://sharothee-wedding.azurewebsites.net/admin/dashboard
```

## 📊 Features Working

✅ **7 Public Pages** + **12 Admin Pages**
✅ **SQLite Database** (persistent)
✅ **18 API Routes** (forms, auth, data)
✅ **Email Notifications** (Gmail)
✅ **20+ Images** (all loading)
✅ **Mobile Responsive**

## 🔧 Troubleshooting

**Deployment fails?**
- Check GitHub Actions logs
- Verify publish profile is complete XML
- Ensure secrets are set in GitHub

**App shows error?**
- Check Azure Portal → Diagnose and solve problems
- Verify app settings are configured
- Restart the Web App

**Email not working?**
- Use Gmail App Password (not regular password)
- Check SMTP settings in Azure logs

**Database errors?**
- Restart Web App in Azure Portal
- Check Prisma client was generated during build

## 💰 Cost

**Free Tier** (12 months):
- F1 plan: Free
- 1 GB RAM, 1 GB storage
- 60 CPU min/day

**After Free Tier**:
- B1 Basic: ~$13/month
- Better performance, more resources

**GitHub Actions**: Free (2,000 min/month)

## 📚 Full Documentation

- Complete Guide: [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md)
- Testing: [TESTING_GUIDE.md](TESTING_GUIDE.md)

## 🎉 You're Live!

Your full-stack wedding website is now on Azure with:
- ✅ Working database
- ✅ Working forms with email
- ✅ Admin dashboard
- ✅ All images
- ✅ Automatic deployments

**Live URL**: `https://sharothee-wedding.azurewebsites.net`

---

**Setup Time**: 30 minutes
**Platform**: Azure Web App (Free tier)
**Build**: GitHub Actions (Ubuntu)
**Database**: SQLite
**Status**: ✅ Production Ready
