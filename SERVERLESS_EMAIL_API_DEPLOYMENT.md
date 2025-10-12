# Serverless Email API Deployment Guide

This guide walks through deploying the serverless email API to Vercel, which enables the static GitHub Pages site to send emails via Gmail SMTP.

## Why a Separate API?

GitHub Pages only serves static HTML/CSS/JavaScript files and cannot execute server-side code. To enable email functionality (contact forms, RSVP submissions) on the static site, we need a separate serverless backend that:

1. Receives form data from the static site via AJAX/fetch
2. Sends emails using Gmail SMTP (via nodemailer)
3. Returns success/error responses

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier is sufficient)
2. **Gmail Account** with App Password:
   - Enable 2-Factor Authentication on your Gmail account
   - Generate an App Password at [Google Account App Passwords](https://myaccount.google.com/apppasswords)
   - Save this password securely (you'll need it for environment variables)

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

## Step 3: Deploy the API

Navigate to the api-serverless directory and deploy:

```bash
cd api-serverless
vercel --prod
```

During deployment, Vercel will ask:

- **Set up and deploy?** → Yes
- **Which scope?** → Select your account/team
- **Link to existing project?** → No (first time) or Yes (subsequent deployments)
- **What's your project's name?** → `wedding-email-api` (or your preferred name)
- **In which directory is your code located?** → `./` (current directory)

Vercel will build and deploy your API. You'll receive a production URL like:
```
https://wedding-email-api.vercel.app
```

## Step 4: Configure Environment Variables

After deployment, add the required environment variables in the Vercel dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project (`wedding-email-api`)
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variables:

### Required Environment Variables

| Variable | Value | Example |
|----------|-------|---------|
| `GMAIL_USER` | Your Gmail email address | `codestromhub@gmail.com` |
| `GMAIL_APP_PASSWORD` | Gmail App Password (from Prerequisites) | `abcd efgh ijkl mnop` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed domains | `https://codestorm-hub.github.io,http://localhost:3000` |

**Important**: Set these for the **Production** environment.

### Via Vercel CLI (Alternative)

You can also add environment variables via CLI:

```bash
vercel env add GMAIL_USER production
vercel env add GMAIL_APP_PASSWORD production
vercel env add ALLOWED_ORIGINS production
```

## Step 5: Redeploy with Environment Variables

After adding environment variables, redeploy to apply them:

```bash
vercel --prod
```

## Step 6: Test the API

Test the deployed API endpoint:

```bash
curl -X POST https://wedding-email-api.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -H "Origin: https://codestorm-hub.github.io" \
  -d '{
    "formType": "Contact",
    "data": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+1234567890",
      "subject": "Test Subject",
      "message": "This is a test message from the API deployment"
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Contact submitted successfully! We'll get back to you soon.",
  "messageId": "..."
}
```

Check your Gmail inbox (codestromhub@gmail.com and arvincia@sparrow-group.com) for the test email.

## Step 7: Add API URL to GitHub Secrets

Now that your API is deployed, add its URL to GitHub repository secrets:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:
   - **Name**: `EMAIL_API_URL`
   - **Value**: `https://wedding-email-api.vercel.app/api/send-email` (use your actual Vercel URL)
5. Click **Add secret**

## Step 8: Trigger GitHub Pages Deployment

After adding the secret, trigger a new GitHub Pages deployment:

1. Go to **Actions** tab in your repository
2. Select **Deploy Next.js site to Pages** workflow
3. Click **Run workflow** → **Run workflow**

The static site will now be deployed with the email API URL configured.

## Verifying the Integration

After GitHub Pages deployment completes:

1. Visit your GitHub Pages site: `https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/`
2. Navigate to the Contact page
3. Fill out and submit the contact form
4. Check the email recipients for the submission

## Updating the API

To update the API after making changes:

```bash
cd api-serverless
vercel --prod
```

No need to update GitHub secrets unless the API URL changes.

## Monitoring and Logs

View API logs and metrics:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Deployments** → Select latest deployment
4. Click **View Function Logs**

You can see:
- Request/response logs
- Error messages
- Performance metrics

## Troubleshooting

### API Returns 500 Error

**Cause**: Missing or incorrect environment variables

**Solution**:
1. Check Vercel dashboard → Settings → Environment Variables
2. Ensure `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set correctly
3. Redeploy: `vercel --prod`

### CORS Error in Browser

**Cause**: GitHub Pages URL not in `ALLOWED_ORIGINS`

**Solution**:
1. Update `ALLOWED_ORIGINS` in Vercel dashboard
2. Include your GitHub Pages URL: `https://codestorm-hub.github.io`
3. Redeploy: `vercel --prod`

### Email Not Sending

**Cause**: Invalid Gmail credentials or App Password

**Solution**:
1. Verify 2FA is enabled on Gmail account
2. Regenerate App Password at [Google Account](https://myaccount.google.com/apppasswords)
3. Update `GMAIL_APP_PASSWORD` in Vercel dashboard
4. Redeploy: `vercel --prod`

### Form Submission Times Out

**Cause**: API URL not configured in GitHub secrets

**Solution**:
1. Verify `EMAIL_API_URL` secret exists in GitHub repository
2. Check the URL matches your Vercel deployment
3. Retrigger GitHub Pages deployment

## Cost

Vercel's free tier includes:
- 100 GB bandwidth per month
- Unlimited deployments
- Automatic HTTPS
- Sufficient for most wedding websites

The serverless email API should stay well within free tier limits.

## Security

- **App Passwords**: More secure than regular Gmail passwords
- **CORS Protection**: Only allowed domains can call the API
- **Environment Variables**: Securely stored in Vercel (encrypted)
- **HTTPS**: All traffic encrypted

## Support

For issues or questions:
- Email: codestromhub@gmail.com
- Repository: https://github.com/CodeStorm-Hub/Sharothee-Wedding-arvinwedsincia
- Vercel Documentation: https://vercel.com/docs

## Next Steps

After completing this deployment:

1. ✅ API deployed to Vercel
2. ✅ Environment variables configured
3. ✅ API URL added to GitHub secrets
4. ✅ GitHub Pages site updated
5. ✅ Email functionality tested

Your static GitHub Pages site now has full email functionality! 🎉
