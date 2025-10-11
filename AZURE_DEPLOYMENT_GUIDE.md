# Deploy to Microsoft Azure Web App - Full-Stack Wedding Website

This guide explains how to deploy the complete Next.js wedding website with SQLite database, API routes, and authentication to Microsoft Azure using GitHub Actions.

## 🎯 Overview

This deployment solution:
- ✅ Uses **GitHub-hosted runners** (Ubuntu Linux VMs) for building
- ✅ Deploys to **Azure Web App** (Node.js runtime)
- ✅ Supports full Next.js with **SQLite database**
- ✅ Working **API routes** and **NextAuth** authentication
- ✅ **Email forms** with server-side processing
- ✅ **Admin dashboard** with authentication
- ✅ Automatic deployments from GitHub
- ✅ Free tier available for 12 months (with Azure free account)

## 📋 Prerequisites

1. **Azure Account** (free tier available - https://azure.microsoft.com/free/)
2. **GitHub repository** with admin access
3. **Email service** (Gmail for production emails)

## 🚀 Step-by-Step Setup

### Step 1: Create Azure Web App (10 minutes)

1. **Sign in to Azure Portal**:
   - Go to https://portal.azure.com
   - Sign in with your Microsoft account
   - Or create a new account (free tier available)

2. **Create a Resource Group**:
   - Click "Resource groups" in the left menu
   - Click "+ Create"
   - Name: `wedding-website-rg`
   - Region: Select your preferred region (e.g., East US)
   - Click "Review + create" → "Create"

3. **Create Azure Web App**:
   - Click "+ Create a resource"
   - Search for "Web App" and select it
   - Click "Create"

4. **Configure Web App**:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: `wedding-website-rg` (created above)
   - **Name**: `sharothee-wedding` (must be globally unique)
   - **Publish**: Code
   - **Runtime stack**: Node 20 LTS
   - **Operating System**: Linux
   - **Region**: Same as resource group
   - **Pricing Plan**: 
     - Free tier: F1 (limited resources, good for testing)
     - Or: B1 Basic ($13/month, better performance)

5. **Review and Create**:
   - Click "Review + create"
   - Review the configuration
   - Click "Create"
   - Wait for deployment to complete (~2 minutes)

### Step 2: Configure App Settings (5 minutes)

1. **Go to your Web App**:
   - In Azure Portal, go to "App Services"
   - Click on your app name (`sharothee-wedding`)

2. **Add Application Settings**:
   - In left menu, click "Configuration"
   - Click "Application settings" tab
   - Click "+ New application setting" for each variable below:

   ```
   Name: DATABASE_URL
   Value: file:./prisma/prod.db
   
   Name: NEXTAUTH_SECRET
   Value: <generate-random-32-char-string>
   
   Name: NEXTAUTH_URL
   Value: https://sharothee-wedding.azurewebsites.net
   
   Name: ADMIN_EMAIL
   Value: admin@wedding.com
   
   Name: ADMIN_PASSWORD
   Value: <your-secure-password>
   
   Name: GMAIL_USER
   Value: codestromhub@gmail.com
   
   Name: GMAIL_APP_PASSWORD
   Value: <your-gmail-app-password>
   
   Name: GMAIL_FROM
   Value: arvincia@sparrow-group.com
   
   Name: CLOUDINARY_CLOUD_NAME (optional)
   Value: <your-cloudinary-cloud-name>
   
   Name: CLOUDINARY_API_KEY (optional)
   Value: <your-cloudinary-api-key>
   
   Name: CLOUDINARY_API_SECRET (optional)
   Value: <your-cloudinary-api-secret>
   ```

3. **Save Settings**:
   - Click "Save" at the top
   - Click "Continue" to restart the app

**Generate NEXTAUTH_SECRET**:
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String([byte[]](1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Or online:
# Visit https://generate-secret.vercel.app/32
```

### Step 3: Get Publish Profile (3 minutes)

1. **Download Publish Profile**:
   - In your Web App, click "Overview" in left menu
   - Click "Get publish profile" at the top
   - A `.PublishSettings` file will download

2. **Save Publish Profile Content**:
   - Open the downloaded file in a text editor
   - Copy **ALL** the content (entire XML file)
   - You'll add this to GitHub Secrets in the next step

### Step 4: Configure GitHub Secrets (3 minutes)

1. **Go to GitHub Repository**:
   - Open your repository on GitHub
   - Click "Settings" → "Secrets and variables" → "Actions"

2. **Add Repository Secrets**:
   
   Click "New repository secret" and add each:

   | Secret Name | Value | Description |
   |------------|-------|-------------|
   | `AZURE_WEBAPP_PUBLISH_PROFILE` | Paste entire publish profile XML | Downloaded from Azure |
   | `NEXTAUTH_SECRET` | Your generated secret | Same as Azure app setting |
   | `NEXTAUTH_URL` | `https://sharothee-wedding.azurewebsites.net` | Your Azure Web App URL |
   | `ADMIN_EMAIL` | `admin@wedding.com` | Admin login email |
   | `ADMIN_PASSWORD` | Your secure password | Admin login password |
   | `GMAIL_USER` | `codestromhub@gmail.com` | Gmail account for emails |
   | `GMAIL_APP_PASSWORD` | Your Gmail app password | Gmail SMTP password |
   | `GMAIL_FROM` | `arvincia@sparrow-group.com` | From email address |
   | `CLOUDINARY_CLOUD_NAME` | Your cloud name (optional) | For image uploads |
   | `CLOUDINARY_API_KEY` | Your API key (optional) | For image uploads |
   | `CLOUDINARY_API_SECRET` | Your API secret (optional) | For image uploads |

3. **Verify Secrets**:
   - You should have at least 8 secrets configured
   - Cloudinary secrets are optional

### Step 5: Update Workflow File (2 minutes)

1. **Edit Azure Workflow**:
   - In your repository, open `.github/workflows/azure-webapps-node.yml`
   - Update line 21 (AZURE_WEBAPP_NAME):
     ```yaml
     AZURE_WEBAPP_NAME: sharothee-wedding    # Replace with your actual app name
     ```

2. **Commit Changes**:
   ```bash
   git add .github/workflows/azure-webapps-node.yml
   git commit -m "Configure Azure Web App name"
   git push origin main
   ```

### Step 6: Deploy! (5 minutes)

1. **Trigger Deployment**:
   - **Option A (Automatic)**: Push to `main` branch triggers deployment
   - **Option B (Manual)**: 
     - Go to Actions tab in GitHub
     - Select "Deploy to Azure Web App"
     - Click "Run workflow"
     - Select `main` branch
     - Click "Run workflow"

2. **Monitor Deployment**:
   - Go to "Actions" tab in GitHub
   - Click on the running workflow
   - Watch the build and deploy jobs
   - Takes ~5-7 minutes total

3. **Deployment Stages**:
   - ✅ Build job (~3-4 min):
     - Install dependencies
     - Generate Prisma client
     - Build Next.js app
     - Run tests
     - Create deployment package
   - ✅ Deploy job (~2-3 min):
     - Download build artifact
     - Deploy to Azure Web App
     - Verify deployment

### Step 7: Verify Deployment (5 minutes)

1. **Access Your Website**:
   - URL: `https://sharothee-wedding.azurewebsites.net`
   - Replace with your actual app name

2. **Test Public Pages**:
   - Homepage: `https://sharothee-wedding.azurewebsites.net/`
   - Events: `/events`
   - Gallery: `/gallery`
   - RSVP: `/rsvp`
   - Contact: `/contact`

3. **Test RSVP Form**:
   - Go to `/rsvp`
   - Fill out the form
   - Submit
   - Check email for confirmation

4. **Test Admin Login**:
   - Go to `/admin/login`
   - Login with `ADMIN_EMAIL` and `ADMIN_PASSWORD`
   - Access admin dashboard
   - Verify guest list, RSVP submissions

## ✅ What's Deployed

### Public Features
- ✅ Homepage with love story
- ✅ Events page (Mehndi, Wedding, Reception, After-party)
- ✅ RSVP form with database storage
- ✅ Contact form with email notifications
- ✅ Photo gallery (20+ images)
- ✅ Live streaming page
- ✅ Travel information

### Admin Features (Password Protected)
- ✅ Admin dashboard
- ✅ Guest management
- ✅ RSVP submission tracking
- ✅ Event management
- ✅ Media gallery management

### API Routes (18 total)
- ✅ RSVP submission (`/api/rsvp/submit`)
- ✅ Contact form (`/api/contact`)
- ✅ Guest CRUD (`/api/guests`)
- ✅ Event management (`/api/events`)
- ✅ Authentication (`/api/auth/[...nextauth]`)
- ✅ Media upload (`/api/media/upload`)
- ✅ And 12 more endpoints

### Database
- ✅ SQLite database (persistent)
- ✅ Guest records
- ✅ RSVP submissions
- ✅ Event data
- ✅ Media metadata

## 🧪 Testing Checklist

After deployment, test:

- [ ] Homepage loads with all sections
- [ ] All images display correctly
- [ ] RSVP form submits successfully
- [ ] Email notification received for RSVP
- [ ] Contact form works
- [ ] Email notification received for contact
- [ ] Admin login functional
- [ ] Admin dashboard accessible
- [ ] Guest list displays in admin
- [ ] RSVP submissions viewable in admin
- [ ] Mobile responsive on all pages
- [ ] All navigation links work

## 🔧 Troubleshooting

### Issue: Deployment Fails

**Error**: "Publish profile not found"

**Fix**:
1. Verify `AZURE_WEBAPP_PUBLISH_PROFILE` secret is set in GitHub
2. Ensure the entire XML content is copied (including `<?xml>` tag)
3. Re-download publish profile from Azure and update secret

**Error**: "Build failed - missing dependencies"

**Fix**:
1. Check GitHub Actions logs for specific error
2. Verify `package.json` is in the client directory
3. Ensure `npm ci` completes successfully

### Issue: App Shows "Application Error"

**Error**: Azure shows application error page

**Fix**:
1. Check Azure App Service logs:
   - Go to Azure Portal → Your Web App
   - Click "Diagnose and solve problems"
   - Check "Application Logs"

2. Verify environment variables are set:
   - Go to Configuration → Application settings
   - Ensure all required variables are present

3. Check Node.js version:
   - Ensure Azure is using Node 20 LTS
   - Go to Configuration → General settings

### Issue: Database Not Working

**Error**: "Database file not found" or "Prisma client error"

**Fix**:
1. Verify DATABASE_URL is set to `file:./prisma/prod.db`
2. Ensure Prisma client was generated during build
3. Check that prisma directory is included in deployment
4. Restart the Web App:
   - Go to Azure Portal → Your Web App → Overview
   - Click "Restart"

### Issue: Email Not Sending

**Error**: Forms submit but no emails received

**Fix**:
1. Verify Gmail credentials in Azure app settings:
   - GMAIL_USER is correct
   - GMAIL_APP_PASSWORD is an App Password (not regular password)

2. Enable "Less secure app access" or use App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification
   - App Passwords → Generate new password

3. Check Azure logs for email errors:
   - Go to Log stream in Azure Portal
   - Look for SMTP errors

### Issue: Authentication Not Working

**Error**: "Invalid credentials" or session errors

**Fix**:
1. Verify NEXTAUTH_SECRET matches in both:
   - GitHub Secrets
   - Azure App Settings

2. Check NEXTAUTH_URL is correct:
   - Should be: `https://your-app-name.azurewebsites.net`
   - No trailing slash

3. Clear browser cookies and try again

## 🔄 Continuous Deployment

### Automatic Deployments

Every push to `main` branch triggers:
1. ✅ Build on GitHub-hosted Ubuntu runner
2. ✅ Run tests
3. ✅ Deploy to Azure Web App
4. ✅ Live in 5-7 minutes

### Manual Deployments

1. Go to GitHub Actions tab
2. Select "Deploy to Azure Web App"
3. Click "Run workflow"
4. Select branch (main)
5. Click "Run workflow"

## 💰 Cost Breakdown

### Azure Free Tier (First 12 Months)

- ✅ **App Service**: F1 Free tier (limited resources)
  - 1 GB RAM
  - 1 GB storage
  - 60 CPU minutes/day
  - Good for development/testing

### Paid Options (After Free Tier)

- **Basic B1**: ~$13/month
  - 1.75 GB RAM
  - 10 GB storage
  - Better performance
  - Recommended for production

- **Standard S1**: ~$70/month
  - 1.75 GB RAM
  - 50 GB storage
  - Auto-scaling
  - Custom domains
  - SSL certificates

### GitHub Actions

- ✅ **Free**: 2,000 minutes/month for public repos
- Each deployment: ~5-7 minutes
- Capacity: ~285 deployments/month

## 📊 Performance Optimization

### Enable Application Insights (Optional)

1. In Azure Portal, go to your Web App
2. Click "Application Insights" in left menu
3. Click "Turn on Application Insights"
4. Create new resource
5. Click "Apply"

This enables:
- Performance monitoring
- Error tracking
- Request analytics
- Custom metrics

### Configure Scaling (Paid Plans Only)

1. Go to "Scale up (App Service plan)"
2. Select tier (Basic, Standard, Premium)
3. Go to "Scale out (App Service plan)"
4. Configure auto-scaling rules

### Enable Caching

Add to `next.config.ts`:
```typescript
headers: async () => [
  {
    source: '/images/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
],
```

## 🔐 Security Best Practices

### SSL Certificate

- ✅ Automatic HTTPS enabled
- ✅ Azure-provided SSL certificate
- ✅ HTTP to HTTPS redirect enabled

### Secrets Management

- ✅ Environment variables in Azure App Settings (encrypted)
- ✅ GitHub Secrets for sensitive data
- ✅ Publish profile rotated regularly

### Database Security

- ✅ SQLite file in app directory (not public)
- ✅ No external database access needed
- ✅ Automatic backups (with paid plans)

## 📞 Support

### Azure Documentation
- App Service: https://docs.microsoft.com/azure/app-service/
- Node.js Apps: https://docs.microsoft.com/azure/app-service/quickstart-nodejs
- GitHub Actions: https://docs.microsoft.com/azure/app-service/deploy-github-actions

### Troubleshooting Resources
- Azure Portal → Diagnose and solve problems
- Log stream for real-time logs
- Application Insights for monitoring

### Contact
- Email: codestromhub@gmail.com
- GitHub Issues: Create an issue in the repository

## 🎉 Success Checklist

Deployment is successful when:

- [ ] GitHub Actions workflow completes successfully
- [ ] Azure Web App shows "Running" status
- [ ] Website accessible at Azure URL
- [ ] All pages load without errors
- [ ] Images display correctly
- [ ] RSVP form submits and sends email
- [ ] Contact form works
- [ ] Admin login functional
- [ ] Database operations work
- [ ] Mobile responsive
- [ ] Performance is acceptable (< 5s load)

---

**Status**: ✅ Production Ready
**Platform**: Microsoft Azure Web App
**Build**: GitHub Actions (Ubuntu runners)
**Database**: SQLite
**Runtime**: Node.js 20 LTS
**Deployment Time**: ~5-7 minutes
**Setup Time**: ~30 minutes (first time)
**Cost**: Free tier available (12 months)

🎊 **Congratulations! Your wedding website is live on Azure!**
