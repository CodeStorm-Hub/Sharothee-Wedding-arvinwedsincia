/**
 * Serverless form submission handler
 * Uses Gmail-based serverless API for static deployments (GitHub Pages)
 * Falls back to local API routes in server mode
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
 * Check if we're in static export mode (GitHub Pages)
 */
export function isStaticMode(): boolean {
  if (typeof window === 'undefined') return false;
  // Check if API routes are available by testing environment
  const isGitHubPages = window.location.hostname.includes('github.io');
  const apiAvailable = process.env.NEXT_PUBLIC_API_AVAILABLE === 'true';
  return isGitHubPages || !apiAvailable;
}

/**
 * Get the serverless email API URL
 */
function getEmailApiUrl(): string {
  // Use environment variable if set, otherwise default to Vercel deployment
  return process.env.NEXT_PUBLIC_EMAIL_API_URL || 'https://wedding-email-api.vercel.app/api/send-email';
}

/**
 * Submit RSVP form
 * In static mode: sends email via serverless Gmail API
 * In server mode: uses Next.js API route
 */
export async function submitRSVPForm(data: RSVPFormData): Promise<FormSubmissionResult> {
  try {
    if (isStaticMode()) {
      // Use serverless Gmail API for static deployment
      return await submitViaEmailAPI(data, 'RSVP');
    } else {
      // Use Next.js API route for server deployment
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
    }
  } catch (error) {
    console.error('RSVP submission error:', error);
    return {
      success: false,
      message: 'Failed to submit RSVP. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Submit contact form
 * In static mode: sends email via serverless Gmail API
 * In server mode: uses Next.js API route
 */
export async function submitContactForm(data: ContactFormData): Promise<FormSubmissionResult> {
  try {
    if (isStaticMode()) {
      // Use serverless Gmail API for static deployment
      return await submitViaEmailAPI(data, 'Contact');
    } else {
      // Use Next.js API route for server deployment
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
    }
  } catch (error) {
    console.error('Contact form submission error:', error);
    return {
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Submit form via serverless Email API
 * Uses Gmail SMTP via Vercel serverless function
 */
async function submitViaEmailAPI(
  data: RSVPFormData | ContactFormData,
  formType: 'RSVP' | 'Contact'
): Promise<FormSubmissionResult> {
  try {
    const apiUrl = getEmailApiUrl();
    
    // Submit to serverless email API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formType,
        data,
      }),
    });

    const result = await response.json();

    if (result.success) {
      // Also store in localStorage for reference
      storeSubmissionLocally(formType, data);
      
      return {
        success: true,
        message: result.message || `${formType} submitted successfully! We'll get back to you soon.`,
      };
    } else {
      return {
        success: false,
        message: result.error || `Failed to submit ${formType}. Please email us directly at arvincia@sparrow-group.com`,
        error: result.error,
      };
    }
  } catch (error) {
    console.error('Email API submission error:', error);
    return {
      success: false,
      message: 'Failed to send email. Please contact us directly at arvincia@sparrow-group.com',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Store submission in localStorage for offline reference
 */
function storeSubmissionLocally(formType: string, data: RSVPFormData | ContactFormData): void {
  try {
    const key = `${formType.toLowerCase()}_submissions`;
    const existing = localStorage.getItem(key);
    const submissions = existing ? JSON.parse(existing) : [];
    
    submissions.push({
      ...data,
      timestamp: new Date().toISOString(),
    });
    
    localStorage.setItem(key, JSON.stringify(submissions));
  } catch (error) {
    console.error('Failed to store submission locally:', error);
  }
}
