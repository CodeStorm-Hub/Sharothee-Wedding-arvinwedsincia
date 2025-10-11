# Deployment Changes Summary

This document summarizes the changes made to enable GitHub Pages deployment for the Sharothee Wedding website.

## Changes Made

### 1. Database Configuration
**File**: `client/prisma/schema.prisma`
- Changed database provider from `mysql` to `sqlite`
- Updated datasource configuration to use SQLite file

### 2. Next.js Configuration
**File**: `client/next.config.ts`
- Enabled static export: `output: 'export'`
- Added basePath for subdirectory deployment: `/Sharothee-Wedding-arvinwedsincia`
- Added assetPrefix for proper asset loading
- Enabled trailing slashes for GitHub Pages compatibility
- Set images to unoptimized mode for static export

### 3. Build Scripts
**Created Files**:
- `client/scripts/prepare-static-build.sh` - Moves API routes and admin pages before build
- `client/scripts/restore-after-build.sh` - Restores moved directories after build

**Updated File**: `client/package.json`
- Added `build:static` script: Runs prepare → build → restore sequence
- Updated `build:github` to use `build:static`

### 4. Form Handling Updates
**Modified Files**:
- `client/src/app/rsvp/page.tsx` - Added static mode detection and email fallback
- `client/src/app/contact/page.tsx` - Added static mode detection and email fallback

Both forms now:
- Detect when running in static export mode
- Show success message with email contact information
- Maintain client-side validation

### 5. GitHub Actions Workflow
**File**: `.github/workflows/nextjs.yml`
- Updated comments to reflect static export functionality
- Changed build command to use `npm run build:static`
- Updated artifact path to `client/out` (static export output)
- Updated environment file creation comments

### 6. GitHub Pages Configuration
**Created Files**:
- `client/public/.nojekyll` - Prevents Jekyll processing on GitHub Pages
- `GITHUB_PAGES_DEPLOYMENT.md` - Complete deployment documentation

**Updated File**: `client/.gitignore`
- Added `.build-backup` directory to ignore list

## Technical Details

### Static Export Process
1. **Preparation**: API routes and admin directories are temporarily moved to `.build-backup`
2. **Build**: Next.js generates static HTML/CSS/JS files in `out` directory
3. **Restore**: Moved directories are restored for development use

### Output Structure
```
client/out/
├── .nojekyll                 # Prevents Jekyll processing
├── index.html               # Home page
├── 404.html                 # 404 error page
├── events/index.html        # Events page
├── gallery/index.html       # Gallery page
├── live/index.html          # Live stream page
├── rsvp/index.html          # RSVP page
├── contact/index.html       # Contact page
├── travel/index.html        # Travel info page
├── _next/                   # Next.js static assets
├── images/                  # Static images
└── favicon.ico              # Favicon
```

### BasePath Configuration
All URLs and asset paths include the basePath `/Sharothee-Wedding-arvinwedsincia` for subdirectory deployment.

Example:
- Image: `/Sharothee-Wedding-arvinwedsincia/images/photo.jpg`
- Link: `/Sharothee-Wedding-arvinwedsincia/events/`
- Script: `/Sharothee-Wedding-arvinwedsincia/_next/static/chunks/...`

## What's Excluded from Static Build

The following directories are temporarily moved during build:
- `src/app/api/` - All API routes (18 files)
- `src/app/admin/` - Admin dashboard pages (10 files)

These are restored after build for local development but not included in the static export.

## Environment Variables

The workflow creates a minimal `.env.local` file with placeholder values:
- `DATABASE_URL` - Points to SQLite file (not used at runtime)
- `NEXTAUTH_SECRET` - Placeholder (authentication not used)
- `NEXTAUTH_URL` - Placeholder (authentication not used)
- Email and Cloudinary keys - Placeholders (not functional in static mode)

## Testing Locally

```bash
cd client
npm run build:static
cd out
python3 -m http.server 8000

# Visit: http://localhost:8000
# Note: BasePath required for full testing
```

## Deployment URL

Once merged and deployed:
**https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/**

## Migration Notes

For full server functionality (API routes, authentication, database):
1. Deploy to Hostinger VPS instead
2. Use MySQL database
3. Remove `output: 'export'` from next.config.ts
4. Keep basePath empty in production
5. Configure proper environment variables

See `HOSTINGER_VPS_DEPLOYMENT_PLAN.md` for VPS deployment instructions.

## Files Changed

### Modified (10 files)
1. `.github/workflows/nextjs.yml`
2. `client/.gitignore`
3. `client/next.config.ts`
4. `client/package.json`
5. `client/prisma/schema.prisma`
6. `client/src/app/contact/page.tsx`
7. `client/src/app/rsvp/page.tsx`

### Created (4 files)
8. `client/public/.nojekyll`
9. `client/scripts/prepare-static-build.sh`
10. `client/scripts/restore-after-build.sh`
11. `GITHUB_PAGES_DEPLOYMENT.md`
12. `DEPLOYMENT_CHANGES_SUMMARY.md` (this file)

## Verification Checklist

- [x] Static build completes successfully
- [x] All 11 pages generated (including 404)
- [x] BasePath correctly applied to all URLs
- [x] .nojekyll file included in output
- [x] API routes and admin pages excluded
- [x] Forms show email fallback
- [x] GitHub Actions workflow updated
- [x] Documentation created

## Support

For questions or issues:
- **Email**: codestromhub@gmail.com
- **Repository**: https://github.com/CodeStorm-Hub/Sharothee-Wedding-arvinwedsincia
