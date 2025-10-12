# GitHub Secrets Setup for Email Functionality

This document explains how to configure GitHub Secrets for the wedding website's email functionality when deployed to GitHub Pages.

## Overview

The wedding website uses Gmail (via Nodemailer) to send emails for:
- Contact form submissions
- RSVP confirmations
- Admin notifications

For security, email credentials are stored as **GitHub Secrets** rather than hardcoded in the repository.

## Required Secrets

### 1. GMAIL_USER
**Description**: Your Gmail email address used for sending emails.

**Example**: `wedding@example.com` or `your-email@gmail.com`

**How to get it**: Use any Gmail account you have access to.

---

### 2. GMAIL_APP_PASSWORD
**Description**: Gmail App Password (NOT your regular Gmail password).

**Important**: This is NOT your regular Gmail password. You must generate a special "App Password" from Google.

**How to get it**:
1. **Enable 2-Factor Authentication** on your Google Account (required)
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**:
   - Go to [Google Account App Passwords](https://myaccount.google.com/apppasswords)
   - Select app: "Mail" or "Other (Custom name)" → "Wedding Website"
   - Click "Generate"
   - Copy the 16-character password (remove spaces)

**Example**: `abcd efgh ijkl mnop` (use as: `abcdefghijklmnop`)

---

### 3. GMAIL_FROM
**Description**: Display name and email shown in sent emails.

**Format**: `"Display Name <email@domain.com>"`

**Examples**:
- `"Wedding <wedding@example.com>"`
- `"Incia & Arvin <arvincia@sparrow-group.com>"`
- Just email: `"your-email@gmail.com"`

**Note**: The email part should match your GMAIL_USER or be a verified sending address.

---

### 4. TEST_EMAIL_TO
**Description**: Email address to receive test emails and notifications.

**Example**: `admin@example.com` or `arvincia@sparrow-group.com`

**Purpose**: Used for testing email functionality and receiving form submissions.

---

### 5. WEB3FORMS_ACCESS_KEY
**Description**: API key for Web3Forms contact form service.

**How to get it**:
1. Go to [https://web3forms.com](https://web3forms.com)
2. Sign up for free
3. Create a new form
4. Copy the Access Key

**Note**: This secret may already be configured in your repository.

---

## How to Add Secrets to GitHub

### Step-by-Step Guide

1. **Navigate to Repository Settings**
   - Go to your GitHub repository
   - Click **Settings** tab
   - In the left sidebar, click **Secrets and variables** → **Actions**

2. **Add Each Secret**
   - Click **New repository secret** button
   - Enter the secret name (exactly as shown above, case-sensitive):
     - `GMAIL_USER`
     - `GMAIL_APP_PASSWORD`
     - `GMAIL_FROM`
     - `TEST_EMAIL_TO`
     - `WEB3FORMS_ACCESS_KEY`
   - Paste the corresponding value
   - Click **Add secret**

3. **Verify Secrets**
   - You should see all 5 secrets listed
   - Secret values are encrypted and hidden (you can't view them after creation)
   - You can update or delete secrets if needed

### Screenshot Guide

```
Repository Settings → Secrets and variables → Actions → New repository secret
```

After adding all secrets, you should see:
```
✓ GMAIL_USER
✓ GMAIL_APP_PASSWORD
✓ GMAIL_FROM
✓ TEST_EMAIL_TO
✓ WEB3FORMS_ACCESS_KEY
```

---

## Security Best Practices

### ✅ DO:
- Use Gmail App Passwords (not regular passwords)
- Keep secrets confidential
- Use dedicated email accounts for production
- Rotate App Passwords periodically
- Use 2-Factor Authentication on Gmail

### ❌ DON'T:
- Share secrets publicly
- Commit secrets to version control
- Use personal Gmail passwords
- Reuse passwords across services
- Disable 2-Factor Authentication

---

## Testing Email Functionality

After configuring secrets:

1. **Trigger a Deployment**
   ```bash
   git push origin main
   ```

2. **Check Workflow Run**
   - Go to **Actions** tab
   - Watch the "Deploy Next.js site to Pages" workflow
   - Verify it completes successfully

3. **Test Email Sending**
   - Visit your deployed site
   - Submit a contact form
   - Check TEST_EMAIL_TO address for notifications

---

## Troubleshooting

### Workflow Fails with "Missing Gmail credentials"
**Solution**: Verify all secrets are added with exact names (case-sensitive).

### Emails Not Sending
**Possible causes**:
1. Incorrect GMAIL_APP_PASSWORD (must be App Password, not regular password)
2. 2-Factor Authentication not enabled on Gmail
3. GMAIL_USER doesn't match the account that generated the App Password
4. Secrets not configured correctly

**Solution**: 
- Regenerate Gmail App Password
- Double-check secret values (delete and re-add if needed)

### "Sign-in attempt blocked" Email from Google
**Solution**: You're using regular password instead of App Password. Generate an App Password.

### Workflow Shows "Web3Forms key configured: No"
**Solution**: Add WEB3FORMS_ACCESS_KEY secret.

---

## Related Documentation

- **[QUICK_DEPLOY_GITHUB_PAGES.md](QUICK_DEPLOY_GITHUB_PAGES.md)** - Quick deployment guide
- **[GITHUB_PAGES_DEPLOYMENT.md](GITHUB_PAGES_DEPLOYMENT.md)** - Detailed deployment information
- **[.github/workflows/nextjs.yml](.github/workflows/nextjs.yml)** - Workflow file using these secrets

---

## Support

For issues or questions:
- **Email**: codestromhub@gmail.com
- **Phone**: +880 1234-567890
- **Location**: Dhaka, Bangladesh

---

**Last Updated**: October 12, 2025
**Version**: 1.0
