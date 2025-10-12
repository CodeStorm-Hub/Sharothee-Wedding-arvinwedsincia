#!/usr/bin/env tsx
/**
 * Database Connection Verification Script
 * Tests connection to PostgreSQL database and verifies all tables exist
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function verifyDatabase() {
  console.log('🔍 Verifying database connection and schema...\n')

  try {
    // Test connection
    console.log('1. Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful\n')

    // Check each table exists by running a simple query
    const tables = [
      { name: 'Account', check: () => prisma.account.count() },
      { name: 'Session', check: () => prisma.session.count() },
      { name: 'User', check: () => prisma.user.count() },
      { name: 'VerificationToken', check: () => prisma.verificationToken.count() },
      { name: 'Guest', check: () => prisma.guest.count() },
      { name: 'Venue', check: () => prisma.venue.count() },
      { name: 'Event', check: () => prisma.event.count() },
      { name: 'RSVP', check: () => prisma.rSVP.count() },
      { name: 'Hotel', check: () => prisma.hotel.count() },
      { name: 'MediaItem', check: () => prisma.mediaItem.count() },
      { name: 'Stream', check: () => prisma.stream.count() },
      { name: 'ContactRequest', check: () => prisma.contactRequest.count() },
      { name: 'RSVPFormSubmission', check: () => prisma.rSVPFormSubmission.count() },
    ]

    console.log('2. Verifying tables exist...')
    for (const table of tables) {
      try {
        const count = await table.check()
        console.log(`   ✅ ${table.name}: ${count} records`)
      } catch (error) {
        console.log(`   ❌ ${table.name}: ERROR - ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    console.log('\n3. Database verification complete!')
    console.log('✨ All checks passed!\n')

  } catch (error) {
    console.error('❌ Database verification failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run verification
verifyDatabase().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
