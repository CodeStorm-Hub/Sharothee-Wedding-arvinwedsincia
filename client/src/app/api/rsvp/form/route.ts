import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, generateRSVPFormEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'
import { rsvpFormSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Transform the payload to match our new validation schema
    const transformedData = {
      guestName: body.guestName,
      email: body.contact?.email,
      willAttendDhaka: body.willAttendDhaka,
      familySide: body.familySide,
      guestCount: body.guestCountOption,
      guestCountOther: body.guestCountOther,
      additionalInfo: body.additionalInfo,
      preferredNumber: body.contact?.preferred?.number || '',
      preferredWhatsapp: body.contact?.preferred?.whatsapp || false,
      preferredBotim: body.contact?.preferred?.botim || false,
      secondaryNumber: body.contact?.secondary?.number || '',
      secondaryWhatsapp: body.contact?.secondary?.whatsapp || false,
      secondaryBotim: body.contact?.secondary?.botim || false,
      emergencyName: body.contact?.emergency?.name || '',
      emergencyPhone: body.contact?.emergency?.phone || '',
      emergencyEmail: body.contact?.emergency?.email || '',
    }

    // Validate the data
    const validatedData = rsvpFormSchema.parse(transformedData)

    // Try to save to database (optional - for serverless environments)
    let rsvpSubmissionId = 'email-only'
    try {
      const rsvpSubmission = await prisma.rSVPFormSubmission.create({
        data: {
          guestName: validatedData.guestName,
          email: validatedData.email,
          willAttendDhaka: validatedData.willAttendDhaka,
          familySide: validatedData.familySide,
          guestCount: validatedData.guestCount,
          guestCountOther: validatedData.guestCountOther,
          additionalInfo: validatedData.additionalInfo,
          preferredNumber: validatedData.preferredNumber,
          preferredWhatsapp: validatedData.preferredWhatsapp || false,
          preferredBotim: validatedData.preferredBotim || false,
          secondaryNumber: validatedData.secondaryNumber,
          secondaryWhatsapp: validatedData.secondaryWhatsapp || false,
          secondaryBotim: validatedData.secondaryBotim || false,
          emergencyName: validatedData.emergencyName,
          emergencyPhone: validatedData.emergencyPhone,
          emergencyEmail: validatedData.emergencyEmail,
        },
      })
      rsvpSubmissionId = rsvpSubmission.id
    } catch (dbError) {
      // Database might not be available in serverless environment (e.g., Vercel)
      // Continue with email sending - this is the primary functionality
      console.warn('Database save failed (expected in serverless), continuing with email:', dbError)
    }

    const html = generateRSVPFormEmail(body)

    // Send confirmation to guest
    const guestResult = await sendEmail({
      to: [validatedData.email],
      subject: "RSVP Received - Incia & Arvin's Wedding",
      html,
    })
    
    if (!guestResult?.success) {
      console.error('RSVP guest email failed:', guestResult?.error)
      // Continue with admin notifications even if guest email fails
    }

    // CRITICAL: Send to arvincia@sparrow-group.com (highest priority) - PRODUCTION ONLY
    const isProduction = process.env.NODE_ENV === 'production'
    if (isProduction) {
      const primaryResult = await sendEmail({
        to: ['arvincia@sparrow-group.com'],
        subject: 'New RSVP Submission - Incia & Arvin Wedding',
        html,
      })
      
      if (!primaryResult?.success) {
        console.error('RSVP primary email to arvincia@sparrow-group.com failed:', primaryResult?.error)
      }
    } else {
      console.log('[DEV] Would send RSVP to arvincia@sparrow-group.com in production')
    }

    // Send notification to admin (ADMIN_EMAIL or fallback to GMAIL_USER)
    const adminCandidates = [process.env.ADMIN_EMAIL, process.env.GMAIL_USER].filter(Boolean) as string[]
    const uniqueAdminRecipients = Array.from(new Set(adminCandidates))
    if (uniqueAdminRecipients.length) {
      const adminResult = await sendEmail({
        to: uniqueAdminRecipients,
        subject: 'New RSVP Submission',
        html,
      })
      if (!adminResult?.success) {
        console.warn('RSVP admin email failed:', adminResult?.error)
      }
    }

    return NextResponse.json({ 
      success: true, 
      id: rsvpSubmissionId,
      message: 'RSVP submitted successfully'
    })
  } catch (error) {
    console.error('RSVP form POST error:', error)
    
    // Handle validation errors specifically
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Please fill in all required fields correctly', details: error.message }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to submit RSVP. Please try again.' }, 
      { status: 500 }
    )
  }
}
