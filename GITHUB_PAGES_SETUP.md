# GitHub Pages Deployment - Complete Guide

## Overview

This guide explains how to deploy the Incia & Arvin Wedding Website to GitHub Pages with **full functionality** including:

- ✅ Static site generation
- ✅ Working RSVP form (via email)
- ✅ Working Contact form (via email)
- ✅ Proper image loading with basePath
- ✅ All pages and navigation

## Understanding the Limitations

**GitHub Pages = Static Hosting Only**

GitHub Pages can only host static files (HTML, CSS, JavaScript). It **cannot** run:
- Server-side code (API routes)
- Databases (SQLite, MySQL, etc.)
- Authentication (NextAuth)
- Server-side rendering

## Our Solution: Hybrid Approach

We've implemented a **hybrid approach** that works in both environments:

### Static Mode (GitHub Pages)
- Forms submit via **Web3Forms** (free email service)
- No database - submissions sent directly to email
- All images use basePath-aware paths
- Client-side validation and processing

### Server Mode (VPS/Vercel/Netlify)
- Forms submit via **Next.js API routes**
- Database storage (SQLite/MySQL)
- Email notifications
- Full authentication and admin panel

The code automatically detects which mode it's running in and adapts accordingly.

## Prerequisites

1. **GitHub Repository** with proper access
2. **Web3Forms Account** (free) - Get your access key from [https://web3forms.com](https://web3forms.com)
3. **GitHub Pages enabled** in repository settings

## Step 1: Get Web3Forms Access Key

### Why Web3Forms?
- Free service (up to 250 submissions/month)
- No backend required
- Works perfectly with static sites
- Reliable email delivery

### Sign Up Process
1. Go to [https://web3forms.com](https://web3forms.com)
2. Click "Create Form"
3. Enter your email (**codestromhub@gmail.com**)
4. Verify your email
5. Copy your **Access Key** (starts with random characters)

### Email Configuration
- **From:** codestromhub@gmail.com
- **To:** User's email (from form submission)
- **CC:** arvincia@sparrow-group.com (receives all form notifications)
- **Subject:** RSVP/Contact Submission - Incia & Arvin's Wedding

### Add to GitHub Secrets
1. Go to your repository on GitHub
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Name: `NEXT_PUBLIC_WEB3FORMS_KEY`
5. Value: Paste your access key
6. Click **Add secret**

## Step 2: Update GitHub Actions Workflow

The workflow file (`.github/workflows/nextjs.yml`) has already been updated with:

```yaml
# In the "Create environment file" step:
NEXT_PUBLIC_WEB3FORMS_KEY="${{ secrets.NEXT_PUBLIC_WEB3FORMS_KEY }}"

# In the "Build with Next.js" step:
env:
  GITHUB_PAGES: "true"
```

If you haven't added the secret yet, the forms will still work - they'll show a success message with manual contact instructions.

## Step 3: Deploy to GitHub Pages

### Automatic Deployment (Recommended)

1. **Push to Main Branch:**
   ```bash
   git push origin main
   ```

2. **Monitor Deployment:**
   - Go to **Actions** tab in GitHub
   - Watch "Deploy Next.js site to Pages" workflow
   - Wait for completion (~2-3 minutes)

3. **Access Your Site:**
   ```
   https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/
   ```

### Manual Deployment

1. Go to **Actions** tab
2. Select "Deploy Next.js site to Pages"
3. Click **Run workflow**
4. Select branch (main)
5. Click **Run workflow**

## Step 4: Verify Deployment

### Check List

- [ ] Site loads at GitHub Pages URL
- [ ] All images display correctly
- [ ] Navigation links work
- [ ] RSVP page loads
- [ ] Contact page loads
- [ ] Forms show proper validation
- [ ] Form submission shows success message
- [ ] Email arrives at arvincia@sparrow-group.com

### Test RSVP Form

1. Navigate to `/rsvp/`
2. Fill in all required fields
3. Submit the form
4. Verify success message appears
5. Check email at arvincia@sparrow-group.com

### Test Contact Form

1. Navigate to `/contact/`
2. Fill in name, email, subject, message
3. Submit the form
4. Verify success message
5. Check email at arvincia@sparrow-group.com

## Troubleshooting

### Images Not Loading

**Symptom:** 404 errors for images

**Solution:**
1. Check browser console for errors
2. Verify image paths use `assetUrl()` helper
3. Check that basePath is set correctly in `next.config.ts`
4. Wait 2-3 minutes for GitHub Pages cache to update

### Forms Not Sending Emails

**Symptom:** Form submits but no email received

**Possible Causes:**
1. **Web3Forms key not set:**
   - Check GitHub Secrets
   - Verify secret name is exactly `NEXT_PUBLIC_WEB3FORMS_KEY`

2. **Web3Forms rate limit:**
   - Free tier: 250 submissions/month
   - Upgrade if needed

3. **Email in spam folder:**
   - Check spam/junk folder
   - Add web3forms.com to safe senders

4. **Invalid email address:**
   - Verify arvincia@sparrow-group.com is correct
   - Update in `src/lib/serverless-forms.ts` if needed

### Build Failures

**Symptom:** GitHub Actions workflow fails

**Check:**
1. **View logs** in Actions tab
2. **Common issues:**
   - Missing environment variables
   - Prisma client not generated
   - TypeScript errors
   - ESLint warnings

**Fix:**
```bash
# Test build locally
cd client
npm install
GITHUB_PAGES=true npm run build:static

# If successful, push changes
git push origin main
```

### 404 on Page Reload

**Symptom:** Refreshing a page shows 404

**Cause:** GitHub Pages doesn't have SPA routing

**Solution:** Use `trailingSlash: true` in next.config.ts (already configured)

## Configuration Files

### next.config.ts
```typescript
const isGitHubPages = process.env.GITHUB_PAGES === 'true' || 
                      process.env.GITHUB_ACTIONS === 'true';
const basePath = isGitHubPages ? '/Sharothee-Wedding-arvinwedsincia' : '';

export default {
  output: 'export',
  basePath: basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};
```

### Environment Variables

**Required in `.github/workflows/nextjs.yml`:**
```bash
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="wedding-pages-deploy-secret"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_placeholder"
CLOUDINARY_CLOUD_NAME="placeholder"
CLOUDINARY_API_KEY="placeholder"
CLOUDINARY_API_SECRET="placeholder"
NEXT_PUBLIC_WEB3FORMS_KEY="${{ secrets.NEXT_PUBLIC_WEB3FORMS_KEY }}"
```

**GitHub Secrets:**
- `NEXT_PUBLIC_WEB3FORMS_KEY` - Your Web3Forms access key

## Updating the Site

### Making Changes

1. **Edit files locally**
2. **Test locally:**
   ```bash
   cd client
   npm run dev
   ```

3. **Build and test static export:**
   ```bash
   GITHUB_PAGES=true npm run build:static
   cd out
   python3 -m http.server 8000
   ```
   Visit: http://localhost:8000/Sharothee-Wedding-arvinwedsincia/

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update wedding site"
   git push origin main
   ```

5. **Wait for deployment** (2-3 minutes)

## Switching to Full Backend

If you need database storage, authentication, and full API functionality:

### Option 1: Vercel (Recommended for Next.js)
- Free tier available
- Automatic deployments from GitHub
- Full Next.js support including API routes
- See: [Vercel Deployment Guide](https://vercel.com/docs)

### Option 2: Netlify
- Free tier available
- Serverless functions support
- Good for static sites with API
- See: [Netlify Deployment Guide](https://docs.netlify.com)

### Option 3: Hostinger VPS
- Full control
- MySQL database support
- See: `HOSTINGER_VPS_DEPLOYMENT_PLAN.md`

## Maintenance

### Regular Tasks

1. **Monitor form submissions** - Check arvincia@sparrow-group.com
2. **Check GitHub Actions** - Ensure deployments succeed
3. **Update dependencies** - Monthly security updates
4. **Test functionality** - Weekly form tests

### Monthly Checklist

- [ ] Test RSVP form submission
- [ ] Test Contact form submission
- [ ] Verify all images load
- [ ] Check for broken links
- [ ] Review GitHub Actions logs
- [ ] Update npm dependencies if needed

## Support & Contact

**Primary Contact:**
- Email: arvincia@sparrow-group.com
- Developer: codestromhub@gmail.com

**Resources:**
- [Next.js Static Export Docs](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Web3Forms Docs](https://docs.web3forms.com)

## Summary

Your wedding website is now deployed to GitHub Pages with:

✅ **Working Forms** - RSVP and Contact forms send emails via Web3Forms
✅ **Correct Images** - All images load with proper basePath
✅ **Static Export** - Fast, reliable hosting on GitHub
✅ **Automatic Deployment** - Push to main = automatic update
✅ **Mobile Responsive** - Works on all devices
✅ **Free Hosting** - No hosting costs with GitHub Pages

**Live URL:** https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/

Enjoy your beautiful wedding website! 💒💕
