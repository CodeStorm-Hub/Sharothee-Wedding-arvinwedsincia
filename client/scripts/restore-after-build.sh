#!/bin/bash
# Script to restore server-dependent features after static build

echo "Restoring backed up directories..."

# Restore API routes
if [ -d ".build-backup/api" ]; then
  echo "Restoring API routes..."
  mv .build-backup/api src/app/
fi

# Restore admin pages
if [ -d ".build-backup/admin" ]; then
  echo "Restoring admin pages..."
  mv .build-backup/admin src/app/
fi

# Clean up backup directory
if [ -d ".build-backup" ]; then
  rmdir .build-backup 2>/dev/null || rm -rf .build-backup
fi

echo "Restore complete!"
