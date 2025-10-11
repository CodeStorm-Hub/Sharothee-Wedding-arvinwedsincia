/**
 * Serverless form submission handler
 * Uses Web3Forms API for static deployments (GitHub Pages)
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
  return isGitHubPages || !process.env.NEXT_PUBLIC_API_AVAILABLE;
}

/**
 * Submit RSVP form
 * In static mode: sends email via Web3Forms
 * In server mode: uses Next.js API route
 */
export async function submitRSVPForm(data: RSVPFormData): Promise<FormSubmissionResult> {
  try {
    if (isStaticMode()) {
      // Use Web3Forms for static deployment
      return await submitViaWeb3Forms(data, 'RSVP');
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
 * In static mode: sends email via Web3Forms
 * In server mode: uses Next.js API route
 */
export async function submitContactForm(data: ContactFormData): Promise<FormSubmissionResult> {
  try {
    if (isStaticMode()) {
      // Use Web3Forms for static deployment
      return await submitViaWeb3Forms(data, 'Contact');
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
 * Submit form via Web3Forms API
 * This is a free service that sends emails without a backend
 * Sign up at https://web3forms.com to get your access key
 */
async function submitViaWeb3Forms(
  data: RSVPFormData | ContactFormData,
  formType: 'RSVP' | 'Contact'
): Promise<FormSubmissionResult> {
  try {
    // Web3Forms access key - can be public, it's rate-limited per domain
    // Get your free key at https://web3forms.com
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY_HERE';
    
    // Format the data for Web3Forms
    const formData = new FormData();
    formData.append('access_key', accessKey);
    formData.append('subject', `${formType} Submission - Incia & Arvin's Wedding`);
    formData.append('from_name', 'Wedding Website');
    
    // Set from email to codestromhub@gmail.com
    formData.append('from_email', 'codestromhub@gmail.com');
    
    // CC arvincia@sparrow-group.com on all form submissions
    formData.append('cc', 'arvincia@sparrow-group.com');
    
    // Add form-specific data
    if (formType === 'RSVP') {
      const rsvpData = data as RSVPFormData;
      const userEmail = rsvpData.contact?.email || rsvpData.email || 'codestromhub@gmail.com';
      
      // Send email to the user who submitted the form
      formData.append('email', userEmail);
      formData.append('name', rsvpData.guestName || 'Guest');
      formData.append('message', formatRSVPMessage(rsvpData));
    } else {
      const contactData = data as ContactFormData;
      const userEmail = contactData.email || 'codestromhub@gmail.com';
      
      // Send email to the user who submitted the form
      formData.append('email', userEmail);
      formData.append('name', contactData.name || 'Guest');
      formData.append('message', contactData.message || '');
      formData.append('phone', contactData.phone || '');
    }

    // Submit to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      // Also store in localStorage for reference
      storeSubmissionLocally(formType, data);
      
      return {
        success: true,
        message: `${formType} submitted successfully! We'll get back to you soon.`,
      };
    } else {
      return {
        success: false,
        message: `Failed to submit ${formType}. Please email us directly at arvincia@sparrow-group.com`,
        error: result.message,
      };
    }
  } catch (error) {
    console.error('Web3Forms submission error:', error);
    return {
      success: false,
      message: 'Please email us directly at arvincia@sparrow-group.com',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Format RSVP data into a readable email message
 */
function formatRSVPMessage(data: RSVPFormData): string {
  let message = `New RSVP Submission\n\n`;
  message += `Guest Name: ${data.guestName || 'N/A'}\n`;
  message += `Email: ${data.contact?.email || data.email || 'N/A'}\n`;
  message += `Will Attend Dhaka: ${data.willAttendDhaka || 'N/A'}\n`;
  message += `Family Side: ${data.familySide || 'N/A'}\n`;
  message += `Guest Count: ${data.guestCountOption || 'N/A'}`;
  
  if (data.guestCountOther) {
    message += ` (${data.guestCountOther})`;
  }
  
  message += `\n`;
  
  if (data.additionalInfo) {
    message += `\nAdditional Info: ${data.additionalInfo}\n`;
  }
  
  if (data.contact?.preferred?.number) {
    message += `\nPreferred Contact: ${data.contact.preferred.number}`;
    if (data.contact.preferred.whatsapp) message += ' (WhatsApp)';
    if (data.contact.preferred.botim) message += ' (Botim)';
    message += `\n`;
  }
  
  if (data.contact?.secondary?.number) {
    message += `Secondary Contact: ${data.contact.secondary.number}`;
    if (data.contact.secondary.whatsapp) message += ' (WhatsApp)';
    if (data.contact.secondary.botim) message += ' (Botim)';
    message += `\n`;
  }
  
  if (data.contact?.emergency?.name) {
    message += `\nEmergency Contact:\n`;
    message += `Name: ${data.contact.emergency.name}\n`;
    message += `Phone: ${data.contact.emergency.phone || 'N/A'}\n`;
    message += `Email: ${data.contact.emergency.email || 'N/A'}\n`;
  }
  
  return message;
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
