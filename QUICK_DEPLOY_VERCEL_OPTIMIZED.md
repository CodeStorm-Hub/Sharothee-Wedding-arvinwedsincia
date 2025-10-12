# Quick Deployment Reference

## 🚀 Deploy to Vercel in 5 Steps

### 1. Set Environment Variables in Vercel Dashboard
```bash
# Required Variables:
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
DATABASE_URL=<your-postgres-url>
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-project.vercel.app
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=<gmail-app-password>
CLOUDINARY_CLOUD_NAME=<optional>
CLOUDINARY_API_KEY=<optional>
CLOUDINARY_API_SECRET=<optional>
```

### 2. Run Pre-Deployment Check
```bash
cd /path/to/project
bash scripts/check-deployment-ready.sh
```

### 3. Import to Vercel
- Go to: https://vercel.com/new
- Import your GitHub repository
- Framework: Next.js
- Root Directory: `client`
- Click "Deploy"

### 4. Configure Database
**Option A: Vercel Postgres (Recommended)**
- Dashboard → Storage → Create Database → Postgres
- Environment variables auto-added
- Run migrations: `npx prisma migrate deploy`

**Option B: External Postgres**
- Add `DATABASE_URL` to environment variables
- Run migrations manually

### 5. Verify Deployment
```bash
# Test homepage
curl https://your-project.vercel.app

# Test API
curl https://your-project.vercel.app/api/health

# Test SEO
curl https://your-project.vercel.app/robots.txt
curl https://your-project.vercel.app/sitemap.xml
```

## 📊 Performance Checklist

After deployment:
- [ ] Run Lighthouse audit (target: 90+ all scores)
- [ ] Check Vercel Speed Insights dashboard
- [ ] Verify Vercel Analytics is tracking
- [ ] Test Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Check all routes load correctly
- [ ] Verify images load in AVIF/WebP formats
- [ ] Test RSVP form submission
- [ ] Test admin login

## 🔍 Monitoring URLs

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Analytics**: https://vercel.com/[your-project]/analytics
- **Speed Insights**: https://vercel.com/[your-project]/speed-insights
- **Deployments**: https://vercel.com/[your-project]/deployments
- **Logs**: https://vercel.com/[your-project]/logs

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `VERCEL_PRODUCTION_GUIDE.md` | Complete deployment walkthrough |
| `SEO_PERFORMANCE_CHECKLIST.md` | Implementation status & checklist |
| `VERCEL_OPTIMIZATIONS_SUMMARY.md` | All optimizations summary |
| `.env.vercel.example` | Environment variable template |

## 🛠️ Useful Commands

```bash
# Local development
cd client
npm install
npm run dev

# Build test
npm run build

# Lint check
npm run lint

# Type check
npm run type-check

# Performance audit
npm run lighthouse

# Deploy with Vercel CLI
npm i -g vercel
vercel --prod
```

## ⚡ Performance Features Enabled

✅ Image Optimization (AVIF/WebP)  
✅ Static Asset Caching (1 year)  
✅ Compression (Brotli/Gzip)  
✅ Code Splitting  
✅ Font Optimization  
✅ Security Headers  
✅ SEO (robots.txt, sitemap, metadata)  
✅ PWA Support (manifest)  
✅ Analytics & Speed Insights  
✅ JSON-LD Structured Data  

## 🔐 Security Checklist

- [x] NEXTAUTH_SECRET is strong (32+ chars)
- [x] Environment variables not in git
- [x] HTTPS enforced (Vercel automatic)
- [x] Security headers configured
- [x] Admin routes protected
- [x] API validation in place
- [x] Gmail App Password (not regular password)
- [x] Database uses SSL

## 📈 Expected Performance

**Lighthouse Scores (Target)**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

**Core Web Vitals (Target)**
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

**Bundle Sizes**
- First Load JS: ~102 KB
- Page JS: 1-6 KB
- Routes: 37 total

## 🆘 Troubleshooting

**Build fails?**
- Check environment variables are set
- Ensure DATABASE_URL is valid
- Run `npm run build` locally first

**Images not optimizing?**
- Verify Vercel Image Optimization is enabled
- Check next.config.ts image configuration
- Use Next.js `<Image>` component

**Slow performance?**
- Check Vercel Speed Insights
- Review Lighthouse recommendations
- Verify caching headers are set
- Check database query performance

**SEO issues?**
- Verify robots.txt is accessible
- Submit sitemap to Google Search Console
- Test OpenGraph tags with validator
- Check meta tags in page source

## 🎉 Success Criteria

Deployment is successful when:
- ✅ Build completes without errors
- ✅ All routes are accessible
- ✅ Lighthouse scores meet targets
- ✅ Analytics is tracking visitors
- ✅ RSVP form works
- ✅ Images load in modern formats
- ✅ SEO files are accessible
- ✅ Admin login works

---

**Need Help?** See `VERCEL_PRODUCTION_GUIDE.md` for detailed instructions.
