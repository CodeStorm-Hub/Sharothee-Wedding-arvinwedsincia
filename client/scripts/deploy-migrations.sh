#!/bin/bash
# Migration deployment script for Vercel PostgreSQL database

echo "🚀 Starting database migration deployment..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  exit 1
fi

echo "✅ DATABASE_URL is configured"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

if [ $? -eq 0 ]; then
  echo "✅ Prisma client generated successfully"
else
  echo "❌ Failed to generate Prisma client"
  exit 1
fi

# Deploy migrations
echo "🔄 Deploying database migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "✅ Migrations deployed successfully"
else
  echo "❌ Failed to deploy migrations"
  exit 1
fi

echo "🎉 Database migration deployment completed successfully!"
