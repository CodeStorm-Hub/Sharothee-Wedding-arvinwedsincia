# Database Migration Guide for Vercel PostgreSQL

## Overview

This project uses Prisma with PostgreSQL (Prisma Accelerate) for production deployments on Vercel.

## Database Setup

### Local Development
- Uses SQLite: `prisma/dev.db`
- Schema: `prisma/schema.prisma` (PostgreSQL compatible)

### Production (Vercel)
- Uses PostgreSQL via Prisma Accelerate
- Connection URL format: `prisma+postgres://accelerate.prisma-data.net/?api_key=...`

## Migration Strategy

### Initial Setup (Already Done)
1. ✅ Created PostgreSQL migration in `prisma/migrations/20251012_init_postgresql/`
2. ✅ Updated `migration_lock.toml` to use PostgreSQL provider
3. ✅ Added RSVPFormSubmission model to both schemas

### Deployment Process

The deployment is automated via Vercel:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Deploy Migrations** (runs automatically on Vercel)
   ```bash
   npx prisma migrate deploy
   ```

4. **Build Application**
   ```bash
   npm run build
   ```

### Manual Migration Deployment

If you need to deploy migrations manually to production:

```bash
# Set the production DATABASE_URL
export DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"

# Run migrations
./scripts/deploy-migrations.sh
```

## Database Schema

The schema includes the following models:
- Account, Session, User (NextAuth)
- Guest, Event, Venue, RSVP
- MediaItem, Stream
- ContactRequest
- **RSVPFormSubmission** (for guest RSVP form submissions)
- Hotel

## Troubleshooting

### Error: Table does not exist

If you see errors like `The table 'public.RSVPFormSubmission' does not exist`:

1. Verify DATABASE_URL is set correctly in Vercel environment variables
2. Ensure migrations are deployed: `npx prisma migrate deploy`
3. Check migration status: `npx prisma migrate status`

### Migration Lock File Issues

If migration lock file shows wrong provider:
- Delete `prisma/migrations/` directory
- Update `migration_lock.toml` with correct provider
- Create new migration: `npx prisma migrate dev --name init_postgresql`

### Prisma Accelerate Connection

Ensure your DATABASE_URL follows this format:
```
prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY
```

## Environment Variables

Required for production:

```env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
POSTGRES_URL="postgres://user:password@host:5432/dbname"
NODE_ENV="production"
```

## Files Changed

1. `prisma/schema.prisma` - PostgreSQL provider (already configured)
2. `prisma/schema.production.prisma` - Added RSVPFormSubmission model
3. `prisma/migrations/` - New PostgreSQL migration
4. `vercel.json` - Updated build command to include migration deployment
5. `scripts/deploy-migrations.sh` - Migration deployment script

## Verification

After deployment, verify the database:

```bash
# Connect to database
npx prisma studio

# Check all tables exist
npx prisma db pull
```

## Notes

- The migration is idempotent and safe to run multiple times
- Vercel automatically runs migrations on each deployment
- Database changes are applied before the application build
- All models are now properly defined in PostgreSQL

## Support

For issues, contact:
- Email: codestromhub@gmail.com
- Check Vercel deployment logs for detailed error messages
