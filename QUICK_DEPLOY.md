# Quick Deployment Guide - GitHub Pages

## 🚀 Quick Start (3 Steps)

### 1. Get Web3Forms Key (2 minutes)
1. Visit https://web3forms.com
2. Sign up with **codestromhub@gmail.com**
3. Copy your access key

### 2. Add to GitHub (1 minute)
1. Go to repository Settings > Secrets and variables > Actions
2. New secret: `NEXT_PUBLIC_WEB3FORMS_KEY`
3. Paste your Web3Forms key
4. Save

### 3. Deploy (automatic)
```bash
git push origin main
```

Wait 2-3 minutes, then visit:
**https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/**

## ✅ What's Included

- 💒 Beautiful wedding website
- 📧 Working RSVP form (from: codestromhub@gmail.com, cc: arvincia@sparrow-group.com)
- 📧 Working Contact form (from: codestromhub@gmail.com, cc: arvincia@sparrow-group.com)
- 🖼️ All images loading correctly
- 📱 Mobile responsive
- 🆓 Free hosting

## 🔧 Technical Details

### Architecture
- **Frontend:** Next.js 15 static export
- **Hosting:** GitHub Pages
- **Forms:** Web3Forms API (serverless)
- **Images:** basePath-aware asset loading

### Key Files Changed
- `client/next.config.ts` - GitHub Pages configuration
- `client/src/lib/serverless-forms.ts` - Form submission handler
- `client/src/lib/utils.ts` - Asset path helper
- `client/src/app/rsvp/page.tsx` - RSVP form
- `client/src/app/contact/page.tsx` - Contact form
- `client/src/app/page.tsx` - Homepage with fixed image paths
- `client/src/app/events/page.tsx` - Events page
- `.github/workflows/nextjs.yml` - Deployment workflow

### How Forms Work

**GitHub Pages Mode (Static):**
```
User fills form → Client-side validation → 
Web3Forms API → Email to arvincia@sparrow-group.com
```

**Server Mode (VPS/Vercel):**
```
User fills form → Next.js API route → 
Database save + Email notification
```

The code automatically detects the environment and uses the appropriate method.

## 📝 Testing Checklist

After deployment, verify:

- [ ] Homepage loads
- [ ] All navigation links work
- [ ] Images display (hero, story timeline, gallery)
- [ ] RSVP page accessible
- [ ] Contact page accessible
- [ ] Fill and submit RSVP form
- [ ] Fill and submit Contact form
- [ ] Check email at arvincia@sparrow-group.com

## 🐛 Common Issues

### Images 404
**Fix:** Wait 2-3 minutes for cache. Still broken? Check `assetUrl()` usage.

### Forms not working
**Fix:** Verify `NEXT_PUBLIC_WEB3FORMS_KEY` secret is set correctly.

### Build fails
**Fix:** Check GitHub Actions logs. Common: missing environment variables.

### Page 404 on refresh
**Fix:** Already handled with `trailingSlash: true` in config.

## 🔄 Updating the Site

```bash
# 1. Make changes
nano client/src/app/page.tsx

# 2. Test locally
cd client
npm run dev

# 3. Build and test static export
GITHUB_PAGES=true npm run build:static

# 4. Deploy
git add .
git commit -m "Update content"
git push origin main

# 5. Wait 2-3 minutes for GitHub Actions to complete
```

## 📧 Email Configuration

**Primary recipient:** arvincia@sparrow-group.com

**To change email:**
Edit `client/src/lib/serverless-forms.ts`:
```typescript
formData.append('to_email', 'your-new-email@domain.com');
```

## 📊 Monitoring

### Check Deployment Status
- GitHub → Actions tab → Latest workflow run

### View Logs
- GitHub → Actions → Select workflow → View logs

### Test Forms
- Visit site → Submit test form → Check email

## 🎯 Performance

- **Build time:** ~30 seconds
- **Deploy time:** ~2-3 minutes total
- **Page load:** <2 seconds (static)
- **Form submission:** <5 seconds (Web3Forms)

## 📚 Documentation

- **Full Guide:** `GITHUB_PAGES_SETUP.md`
- **Original Docs:** `GITHUB_PAGES_DEPLOYMENT.md`
- **VPS Deployment:** `HOSTINGER_VPS_DEPLOYMENT_PLAN.md`

## 💡 Pro Tips

1. **Test locally first** with `GITHUB_PAGES=true npm run build:static`
2. **Keep Web3Forms key secret** - don't commit to code
3. **Monitor email delivery** - check spam folder initially
4. **Update dependencies monthly** for security
5. **Use meaningful commit messages** for easy rollback

## 🎉 Success Indicators

✅ Green checkmark in GitHub Actions
✅ Site accessible at GitHub Pages URL
✅ All images visible
✅ Forms submit successfully
✅ Emails arrive at arvincia@sparrow-group.com

## 🆘 Need Help?

**Developer Contact:**
- Email: codestromhub@gmail.com
- For form issues: Check Web3Forms dashboard
- For deployment: Check GitHub Actions logs

**Quick Debug:**
```bash
# Check build locally
cd client
GITHUB_PAGES=true npm run build:static

# Check for errors
npm run lint
npm run type-check

# Test in browser
cd out
python3 -m http.server 8000
# Visit: http://localhost:8000/Sharothee-Wedding-arvinwedsincia/
```

---

**Last Updated:** October 2025
**Status:** ✅ Production Ready
**Live URL:** https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/
