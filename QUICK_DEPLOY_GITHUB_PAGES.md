# Quick Deploy to GitHub Pages - 5 Minutes Setup 🚀

This guide will get your wedding website live on GitHub Pages in 5 minutes with working forms and images.

## ⚡ Quick Steps

### 1️⃣ Get Web3Forms API Key (2 minutes)

1. Go to **[https://web3forms.com](https://web3forms.com)**
2. Click **"Get Started for Free"**
3. Sign up with your email or GitHub
4. Create a new form, set email to: `codestromhub@gmail.com`
5. **Copy your Access Key** (you'll need this in step 2)

### 2️⃣ Configure GitHub Repository (2 minutes)

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Name: `WEB3FORMS_ACCESS_KEY`
4. Value: Paste your Web3Forms access key
5. Click **"Add secret"**

Now go to **Settings** → **Pages**:
1. Under "Source", select **"GitHub Actions"**
2. Click **"Save"**

### 3️⃣ Deploy (1 minute)

#### Option A: Automatic (Recommended)
Just push to main branch:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

#### Option B: Manual
1. Go to **Actions** tab
2. Click **"Deploy Next.js site to Pages"**
3. Click **"Run workflow"** → Select `main` → Click **"Run workflow"**

### 4️⃣ Access Your Website

Your site will be live at:
```
https://<username>.github.io/<repository-name>/
```

Example:
```
https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/
```

Wait 2-3 minutes for deployment to complete.

## ✅ Test Checklist

- [ ] Homepage loads
- [ ] All images display
- [ ] Contact form submits
- [ ] RSVP form submits
- [ ] Email notifications received
- [ ] Mobile responsive

## 🆘 Troubleshooting

**Forms not working?**
- Check that `WEB3FORMS_ACCESS_KEY` secret is set
- Verify Web3Forms account is active

**Images not loading?**
- Wait 2-3 minutes for deployment
- Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

**Build failed?**
- Check Actions tab for error logs
- Ensure all secrets are configured

## 📚 Full Documentation

For detailed setup and troubleshooting, see:
- **[GITHUB_ACTIONS_DEPLOYMENT_GUIDE.md](GITHUB_ACTIONS_DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[GITHUB_PAGES_DEPLOYMENT.md](GITHUB_PAGES_DEPLOYMENT.md)** - Technical details

## 🎉 Done!

Your wedding website is now live with:
- ✅ Working contact & RSVP forms
- ✅ All images and galleries
- ✅ Mobile-friendly design
- ✅ Email notifications

Enjoy! 💍✨
