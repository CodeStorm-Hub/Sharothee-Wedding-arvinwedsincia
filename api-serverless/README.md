# Wedding Email API

Serverless email API for the wedding website form submissions. Deployed on Vercel.

## 🚀 Quick Deploy

**First time setup:**
```bash
npm install -g vercel  # Install Vercel CLI
vercel login           # Login to Vercel
vercel --prod          # Deploy to production
```

**Copy the deployment URL** (e.g., `https://wedding-email-api.vercel.app`)

## ⚙️ Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `GMAIL_USER` | `codestromhub@gmail.com` | Production |
| `GMAIL_APP_PASSWORD` | `rfmltjgaqdtzqhpv` | Production |
| `ALLOWED_ORIGINS` | `https://codestorm-hub.github.io,http://localhost:3000` | Production |

After adding variables:
```bash
vercel --prod  # Redeploy to apply changes
```

## 🧪 Test Deployment

```bash
./test-api.sh https://wedding-email-api.vercel.app/api/send-email
```

Or manually:
```bash
curl -X POST https://wedding-email-api.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -H "Origin: https://codestorm-hub.github.io" \
  -d '{
    "formType": "Contact",
    "data": {
      "name": "Test User",
      "email": "test@example.com",
      "subject": "Test",
      "message": "Testing email API"
    }
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Contact submitted successfully! We'll get back to you soon."
}
```

**Verify:** Check emails at codestromhub@gmail.com and arvincia@sparrow-group.com

## 📝 Next Step

After successful deployment and testing:

1. Copy your API URL: `https://wedding-email-api.vercel.app/api/send-email`
2. Add to GitHub repository secrets as `EMAIL_API_URL`
3. Deploy GitHub Pages site
4. Test on production

See **../EMAIL_MIGRATION_GUIDE.md** for complete instructions.

---

## 📚 API Documentation

### Endpoint: POST /api/send-email

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

### Error Responses

- `400`: Missing/invalid fields
- `405`: Method not allowed (use POST)
- `500`: Server error (email sending failed)

### CORS

Automatically handles CORS for domains in `ALLOWED_ORIGINS`.

### Email Recipients

All submissions sent to:
- `codestromhub@gmail.com` (primary)
- `arvincia@sparrow-group.com` (CC)

### Security

✅ Gmail App Passwords  
✅ CORS protection  
✅ Encrypted env vars  
✅ HTTPS only

## 🛠️ Local Development

```bash
npm install
vercel dev  # Starts local server
```

## 📊 Monitoring

View logs in Vercel Dashboard:
1. Go to your project
2. Deployments → Latest
3. View Function Logs

## 💰 Cost

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited requests
- More than sufficient

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| 500 error | Check env vars in Vercel |
| CORS error | Update ALLOWED_ORIGINS |
| No email | Verify Gmail credentials |
| Timeout | Check API URL |

## 📞 Support

- Email: codestromhub@gmail.com
- Docs: https://vercel.com/docs

---
