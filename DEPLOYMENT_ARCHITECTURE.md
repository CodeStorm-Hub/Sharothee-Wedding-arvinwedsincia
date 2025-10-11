# Deployment Architecture: GitHub Runners + Vercel

This document explains how the wedding website deployment uses GitHub-hosted runners (Ubuntu Linux VMs) to build and deploy the full-stack Next.js application to Vercel.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│  (Code, Workflows, Database Schema, Next.js App)            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ Push to main / Manual trigger
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              GitHub Actions (CI/CD Pipeline)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │    GitHub-Hosted Runner (Ubuntu Linux VM)           │   │
│  │                                                      │   │
│  │  1. Checkout code                                   │   │
│  │  2. Setup Node.js 20                                │   │
│  │  3. Install dependencies (npm ci)                   │   │
│  │  4. Generate Prisma client                          │   │
│  │  5. Run tests                                       │   │
│  │  6. Build Next.js app (Vercel CLI)                  │   │
│  │  7. Deploy to Vercel                                │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ Deploy artifacts
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Platform                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Production Environment                  │   │
│  │                                                      │   │
│  │  • Next.js App Running                              │   │
│  │  • SQLite Database (Serverless)                     │   │
│  │  • API Routes (18 endpoints)                        │   │
│  │  • NextAuth Authentication                          │   │
│  │  • Email Service (Gmail SMTP)                       │   │
│  │  • Image Storage (Cloudinary)                       │   │
│  │  • Global CDN                                       │   │
│  │  • Automatic SSL                                    │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTPS
                            ↓
                     ┌─────────────┐
                     │   Users     │
                     │ (Browsers)  │
                     └─────────────┘
```

## 🔧 Component Breakdown

### 1. GitHub-Hosted Runners (Build Environment)

**What it is:**
- Temporary Ubuntu Linux virtual machines
- Provided free by GitHub
- Runs during GitHub Actions workflows
- Automatically provisioned and destroyed

**What it does:**
- ✅ Checks out code from repository
- ✅ Installs Node.js 20 and dependencies
- ✅ Generates Prisma database client
- ✅ Runs test suite
- ✅ Builds Next.js application
- ✅ Deploys to Vercel using Vercel CLI

**Duration:** 2-4 minutes per deployment

**Cost:** FREE (included with GitHub)

### 2. Vercel Platform (Hosting Environment)

**What it is:**
- Serverless hosting platform optimized for Next.js
- Global CDN (Content Delivery Network)
- Automatic SSL certificates
- Edge network for fast response times

**What it runs:**
- ✅ Next.js application (all 34 routes)
- ✅ API routes (18 endpoints for forms, auth, data)
- ✅ SQLite database (serverless, persistent)
- ✅ NextAuth authentication
- ✅ Email notification service
- ✅ Static assets and images

**Duration:** Continuous (24/7 uptime)

**Cost:** FREE tier (no credit card required)

### 3. Deployment Flow

```
Developer Action:
├─ git push origin main
└─ or: Manual workflow trigger

GitHub Actions:
├─ Workflow triggered (.github/workflows/deploy-vercel.yml)
├─ Spin up Ubuntu runner
├─ Install dependencies
├─ Build application
├─ Run tests (optional)
└─ Deploy to Vercel

Vercel:
├─ Receive deployment
├─ Activate new version
├─ Update DNS
├─ Site live with zero downtime
└─ Old version automatically cleaned up

Result:
└─ Live site at https://your-project.vercel.app
```

## 🎯 Why This Architecture?

### GitHub Runners for Build

**Advantages:**
- ✅ Free compute for building
- ✅ Consistent Ubuntu environment
- ✅ Integrated with GitHub repository
- ✅ Automatic on every push
- ✅ Can run tests before deploy
- ✅ Build logs in GitHub Actions

**Role:**
- CI/CD automation
- Quality assurance (testing)
- Build optimization
- Deployment orchestration

### Vercel for Hosting

**Advantages:**
- ✅ Free tier (no credit card)
- ✅ Native Next.js support
- ✅ Serverless functions (API routes)
- ✅ Global CDN (fast worldwide)
- ✅ Automatic SSL certificates
- ✅ Zero-downtime deployments
- ✅ Environment variable management
- ✅ Persistent database storage

**Role:**
- Production hosting
- Serving web traffic
- Running server-side code
- Database storage
- Email sending

## 📊 What Runs Where

| Component | GitHub Runner | Vercel |
|-----------|--------------|--------|
| **Build Process** | ✅ Yes | ❌ No |
| **Testing** | ✅ Yes | ❌ No |
| **Live Website** | ❌ No | ✅ Yes |
| **API Routes** | ❌ No | ✅ Yes |
| **Database** | ❌ No | ✅ Yes |
| **Authentication** | ❌ No | ✅ Yes |
| **Email Sending** | ❌ No | ✅ Yes |
| **Static Assets** | ❌ No | ✅ Yes |
| **Duration** | 2-4 minutes | 24/7 |
| **Cost** | Free | Free |

## 🔄 Continuous Deployment

### Automatic (Recommended)

```bash
# 1. Make changes to code
git add .
git commit -m "Update feature"
git push origin main

# 2. GitHub Actions automatically:
#    - Builds on Ubuntu runner
#    - Runs tests
#    - Deploys to Vercel
#    - Site updated in 3 minutes
```

### Manual

```bash
# Go to GitHub Actions tab
# Select: "Deploy Full-Stack App to Vercel"
# Click: "Run workflow"
# Select: branch (main)
# Click: "Run workflow"
```

## 🔐 Environment Variables

### Stored in Vercel

Production secrets stored securely in Vercel:
- `DATABASE_URL` - SQLite database path
- `NEXTAUTH_SECRET` - Authentication secret
- `NEXTAUTH_URL` - Production URL
- `ADMIN_EMAIL` - Admin login email
- `ADMIN_PASSWORD` - Admin login password
- `GMAIL_USER` - Email service username
- `GMAIL_APP_PASSWORD` - Email service password
- `CLOUDINARY_*` - Image upload credentials

### Stored in GitHub

Deployment credentials stored in GitHub Secrets:
- `VERCEL_TOKEN` - Vercel CLI authentication
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

## 📈 Scalability

### Traffic Handling

- **Low Traffic** (< 100 visits/day): ✅ Free tier sufficient
- **Medium Traffic** (100-10,000 visits/day): ✅ Free tier works
- **High Traffic** (> 10,000 visits/day): May need Vercel Pro ($20/mo)

### Database

- **SQLite** (Current):
  - ✅ Good for < 1000 concurrent users
  - ✅ Simple and fast
  - ✅ No extra configuration

- **Upgrade Path** (if needed):
  - PostgreSQL (Vercel Postgres)
  - MySQL (PlanetScale)
  - MongoDB (MongoDB Atlas)

## 🛠️ Maintenance

### Updates

```bash
# Code updates: Just push to GitHub
git push origin main
# Automatic rebuild and deploy

# Dependency updates:
npm update
git push origin main
# Automatic rebuild and deploy

# Database schema changes:
npx prisma migrate dev
git push origin main
# Automatic rebuild and deploy
```

### Monitoring

- **Vercel Dashboard**: https://vercel.com/dashboard
  - View deployment logs
  - Monitor performance
  - Check error rates
  - Analyze traffic

- **GitHub Actions**: Actions tab in repository
  - Build status
  - Test results
  - Deployment history

## 💰 Cost Breakdown

### GitHub (Free)

- ✅ GitHub Actions: 2,000 minutes/month free
- ✅ Each deployment: ~3 minutes
- ✅ Capacity: ~650 deployments/month

### Vercel (Free Tier)

- ✅ Bandwidth: 100 GB/month
- ✅ Serverless execution: 100 GB-hours
- ✅ Deployments: Unlimited
- ✅ Team members: 1
- ✅ Custom domains: ✅
- ✅ SSL: ✅ (automatic)

### Total Monthly Cost

**$0.00** (Everything free)

## 🎯 Advantages Over Alternatives

### vs GitHub Pages (Static Only)

| Feature | GitHub Pages | This Solution |
|---------|-------------|---------------|
| Database | ❌ | ✅ SQLite |
| API Routes | ❌ | ✅ 18 routes |
| Authentication | ❌ | ✅ NextAuth |
| Admin Panel | ❌ | ✅ Full dashboard |
| Forms | Limited | ✅ Full featured |
| Build | GitHub Actions | GitHub Actions |
| Cost | Free | Free |

### vs VPS (Self-Hosted)

| Feature | VPS | This Solution |
|---------|-----|---------------|
| Setup Time | Hours | 12 minutes |
| Maintenance | Manual | Automatic |
| SSL | Manual | Automatic |
| CDN | Extra cost | Included |
| Scaling | Manual | Automatic |
| Cost | $5-50/month | Free |
| Build | Self-managed | GitHub Actions |

## 🔒 Security

### GitHub Runners

- ✅ Isolated VM per workflow
- ✅ Clean environment every time
- ✅ No persistent data
- ✅ Secrets encrypted

### Vercel

- ✅ Automatic SSL/TLS
- ✅ DDoS protection
- ✅ Environment variables encrypted
- ✅ Secure database storage
- ✅ Regular security updates

## 📞 Support

### For Build Issues (GitHub Actions)

- Check workflow logs in Actions tab
- Review error messages
- Verify GitHub Secrets are set

### For Runtime Issues (Vercel)

- Check Vercel dashboard logs
- Review function logs
- Verify environment variables
- Check database connections

## 🎉 Summary

This architecture provides:

✅ **Free Hosting** - No costs for typical wedding website
✅ **Full-Stack** - Database, API routes, authentication
✅ **Automatic Deployment** - Push code, site updates
✅ **GitHub Runners** - Ubuntu Linux VMs for building
✅ **Production Ready** - SSL, CDN, global performance
✅ **Simple Maintenance** - No server management
✅ **Scalable** - Handles traffic spikes automatically

**Result:** Professional wedding website with all features working, deployed in 12 minutes, maintained via Git.

---

**Build Platform**: GitHub Actions (Ubuntu runners)
**Hosting Platform**: Vercel (Serverless)
**Database**: SQLite (Serverless)
**Cost**: $0/month
**Setup Time**: 12 minutes
**Status**: ✅ Production Ready
