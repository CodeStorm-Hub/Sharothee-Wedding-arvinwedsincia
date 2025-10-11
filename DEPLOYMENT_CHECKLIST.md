# 🚀 DEPLOYMENT CHECKLIST - Follow These Steps

This is your step-by-step checklist to deploy the wedding website to GitHub Pages. Follow each step in order and check them off as you complete them.

---

## ✅ PRE-DEPLOYMENT CHECKLIST

### Step 1: Get Web3Forms API Key (2 minutes)

- [ ] Go to **https://web3forms.com**
- [ ] Click **"Get Started for Free"**
- [ ] Sign up with email or GitHub account
- [ ] Verify your email address
- [ ] Click **"Create New Form"** in dashboard
- [ ] Form Name: `Wedding Website - Contact & RSVP`
- [ ] Set email recipients:
  - [ ] Primary email: `codestromhub@gmail.com`
  - [ ] Additional CC: `arvincia@sparrow-group.com`
- [ ] **COPY YOUR ACCESS KEY** (looks like: `abc123-def4-56gh-ijkl-789mnopqrst`)
  - [ ] Save it somewhere safe (you'll need it in Step 2)

**✅ Step 1 Complete!** You now have your Web3Forms Access Key.

---

### Step 2: Configure GitHub Repository (3 minutes)

#### 2.1: Add Web3Forms Secret

- [ ] Open your repository on GitHub
- [ ] Click **"Settings"** tab (top right)
- [ ] In left sidebar, click **"Secrets and variables"** → **"Actions"**
- [ ] Click **"New repository secret"** (green button)
- [ ] Fill in:
  - Name: `WEB3FORMS_ACCESS_KEY` (exact spelling, all caps)
  - Value: [Paste your Access Key from Step 1]
- [ ] Click **"Add secret"**
- [ ] ✅ You should see "WEB3FORMS_ACCESS_KEY" in the list

#### 2.2: Enable GitHub Pages

- [ ] Still in Settings, scroll down left sidebar to **"Pages"**
- [ ] Under **"Build and deployment"**:
  - Source: Select **"GitHub Actions"** (NOT "Deploy from a branch")
- [ ] Click **"Save"** if prompted
- [ ] ✅ You should see: "Your site will be published from GitHub Actions"

#### 2.3: Verify Workflow Permissions

- [ ] In left sidebar, click **"Actions"** → **"General"**
- [ ] Scroll to **"Workflow permissions"**
- [ ] Select: **"Read and write permissions"**
- [ ] Check: ✅ **"Allow GitHub Actions to create and approve pull requests"**
- [ ] Click **"Save"** at bottom

**✅ Step 2 Complete!** GitHub is now configured for deployment.

---

### Step 3: Merge or Push to Main (1 minute)

#### Option A: If Using a Pull Request (Recommended)

- [ ] Go to your Pull Request (this PR)
- [ ] Review the changes one more time
- [ ] Click **"Merge pull request"**
- [ ] Click **"Confirm merge"**
- [ ] ✅ PR merged! GitHub Actions will start automatically.

#### Option B: If Pushing Directly to Main

- [ ] Ensure you're on the correct branch
- [ ] Run: `git push origin main`
- [ ] ✅ Pushed! GitHub Actions will start automatically.

**✅ Step 3 Complete!** Deployment has been triggered.

---

## 🔄 DEPLOYMENT IN PROGRESS

### Step 4: Monitor Deployment (2-4 minutes)

- [ ] Go to **"Actions"** tab in your repository
- [ ] You should see a workflow run: **"Deploy Next.js site to Pages"**
- [ ] Click on the workflow run to see details
- [ ] Wait for both jobs to complete:
  - [ ] **build** job (takes ~2-3 minutes)
    - [ ] Checkout
    - [ ] Setup Node
    - [ ] Install dependencies
    - [ ] Generate Prisma client
    - [ ] Create environment file
    - [ ] Build with Next.js
    - [ ] Upload artifact
  - [ ] **deploy** job (takes ~30-60 seconds)
    - [ ] Deploy to GitHub Pages

**Troubleshooting**:
- ❌ If build fails: Check error logs, verify Web3Forms secret is set
- ❌ If deploy fails: Check GitHub Pages is enabled, workflow permissions are correct

**✅ Step 4 Complete!** Both jobs should show green checkmarks.

---

## 🌐 POST-DEPLOYMENT VERIFICATION

### Step 5: Access Your Live Website (1 minute)

- [ ] Wait 1-2 minutes after deployment completes (for DNS propagation)
- [ ] Open your browser
- [ ] Go to: **https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/**
  - Replace with your actual GitHub username and repository name if different
- [ ] ✅ Website loads successfully!

**First Time Loading?**
- Clear cache: Press `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Or use Incognito/Private mode

---

### Step 6: Test Pages (3 minutes)

Visit each page and verify it loads:

- [ ] **Homepage** (`/`)
  - [ ] Hero section shows couple names
  - [ ] Love story images load
  - [ ] Navigation menu works
  
- [ ] **Events** (`/events`)
  - [ ] Wedding events listed
  - [ ] Event images display
  - [ ] Dates and venues shown
  
- [ ] **Gallery** (`/gallery`)
  - [ ] All 8+ images display
  - [ ] No broken image icons
  
- [ ] **Live** (`/live`)
  - [ ] Live streaming section visible
  
- [ ] **Travel** (`/travel`)
  - [ ] Travel information displays
  
- [ ] **RSVP** (`/rsvp`)
  - [ ] Form loads completely
  - [ ] All fields visible
  
- [ ] **Contact** (`/contact`)
  - [ ] Contact form loads
  - [ ] Emergency contacts shown

**✅ Step 6 Complete!** All pages are loading correctly.

---

### Step 7: Test RSVP Form (3 minutes)

- [ ] Go to `/rsvp` page
- [ ] Fill out the form with test data:
  - Full Name: `Test Guest`
  - Email: `[your-email]@example.com`
  - Will attend: Select **"Yes"**
  - Family Side: Select **"Bride's Family"**
  - Guest Count: Select **"2 people"**
  - Preferred Contact: `+1234567890`
- [ ] Click **"Submit RSVP"**
- [ ] ✅ Success message appears: "Thank You! Your RSVP has been received..."

**Then check email**:
- [ ] Open email for: `codestromhub@gmail.com`
- [ ] You should receive an email with subject: **"RSVP Submission - Incia & Arvin's Wedding"**
- [ ] Email should contain:
  - [ ] Guest name: Test Guest
  - [ ] Attendance: Yes
  - [ ] Guest count: 2
  - [ ] Contact details
  - [ ] Submitter's email

**✅ Step 7 Complete!** RSVP form is working and sending emails.

---

### Step 8: Test Contact Form (3 minutes)

- [ ] Go to `/contact` page
- [ ] Fill out the form with test data:
  - Name: `Test User`
  - Email: `[your-email]@example.com`
  - Subject: Select **"General Questions"**
  - Message: `This is a test message to verify the contact form works correctly.`
- [ ] Click **"Send Message"**
- [ ] ✅ Success message appears: "Thank You! Please send your message directly to our email..."

**Then check email**:
- [ ] Open email for: `codestromhub@gmail.com`
- [ ] You should receive an email with subject: **"Contact Submission - Incia & Arvin's Wedding"**
- [ ] Email should contain:
  - [ ] Sender name: Test User
  - [ ] Message subject: General Questions
  - [ ] Message content
  - [ ] Submitter's email

**✅ Step 8 Complete!** Contact form is working and sending emails.

---

### Step 9: Run Automated Verification (2 minutes)

**On your local machine**:

- [ ] Open terminal/command prompt
- [ ] Navigate to repository directory
- [ ] Run verification script:
  ```bash
  bash scripts/verify-deployment.sh https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia
  ```
- [ ] Review results:
  - [ ] All pages: ✅ PASS
  - [ ] All images: ✅ PASS
  - [ ] Static assets: ✅ PASS
  - [ ] Form pages: ✅ PASS
- [ ] ✅ Script shows: "🎉 All tests passed! (100%)"

**If any tests fail**:
- Wait 2-3 minutes for full deployment
- Clear browser cache
- Run script again

**✅ Step 9 Complete!** Automated verification passed.

---

### Step 10: Test Responsive Design (3 minutes)

**Test on Mobile**:
- [ ] Open site on mobile phone (or use browser DevTools mobile view)
- [ ] Navigation menu works
- [ ] All images display
- [ ] Forms are usable
- [ ] Text is readable
- [ ] Buttons are tappable

**Test on Desktop**:
- [ ] Open site on desktop browser
- [ ] Layout is centered and balanced
- [ ] Images are not pixelated
- [ ] All features work

**✅ Step 10 Complete!** Site is responsive on all devices.

---

## 🎉 DEPLOYMENT COMPLETE!

### Final Checklist

- [x] Web3Forms API key configured
- [x] GitHub repository settings configured
- [x] Code merged/pushed to main
- [x] GitHub Actions workflow completed
- [x] Website is live and accessible
- [x] All pages load correctly
- [x] All images display
- [x] RSVP form works and sends emails
- [x] Contact form works and sends emails
- [x] Automated verification passed
- [x] Responsive design verified

**🎊 Congratulations! Your wedding website is now live!**

**Live URL**: https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/

---

## 📋 What To Do Next

### Share Your Website

- [ ] Share URL with family and friends
- [ ] Post on social media (if desired)
- [ ] Send in wedding invitations
- [ ] Email to guest list

### Monitor and Maintain

- [ ] Check email notifications daily for new RSVPs
- [ ] Monitor form submissions
- [ ] Update event details as needed
- [ ] Add more photos to gallery

### Update Content (When Needed)

1. Make changes to code in repository
2. Push to main branch
3. GitHub Actions will automatically rebuild and redeploy
4. Changes live in 2-4 minutes

---

## 🆘 Troubleshooting

### Issue: Forms Not Sending Emails

**Check**:
- [ ] `WEB3FORMS_ACCESS_KEY` secret is set correctly
- [ ] Web3Forms account is active
- [ ] Email addresses in Web3Forms dashboard are correct

**Fix**:
- Log in to Web3Forms dashboard
- Verify form is active
- Check email recipients
- Test form submission again

### Issue: Images Not Loading

**Check**:
- [ ] Wait 2-3 minutes for full deployment
- [ ] Clear browser cache (`Ctrl+Shift+R`)
- [ ] Try incognito/private mode

**Fix**:
- Check browser console for 404 errors
- Verify images exist in `client/public/images/`
- Re-run build if needed

### Issue: Page Returns 404

**Check**:
- [ ] GitHub Pages is enabled
- [ ] Source is set to "GitHub Actions"
- [ ] Wait 2-3 minutes for DNS propagation

**Fix**:
- Hard refresh browser
- Check deployment logs in Actions tab
- Verify `.nojekyll` file exists in output

---

## 📞 Get Help

If you encounter issues:

1. **Check Documentation**:
   - `QUICK_DEPLOY_GITHUB_PAGES.md` - Quick fixes
   - `GITHUB_ACTIONS_DEPLOYMENT_GUIDE.md` - Detailed troubleshooting
   - `TESTING_GUIDE.md` - Comprehensive testing

2. **Check Logs**:
   - GitHub Actions tab for build errors
   - Browser console for frontend errors
   - Web3Forms dashboard for form issues

3. **Contact Support**:
   - Email: codestromhub@gmail.com
   - Create GitHub issue in repository

---

## ✅ Success!

You've successfully deployed your wedding website to GitHub Pages with:
- ✅ Working forms with email notifications
- ✅ All images loading correctly
- ✅ Responsive design for all devices
- ✅ Automated CI/CD deployment
- ✅ No third-party VMs required

**Enjoy your wedding website! 💍✨**

---

**Last Updated**: October 2024
**Deployment Platform**: GitHub Pages
**Status**: ✅ LIVE AND WORKING
