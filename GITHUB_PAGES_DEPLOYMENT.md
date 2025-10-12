# GitHub Pages Deployment Guide

This document explains how the wedding website is deployed to GitHub Pages as a static site.

## Overview

The website is deployed as a static Next.js export to GitHub Pages at:
**https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/**

## Static Export Configuration

### What's Included
- ✅ All public-facing pages (Home, Events, Gallery, Live, Travel)
- ✅ RSVP and Contact pages (with email fallback)
- ✅ SQLite database schema (for development reference)
- ✅ Responsive design and all UI features
- ✅ Static images and assets

### What's Excluded
- ❌ API routes (not supported in static export)
- ❌ Admin pages (require authentication)
- ❌ Server-side functionality (forms, database operations)
- ❌ NextAuth authentication

## Build Process

The static build uses a special process to exclude server-dependent features:

1. **Preparation**: `scripts/prepare-static-build.sh` temporarily moves API and admin directories
2. **Build**: Next.js exports the site to the `out` directory with proper basePath
3. **Restore**: `scripts/restore-after-build.sh` brings back the moved directories

### Build Commands

```bash
# Local build for GitHub Pages
cd client
npm run build:static

# Output directory
# All static files are in ./out/
```

## Configuration Details

### next.config.ts
```typescript
output: 'export',
basePath: '/Sharothee-Wedding-arvinwedsincia',
assetPrefix: '/Sharothee-Wedding-arvinwedsincia',
trailingSlash: true,
images: {
  unoptimized: true,
}
```

### Database
- **Development**: SQLite at `prisma/dev.db`
- **Production (GitHub Pages)**: No database (static content only)
- **For full backend**: Deploy to Hostinger VPS (see `HOSTINGER_VPS_DEPLOYMENT_PLAN.md`)

## GitHub Actions Workflow

The deployment is automated via `.github/workflows/nextjs.yml`:

1. Checkout repository
2. Setup Node.js 20
3. Install dependencies
4. Create environment file with secrets
5. Generate Prisma client
6. Run `npm run build:static`
7. Upload `client/out` directory to GitHub Pages
8. Deploy to GitHub Pages

### Required GitHub Secrets

To enable email functionality and proper builds, configure these repository secrets:

1. **EMAIL_API_URL**: URL of the deployed serverless email API (e.g., `https://wedding-email-api.vercel.app/api/send-email`)
2. **GMAIL_USER**: Gmail email address for sending emails (e.g., `your-email@gmail.com`)
3. **GMAIL_APP_PASSWORD**: Gmail app password (NOT your regular password)
   - Generate at: [Google Account App Passwords](https://myaccount.google.com/apppasswords)
   - Requires 2-Factor Authentication enabled
4. **GMAIL_FROM**: Display name for sent emails (e.g., `"Wedding <email@domain.com>"`)
5. **TEST_EMAIL_TO**: Test recipient email address

#### How to Add Secrets

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each secret with its name and value
4. Secrets are encrypted and not visible after creation

#### Deploying the Serverless Email API

The serverless email API must be deployed to Vercel before the static site can send emails:

1. Navigate to `api-serverless` directory
2. Install Vercel CLI: `npm install -g vercel`
3. Login to Vercel: `vercel login`
4. Deploy: `vercel --prod`
5. Set environment variables in Vercel dashboard:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `ALLOWED_ORIGINS` (include your GitHub Pages URL)
6. Copy the deployment URL and add to GitHub secrets as `EMAIL_API_URL`

See `api-serverless/README.md` for detailed instructions.

## Form Handling in Static Mode

Since API routes don't work in static export, forms use a serverless email API:

### Serverless Email API

A separate Vercel serverless function handles email sending via Gmail SMTP. The static GitHub Pages site calls this API endpoint when forms are submitted.

**Setup**:
1. Deploy the serverless API (see `api-serverless/README.md`)
2. Configure environment variables in Vercel dashboard
3. Add API URL to GitHub repository secrets as `EMAIL_API_URL`

### RSVP Form
- Submits data to serverless email API
- Sends email to wedding organizers via Gmail SMTP
- Stores submission locally in browser for reference
- Full client-side validation

### Contact Form
- Submits data to serverless email API  
- Sends email to wedding organizers via Gmail SMTP
- Stores submission locally in browser for reference
- Full client-side validation

## Local Testing

To test the static build locally:

```bash
cd client

# Build the static site
npm run build:static

# Serve the out directory
cd out
python3 -m http.server 8000

# Visit: http://localhost:8000
# Note: Add basePath manually: http://localhost:8000/Sharothee-Wedding-arvinwedsincia/
```

## Deployment Workflow

### Automatic Deployment
1. Push changes to the `main` branch
2. GitHub Actions workflow runs automatically
3. Site builds and deploys to GitHub Pages
4. Visit: https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/

### Manual Deployment
```bash
# From Actions tab in GitHub
1. Go to "Actions" tab
2. Select "Deploy Next.js site to Pages" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"
```

## Troubleshooting

### 404 Error on GitHub Pages
- Ensure GitHub Pages is enabled in repository settings
- Check that source is set to "GitHub Actions"
- Verify `.nojekyll` file exists in `out` directory
- Wait 2-3 minutes after deployment for changes to propagate

### Build Failures
- Check that `.env.local` file exists with required variables
- Ensure Prisma client is generated: `npx prisma generate`
- Verify all dependencies are installed: `npm install`

### Missing Assets
- Check `next.config.ts` has correct basePath
- Ensure images are in `public/images/` directory
- Verify `.nojekyll` file prevents Jekyll processing

## Migration to Full Server

For full functionality with API routes and authentication:

1. See `HOSTINGER_VPS_DEPLOYMENT_PLAN.md`
2. Use MySQL database instead of SQLite
3. Enable server-side features in `next.config.ts`
4. Deploy to VPS with Node.js runtime

## Support

For issues or questions:
- Email: codestromhub@gmail.com
- Phone: +880 1234-567890
- Location: Dhaka, Bangladesh
