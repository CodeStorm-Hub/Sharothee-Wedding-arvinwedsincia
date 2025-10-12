import nodemailer, { Transporter } from 'nodemailer'
import type { SentMessageInfo } from 'nodemailer'

let transporter: Transporter | null = null

function getTransporter(): Transporter | null {
  if (transporter) return transporter

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    console.warn('⚠️ GMAIL_USER or GMAIL_APP_PASSWORD is not set.')
    console.warn('📧 Email sending will be skipped. Configure these environment variables in Vercel:')
    console.warn('   - GMAIL_USER: Your Gmail email address')
    console.warn('   - GMAIL_APP_PASSWORD: Gmail App Password (not regular password)')
    console.warn('   Generate App Password at: https://myaccount.google.com/apppasswords')
    return null
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  })

  return transporter
}

interface EmailData {
  to: string[]
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: EmailData) {
  try {
    const tx = getTransporter()
    if (!tx) {
      console.error('❌ Cannot send email - Gmail credentials not configured')
      return { success: false, error: new Error('Missing Gmail credentials - configure GMAIL_USER and GMAIL_APP_PASSWORD in Vercel environment variables') }
    }

    const fromAddress =
      from || process.env.GMAIL_FROM || `Wedding <${process.env.GMAIL_USER}>`

    const info = (await tx.sendMail({
      from: fromAddress,
      to: to.join(','),
      subject,
      html,
    })) as SentMessageInfo
    // Basic debug log for troubleshooting
    try {
      console.log('✅ [email] sent', { messageId: info?.messageId as string | undefined, to })
    } catch {}
    return { success: true, data: info }
  } catch (error) {
    console.error('❌ Email error:', error)
    if (error instanceof Error && error.message.includes('Invalid login')) {
      console.error('🔑 Gmail authentication failed. Check these in Vercel environment variables:')
      console.error('   - GMAIL_USER is correct email address')
      console.error('   - GMAIL_APP_PASSWORD is a valid Gmail App Password (not regular password)')
      console.error('   - 2FA is enabled on Gmail account')
      console.error('   Generate new App Password at: https://myaccount.google.com/apppasswords')
    }
    return { success: false, error }
  }
}

export function generateRSVPConfirmationEmail(guestName: string, events: string[]) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #8B7355; text-align: center;">RSVP Confirmation</h1>
      <p>Dear ${guestName},</p>
      <p>Thank you for your RSVP! We're thrilled that you'll be joining us for our special day.</p>
      <h3>Events you'll be attending:</h3>
      <ul>
        ${events.map(event => `<li>${event}</li>`).join('')}
      </ul>
      <p>We'll send you more details about the venues and schedule closer to the date.</p>
      <p>With love,<br>Incia & Arvin</p>
    </div>
  `;
}

export function generateContactNotificationEmail(name: string, email: string, subject: string, message: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #8B7355;">New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
    </div>
  `;
}

export function generateRSVPFormEmail(data: {
  guestName?: string
  willAttendDhaka: 'yes' | 'no' | 'maybe' | ''
  familySide: 'bride' | 'groom' | 'both' | ''
  guestCountOption: '1' | '2' | '3' | '4' | 'other' | ''
  guestCountOther?: string
  additionalInfo?: string
  contact: {
    preferred: { number: string; whatsapp: boolean; botim: boolean }
    secondary: { number: string; whatsapp: boolean; botim: boolean }
    emergency: { name: string; phone: string; email: string }
    email: string
  }
}) {
  // Map form values to full descriptive text (matching form labels)
  const attendanceOptions = {
    'yes': 'Yes, I will attend',
    'no': 'No, I will not attend', 
    'maybe': 'Maybe'
  } as const
  
  const familySideOptions = {
    'bride': "The Bride's Family",
    'groom': "The Groom's Family",
    'both': 'Both Families'
  } as const

  const attendanceText = data.willAttendDhaka && data.willAttendDhaka in attendanceOptions 
    ? attendanceOptions[data.willAttendDhaka as keyof typeof attendanceOptions]
    : '—'

  const familySideText = data.familySide && data.familySide in familySideOptions
    ? familySideOptions[data.familySide as keyof typeof familySideOptions] 
    : '—'

  const guestCountText = data.guestCountOption === 'other' 
    ? `Other: ${data.guestCountOther || '—'} people`
    : data.guestCountOption === '1' 
      ? '1 person'
      : data.guestCountOption 
        ? `${data.guestCountOption} people`
        : '—'

  const rows = [
    ['Guest Name', data.guestName || '—'],
    ['Will attend in Dhaka', attendanceText],
    ["Family Side", familySideText],
    ['Guest Count', guestCountText],
    ['Additional Info', data.additionalInfo || '—'],
    ['Preferred Number', `${data.contact.preferred.number || '—'} (WhatsApp: ${data.contact.preferred.whatsapp ? 'Yes' : 'No'}, Botim: ${data.contact.preferred.botim ? 'Yes' : 'No'})`],
    ['Secondary Number', `${data.contact.secondary.number || '—'} (WhatsApp: ${data.contact.secondary.whatsapp ? 'Yes' : 'No'}, Botim: ${data.contact.secondary.botim ? 'Yes' : 'No'})`],
    ['Emergency Contact', `${data.contact.emergency.name || '—'} / ${data.contact.emergency.phone || '—'} / ${data.contact.emergency.email || '—'}`],
    ['Email', data.contact.email || '—'],
  ]

  const tr = rows
    .map(([k, v]) => `<tr><td style="padding:8px;border:1px solid #eee;font-weight:600">${k}</td><td style="padding:8px;border:1px solid #eee">${v}</td></tr>`) 
    .join('')

  return `
    <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto;">
      <h1 style="color: #8B7355; text-align: center;">RSVP Received</h1>
      <p style="text-align:center">Thank you${data.guestName ? `, ${data.guestName}` : ''}! We've received your RSVP.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px">${tr}</table>
      <p style="margin-top:16px">With love,<br/>Incia & Arvin</p>
    </div>
  `
}
