/**
 * Serverless Email API Endpoint
 * Handles form submissions from static GitHub Pages site
 * Sends emails using Gmail SMTP via nodemailer
 */

const nodemailer = require('nodemailer');

// CORS headers helper
function corsHeaders(origin) {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
  const isAllowed = allowedOrigins.some(allowed => origin?.includes(allowed));
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0] || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// Email transporter (created once per function instance)
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD environment variables not set');
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  return transporter;
}

// Format RSVP data into readable email
function formatRSVPEmail(data) {
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

// Format Contact form data into readable email
function formatContactEmail(data) {
  let message = `New Contact Form Submission\n\n`;
  message += `Name: ${data.name || 'N/A'}\n`;
  message += `Email: ${data.email || 'N/A'}\n`;
  message += `Phone: ${data.phone || 'N/A'}\n`;
  message += `Subject: ${data.subject || 'N/A'}\n\n`;
  message += `Message:\n${data.message || 'N/A'}\n`;
  
  return message;
}

module.exports = async (req, res) => {
  // Handle CORS preflight
  const origin = req.headers.origin || req.headers.referer || '';
  const headers = corsHeaders(origin);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader(...Object.entries(headers).flat()).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { formType, data } = req.body;
    
    // Validate required fields
    if (!formType || !data) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: formType and data' 
      });
    }
    
    // Get email transporter
    const tx = getTransporter();
    
    // Prepare email content based on form type
    let subject, htmlContent, textContent;
    const userEmail = data.contact?.email || data.email || 'Not provided';
    
    if (formType === 'RSVP') {
      subject = `RSVP Submission - Incia & Arvin's Wedding`;
      textContent = formatRSVPEmail(data);
      htmlContent = `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${textContent}</pre>`;
    } else if (formType === 'Contact') {
      subject = `Contact Form: ${data.subject || 'General Inquiry'} - Incia & Arvin's Wedding`;
      textContent = formatContactEmail(data);
      htmlContent = `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${textContent}</pre>`;
    } else {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid formType. Must be either "RSVP" or "Contact"' 
      });
    }
    
    // Send email to wedding organizers
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: ['codestromhub@gmail.com', 'arvincia@sparrow-group.com'],
      subject: subject,
      text: textContent,
      html: htmlContent,
      replyTo: userEmail !== 'Not provided' ? userEmail : undefined,
    };
    
    const info = await tx.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    // Set CORS headers and return success
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    return res.status(200).json({
      success: true,
      message: `${formType} submitted successfully! We'll get back to you soon.`,
      messageId: info.messageId,
    });
    
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Set CORS headers even for errors
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    return res.status(500).json({
      success: false,
      error: 'Failed to send email. Please try again or contact us directly at arvincia@sparrow-group.com',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
