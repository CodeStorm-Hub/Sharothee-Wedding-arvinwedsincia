# Vercel Production Deployment Guide

## 🚀 Quick Start

This guide will help you deploy the Incia & Arvin Wedding website to Vercel with full production optimizations.

## Prerequisites

- GitHub account with repository access
- Vercel account (free tier works)
- Database provider (Vercel Postgres recommended)
- Gmail account for email functionality
- Cloudinary account for media uploads (optional)

## Step 1: Prepare Your Database

### Option A: Vercel Postgres (Recommended)

1. **Create Database in Vercel Dashboard**
   ```bash
   # Go to: https://vercel.com/dashboard
   # Click: Storage → Create Database → Postgres
   # Database name: wedding-db
   # Region: Choose closest to your users
   ```

2. **Get Connection Strings**
   - After creation, Vercel will provide:
     - `POSTGRES_URL` - Standard PostgreSQL connection
     - `POSTGRES_PRISMA_URL` - Optimized for Prisma
   - These will be automatically added to your environment variables

3. **Run Database Migrations**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Link to your project
   vercel link

   # Pull environment variables
   vercel env pull .env.local

   # Run Prisma migrations
   cd client
   npx prisma migrate deploy
   
   # Seed the database (optional)
   npm run db:seed
   ```

### Option B: External PostgreSQL

Popular options:
- **Supabase** - https://supabase.com (Free tier)
- **Railway** - https://railway.app (Free tier)
- **Neon** - https://neon.tech (Free tier)

Get your `DATABASE_URL` from your provider and add to Vercel environment variables.

## Step 2: Configure Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Navigate to: Settings → Environment Variables
   - Add the following variables:

2. **Required Variables**

   ```env
   # Site URL
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   
   # Database (auto-added if using Vercel Postgres)
   DATABASE_PROVIDER=postgresql
   POSTGRES_URL=postgresql://...
   POSTGRES_PRISMA_URL=prisma+postgres://...
   DATABASE_URL=${POSTGRES_PRISMA_URL}
   
   # NextAuth (CRITICAL!)
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   NEXTAUTH_URL=https://your-project.vercel.app
   
   # Admin Credentials
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=<strong-secure-password>
   
   # Email Service
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=<gmail-app-password>
   GMAIL_FROM=Your Wedding <noreply@yourdomain.com>
   
   # Cloudinary (Optional but recommended)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Generate Strong Secrets**
   ```bash
   # Generate NEXTAUTH_SECRET
   openssl rand -base64 32
   
   # Or use Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Gmail App Password Setup**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification
   - Generate App Password for "Mail"
   - Use the 16-character password as `GMAIL_APP_PASSWORD`

5. **Apply to All Environments**
   - Production ✅
   - Preview ✅
   - Development ✅

## Step 3: Deploy to Vercel

### Method A: GitHub Integration (Recommended)

1. **Import Project**
   ```
   1. Go to: https://vercel.com/new
   2. Select: Import Git Repository
   3. Choose: CodeStorm-Hub/Sharothee-Wedding-arvinwedsincia
   4. Configure project settings:
      - Framework Preset: Next.js
      - Root Directory: client
      - Build Command: (leave default) npm run build
      - Output Directory: (leave default) .next
      - Install Command: (leave default) npm install
   5. Click: Deploy
   ```

2. **Automatic Deployments**
   - Every push to `main` → Production deployment
   - Every PR → Preview deployment
   - Instant rollback capability

### Method B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client directory
cd client

# Deploy to production
vercel --prod

# Follow prompts to link project
```

## Step 4: Post-Deployment Configuration

### 1. Custom Domain (Optional)

```bash
# Add custom domain in Vercel Dashboard
# Settings → Domains → Add Domain
# Follow DNS configuration instructions

# Update environment variables:
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
```

### 2. Verify Deployment

1. **Check Build Logs**
   - Vercel Dashboard → Deployments → Latest
   - Ensure no errors in build process

2. **Test Website**
   ```bash
   # Homepage
   curl https://your-project.vercel.app
   
   # Health check
   curl https://your-project.vercel.app/api/health
   
   # Sitemap
   curl https://your-project.vercel.app/sitemap.xml
   
   # Robots.txt
   curl https://your-project.vercel.app/robots.txt
   ```

3. **Test Key Features**
   - ✅ Homepage loads
   - ✅ Navigation works
   - ✅ Events page displays
   - ✅ RSVP form works
   - ✅ Admin login works
   - ✅ Contact form sends emails
   - ✅ Gallery displays images

### 3. Performance Monitoring

**Enable Vercel Analytics**
Already integrated! View metrics at:
- Dashboard → Your Project → Analytics
- Real-time visitor analytics
- Page performance metrics
- Web vitals tracking

**Enable Speed Insights**
Already integrated! View at:
- Dashboard → Your Project → Speed Insights
- Core Web Vitals scores
- Performance recommendations
- Real User Monitoring (RUM)

## Step 5: Production Optimizations

### Performance Features (Already Implemented)

✅ **Image Optimization**
- Automatic AVIF/WebP conversion
- Responsive image sizing
- Lazy loading
- CDN delivery

✅ **Code Optimization**
- Tree shaking
- Code splitting
- Minification
- Compression (Brotli/Gzip)

✅ **Caching Strategy**
- Static assets: 1 year cache
- API routes: No cache
- Pages: Smart caching

✅ **SEO Optimizations**
- Robots.txt
- Sitemap.xml
- Meta tags
- OpenGraph images
- JSON-LD structured data
- PWA manifest

✅ **Security Headers**
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- CSP ready

## Step 6: Monitoring & Maintenance

### View Deployment Logs

```bash
# View production logs
vercel logs --prod

# View specific deployment
vercel logs [deployment-url]

# Stream logs in real-time
vercel logs --follow
```

### Monitor Performance

1. **Lighthouse Audits**
   - Use Chrome DevTools
   - Run on production URL
   - Target scores: 90+ for all metrics

2. **Web Vitals**
   - LCP: < 2.5s (Largest Contentful Paint)
   - FID: < 100ms (First Input Delay)
   - CLS: < 0.1 (Cumulative Layout Shift)

3. **Vercel Speed Insights**
   - Real user metrics
   - Performance timeline
   - Geographic distribution

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database
npm run db:seed
```

## Step 7: Scaling & Optimization

### Upgrade Considerations

**Free Tier Limits:**
- 100 GB bandwidth/month
- 100 GB-hours compute/month
- 6,000 build minutes/month
- 1 concurrent build

**When to Upgrade:**
- High traffic (>100k visitors/month)
- Need faster builds
- Multiple concurrent deployments
- Advanced analytics
- Team collaboration

**Pro Plan Benefits:**
- 1 TB bandwidth
- Unlimited builds
- Password protection
- Advanced analytics
- Team features

## Troubleshooting

### Build Failures

**Issue**: Prisma generate fails
```bash
# Solution: Ensure DATABASE_URL is set
# Check: Settings → Environment Variables
# Redeploy after adding
```

**Issue**: NextAuth errors
```bash
# Solution: Verify NEXTAUTH_SECRET and NEXTAUTH_URL
# Must be set in production environment
# Regenerate secret if needed
```

### Runtime Errors

**Issue**: Database connection fails
```bash
# Check: DATABASE_URL is correct
# Verify: Database is accessible from Vercel IPs
# Test: Connection pooling settings
```

**Issue**: Email not sending
```bash
# Verify: GMAIL_APP_PASSWORD (not regular password)
# Check: 2-Step Verification enabled
# Test: Using correct Gmail account
```

### Performance Issues

**Issue**: Slow page loads
```bash
# Check: Vercel Analytics for bottlenecks
# Optimize: Large images
# Enable: Image optimization
# Use: Incremental Static Regeneration (ISR)
```

## Security Checklist

- [ ] Strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Secure `ADMIN_PASSWORD`
- [ ] Environment variables not committed to git
- [ ] Database connection uses SSL
- [ ] Gmail App Password (not regular password)
- [ ] API routes have rate limiting
- [ ] Admin routes protected with auth
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Security headers configured
- [ ] Regular dependency updates

## Cost Optimization

### Free Tier Best Practices

1. **Optimize Images**
   - Use Next.js Image component
   - Compress images before upload
   - Use appropriate formats (AVIF/WebP)

2. **Reduce Build Time**
   - Cache dependencies
   - Minimize build steps
   - Use incremental builds

3. **Bandwidth Management**
   - Enable caching headers
   - Use CDN for static assets
   - Compress responses

4. **Function Optimization**
   - Keep functions lightweight
   - Use edge functions when possible
   - Optimize cold starts

## Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [NextAuth.js](https://next-auth.js.org/deployment)

### Support
- [Vercel Support](https://vercel.com/support)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Next.js Discord](https://nextjs.org/discord)

### Tools
- [Vercel CLI](https://vercel.com/docs/cli)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals Extension](https://chrome.google.com/webstore/detail/web-vitals)

## Summary

✅ **Deployment Checklist**
- [x] Database setup and migrated
- [x] Environment variables configured
- [x] Project deployed to Vercel
- [x] Custom domain configured (optional)
- [x] Analytics enabled
- [x] Performance optimized
- [x] Security headers configured
- [x] SEO optimized
- [x] Monitoring enabled

🎉 **Your wedding website is now live and optimized for production!**

---

**Last Updated**: October 2025  
**Status**: Production Ready  
**Performance**: Optimized for Core Web Vitals  
**SEO**: Fully configured with structured data
