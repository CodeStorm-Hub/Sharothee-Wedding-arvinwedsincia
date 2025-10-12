# Email Functionality Migration - Complete Guide

## Overview

The wedding website has been successfully migrated from Web3Forms to a custom Gmail-based email solution. This provides better control, security, and reliability for form submissions on the GitHub Pages static site.

## What Changed

### Before (Web3Forms)
- Used third-party Web3Forms service
- Required WEB3FORMS_ACCESS_KEY secret
- Limited customization and control
- Dependent on external service availability

### After (Gmail via Serverless API)
- Custom serverless API deployed on Vercel
- Uses Gmail SMTP with App Passwords (more secure)
- Complete control over email content and delivery
- No third-party dependencies for core functionality
- Same Gmail credentials already in use for other parts of the site

## Architecture

```
┌─────────────────────┐
│  GitHub Pages       │
│  (Static Site)      │
│                     │
│  - Contact Form     │
│  - RSVP Form        │
└──────────┬──────────┘
           │
           │ AJAX/fetch POST
           │
           ▼
┌─────────────────────┐
│  Vercel Serverless  │
│  API Function       │
│                     │
│  - CORS handling    │
│  - Email formatting │
│  - Gmail SMTP       │
└──────────┬──────────┘
           │
           │ SMTP (port 465)
           │
           ▼
┌─────────────────────┐
│  Gmail SMTP         │
│                     │
│  Sends to:          │
│  - codestromhub@    │
│    gmail.com        │
│  - arvincia@        │
│    sparrow-group.com│
└─────────────────────┘
```

## Deployment Steps

### Step 1: Deploy Serverless API to Vercel

**Prerequisites:**
- Vercel account (free tier is sufficient)
- Vercel CLI installed (`npm install -g vercel`)
- Gmail App Password (already configured: `rfmltjgaqdtzqhpv`)

**Deployment:**
```bash
cd api-serverless
vercel login  # Authenticate with Vercel
vercel --prod # Deploy to production
```

**Expected Output:**
```
🔍  Inspect: https://vercel.com/your-account/wedding-email-api/xxx
✅  Production: https://wedding-email-api.vercel.app [copied to clipboard]
```

Copy the production URL (e.g., `https://wedding-email-api.vercel.app`)

### Step 2: Configure Vercel Environment Variables

In the Vercel dashboard (https://vercel.com/dashboard):

1. Go to your project → Settings → Environment Variables
2. Add the following for **Production** environment:

| Variable | Value |
|----------|-------|
| `GMAIL_USER` | `codestromhub@gmail.com` |
| `GMAIL_APP_PASSWORD` | `rfmltjgaqdtzqhpv` |
| `ALLOWED_ORIGINS` | `https://codestorm-hub.github.io,http://localhost:3000` |

3. Click "Save"
4. Redeploy: `vercel --prod`

### Step 3: Test the Deployed API

Test using the provided script:
```bash
cd api-serverless
./test-api.sh https://wedding-email-api.vercel.app/api/send-email
```

Or manually with curl:
```bash
curl -X POST https://wedding-email-api.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -H "Origin: https://codestorm-hub.github.io" \
  -d '{
    "formType": "Contact",
    "data": {
      "name": "Test User",
      "email": "test@example.com",
      "subject": "Test",
      "message": "Testing the new email API"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Contact submitted successfully! We'll get back to you soon.",
  "messageId": "..."
}
```

**Verify:** Check emails at:
- codestromhub@gmail.com
- arvincia@sparrow-group.com

### Step 4: Add API URL to GitHub Secrets

1. Go to GitHub repository: https://github.com/CodeStorm-Hub/Sharothee-Wedding-arvinwedsincia
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:
   - **Name:** `EMAIL_API_URL`
   - **Value:** `https://wedding-email-api.vercel.app/api/send-email`
   - (Replace with your actual Vercel URL from Step 1)
5. Click **Add secret**

### Step 5: Remove Old Web3Forms Secret (Optional)

In the same GitHub Secrets page:
1. Find `WEB3FORMS_ACCESS_KEY` (if it exists)
2. Click "Remove" - it's no longer needed

### Step 6: Deploy to GitHub Pages

Trigger a new deployment:

**Option A: Push to main branch**
```bash
git push origin main
```

**Option B: Manual workflow trigger**
1. Go to repository → **Actions** tab
2. Select **Deploy Next.js site to Pages**
3. Click **Run workflow** → **Run workflow**

### Step 7: Test on Production

After deployment completes (2-3 minutes):

1. Visit: https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/
2. Navigate to **Contact** page
3. Fill out and submit the form
4. Verify email received at codestromhub@gmail.com and arvincia@sparrow-group.com

**Test RSVP form:**
1. Navigate to **RSVP** page
2. Fill out and submit
3. Verify email received

## Verification Checklist

- [ ] Vercel API deployed successfully
- [ ] Environment variables configured in Vercel
- [ ] API test via curl returns success
- [ ] Test email received in Gmail inbox
- [ ] GitHub secret `EMAIL_API_URL` added
- [ ] GitHub Pages deployment completed
- [ ] Contact form works on production site
- [ ] RSVP form works on production site
- [ ] Emails received from production submissions

## Troubleshooting

### Issue: API returns 500 error
**Solution:** Check Vercel environment variables are set correctly, redeploy

### Issue: CORS error in browser console
**Solution:** Ensure `ALLOWED_ORIGINS` includes `https://codestorm-hub.github.io`

### Issue: Email not sending
**Solution:** Verify Gmail credentials, check App Password hasn't been revoked

### Issue: Form submission times out
**Solution:** Check `EMAIL_API_URL` secret in GitHub, verify Vercel API is running

### Issue: 404 on API endpoint
**Solution:** Verify the URL includes `/api/send-email` at the end

## Rollback Plan

If issues occur, you can temporarily revert:

1. Re-add `WEB3FORMS_ACCESS_KEY` to GitHub secrets
2. Revert the changes in `client/src/lib/serverless-forms.ts`
3. Redeploy GitHub Pages

However, the new system is more reliable and should work correctly once configured.

## Monitoring

**View API logs:**
1. Vercel dashboard → Your project
2. Deployments → Latest deployment
3. "View Function Logs"

**Check email delivery:**
- Login to codestromhub@gmail.com
- Check "Sent" folder for outgoing emails
- Verify no bounce-backs in inbox

## Cost

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited requests (with fair use)
- More than sufficient for wedding website

**Gmail:**
- No cost for sending emails via SMTP

## Security

✅ **Improvements:**
- Gmail App Passwords (more secure than regular passwords)
- CORS protection (only allowed domains can call API)
- Environment variables encrypted in Vercel
- HTTPS everywhere
- No public API keys (unlike Web3Forms)

## Support

For issues:
- **Email:** codestromhub@gmail.com
- **Repository:** https://github.com/CodeStorm-Hub/Sharothee-Wedding-arvinwedsincia
- **Vercel Docs:** https://vercel.com/docs

## Next Steps

After completing the above steps:

1. Monitor email submissions for a few days
2. Consider adding analytics to track form submissions
3. Set up email alerts for failed submissions (optional)
4. Document the email template customization for future events

## Summary

The migration is complete in the code. You now need to:
1. Deploy the Vercel API (5 minutes)
2. Configure environment variables (2 minutes)
3. Add GitHub secret (1 minute)
4. Trigger GitHub Pages deployment (2 minutes)
5. Test on production (5 minutes)

**Total time:** ~15 minutes

All the code changes are ready - just follow the deployment steps above! 🎉
