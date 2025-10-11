#!/bin/bash
# Script to prepare the app for static export to GitHub Pages
# This temporarily moves server-dependent features out of the build

echo "Preparing for static export..."

# Create backup directory
mkdir -p .build-backup

# Move API routes out (they don't work in static export)
if [ -d "src/app/api" ]; then
  echo "Moving API routes to backup..."
  mv src/app/api .build-backup/
fi

# Move admin pages out (require authentication)
if [ -d "src/app/admin" ]; then
  echo "Moving admin pages to backup..."
  mv src/app/admin .build-backup/
fi

echo "Static build preparation complete!"
