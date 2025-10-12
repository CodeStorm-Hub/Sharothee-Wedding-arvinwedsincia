# 🚀 Quick Reference - Email Migration

## ✅ Status: READY TO DEPLOY

All code changes are complete. Follow these steps to go live.

---

## 📋 5-Minute Deployment Checklist

### ☑️ Step 1: Deploy to Vercel
```bash
cd api-serverless
vercel --prod
```
**Copy the URL** (e.g., `https://wedding-email-api.vercel.app`)

### ☑️ Step 2: Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
- `GMAIL_USER` = `codestromhub@gmail.com`
- `GMAIL_APP_PASSWORD` = `rfmltjgaqdtzqhpv`  
- `ALLOWED_ORIGINS` = `https://codestorm-hub.github.io,http://localhost:3000`

Then redeploy:
```bash
vercel --prod
```

### ☑️ Step 3: Test API
```bash
./test-api.sh https://wedding-email-api.vercel.app/api/send-email
```
✅ Verify emails arrive at both addresses

### ☑️ Step 4: Add GitHub Secret
Repository → Settings → Secrets → Actions
- Name: `EMAIL_API_URL`
- Value: `https://wedding-email-api.vercel.app/api/send-email`

### ☑️ Step 5: Deploy GitHub Pages
Push to main or trigger workflow manually

### ☑️ Step 6: Test Production
Visit: `https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/contact`
- Submit test form
- Verify email received

---

## 📖 Documentation Quick Links

| Need to... | Read this... |
|------------|--------------|
| **Get started** | EMAIL_MIGRATION_GUIDE.md |
| **Deploy to Vercel** | SERVERLESS_EMAIL_API_DEPLOYMENT.md |
| **Test on production** | PRODUCTION_TESTING_GUIDE.md |
| **Understand changes** | MIGRATION_COMPLETE.md |
| **API reference** | api-serverless/README.md |

---

## 🎯 What Changed

### Before: Web3Forms ❌
- Third-party service
- Public API key required
- Limited control

### After: Gmail via Vercel ✅  
- Your own infrastructure
- Encrypted credentials
- Full control

---

## 🏗️ Simple Architecture

```
Your Static Site
       ↓
Vercel API (you deploy this)
       ↓
Gmail SMTP
       ↓
Emails delivered ✉️
```

---

## 🧪 Quick Test

After deployment, test with:
```bash
curl -X POST https://YOUR-VERCEL-URL/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"formType":"Contact","data":{"name":"Test","email":"test@example.com","subject":"Test","message":"Testing"}}'
```

Should return:
```json
{"success":true,"message":"Contact submitted successfully!"}
```

---

## 💰 Cost

- **Vercel:** Free
- **Gmail:** Free
- **Total:** $0/month

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| API 500 error | Check Vercel env vars |
| CORS error | Add your domain to ALLOWED_ORIGINS |
| No email | Verify Gmail password |
| Timeout | Check EMAIL_API_URL in GitHub |

---

## ✨ Benefits

✅ More secure (encrypted credentials)  
✅ Better control (your infrastructure)  
✅ Better monitoring (Vercel logs)  
✅ More reliable (no third-party dependency)  
✅ Same cost (free!)

---

## 📞 Support

- **Email:** codestromhub@gmail.com
- **Docs:** See files above
- **Logs:** Vercel dashboard

---

## 🎉 That's It!

**Total time:** ~15 minutes  
**Files to edit:** 0 (code is ready!)  
**Things to deploy:** 1 (the API)

Just follow the checklist above and you're done! 🚀

---

**Start here:** EMAIL_MIGRATION_GUIDE.md  
**Then deploy:** Follow Step 1 above  
**Finally test:** PRODUCTION_TESTING_GUIDE.md
