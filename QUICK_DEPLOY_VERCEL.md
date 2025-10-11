# 🚀 Quick Deploy to Vercel - Full-Stack Wedding Website

Deploy your complete Next.js wedding website with database, API routes, and authentication in 12 minutes.

## ✅ What You Get

- **Full-Stack Next.js App** with all features working
- **SQLite Database** for storing RSVP and guest data
- **API Routes** for form submissions and data management
- **Admin Dashboard** with authentication
- **Email Notifications** for forms
- **GitHub Actions** build on Ubuntu runners
- **Vercel Hosting** (free tier, no credit card)

## ⚡ Quick Setup (12 Minutes)

### 1. Create Vercel Account (2 min)

```bash
# Go to https://vercel.com
# Click "Sign Up" with GitHub
# Authorize Vercel
```

### 2. Import Project (3 min)

In Vercel:
1. Click "Add New..." → "Project"
2. Select: `Sharothee-Wedding-arvinwedsincia`
3. Configure:
   - Root Directory: `client`
   - Framework: Next.js
4. Add environment variables (see below)
5. Skip first deploy

**Required Environment Variables:**
```env
DATABASE_URL=file:./prisma/prod.db
NEXTAUTH_SECRET=<random-32-char-string>
NEXTAUTH_URL=https://your-project.vercel.app
ADMIN_EMAIL=admin@wedding.com
ADMIN_PASSWORD=<your-password>
GMAIL_USER=codestromhub@gmail.com
GMAIL_APP_PASSWORD=<gmail-app-password>
```

### 3. Get Vercel Credentials (2 min)

```bash
# Get Token: https://vercel.com/account/tokens
# Create token named "GitHub Actions"
# Copy: VERCEL_TOKEN

# Get IDs from Vercel dashboard:
# VERCEL_ORG_ID (from account settings)
# VERCEL_PROJECT_ID (from project settings)
```

### 4. Add GitHub Secrets (2 min)

In GitHub repo → Settings → Secrets → Actions:

```
VERCEL_TOKEN = <your-token>
VERCEL_ORG_ID = <your-org-id>
VERCEL_PROJECT_ID = <your-project-id>
```

### 5. Deploy! (3 min)

```bash
# Option A: Push to main
git push origin main

# Option B: Manual trigger
# Go to Actions → "Deploy Full-Stack App to Vercel" → Run workflow
```

**Done!** Visit `https://your-project.vercel.app` in 3 minutes.

## 🧪 Test Your Deployment

### Quick Tests

```bash
# Homepage
curl https://your-project.vercel.app

# RSVP page
curl https://your-project.vercel.app/rsvp

# Health check
curl https://your-project.vercel.app/api/health
```

### Manual Testing

1. **RSVP Form** (`/rsvp`):
   - Fill form → Submit → Check email

2. **Contact Form** (`/contact`):
   - Send message → Check email

3. **Admin Login** (`/admin/login`):
   - Login with `ADMIN_EMAIL` and `ADMIN_PASSWORD`
   - Access dashboard
   - View guest list

4. **Images**:
   - Gallery page → All images load
   - Event pages → Images display

## 📊 Features Working

✅ **All 7 Public Pages**
- Homepage, Events, RSVP, Contact, Gallery, Live, Travel

✅ **All 12 Admin Pages**
- Dashboard, Guests, Events, Media, etc.

✅ **All 18 API Routes**
- Forms, Authentication, Database operations

✅ **SQLite Database**
- Guest data, RSVP submissions, Events

✅ **Email Notifications**
- RSVP confirmations, Contact messages

✅ **Authentication**
- Admin login with NextAuth

## 🔧 Troubleshooting

**Build fails?**
```bash
# Check Vercel environment variables are set
# Verify DATABASE_URL, NEXTAUTH_SECRET, etc.
```

**Forms not working?**
```bash
# Check Gmail App Password is correct
# Verify GMAIL_USER and GMAIL_APP_PASSWORD
```

**Database errors?**
```bash
# Database creates on first use
# Check Vercel logs: vercel logs --prod
```

## 📚 Full Documentation

- Complete Guide: [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)
- GitHub Pages (Static): [QUICK_DEPLOY_GITHUB_PAGES.md](QUICK_DEPLOY_GITHUB_PAGES.md)
- Testing Guide: [TESTING_GUIDE.md](TESTING_GUIDE.md)

## 💰 Cost

**Vercel Free Tier:**
- ✅ Free forever
- ✅ No credit card required
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic SSL
- ✅ Global CDN

## 🎉 You're Live!

Your full-stack wedding website is now deployed with:
- ✅ Working database
- ✅ Working forms with email
- ✅ Admin dashboard
- ✅ All images
- ✅ Mobile responsive
- ✅ Automatic deployments

**Live URL**: `https://your-project.vercel.app`

---

**Setup Time**: 12 minutes
**Platform**: Vercel (Free)
**Build**: GitHub Actions (Ubuntu)
**Database**: SQLite
**Status**: ✅ Production Ready
