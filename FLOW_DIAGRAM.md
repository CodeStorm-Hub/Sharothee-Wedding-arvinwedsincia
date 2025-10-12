# Email System Flow Diagram

## Complete End-to-End Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

1. User visits GitHub Pages site
   https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/
   
   ↓

2. User navigates to Contact or RSVP page
   
   ↓

3. User fills out form
   - Name: John Doe
   - Email: john@example.com
   - Message: Hello!
   
   ↓

4. User clicks "Submit" button

   ↓

┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND PROCESSING                         │
└─────────────────────────────────────────────────────────────────┘

5. React form component validates input
   src/lib/serverless-forms.ts
   
   ↓

6. Check: Are we in static mode?
   - GitHub Pages? YES
   - isStaticMode() returns true
   
   ↓

7. Call submitViaEmailAPI()
   - URL: process.env.NEXT_PUBLIC_EMAIL_API_URL
   - Method: POST
   - Body: { formType: "Contact", data: {...} }
   
   ↓

┌─────────────────────────────────────────────────────────────────┐
│                      NETWORK REQUEST                             │
└─────────────────────────────────────────────────────────────────┘

8. Browser sends AJAX request
   
   FROM: https://codestorm-hub.github.io
   TO:   https://wedding-email-api.vercel.app/api/send-email
   
   Headers:
   - Content-Type: application/json
   - Origin: https://codestorm-hub.github.io
   
   Body:
   {
     "formType": "Contact",
     "data": {
       "name": "John Doe",
       "email": "john@example.com",
       "message": "Hello!"
     }
   }
   
   ↓

┌─────────────────────────────────────────────────────────────────┐
│                  VERCEL SERVERLESS FUNCTION                      │
└─────────────────────────────────────────────────────────────────┘

9. Vercel receives request
   api-serverless/api/send-email.js
   
   ↓

10. CORS check
    - Origin in ALLOWED_ORIGINS? YES
    - Add CORS headers to response
    
    ↓

11. Validate request
    - Has formType? YES
    - Has data? YES
    - formType is valid? YES
    
    ↓

12. Create Gmail transporter
    - Host: smtp.gmail.com
    - Port: 465 (SSL)
    - User: process.env.GMAIL_USER
    - Pass: process.env.GMAIL_APP_PASSWORD
    
    ↓

13. Format email content
    - Subject: "Contact Form: Test - Incia & Arvin Wedding"
    - HTML/Text body with form data
    - From: codestromhub@gmail.com
    - Reply-To: john@example.com
    
    ↓

14. Send email via nodemailer
    
    ↓

┌─────────────────────────────────────────────────────────────────┐
│                      GMAIL SMTP SERVER                           │
└─────────────────────────────────────────────────────────────────┘

15. Gmail SMTP receives email
    
    ↓

16. Gmail authenticates
    - Check App Password: VALID ✓
    - Check account: ACTIVE ✓
    
    ↓

17. Gmail sends email
    
    TO:      codestromhub@gmail.com
    CC:      arvincia@sparrow-group.com
    SUBJECT: Contact Form: Test - Incia & Arvin Wedding
    
    ↓

18. Email delivered to inboxes
    
    ✉️  codestromhub@gmail.com  ← Primary recipient
    ✉️  arvincia@sparrow-group.com  ← CC recipient
    
    ↓

┌─────────────────────────────────────────────────────────────────┐
│                      RESPONSE FLOW                               │
└─────────────────────────────────────────────────────────────────┘

19. Gmail returns success
    - messageId: "<unique-id@gmail.com>"
    
    ↓

20. Nodemailer returns result
    - success: true
    - messageId: "<unique-id@gmail.com>"
    
    ↓

21. Vercel function returns response
    {
      "success": true,
      "message": "Contact submitted successfully!",
      "messageId": "<unique-id@gmail.com>"
    }
    
    ↓

22. Browser receives response
    
    ↓

23. Frontend processes response
    - Store submission in localStorage
    - Show success message to user
    
    ↓

24. User sees: "Message sent successfully!" ✅

```

---

## Error Flow Example

```
User submits form
   ↓
Validation fails (missing email)
   ↓
Show error: "Email is required"
   ↓
User corrects and resubmits
   ↓
[Continue normal flow above]
```

---

## Offline Flow Example

```
User submits form
   ↓
No internet connection
   ↓
fetch() throws error
   ↓
Catch error in submitViaEmailAPI()
   ↓
Return: {
  success: false,
  message: "Failed to send email. Please contact us directly..."
}
   ↓
Show fallback message with email address
```

---

## Environment Configuration

### Development (Local)
```
User → http://localhost:3000
       ↓
       Uses local API routes (/api/contact)
       ↓
       Direct database + email
```

### Production (GitHub Pages)
```
User → https://codestorm-hub.github.io/...
       ↓
       Uses Vercel serverless API
       ↓
       Gmail SMTP
```

---

## Security Layers

```
1. CORS Check
   ├─ Is origin allowed?
   └─ If NO → Reject with CORS error

2. Input Validation
   ├─ Has required fields?
   └─ If NO → 400 Bad Request

3. Authentication
   ├─ Valid Gmail credentials?
   └─ If NO → 500 Server Error

4. SSL/TLS
   ├─ HTTPS everywhere
   └─ Encrypted in transit

5. Environment Variables
   ├─ Stored in Vercel (encrypted)
   └─ Never exposed to client
```

---

## Timing Breakdown

| Step | Process | Time |
|------|---------|------|
| 1-4 | User fills form | ~30s |
| 5-7 | Frontend validation | <100ms |
| 8 | Network request | ~200ms |
| 9-14 | Vercel processing | ~500ms |
| 15-17 | Gmail SMTP | ~1-2s |
| 18 | Email delivery | <1min |
| 19-24 | Response handling | <100ms |
| **Total** | **Form → Success** | **~3s** |
| **Email delivery** | **Total → Inbox** | **<2min** |

---

## Data Flow

```
┌─────────────┐
│  Form Data  │
└──────┬──────┘
       │
       ├─→ Client-side validation
       │   └─→ Zod schema check
       │
       ├─→ AJAX POST to Vercel
       │   └─→ JSON stringified
       │
       ├─→ Vercel function
       │   ├─→ Parse JSON
       │   ├─→ Format email
       │   └─→ Send via SMTP
       │
       ├─→ Gmail inbox
       │   └─→ HTML formatted
       │
       └─→ Success response
           └─→ User confirmation
```

---

## Deployment Flow

```
Developer                 Vercel                 GitHub Pages
    │                        │                        │
    ├─ Push code            │                        │
    │  to api-serverless/   │                        │
    │                       │                        │
    ├─ vercel --prod ──────►│                        │
    │                       │                        │
    │                       ├─ Build                 │
    │                       ├─ Deploy                │
    │                       └─ Return URL            │
    │                         (wedding-email-api...)│
    │                                                │
    ├─ Add GitHub secret ──────────────────────────►│
    │  EMAIL_API_URL                                │
    │                                                │
    ├─ Push to main ───────────────────────────────►│
    │                                                │
    │                                                ├─ Build
    │                                                ├─ Include URL
    │                                                └─ Deploy
    │                                                │
    └─────────────── Site calls API ────────────────┘
                            ▲
                            │
                         AJAX POST
```

---

## Cost Flow

```
User Request (FREE)
   │
   ↓
GitHub Pages (FREE)
   - Static hosting
   - Unlimited requests
   │
   ↓
Vercel Function (FREE TIER)
   - 100GB bandwidth/month
   - Unlimited invocations
   │
   ↓
Gmail SMTP (FREE)
   - Unlimited sending
   - No cost per email
   │
   ↓
Total Cost: $0/month ✅
```

---

## Monitoring Points

```
1. Vercel Dashboard
   └─→ View function logs
       ├─ Request count
       ├─ Error rate
       ├─ Response time
       └─ Bandwidth usage

2. Gmail Sent Folder
   └─→ Verify emails sent
       ├─ Check delivery
       └─ Review content

3. Browser DevTools
   └─→ Network tab
       ├─ API response
       ├─ Timing
       └─ Errors

4. User Feedback
   └─→ Support emails
       └─ Issues reported
```

---

This diagram shows the complete flow from user interaction to email delivery. Every step is handled with proper error checking and security measures. 🎯
