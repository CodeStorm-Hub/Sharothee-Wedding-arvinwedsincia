/**
 * Form submission handler
 * Uses Next.js API routes with Gmail SMTP
 * For production deployment on VPS/server platforms (not GitHub Pages static export)
 */

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  error?: string;
}

interface RSVPFormData {
  guestName?: string;
  willAttendDhaka?: string;
  familySide?: string;
  guestCountOption?: string;
  guestCountOther?: string;
  additionalInfo?: string;
  contact?: {
    email?: string;
    preferred?: { number?: string; whatsapp?: boolean; botim?: boolean };
    secondary?: { number?: string; whatsapp?: boolean; botim?: boolean };
    emergency?: { name?: string; phone?: string; email?: string };
  };
  email?: string;
}

interface ContactFormData {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

/**
 * Check if we're in server mode with API routes available
 */
export function isServerMode(): boolean {
  // Always use API routes (they use Gmail SMTP via nodemailer)
  // This works for VPS/server deployments (Vercel, Hostinger, etc.)
  // Note: GitHub Pages static export cannot use API routes
  return true;
}

/**
 * Submit RSVP form via Next.js API route
 * Uses Gmail SMTP on the backend
 */
export async function submitRSVPForm(data: RSVPFormData): Promise<FormSubmissionResult> {
  try {
    // Use Next.js API route (uses Gmail SMTP via nodemailer)
    const response = await fetch('/api/rsvp/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Failed to submit RSVP',
        error: result.error,
      };
    }

    return {
      success: true,
      message: 'RSVP submitted successfully!',
    };
  } catch (error) {
    console.error('RSVP submission error:', error);
    return {
      success: false,
      message: 'Failed to submit RSVP. Please try again or contact us directly at arvincia@sparrow-group.com',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Submit contact form via Next.js API route
 * Uses Gmail SMTP on the backend
 */
export async function submitContactForm(data: ContactFormData): Promise<FormSubmissionResult> {
  try {
    // Use Next.js API route (uses Gmail SMTP via nodemailer)
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Failed to send message',
        error: result.error,
      };
    }

    return {
      success: true,
      message: 'Message sent successfully!',
    };
  } catch (error) {
    console.error('Contact form submission error:', error);
    return {
      success: false,
      message: 'Failed to send message. Please try again or contact us directly at arvincia@sparrow-group.com',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


