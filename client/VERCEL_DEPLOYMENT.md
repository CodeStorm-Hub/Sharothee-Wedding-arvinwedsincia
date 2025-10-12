# Vercel Deployment Instructions

## Overview
This document provides instructions for deploying the Sharothee Wedding website to Vercel with PostgreSQL database support.

## Prerequisites
- Vercel account with project set up
- Prisma PostgreSQL database (Prisma Accelerate) configured
- Environment variables configured in Vercel

## Required Environment Variables

Configure these in Vercel Project Settings → Environment Variables:

```env
# Database - Prisma Accelerate
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
POSTGRES_URL="postgres://user:password@db.prisma.io:5432/postgres?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://arvinwedsincia.com"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Admin
ADMIN_EMAIL="admin@arvinwedsincia.com"
ADMIN_PASSWORD="your-admin-password"

# Email (Gmail)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"
GMAIL_FROM="Incia & Arvin Wedding <noreply@arvinwedsincia.com>"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Application
NEXT_PUBLIC_APP_URL="https://arvinwedsincia.com"
CORS_ORIGIN="https://arvinwedsincia.com"
NODE_ENV="production"
```

## Deployment Process

### Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Vercel Auto-Deploy**
   - Vercel will automatically detect the push
   - Run `npm install`
   - Execute `scripts/deploy-migrations.sh` (creates database tables)
   - Run `npx prisma generate`
   - Build the application with `npm run build`
   - Deploy to production

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd client
   vercel --prod
   ```

## Migration Process

The migration is automated in the build process via `vercel.json`:

```json
{
  "buildCommand": "bash scripts/deploy-migrations.sh && npm run build"
}
```

This script:
1. ✅ Checks DATABASE_URL is set
2. ✅ Generates Prisma client
3. ✅ Deploys all migrations to PostgreSQL
4. ✅ Creates all necessary tables

## Database Tables Created

The migration creates these tables in PostgreSQL:

### Authentication & Users
- `Account` - NextAuth account data
- `Session` - NextAuth sessions
- `User` - Admin users
- `VerificationToken` - Email verification

### Wedding Data
- `Guest` - Wedding guests with RSVP tokens
- `Venue` - Event venues
- `Event` - Wedding events (Mehndi, Wedding, Reception, etc.)
- `RSVP` - Guest RSVP responses per event
- `Hotel` - Accommodation information

### Media & Content
- `MediaItem` - Photos and videos (fixes "MediaItem does not exist" error)
- `Stream` - Live streaming information

### Forms & Requests
- `ContactRequest` - Contact form submissions
- `RSVPFormSubmission` - RSVP form data (fixes "RSVPFormSubmission does not exist" error)

## Verification

After deployment, verify the database:

### Option 1: Check Vercel Logs
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Check the build logs for:
   ```
   ✅ Migrations deployed successfully
   ✅ Database migration deployment completed successfully!
   ```

### Option 2: Test API Endpoints
Visit these URLs to verify tables exist:
- `https://arvinwedsincia.com/api/health` - Health check
- `https://arvinwedsincia.com/api/media` - MediaItem table
- `https://arvinwedsincia.com/api/rsvp/submissions` - RSVPFormSubmission table

### Option 3: Use Prisma Studio (Local)
```bash
# Set production DATABASE_URL locally
export DATABASE_URL="your-production-database-url"

# Open Prisma Studio
npm run db:studio
```

## Troubleshooting

### Issue: Tables Still Don't Exist

**Solution:**
1. Check Vercel build logs for migration errors
2. Verify DATABASE_URL is correctly set in Vercel
3. Manually deploy migrations:
   ```bash
   export DATABASE_URL="your-production-database-url"
   npx prisma migrate deploy
   ```

### Issue: Migration Fails

**Solution:**
1. Check if migrations directory exists: `client/prisma/migrations/`
2. Verify migration_lock.toml has `provider = "postgresql"`
3. Re-run deployment

### Issue: Build Fails

**Solution:**
1. Check all environment variables are set in Vercel
2. Verify Prisma client is generated: look for "Generated Prisma Client" in logs
3. Check for TypeScript errors in build output

### Issue: Database Connection Timeout

**Solution:**
1. Verify POSTGRES_URL and DATABASE_URL are both set
2. Check Prisma Accelerate API key is valid
3. Ensure database is accessible from Vercel servers

## Post-Deployment Checklist

- [ ] Database tables created successfully
- [ ] Homepage loads without errors
- [ ] RSVP form submission works (tests RSVPFormSubmission table)
- [ ] Gallery page loads (tests MediaItem table)
- [ ] Contact form works (tests ContactRequest table)
- [ ] Admin panel accessible at `/admin/login`
- [ ] All API endpoints return valid responses

## Database Maintenance

### Backup Database
```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Export schema
npx prisma db pull

# Create backup migration
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma --script > backup.sql
```

### Reset Database (⚠️ DANGER - Deletes all data)
```bash
export DATABASE_URL="your-production-database-url"
npx prisma migrate reset
```

### Add New Tables
1. Update `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name add_new_table`
3. Push to GitHub (Vercel will auto-deploy migration)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review `DATABASE_MIGRATION_GUIDE.md`
3. Contact: codestromhub@gmail.com

## Files Modified

| File | Purpose |
|------|---------|
| `prisma/migrations/20251012_init_postgresql/migration.sql` | PostgreSQL migration |
| `prisma/migrations/migration_lock.toml` | Lock file for PostgreSQL |
| `prisma/schema.production.prisma` | Added RSVPFormSubmission model |
| `vercel.json` | Updated build command to run migrations |
| `scripts/deploy-migrations.sh` | Automated migration deployment |
| `scripts/verify-database.ts` | Database verification script |
| `DATABASE_MIGRATION_GUIDE.md` | Detailed migration documentation |

## Success Indicators

✅ **Build Logs Should Show:**
```
✅ DATABASE_URL is configured
📦 Generating Prisma client...
✅ Prisma client generated successfully
🔄 Deploying database migrations...
✅ Migrations deployed successfully
🎉 Database migration deployment completed successfully!
```

✅ **Production Should Work:**
- No "table does not exist" errors in logs
- RSVP form submissions save successfully
- Media gallery loads correctly
- All API endpoints functional

---

**Last Updated:** October 12, 2025
**Version:** 1.0.0
