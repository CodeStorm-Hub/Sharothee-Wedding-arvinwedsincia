# Post-Deployment Testing Guide

This guide provides a comprehensive testing checklist for verifying the wedding website deployment on GitHub Pages.

## 🎯 Testing Overview

After deploying to GitHub Pages, you should test:
1. Page loading and navigation
2. Image display
3. Form submissions
4. Responsive design
5. Browser compatibility
6. Performance

## 📋 Pre-Testing Setup

### Get Your Live URL

Your website URL will be:
```
https://<username>.github.io/<repository-name>/
```

Example:
```
https://codestorm-hub.github.io/Sharothee-Wedding-arvinwedsincia/
```

### Wait for Deployment

- **First deployment**: 3-5 minutes
- **Subsequent deployments**: 1-2 minutes
- Check Actions tab for completion status

### Clear Browser Cache

Before testing:
- Press `Ctrl + Shift + R` (Windows/Linux)
- Press `Cmd + Shift + R` (Mac)
- Or use incognito/private mode

## ✅ Test Checklist

### 1. Homepage Tests

#### Visual Elements
- [ ] Hero section loads with couple names
- [ ] Love story section displays
- [ ] Story images load (3+ images)
- [ ] Timeline/journey section shows
- [ ] Call-to-action buttons visible
- [ ] Navigation menu appears

#### Navigation
- [ ] All navigation links work
- [ ] Smooth scrolling (if enabled)
- [ ] Logo/title links to homepage
- [ ] Mobile menu opens/closes

#### Footer
- [ ] Footer displays at bottom
- [ ] Social media links work
- [ ] Contact information visible
- [ ] Copyright text shows

**Test URL**: `https://<your-url>/`

### 2. Events Page Tests

#### Content Display
- [ ] All wedding events listed (Mehndi, Wedding, Reception, etc.)
- [ ] Event dates and times correct
- [ ] Venue information displayed
- [ ] Event images load
- [ ] Event descriptions visible

#### Interactive Elements
- [ ] "Add to Calendar" buttons work (if present)
- [ ] "View Details" buttons expand/link
- [ ] Google Maps embeds load
- [ ] Countdown timers work (if present)

**Test URL**: `https://<your-url>/events/`

### 3. RSVP Page Tests

#### Form Display
- [ ] RSVP form loads completely
- [ ] All form fields visible:
  - [ ] Full Name field
  - [ ] Email field
  - [ ] Attendance radio buttons
  - [ ] Family side radio buttons
  - [ ] Guest count options
  - [ ] Contact details fields
  - [ ] Additional info textarea
- [ ] Required field indicators show (*)
- [ ] Submit button visible

#### Form Validation
- [ ] Empty form shows validation errors
- [ ] Invalid email shows error
- [ ] Required fields marked clearly
- [ ] Error messages appear for missing fields
- [ ] Validation clears when field is filled

#### Form Submission
- [ ] Fill out complete form
- [ ] Click "Submit RSVP"
- [ ] Success message appears
- [ ] Email notification received (check configured email)
- [ ] Form data included in email
- [ ] Submitter's email in notification

**Test Data**:
```
Name: Test Guest
Email: your-test-email@example.com
Will Attend: Yes
Family Side: Bride's Family
Guest Count: 2 people
Preferred Contact: +1234567890
Email: your-test-email@example.com
```

**Test URL**: `https://<your-url>/rsvp/`

### 4. Contact Page Tests

#### Form Display
- [ ] Contact form loads
- [ ] All fields visible:
  - [ ] Name field
  - [ ] Email field
  - [ ] Phone field (optional)
  - [ ] Subject dropdown
  - [ ] Message textarea
- [ ] Submit button visible
- [ ] Emergency contacts section displays

#### Form Validation
- [ ] Empty form shows errors
- [ ] Invalid email shows error
- [ ] Short message (< 10 chars) shows error
- [ ] Subject selection required
- [ ] Validation clears on input

#### Form Submission
- [ ] Fill out form completely
- [ ] Click "Send Message"
- [ ] Success message displays
- [ ] Email notification received
- [ ] Message content correct
- [ ] Contact info included

**Test Data**:
```
Name: Test User
Email: your-test-email@example.com
Phone: +1234567890 (optional)
Subject: General Questions
Message: This is a test message to verify the contact form works correctly.
```

**Test URL**: `https://<your-url>/contact/`

### 5. Gallery Page Tests

#### Image Display
- [ ] Gallery images load
- [ ] All images visible (8+ images)
- [ ] Images properly sized
- [ ] Image grid/layout correct
- [ ] No broken image icons

#### Interactive Features
- [ ] Click image to enlarge (if lightbox enabled)
- [ ] Navigate between images
- [ ] Close lightbox works
- [ ] Captions display (if present)
- [ ] Categories/filters work (if present)

**Test URL**: `https://<your-url>/gallery/`

### 6. Live Streaming Page Tests

#### Display
- [ ] Live stream section visible
- [ ] Event information displayed
- [ ] Stream schedule shown
- [ ] Countdown timer works (if enabled)

#### Functionality
- [ ] Stream embed loads (if active)
- [ ] Video player controls work
- [ ] Audio toggles correctly
- [ ] Fullscreen works

**Test URL**: `https://<your-url>/live/`

### 7. Travel Page Tests

#### Content
- [ ] Travel information displays
- [ ] Hotel listings visible
- [ ] Transportation details shown
- [ ] Maps load correctly
- [ ] Contact information displayed

#### Links
- [ ] Hotel booking links work
- [ ] Google Maps links open
- [ ] Transportation links functional
- [ ] External links open in new tab

**Test URL**: `https://<your-url>/travel/`

### 8. Image Loading Tests

#### Homepage Images
```bash
# Check these images load:
/images/story/love-across-continents-1.jpg
/images/story/tuscany-proposal 1.jpg
/images/story/university-years.jpg
/images/heart/couple.jpeg
/images/heart/cake.jpeg
```

#### Gallery Images
```bash
# Check these images load:
/images/gallery/gallery-1.jpg
/images/gallery/gallery-2.jpg
/images/gallery/gallery-3.jpg
/images/gallery/gallery-4.jpg
/images/gallery/gallery-5.jpg
/images/gallery/gallery-6.jpg
/images/gallery/gallery-7.jpg
/images/gallery/gallery-8.jpg
```

#### Event Images
```bash
# Check these images load:
/images/event/Akdh.jpeg
/images/event/Holud.jpeg
/images/event/Reception.jpeg
```

### 9. Responsive Design Tests

#### Mobile (320px - 480px)
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPhone 12 Pro (390px)
- [ ] Navigation menu works
- [ ] Forms are usable
- [ ] Images scale correctly
- [ ] Text is readable
- [ ] Buttons are tappable (48px min)
- [ ] No horizontal scroll

#### Tablet (481px - 768px)
- [ ] Test on iPad (768px)
- [ ] Test on iPad Mini (768px)
- [ ] Layout adapts properly
- [ ] Forms use full width
- [ ] Images display correctly
- [ ] Navigation works

#### Desktop (769px+)
- [ ] Test on laptop (1024px)
- [ ] Test on desktop (1920px)
- [ ] Test on wide screen (2560px)
- [ ] Layout is centered
- [ ] Images not pixelated
- [ ] Whitespace balanced

### 10. Browser Compatibility Tests

Test on multiple browsers:

#### Chrome/Edge (Chromium)
- [ ] All pages load
- [ ] Forms submit
- [ ] Images display
- [ ] Animations work

#### Firefox
- [ ] All pages load
- [ ] Forms submit
- [ ] Images display
- [ ] Styles render correctly

#### Safari
- [ ] All pages load
- [ ] Forms submit
- [ ] Images display
- [ ] iOS Safari works

#### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet
- [ ] Firefox Mobile

### 11. Performance Tests

#### Page Load Speed
- [ ] Homepage loads < 3 seconds
- [ ] Other pages load < 2 seconds
- [ ] Images load progressively
- [ ] No blocking resources

#### Lighthouse Test
Run Chrome DevTools Lighthouse:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit

**Target Scores**:
- [ ] Performance: 70+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 90+

#### Network Test
Test on slow connection:
1. Open DevTools (F12)
2. Go to Network tab
3. Select "Slow 3G"
4. Refresh page

- [ ] Page loads completely
- [ ] Images load (even if slowly)
- [ ] Forms still work
- [ ] No errors

### 12. Console Error Tests

Check browser console for errors:
1. Open DevTools (F12)
2. Go to Console tab
3. Refresh each page
4. Check for errors

- [ ] No JavaScript errors
- [ ] No 404 errors
- [ ] No CORS errors
- [ ] Only warnings acceptable (not errors)

### 13. Email Notification Tests

#### RSVP Notification
After submitting RSVP form, check email:
- [ ] Subject: "RSVP Submission - Incia & Arvin's Wedding"
- [ ] From: Wedding Website
- [ ] To: codestromhub@gmail.com
- [ ] CC: arvincia@sparrow-group.com
- [ ] Contains guest name
- [ ] Contains attendance choice
- [ ] Contains guest count
- [ ] Contains contact details
- [ ] Contains submitter's email

#### Contact Notification
After submitting contact form, check email:
- [ ] Subject: "Contact Submission - Incia & Arvin's Wedding"
- [ ] From: Wedding Website
- [ ] To: codestromhub@gmail.com
- [ ] CC: arvincia@sparrow-group.com
- [ ] Contains sender name
- [ ] Contains message subject
- [ ] Contains message content
- [ ] Contains contact phone (if provided)
- [ ] Contains submitter's email

### 14. SEO Tests

#### Meta Tags
View page source and check:
- [ ] Title tag present
- [ ] Meta description present
- [ ] Open Graph tags for social sharing
- [ ] Favicon loads

#### Social Sharing
Test sharing on:
- [ ] Facebook (preview shows correctly)
- [ ] Twitter (card displays)
- [ ] WhatsApp (preview works)
- [ ] LinkedIn (card shows)

### 15. Accessibility Tests

#### Keyboard Navigation
- [ ] Tab through all links
- [ ] Tab through form fields
- [ ] Submit forms with Enter
- [ ] Close modals with Escape
- [ ] No keyboard traps

#### Screen Reader
Test with screen reader (NVDA/JAWS/VoiceOver):
- [ ] Page structure makes sense
- [ ] Forms are labeled correctly
- [ ] Images have alt text
- [ ] Links are descriptive
- [ ] Errors are announced

#### WCAG Compliance
- [ ] Color contrast sufficient (4.5:1)
- [ ] Touch targets ≥ 48x48px
- [ ] Focus indicators visible
- [ ] No text in images (or has alt)
- [ ] Headings in logical order

## 🐛 Common Issues & Fixes

### Images Not Loading

**Symptoms**: Broken image icons

**Check**:
1. Browser console for 404 errors
2. Image paths use correct basePath
3. Images exist in `public/images/` directory

**Fix**: Verify `next.config.ts` basePath configuration

### Forms Not Submitting

**Symptoms**: Error message on submit

**Check**:
1. Web3Forms API key is set in GitHub Secrets
2. Key is properly configured in workflow
3. Check Web3Forms dashboard for issues

**Fix**: Verify `WEB3FORMS_ACCESS_KEY` secret

### Pages Return 404

**Symptoms**: Page not found error

**Check**:
1. Wait 2-3 minutes after deployment
2. Clear browser cache
3. Check `.nojekyll` file exists
4. Verify GitHub Pages is enabled

**Fix**: Hard refresh or check deployment logs

### Slow Loading

**Symptoms**: Pages take > 5 seconds to load

**Check**:
1. Image file sizes (should be < 500KB each)
2. Network tab in DevTools
3. Check CDN status

**Fix**: Optimize images or wait for CDN propagation

## 📊 Testing Report Template

Create a testing report:

```markdown
# Deployment Testing Report

**Date**: YYYY-MM-DD
**Tester**: Your Name
**Live URL**: https://<username>.github.io/<repository>/
**Commit**: <commit-hash>

## Summary
- Total Tests: 100
- Passed: 98
- Failed: 2
- Blocked: 0

## Failed Tests
1. **Gallery lightbox**: Not opening on mobile Safari
   - Severity: Medium
   - Action: Create bug report

2. **RSVP form**: Validation message not clearing
   - Severity: Low
   - Action: Fix in next release

## Browser Compatibility
- Chrome 120: ✅ Pass
- Firefox 121: ✅ Pass
- Safari 17: ⚠️ Partial (lightbox issue)
- Edge 120: ✅ Pass
- Chrome Mobile: ✅ Pass
- Safari iOS: ⚠️ Partial (lightbox issue)

## Performance
- Lighthouse Score: 85/100
- Page Load: 2.1s (target: < 3s)
- Time to Interactive: 3.2s

## Recommendations
1. Fix Safari lightbox compatibility
2. Optimize largest contentful paint
3. Consider lazy loading for below-fold images

## Sign-off
Tested by: _______________
Date: _______________
```

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ All pages load without errors
- ✅ All images display correctly
- ✅ Forms submit and send email notifications
- ✅ Mobile responsive on all devices
- ✅ No console errors
- ✅ Lighthouse score > 70
- ✅ Works on Chrome, Firefox, Safari, Edge
- ✅ Keyboard navigation works
- ✅ Email notifications received

## 📞 Support

If tests fail:
1. Check **GITHUB_ACTIONS_DEPLOYMENT_GUIDE.md** troubleshooting section
2. Review deployment logs in Actions tab
3. Open an issue with test results
4. Email: codestromhub@gmail.com

## 🔄 Continuous Testing

After deployment:
- Test weekly during development
- Test before major events
- Test after content updates
- Monitor email notifications
- Check analytics regularly

---

**Last Updated**: October 2024
**Version**: 1.0
