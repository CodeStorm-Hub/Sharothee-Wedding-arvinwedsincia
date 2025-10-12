# Vercel Deployment Guide with SQLite Database

## Overview
This guide explains how to deploy the Sharothee Wedding website to Vercel using the existing SQLite database.

## Important: SQLite on Vercel

### Understanding SQLite Limitations on Vercel
Vercel uses a **serverless architecture** where each function invocation runs in an isolated, ephemeral environment. This means:

⚠️ **Key Limitations:**
- SQLite databases are **read-only** on Vercel
- Any writes to the database will be lost after the function completes
- The database file is included in the deployment bundle but cannot be modified at runtime
- Each serverless function gets a fresh copy of the database

### Recommended Approach for Production

For a **production deployment** with write capabilities, consider:

1. **Vercel Postgres** (Recommended)
   - Managed PostgreSQL database
   - Fully compatible with Prisma
   - Free tier available
   - Persistent storage

2. **Vercel Blob Storage + Turso**
   - SQLite-compatible edge database
   - Distributed and persistent
   - Free tier available

3. **External Database Providers**
   - PlanetScale (MySQL)
   - Supabase (PostgreSQL)
   - Railway (PostgreSQL/MySQL)

### Using SQLite for Read-Only Data

If you want to use the existing SQLite database as **read-only** data:
- Guest lists
- Event information
- Pre-populated content
- Static configuration

This works well for **display-only** pages but **NOT** for:
- ❌ RSVP submissions (writes to database)
- ❌ Contact forms (writes to database)
- ❌ Admin updates (writes to database)
- ❌ Media uploads (writes to database)

## Deployment Steps

### Step 1: Prepare Environment Variables

Create environment variables in Vercel Dashboard:

```env
# Database - Read-only SQLite
DATABASE_URL=file:./prisma/dev.db
DATABASE_PROVIDER=sqlite

# NextAuth
NEXTAUTH_SECRET=<your-secure-random-string-32-chars>
NEXTAUTH_URL=https://your-project.vercel.app

# Admin Credentials
ADMIN_EMAIL=admin@wedding.com
ADMIN_PASSWORD=<your-secure-password>

# Email Service (Gmail)
GMAIL_USER=codestromhub@gmail.com
GMAIL_APP_PASSWORD=<your-gmail-app-password>
GMAIL_FROM=Incia & Arvin Wedding <arvincia@sparrow-group.com>

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

### Step 2: Verify SQLite Database

Ensure the SQLite database exists:

```bash
cd client/prisma
ls -lh dev.db  # Should show ~147KB file
```

### Step 3: Configure Vercel Project

1. **Import Project to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Select your GitHub repository
   - Configure:
     - Framework Preset: Next.js
     - Root Directory: `client`
     - Build Command: `npm run build` (uses default)
     - Install Command: `npm install` (uses default)

2. **Add Environment Variables**
   - Settings → Environment Variables
   - Add all variables from Step 1
   - Apply to: Production, Preview, Development

### Step 4: Deploy Using GitHub Actions

The repository includes a GitHub Actions workflow for automated deployment:

**Trigger Deployment:**
```bash
# Option 1: Manual trigger from GitHub Actions tab
# Go to: Actions → "Deploy Full-Stack App to Vercel" → Run workflow

# Option 2: Push to trigger (if configured)
git push origin main
```

**Workflow does:**
1. ✅ Installs dependencies
2. ✅ Generates Prisma client
3. ✅ Runs tests
4. ✅ Builds the application
5. ✅ Deploys to Vercel

### Step 5: Verify Deployment

After deployment:

1. **Check Build Logs**
   - Vercel Dashboard → Deployments → Latest
   - Look for "Build successful"

2. **Test Website**
   ```bash
   # Homepage
   curl https://your-project.vercel.app
   
   # API Health Check
   curl https://your-project.vercel.app/api/health
   ```

3. **Test Read-Only Features**
   - Events page (reads from database)
   - Gallery (static content)
   - Live stream (configuration)

## Switching to a Persistent Database

### Option A: Vercel Postgres (Recommended)

1. **Create Vercel Postgres**
   ```bash
   # In Vercel Dashboard
   # Storage → Create Database → Postgres
   ```

2. **Update Prisma Schema**
   ```prisma
   // client/prisma/schema.prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_PRISMA_URL")
   }
   ```

3. **Migrate Data**
   ```bash
   # Export from SQLite
   sqlite3 prisma/dev.db .dump > data.sql
   
   # Convert and import to Postgres
   # Use migration tools or manual conversion
   ```

4. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

### Option B: Turso (Edge SQLite)

1. **Install Turso**
   ```bash
   npm install @libsql/client
   ```

2. **Create Turso Database**
   ```bash
   turso db create wedding-db
   turso db show wedding-db --url
   ```

3. **Update Environment**
   ```env
   DATABASE_URL=libsql://[your-db].turso.io
   TURSO_AUTH_TOKEN=<your-token>
   ```

## GitHub Actions Workflows

All workflows have been updated to **manual trigger only**:

- ✅ `auto-label-issues.yml` - Manual only
- ✅ `azure-webapps-node.yml` - Manual only
- ✅ `ci-cd-pipeline.yml` - Manual only
- ✅ `codeql.yml` - Manual only
- ✅ `deploy-vercel.yml` - Manual only
- ✅ `nextjs.yml` - Manual only
- ✅ `project-board-automation.yml` - Manual only
- ✅ `sync-issues.yml` - Manual only
- ✅ `wedding-day-notifications.yml` - Manual only

**To trigger any workflow:**
1. Go to GitHub repository
2. Click "Actions" tab
3. Select workflow from left sidebar
4. Click "Run workflow" button
5. Confirm by clicking "Run workflow"

## Configuration Files

### vercel.json

```json
{
  "buildCommand": "npx prisma generate && npm run build",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

This ensures:
- Prisma client is generated during build
- Next.js build runs correctly
- Dependencies are installed properly

## Troubleshooting

### Build Fails

**Issue**: Build fails with Prisma errors
**Solution**:
```bash
# Ensure prisma generate runs during build
# Check vercel.json has correct buildCommand
```

### Database Write Errors

**Issue**: "Database is locked" or "Read-only database"
**Solution**:
- SQLite on Vercel is read-only
- Switch to Vercel Postgres or Turso
- See "Switching to a Persistent Database" section

### Environment Variables Not Set

**Issue**: App shows configuration errors
**Solution**:
```bash
# In Vercel Dashboard
# Settings → Environment Variables
# Add all required variables
# Redeploy the application
```

### Missing Database File

**Issue**: "Database file not found"
**Solution**:
```bash
# Verify dev.db exists in client/prisma/
# Ensure .gitignore doesn't exclude prisma/*.db
# Check vercel.json doesn't ignore prisma directory
```

## Security Considerations

### Production Environment Variables

**Never commit these to Git:**
- ❌ NEXTAUTH_SECRET
- ❌ ADMIN_PASSWORD
- ❌ GMAIL_APP_PASSWORD
- ❌ CLOUDINARY_API_SECRET
- ❌ Any API keys or tokens

**Always set in Vercel Dashboard:**
- ✅ Environment Variables section
- ✅ Mark as sensitive
- ✅ Different values for dev/preview/production

### Database Security

**Read-only SQLite:**
- ✅ Safe for public data
- ✅ No risk of unauthorized writes
- ❌ Cannot store user submissions

**Production Database:**
- ✅ Use connection string encryption
- ✅ Enable SSL/TLS
- ✅ Use environment variables
- ✅ Regular backups

## Monitoring

### Vercel Analytics

Already integrated:
- ✅ @vercel/analytics installed
- ✅ Component added to layout
- ✅ Automatic tracking enabled

**View in Dashboard:**
- Vercel → Your Project → Analytics

### Vercel Speed Insights

Already integrated:
- ✅ @vercel/speed-insights installed
- ✅ Component added to layout
- ✅ Automatic performance tracking

**View in Dashboard:**
- Vercel → Your Project → Speed Insights

### Error Tracking

**Vercel Logs:**
```bash
# View production logs
vercel logs --prod

# View specific deployment
vercel logs [deployment-url]
```

## Cost

### Vercel Free Tier

**Included:**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic SSL certificates
- ✅ Global CDN
- ✅ DDoS protection
- ✅ Analytics (basic)
- ✅ Speed Insights (basic)

**Limits:**
- 100 GB bandwidth/month
- 100 GB-hours compute/month
- 6,000 build minutes/month

**Pricing Page:** https://vercel.com/pricing

## Support

### Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Prisma with Vercel**: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- **Vercel Support**: https://vercel.com/support

### Common Links

- **Deployment URL**: https://sharothee-wedding-arvinwedsincia.vercel.app
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Actions**: https://github.com/CodeStorm-Hub/Sharothee-Wedding-arvinwedsincia/actions

## Summary

✅ **Current Setup:**
- SQLite database included (read-only)
- Vercel Analytics enabled
- Vercel Speed Insights enabled
- Manual-trigger workflows
- GitHub Actions deployment

⚠️ **For Production with Write Access:**
- Migrate to Vercel Postgres or Turso
- Update Prisma schema
- Run database migrations
- Test RSVP and contact forms

---

**Last Updated**: October 12, 2025
**Status**: ✅ Ready for Read-Only Deployment
**Recommendation**: Migrate to Vercel Postgres for full functionality
