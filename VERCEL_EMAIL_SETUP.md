# Vercel Deployment - Gmail Email Configuration Guide

## 🚨 Current Issue: Gmail Authentication Failed

The forms are working correctly, but emails are not being sent because Gmail credentials are not configured in Vercel.

**Error in Vercel logs:**
```
Invalid login: 535-5.7.8 Username and Password not accepted
```

This means `GMAIL_USER` and `GMAIL_APP_PASSWORD` environment variables are either:
- Not set in Vercel
- Set incorrectly  
- Using an invalid Gmail App Password

---

## ✅ Solution: Configure Gmail in Vercel (5 minutes)

### Step 1: Generate Gmail App Password

You need a **Gmail App Password** (not your regular Gmail password).

1. **Enable 2-Factor Authentication**:
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification" if not already enabled

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" → Enter "Wedding Website Vercel"
   - Click "Generate"
   - **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)
   - **Remove all spaces**: `abcdefghijklmnop`

### Step 2: Add Environment Variables in Vercel

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables for **Production** environment:

| Variable Name | Value |
|--------------|-------|
| `GMAIL_USER` | `codestromhub@gmail.com` |
| `GMAIL_APP_PASSWORD` | `abcdefghijklmnop` (your 16-char password, no spaces) |
| `GMAIL_FROM` | `Incia & Arvin Wedding <arvincia@sparrow-group.com>` |

5. Click **Save** for each variable

### Step 3: Redeploy

After adding environment variables, redeploy:

**Option A: Via Vercel Dashboard**
1. Go to "Deployments" tab
2. Click "..." on latest deployment → "Redeploy"

**Option B: Push to trigger deployment**
```bash
git commit --allow-empty -m "Trigger redeploy with Gmail credentials"
git push
```

### Step 4: Verify It Works

1. **Check Vercel Function Logs**:
   - Go to Deployments → Latest → Functions
   - Look for: `✅ [email] sent`

2. **Test the form**:
   - Visit your Vercel site
   - Submit contact form
   - Check emails at:
     - codestromhub@gmail.com
     - arvincia@sparrow-group.com

---

## 🔍 Troubleshooting

### Still getting "Invalid login" error?

**Common causes:**
1. App Password has spaces (remove ALL spaces)
2. Using regular Gmail password instead of App Password
3. 2FA not enabled on Gmail
4. Wrong Gmail account used
5. Environment variables not saved properly

**Fix:**
1. Generate a **new** App Password
2. Remove ALL spaces from password
3. Update `GMAIL_APP_PASSWORD` in Vercel
4. Make sure you selected "Production" environment
5. Redeploy

### Emails still not sending?

**Check Vercel Function Logs** (this tells you exactly what's wrong):

| Log Message | Meaning | Solution |
|------------|---------|----------|
| `⚠️ GMAIL_USER or GMAIL_APP_PASSWORD is not set` | Env vars missing | Add them in Vercel Settings |
| `🔑 Gmail authentication failed` | Invalid credentials | Generate new App Password |
| `❌ Email error` | SMTP connection issue | Check Gmail account, 2FA enabled |
| `✅ [email] sent` | Success! | Emails should arrive |

### Database warnings (expected on Vercel)

You'll see warnings like:
```
Database save failed (expected in serverless), continuing with email
```

**This is normal!** SQLite doesn't work on Vercel (read-only file system). The code handles this gracefully:
- Database save is attempted but fails (expected)
- Email sending continues (this is what matters)
- User gets success message
- Forms work perfectly

---

## 📧 How Email System Works

```
User submits form
    ↓
Vercel Serverless Function
    ↓
Try to save to database (fails on Vercel, that's OK)
    ↓
Send emails via Gmail SMTP
    ✓ To: arvincia@sparrow-group.com (primary)
    ✓ To: codestromhub@gmail.com (backup)  
    ✓ Confirmation to user's email
    ↓
Return success to user
```

**Key points:**
- Email sending is the primary functionality
- Database is optional (works on VPS, not on Vercel)
- Users always get emails even if database fails

---

## ✅ Success Checklist

- [ ] 2FA enabled on Gmail account
- [ ] Gmail App Password generated (16 characters, no spaces)
- [ ] `GMAIL_USER` added in Vercel (Production)
- [ ] `GMAIL_APP_PASSWORD` added in Vercel (Production)  
- [ ] `GMAIL_FROM` added in Vercel (Production)
- [ ] Redeployed after adding environment variables
- [ ] Tested form submission
- [ ] Checked Vercel Function Logs
- [ ] Received test emails

---

## 🔒 Security Notes

1. **Never commit credentials to git** - Always use Vercel environment variables
2. **Use App Passwords only** - More secure than regular passwords
3. **Rotate periodically** - Generate new App Password every 6 months
4. **Monitor logs** - Check Vercel logs for suspicious activity

---

## 📞 Quick Reference

**Vercel Dashboard:** https://vercel.com/dashboard

**Generate App Password:** https://myaccount.google.com/apppasswords

**Environment Variables to Set:**
```
GMAIL_USER=codestromhub@gmail.com
GMAIL_APP_PASSWORD=your16charpassword  # No spaces!
GMAIL_FROM=Incia & Arvin Wedding <arvincia@sparrow-group.com>
```

**After adding env vars:** Redeploy!

**Check logs:** Deployments → Latest → Functions → Look for ✅ or ❌

---

**Remember:** The forms work on Vercel, but emails won't send until you configure these Gmail credentials!
