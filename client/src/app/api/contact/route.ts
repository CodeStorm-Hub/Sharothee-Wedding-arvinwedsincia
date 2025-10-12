import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { contactSchema } from "@/lib/validations"
import { sendEmail, generateContactNotificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    // Try to save contact request to database (optional - for serverless environments)
    let contactRequestId = 'email-only'
    try {
      const contactRequest = await prisma.contactRequest.create({
        data: validatedData
      })
      contactRequestId = contactRequest.id
    } catch (dbError) {
      // Database might not be available in serverless environment (e.g., Vercel)
      // Continue with email sending - this is the primary functionality
      console.warn('Database save failed (expected in serverless), continuing with email:', dbError)
    }

    // Generate email content
    const adminEmailHtml = generateContactNotificationEmail(
      validatedData.name,
      validatedData.email,
      validatedData.subject,
      validatedData.message
    )
    
    // CRITICAL: Send to arvincia@sparrow-group.com (highest priority) - PRODUCTION ONLY
    const isProduction = process.env.NODE_ENV === 'production'
    if (isProduction) {
      const primaryResult = await sendEmail({
        to: ["arvincia@sparrow-group.com"],
        subject: `New Contact Request: ${validatedData.subject} - Incia & Arvin Wedding`,
        html: adminEmailHtml
      })

      if (!primaryResult?.success) {
        console.error('Contact form primary email to arvincia@sparrow-group.com failed:', primaryResult?.error)
      }
    } else {
      console.log('[DEV] Would send contact form to arvincia@sparrow-group.com in production')
    }

    // Send notification email to admin (backup)
    const adminResult = await sendEmail({
      to: ["codestromhub@gmail.com"],
      subject: `New Contact Request: ${validatedData.subject}`,
      html: adminEmailHtml
    })

    if (!adminResult?.success) {
      console.warn('Contact form admin backup email failed:', adminResult?.error)
    }

    // Send confirmation email to user
    const userConfirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5A3C;">Thank you for contacting us!</h2>
        <p>Dear ${validatedData.name},</p>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <div style="background: #FDF6F0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #8B5A3C; margin-top: 0;">Your Message:</h3>
          <p><strong>Subject:</strong> ${validatedData.subject}</p>
          <p><strong>Message:</strong> ${validatedData.message}</p>
        </div>
        <p>With love,<br>Incia & Arvin</p>
      </div>
    `

    await sendEmail({
      to: [validatedData.email],
      subject: "Message Received - Incia & Arvin's Wedding",
      html: userConfirmationHtml
    })

    return NextResponse.json({
      success: true,
      id: contactRequestId,
      message: "Contact request submitted successfully"
    })

  } catch (error) {
    console.error("Contact submission error:", error)
    
    // Handle validation errors specifically
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Please fill in all required fields correctly', details: error.message }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to submit contact request. Please try again." },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contactRequest.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    )
  }
}
