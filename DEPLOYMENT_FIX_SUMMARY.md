# GitHub Pages Deployment Fix Summary

## Issue Description
The GitHub Pages deployment workflow was failing with the error:
```
tar: client/out: Cannot open: No such file or directory
tar: Error is not recoverable: exiting now
```

## Root Cause Analysis

### Primary Issue: Environment Variable Mismatch
- **Expected**: `DEPLOY_TARGET=github-pages` (in `next.config.ts` line 4)
- **Actual**: `GITHUB_PAGES=true` (in `.github/workflows/nextjs.yml` line 116)

The `next.config.ts` configuration checks for `process.env.DEPLOY_TARGET === 'github-pages'` to enable static export:
```typescript
const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';
```

However, the GitHub Actions workflow was setting a different environment variable:
```yaml
env:
  GITHUB_PAGES: "true"  # Wrong variable name
```

This caused the Next.js build to run in server mode (without static export), which doesn't create the `out` directory. The upload artifact step then failed trying to find `./client/out`.

## Solution

### Change Made
Updated `.github/workflows/nextjs.yml` line 116:
```yaml
# Before:
env:
  GITHUB_PAGES: "true"

# After:
env:
  DEPLOY_TARGET: "github-pages"
```

### Why This Works
1. Setting `DEPLOY_TARGET=github-pages` makes `isGitHubPages = true` in `next.config.ts`
2. This enables `output: 'export'` configuration for static export
3. Next.js build creates the `out` directory with static files
4. The upload artifact step successfully finds and uploads `./client/out`

## Verification

### Tests Performed
1. ✅ **Static Export Build**: Successfully built with `DEPLOY_TARGET=github-pages`
   - Generated 8 static pages in `client/out`
   - Routes: /, /contact, /events, /gallery, /live, /rsvp, /travel, /404

2. ✅ **Normal Server Build**: Successfully built without static export
   - Generated 27 routes (11 admin + 16 API + static pages)
   - Confirms server-side functionality remains intact

3. ✅ **Code Quality Checks**:
   - Linting: No ESLint warnings or errors
   - Type Check: No TypeScript errors

4. ✅ **Artifact Path Verification**:
   - Confirmed `./client/out` is accessible from repository root
   - Upload artifact step path is correct

## Deployment Impact

### Static Export Features (GitHub Pages)
When deployed to GitHub Pages with `DEPLOY_TARGET=github-pages`:
- ✅ Static pages: Home, Events, Gallery, Live, RSVP, Travel, Contact
- ✅ Client-side routing and navigation
- ✅ Static assets and images
- ❌ API routes (disabled for static export)
- ❌ Admin pages (require server-side authentication)
- ❌ Form submissions via Next.js API (use Web3Forms instead)

### Full Server Features (Hostinger VPS)
When deployed to Hostinger VPS without static export:
- ✅ All static pages
- ✅ All API routes for backend functionality
- ✅ Admin dashboard and authentication
- ✅ Database integration via Prisma
- ✅ Form submissions via Next.js API
- ✅ Email functionality via Resend
- ✅ Media uploads via Cloudinary

## Recommendations

### 1. Environment Variable Consistency
- Keep `DEPLOY_TARGET` as the standard variable for deployment configuration
- Document which environment variables control build behavior
- Consider using a single source of truth for deployment config

### 2. Testing Strategy
- Add pre-deployment tests that verify `out` directory creation
- Test both static export and server builds in CI/CD pipeline
- Monitor GitHub Actions workflow runs for deployment issues

### 3. Documentation Updates
- Update deployment documentation to mention `DEPLOY_TARGET` variable
- Add troubleshooting guide for common deployment errors
- Document differences between static export and server deployment

### 4. GitHub Pages Limitations
- Make it clear on the website that GitHub Pages version has limited functionality
- Provide contact information for users when API features are unavailable
- Consider adding a banner indicating "Limited features - visit [VPS URL] for full functionality"

### 5. Monitoring
- Set up workflow notifications for deployment failures
- Monitor GitHub Pages deployment status
- Track any issues related to static export limitations

## Related Files
- `.github/workflows/nextjs.yml` - GitHub Pages deployment workflow
- `client/next.config.ts` - Next.js configuration with deployment targets
- `client/scripts/prepare-static-build.sh` - Static export preparation script
- `client/scripts/restore-after-build.sh` - Post-build restoration script

## Next Steps
1. ✅ Fix applied and tested locally
2. ⏳ Push changes and trigger GitHub Actions workflow
3. ⏳ Monitor deployment to GitHub Pages
4. ⏳ Verify deployed site works as expected
5. ⏳ Update documentation if needed

---

**Fix Date**: October 11, 2025  
**Fixed By**: GitHub Copilot  
**Issue Reference**: #234  
**Related PR**: TBD
