# GitHub Actions Deployment Guide

This guide explains how to deploy the wedding website to GitHub Pages using GitHub Actions with fully functional form submissions and image loading.

## 🎯 Overview

The website is deployed as a static Next.js application to GitHub Pages with:
- ✅ All public-facing pages (Home, Events, Gallery, Live, Travel, Contact, RSVP)
- ✅ Working contact and RSVP forms (using Web3Forms API)
- ✅ All images and static assets
- ✅ Responsive design
- ✅ Mobile-friendly interface

## 📋 Prerequisites

Before deploying, you need to:

1. **GitHub Repository Access**: Admin access to configure repository settings
2. **Web3Forms Account**: Free account for form submissions (https://web3forms.com)

## 🔑 Step 1: Set Up Web3Forms

Web3Forms is a free service that enables form submissions without a backend server.

### Create a Web3Forms Account

1. Go to [https://web3forms.com](https://web3forms.com)
2. Click "Get Started for Free"
3. Sign up with your email (GitHub login also available)
4. Verify your email address

### Get Your Access Key

1. Log in to your Web3Forms dashboard
2. Click "Create New Form"
3. Enter form name: "Wedding Website Contact Form"
4. Set email to receive submissions: `codestromhub@gmail.com` and `arvincia@sparrow-group.com`
5. Copy the **Access Key** (looks like: `abc123def-4567-89ab-cdef-0123456789ab`)

### Features (Free Tier)

- ✅ Unlimited form submissions
- ✅ Email notifications
- ✅ Spam protection with reCAPTCHA
- ✅ File uploads (up to 5MB)
- ✅ Custom email templates
- ✅ No branding required

## 🔧 Step 2: Configure GitHub Repository

### Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **GitHub Actions**
4. Click **Save**

### Add Web3Forms Secret

1. In your repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `WEB3FORMS_ACCESS_KEY`
4. Value: Paste your Web3Forms access key from Step 1
5. Click **Add secret**

### Verify Workflow Permissions

1. Go to **Settings** → **Actions** → **General**
2. Scroll to "Workflow permissions"
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

## 🚀 Step 3: Deploy the Website

### Automatic Deployment

The website automatically deploys when you push to the `main` branch:

```bash
# Make any changes to your code
git add .
git commit -m "Update website content"
git push origin main
```

The GitHub Actions workflow will:
1. ✅ Install dependencies
2. ✅ Generate Prisma client
3. ✅ Create environment file with Web3Forms key
4. ✅ Build static site (removing API routes and admin pages)
5. ✅ Export to `out` directory
6. ✅ Deploy to GitHub Pages

### Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab in your repository
2. Select "Deploy Next.js site to Pages" workflow
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow** button

## 📊 Step 4: Monitor Deployment

### Check Build Status

1. Go to **Actions** tab
2. Click on the latest workflow run
3. Monitor the build and deploy jobs
4. Check for any errors (shown in red)

### Build Time

- **Expected duration**: 2-4 minutes
- **Steps**: Install dependencies → Build → Deploy

### Common Issues

**Build Failed**
- Check that all dependencies are in `package.json`
- Verify `WEB3FORMS_ACCESS_KEY` secret is set
- Review error logs in Actions tab

**Deployment Failed**
- Ensure GitHub Pages is enabled
- Check workflow permissions are set correctly
- Verify Pages source is "GitHub Actions"

## 🌐 Step 5: Access Your Website

### Live URL

After successful deployment, your website will be available at:

```
https://<username>.github.io/<repository-name>/
```

Example:
```
https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/
```

### DNS Propagation

- **Initial deployment**: 2-5 minutes
- **Subsequent deployments**: 30-60 seconds
- **Cache clearing**: May take up to 10 minutes

### Force Cache Refresh

If you don't see changes:
1. Press `Ctrl + Shift + R` (Windows/Linux)
2. Press `Cmd + Shift + R` (Mac)
3. Or open in incognito/private mode

## ✅ Step 6: Test Form Submissions

### Test Contact Form

1. Go to `/contact` page
2. Fill out the form:
   - Name: Test User
   - Email: your-email@example.com
   - Subject: General Questions
   - Message: This is a test message
3. Click "Send Message"
4. You should see: "Thank You! Please send your message directly to our email..."

### Test RSVP Form

1. Go to `/rsvp` page
2. Fill out the form:
   - Full Name: Test Guest
   - Will attend: Yes
   - Family: Bride's Family
   - Guest count: 2
   - Email: your-email@example.com
3. Click "Submit RSVP"
4. You should see: "Thank You! Your RSVP has been received..."

### Check Email Notifications

- Check the email addresses configured in Web3Forms
- Should receive notification with form details
- Verify submitter's email is included in the message

## 🖼️ Step 7: Verify Images

### Check Image Loading

1. Visit homepage (`/`)
2. Verify love story images load correctly
3. Go to `/gallery` page
4. Confirm all gallery images display
5. Check `/events` page event images
6. Test on mobile devices

### Image Optimization

All images are served unoptimized from the static export:
- Located in: `public/images/`
- Served from: `out/images/`
- Format: Original (JPEG, PNG)

## 🔍 Step 8: Testing Checklist

### Page Functionality

- [ ] Homepage loads with hero section
- [ ] Navigation menu works on all pages
- [ ] Footer displays correctly
- [ ] All links are working
- [ ] Images load properly

### Forms

- [ ] Contact form submits successfully
- [ ] RSVP form submits successfully
- [ ] Form validation works (required fields)
- [ ] Success messages display
- [ ] Email notifications received

### Responsive Design

- [ ] Mobile view (320px - 480px)
- [ ] Tablet view (481px - 768px)
- [ ] Desktop view (769px+)
- [ ] Touch targets are at least 48x48px

### Performance

- [ ] Pages load in under 3 seconds
- [ ] Images are optimized for web
- [ ] No console errors in browser

## 🛠️ Troubleshooting

### Forms Not Submitting

**Issue**: Form shows error message

**Solutions**:
1. Verify `WEB3FORMS_ACCESS_KEY` secret is set correctly
2. Check Web3Forms dashboard for any issues
3. Ensure email addresses in `serverless-forms.ts` are correct
4. Test with a different email address

**Check Code**:
```typescript
// client/src/lib/serverless-forms.ts
const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY_HERE';
```

### Images Not Loading

**Issue**: Images show broken icon

**Solutions**:
1. Verify images exist in `client/public/images/`
2. Check image paths in code (should be `/images/...`)
3. Ensure `basePath` is configured correctly in `next.config.ts`
4. Check browser console for 404 errors

**Image Path Example**:
```tsx
// Correct for GitHub Pages
<img src="/Sharothee-Wedding-arvinwedsincia/images/gallery/photo.jpg" />

// Better approach (Next.js handles basePath)
<img src="/images/gallery/photo.jpg" />
```

### 404 Errors

**Issue**: Pages return 404

**Solutions**:
1. Ensure `.nojekyll` file exists in `out` directory
2. Check that basePath is set in `next.config.ts`
3. Verify GitHub Pages source is "GitHub Actions"
4. Wait 2-3 minutes for deployment to propagate

### Build Errors

**Issue**: Workflow fails during build

**Solutions**:
1. Check Node.js version (should be 20+)
2. Verify all dependencies are installed
3. Run build locally: `npm run build:static`
4. Check for TypeScript errors: `npm run type-check`
5. Review workflow logs in Actions tab

## 🎨 Customization

### Update Email Recipients

Edit `client/src/lib/serverless-forms.ts`:

```typescript
// Line 154-161
formData.append('email', 'your-primary-email@example.com');
formData.append('from_email', 'your-primary-email@example.com');
formData.append('cc', 'your-secondary-email@example.com');
```

### Update Web3Forms Settings

1. Log in to Web3Forms dashboard
2. Click on your form
3. Update settings:
   - **Email recipients**: Add/remove email addresses
   - **Email template**: Customize notification format
   - **Success page**: Set custom redirect URL
   - **reCAPTCHA**: Enable spam protection

### Modify Deployment Trigger

Edit `.github/workflows/nextjs.yml`:

```yaml
on:
  # Deploy on push to main
  push:
    branches: ["main"]
  
  # Deploy on pull request to main
  pull_request:
    branches: ["main"]
  
  # Manual deployment
  workflow_dispatch:
```

## 📈 Advanced Configuration

### Custom Domain

To use a custom domain:

1. Add `CNAME` file to `client/public/`:
   ```
   yourdomain.com
   ```

2. Update DNS records:
   ```
   Type: CNAME
   Name: www
   Value: <username>.github.io
   ```

3. Configure in GitHub:
   - Go to Settings → Pages
   - Enter custom domain
   - Enable "Enforce HTTPS"

4. Update `next.config.ts`:
   ```typescript
   const basePath = isGitHubPages ? '' : '';
   ```

### Analytics Integration

Add Google Analytics to `client/src/app/layout.tsx`:

```tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## 📞 Support

### Need Help?

- **Email**: codestromhub@gmail.com
- **GitHub Issues**: Create an issue in the repository
- **Documentation**: See `GITHUB_PAGES_DEPLOYMENT.md` for more details

### Useful Links

- **Web3Forms Documentation**: https://docs.web3forms.com
- **Next.js Static Export**: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- **GitHub Pages**: https://docs.github.com/pages
- **GitHub Actions**: https://docs.github.com/actions

## 🎉 Success!

If you've completed all steps, your wedding website should be:

✅ Live on GitHub Pages
✅ Forms working with email notifications
✅ Images loading correctly
✅ Mobile responsive
✅ Ready for guests to RSVP!

Congratulations on deploying your wedding website! 💍✨
