#!/bin/bash

# Vercel Deployment Readiness Check
# This script validates that the application is ready for production deployment

set -e

echo "🚀 Vercel Deployment Readiness Check"
echo "===================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# Function to print check result
check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((CHECKS_PASSED++))
    else
        if [ "$3" = "warning" ]; then
            echo -e "${YELLOW}⚠${NC} $2"
            ((CHECKS_WARNING++))
        else
            echo -e "${RED}✗${NC} $2"
            ((CHECKS_FAILED++))
        fi
    fi
}

# Navigate to client directory
cd "$(dirname "$0")/../client" || exit 1

echo "1. Environment Configuration"
echo "----------------------------"

# Check for .env.local in development
if [ -f .env.local ]; then
    check_result 0 ".env.local exists (for local development)"
else
    check_result 1 ".env.local exists" "warning"
fi

# Check for example env file
if [ -f .env.vercel.example ]; then
    check_result 0 ".env.vercel.example exists (for Vercel setup)"
else
    check_result 1 ".env.vercel.example exists"
fi

echo ""
echo "2. Required Files"
echo "-----------------"

# Check for critical files
[ -f "package.json" ] && check_result 0 "package.json exists" || check_result 1 "package.json exists"
[ -f "next.config.ts" ] && check_result 0 "next.config.ts exists" || check_result 1 "next.config.ts exists"
[ -f "vercel.json" ] && check_result 0 "vercel.json exists" || check_result 1 "vercel.json exists"
[ -f "tsconfig.json" ] && check_result 0 "tsconfig.json exists" || check_result 1 "tsconfig.json exists"

echo ""
echo "3. SEO Files"
echo "------------"

# Check for SEO files
[ -f "src/app/robots.ts" ] && check_result 0 "robots.ts exists" || check_result 1 "robots.ts exists"
[ -f "src/app/sitemap.ts" ] && check_result 0 "sitemap.ts exists" || check_result 1 "sitemap.ts exists"
[ -f "src/app/manifest.ts" ] && check_result 0 "manifest.ts exists" || check_result 1 "manifest.ts exists"
[ -f "src/app/favicon.ico" ] && check_result 0 "favicon.ico exists" || check_result 1 "favicon.ico exists"

echo ""
echo "4. Dependencies"
echo "---------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    check_result 0 "node_modules installed"
else
    echo "Installing dependencies..."
    npm install
    check_result $? "Dependencies installation"
fi

# Check for required packages
node -e "require('@vercel/analytics')" 2>/dev/null && check_result 0 "@vercel/analytics installed" || check_result 1 "@vercel/analytics installed"
node -e "require('@vercel/speed-insights')" 2>/dev/null && check_result 0 "@vercel/speed-insights installed" || check_result 1 "@vercel/speed-insights installed"

echo ""
echo "5. Code Quality"
echo "---------------"

# Run TypeScript check
echo "Running TypeScript check..."
npm run type-check && check_result 0 "TypeScript compilation" || check_result 1 "TypeScript compilation"

# Run linter
echo "Running linter..."
npm run lint && check_result 0 "ESLint validation" || check_result 1 "ESLint validation"

echo ""
echo "6. Build Test"
echo "-------------"

# Run build
echo "Running production build..."
npm run build && check_result 0 "Production build" || check_result 1 "Production build"

echo ""
echo "7. Database Configuration"
echo "-------------------------"

# Check Prisma schema
[ -f "prisma/schema.prisma" ] && check_result 0 "Prisma schema exists" || check_result 1 "Prisma schema exists"

# Check if Prisma client is generated
if [ -d "node_modules/.prisma/client" ]; then
    check_result 0 "Prisma client generated"
else
    echo "Generating Prisma client..."
    npx prisma generate
    check_result $? "Prisma client generation"
fi

echo ""
echo "8. Performance Configuration"
echo "----------------------------"

# Check for performance configurations
[ -f "lighthouserc.json" ] && check_result 0 "Lighthouse CI config exists" || check_result 1 "Lighthouse CI config exists" "warning"

# Check for image optimization config
grep -q "formats.*avif" next.config.ts && check_result 0 "AVIF image support configured" || check_result 1 "AVIF image support configured" "warning"

echo ""
echo "9. Security Headers"
echo "-------------------"

# Check for security headers in config
grep -q "X-Frame-Options" next.config.ts && check_result 0 "Security headers configured" || check_result 1 "Security headers configured"
grep -q "X-Content-Type-Options" next.config.ts && check_result 0 "Content type options configured" || check_result 1 "Content type options configured"

echo ""
echo "===================================="
echo "Summary"
echo "===================================="
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
echo -e "${YELLOW}Warnings: $CHECKS_WARNING${NC}"
echo -e "${RED}Failed: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Application is ready for Vercel deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Set environment variables in Vercel Dashboard"
    echo "2. Connect your GitHub repository to Vercel"
    echo "3. Configure database (Vercel Postgres recommended)"
    echo "4. Deploy with: vercel --prod"
    echo ""
    echo "See VERCEL_PRODUCTION_GUIDE.md for detailed instructions"
    exit 0
else
    echo -e "${RED}❌ Please fix the failed checks before deploying${NC}"
    exit 1
fi
