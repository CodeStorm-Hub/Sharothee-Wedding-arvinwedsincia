#!/bin/bash
# Post-Deployment Verification Script
# Tests that the deployed website is working correctly

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SITE_URL="${1:-https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia}"
TIMEOUT=10

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Deployment Verification Script${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo "Testing site: $SITE_URL"
echo ""

# Function to test URL
test_url() {
    local url=$1
    local name=$2
    
    echo -n "Testing $name... "
    
    if curl -s -f -m $TIMEOUT "$url" > /dev/null; then
        echo -e "${GREEN}✓ PASS${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        return 1
    fi
}

# Function to test image
test_image() {
    local url=$1
    local name=$2
    
    echo -n "Testing image $name... "
    
    if curl -s -f -I -m $TIMEOUT "$url" | grep -q "200 OK\|HTTP/2 200"; then
        echo -e "${GREEN}✓ PASS${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        return 1
    fi
}

# Counter for results
PASSED=0
FAILED=0

echo -e "${YELLOW}1. Testing Pages${NC}"
echo "=================="

# Test pages
pages=(
    "/:Homepage"
    "/events/:Events Page"
    "/rsvp/:RSVP Page"
    "/contact/:Contact Page"
    "/gallery/:Gallery Page"
    "/live/:Live Page"
    "/travel/:Travel Page"
)

for page in "${pages[@]}"; do
    IFS=':' read -r path name <<< "$page"
    if test_url "${SITE_URL}${path}" "$name"; then
        ((PASSED++))
    else
        ((FAILED++))
    fi
done

echo ""
echo -e "${YELLOW}2. Testing Images${NC}"
echo "=================="

# Test critical images
images=(
    "/images/gallery/gallery-1.jpg:Gallery Image 1"
    "/images/gallery/gallery-2.jpg:Gallery Image 2"
    "/images/event/Akdh.jpeg:Event Image - Akdh"
    "/images/heart/couple.jpeg:Heart Collage - Couple"
    "/images/story/love-across-continents-1.jpg:Story Image"
)

for image in "${images[@]}"; do
    IFS=':' read -r path name <<< "$image"
    if test_image "${SITE_URL}${path}" "$name"; then
        ((PASSED++))
    else
        ((FAILED++))
    fi
done

echo ""
echo -e "${YELLOW}3. Testing Static Assets${NC}"
echo "========================="

# Test static assets
if test_url "${SITE_URL}/favicon.ico" "Favicon"; then
    ((PASSED++))
else
    ((FAILED++))
fi

if test_url "${SITE_URL}/.nojekyll" ".nojekyll file"; then
    ((PASSED++))
else
    ((FAILED++))
fi

echo ""
echo -e "${YELLOW}4. Testing Form Pages${NC}"
echo "======================"

# Check if form pages have expected content
echo -n "Checking RSVP form content... "
if curl -s -m $TIMEOUT "${SITE_URL}/rsvp/" | grep -q "Submit RSVP"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

echo -n "Checking Contact form content... "
if curl -s -m $TIMEOUT "${SITE_URL}/contact/" | grep -q "Send Message"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Test Results${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

# Calculate percentage
TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! (100%)${NC}"
    echo -e "${GREEN}Deployment is successful!${NC}"
    exit 0
elif [ $PERCENTAGE -ge 80 ]; then
    echo -e "${YELLOW}⚠️  Most tests passed ($PERCENTAGE%)${NC}"
    echo -e "${YELLOW}Some issues detected - please review failed tests${NC}"
    exit 1
else
    echo -e "${RED}❌ Many tests failed ($PERCENTAGE%)${NC}"
    echo -e "${RED}Deployment may have issues - please investigate${NC}"
    exit 1
fi
