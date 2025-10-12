# Wedding Email API

Serverless email API for the wedding website form submissions. Deployed on Vercel.

## Purpose

This API handles email sending for the static GitHub Pages wedding website. Since GitHub Pages only serves static files, this separate serverless API provides the server-side functionality needed to send emails via Gmail SMTP.

## Endpoints

### POST /api/send-email

Sends an email based on form submission data.

**Request Body:**
```json
{
  "formType": "RSVP" | "Contact",
  "data": {
    // For RSVP
    "guestName": "string",
    "email": "string",
    "willAttendDhaka": "yes|no|maybe",
    "familySide": "bride|groom|both",
    "guestCountOption": "1|2|3|4|other",
    "guestCountOther": "string",
    "additionalInfo": "string",
    "contact": {
      "email": "string",
      "preferred": { "number": "string", "whatsapp": boolean, "botim": boolean },
      "secondary": { "number": "string", "whatsapp": boolean, "botim": boolean },
      "emergency": { "name": "string", "phone": "string", "email": "string" }
    }
    
    // For Contact
    "name": "string",
    "email": "string",
    "phone": "string",
    "subject": "string",
    "message": "string"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "string"
}
```

## Environment Variables

Required environment variables for deployment:

- `GMAIL_USER`: Gmail email address for sending emails
- `GMAIL_APP_PASSWORD`: Gmail app password (NOT regular password)
  - Generate at: https://myaccount.google.com/apppasswords
  - Requires 2-Factor Authentication enabled on Gmail account
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (e.g., `https://codestorm-hub.github.io,http://localhost:3000`)

## Deployment

### Prerequisites

1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`

### Deploy to Vercel

```bash
cd api-serverless
vercel --prod
```

### Set Environment Variables

Via Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the required variables

Or via CLI:
```bash
vercel env add GMAIL_USER
vercel env add GMAIL_APP_PASSWORD
vercel env add ALLOWED_ORIGINS
```

## Local Development

```bash
cd api-serverless
npm install
vercel dev
```

This will start a local development server at `http://localhost:3000`.

## Testing

Test the endpoint locally:

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "Contact",
    "data": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+1234567890",
      "subject": "Test Subject",
      "message": "This is a test message"
    }
  }'
```

## CORS Configuration

The API automatically handles CORS for allowed origins. Origins are configured via the `ALLOWED_ORIGINS` environment variable.

## Email Recipients

All form submissions are sent to:
- `codestromhub@gmail.com` (primary)
- `arvincia@sparrow-group.com` (CC)

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (missing/invalid fields)
- `405`: Method not allowed (only POST accepted)
- `500`: Server error (email sending failed)

## Security

- Uses Gmail App Passwords (more secure than regular passwords)
- CORS protection limits which domains can call the API
- No sensitive data logged to console
- Environment variables stored securely in Vercel

## Support

For issues or questions:
- Email: codestromhub@gmail.com
- Repository: https://github.com/CodeStorm-Hub/Sharothee-Wedding-arvinwedsincia
