# Production Testing Guide - Email Functionality

## Overview

This guide provides real-life test scenarios to validate the email functionality on the production GitHub Pages site after deploying the serverless API.

## Prerequisites

Before testing:
- ✅ Serverless API deployed to Vercel
- ✅ Vercel environment variables configured
- ✅ GitHub secret EMAIL_API_URL added
- ✅ GitHub Pages deployment completed

## Test Environment

- **Production Site:** https://codestrom-hub.github.io/Sharothee-Wedding-arvinwedsincia/
- **Email Recipients:** 
  - codestromhub@gmail.com (primary)
  - arvincia@sparrow-group.com (CC)

## Test Scenarios

### Scenario 1: Contact Form - Complete Submission

**Objective:** Verify contact form works with all fields filled

**Steps:**
1. Navigate to https://codestrom-hub.github.io/Sharothee-Wedding-arvinwedsincia/contact
2. Fill out the form:
   ```
   Name: John Doe
   Email: john.doe@example.com
   Phone: +1 (555) 123-4567
   Subject: Test Inquiry
   Message: This is a test message to verify the email functionality is working correctly on the production site.
   ```
3. Click "Send Message"
4. Wait for success message

**Expected Results:**
- ✅ Success message appears: "Message sent successfully!"
- ✅ Email received at codestromhub@gmail.com within 1 minute
- ✅ Email received at arvincia@sparrow-group.com within 1 minute
- ✅ Email contains all submitted information
- ✅ Reply-to address is john.doe@example.com

**Actual Results:**
- [ ] Success message appeared
- [ ] Email received at primary address
- [ ] Email received at CC address
- [ ] All data present in email
- [ ] Reply-to correct

---

### Scenario 2: Contact Form - Validation Error

**Objective:** Verify client-side validation works

**Steps:**
1. Navigate to contact page
2. Fill only Name: "Test User"
3. Leave all other fields empty
4. Click "Send Message"

**Expected Results:**
- ✅ Form does NOT submit
- ✅ Validation errors shown for required fields
- ✅ No API call made (check browser Network tab)
- ✅ No email sent

**Actual Results:**
- [ ] Validation prevented submission
- [ ] Error messages displayed
- [ ] No network request
- [ ] No email received

---

### Scenario 3: RSVP Form - Complete Submission

**Objective:** Verify RSVP form with full details

**Steps:**
1. Navigate to https://codestrom-hub.github.io/Sharothee-Wedding-arvinwedsincia/rsvp
2. Fill out the form:
   ```
   Guest Name: Jane Smith
   Email: jane.smith@example.com
   Will attend in Dhaka: Yes, I will attend
   Family Side: The Bride's Family
   Guest Count: 2 people
   Additional Info: Looking forward to celebrating with you!
   
   Contact Information:
   - Preferred Number: +1 (555) 234-5678
   - WhatsApp: Yes
   - Secondary Number: +1 (555) 987-6543
   - Emergency Contact: John Smith / +1 (555) 111-2222 / john.smith@example.com
   ```
3. Click "Submit RSVP"
4. Wait for confirmation

**Expected Results:**
- ✅ Success message appears
- ✅ Email received at both addresses
- ✅ All RSVP details in email
- ✅ Contact information formatted correctly
- ✅ Emergency contact included

**Actual Results:**
- [ ] Success message appeared
- [ ] Email received at both addresses
- [ ] All fields present in email
- [ ] Data formatted correctly

---

### Scenario 4: RSVP Form - Minimal Submission

**Objective:** Verify RSVP works with minimal required fields

**Steps:**
1. Navigate to RSVP page
2. Fill only required fields:
   ```
   Guest Name: Bob Johnson
   Email: bob.j@example.com
   Will attend in Dhaka: Maybe
   Family Side: The Groom's Family
   Guest Count: 1 person
   ```
3. Leave all optional fields empty
4. Submit

**Expected Results:**
- ✅ Form submits successfully
- ✅ Email received
- ✅ No errors for empty optional fields
- ✅ Email shows "N/A" for missing fields

**Actual Results:**
- [ ] Submitted successfully
- [ ] Email received
- [ ] Optional fields handled correctly

---

### Scenario 5: Network Error Handling

**Objective:** Test graceful error handling

**Steps:**
1. Open browser DevTools → Network tab
2. Enable "Offline" mode in DevTools
3. Fill out contact form
4. Try to submit

**Expected Results:**
- ✅ Error message displayed
- ✅ Message suggests contacting directly
- ✅ Shows fallback email: arvincia@sparrow-group.com
- ✅ No page crash or white screen

**Actual Results:**
- [ ] Error handled gracefully
- [ ] Fallback contact info shown
- [ ] No page errors

---

### Scenario 6: Mobile Device Testing

**Objective:** Verify forms work on mobile

**Steps:**
1. Access site on mobile device or DevTools mobile view
2. Test contact form submission
3. Test RSVP form submission

**Expected Results:**
- ✅ Forms display correctly on mobile
- ✅ All fields accessible and usable
- ✅ Submit buttons work
- ✅ Success/error messages visible
- ✅ Emails received

**Actual Results:**
- [ ] Mobile layout correct
- [ ] Forms usable
- [ ] Submissions work
- [ ] Emails received

---

### Scenario 7: API Response Time

**Objective:** Verify acceptable response times

**Steps:**
1. Open browser DevTools → Network tab
2. Submit contact form
3. Check network request timing

**Expected Results:**
- ✅ API responds within 5 seconds
- ✅ Success message appears promptly
- ✅ No timeout errors

**Actual Results:**
- [ ] Response time: _____ seconds
- [ ] Acceptable performance

---

### Scenario 8: Special Characters in Input

**Objective:** Test handling of special characters

**Steps:**
1. Submit contact form with:
   ```
   Name: André O'Brien-Smith
   Email: test+tag@example.com
   Message: Testing special chars: @#$%^&*()_+{}|:"<>?
              Line breaks
              And unicode: 你好 مرحبا 
   ```

**Expected Results:**
- ✅ Form accepts all characters
- ✅ Submission successful
- ✅ Email received with all characters intact
- ✅ No encoding errors

**Actual Results:**
- [ ] Special characters handled
- [ ] Email displays correctly

---

### Scenario 9: Concurrent Submissions

**Objective:** Test multiple submissions in short period

**Steps:**
1. Open 3 browser tabs to contact page
2. Fill different data in each
3. Submit all within 30 seconds

**Expected Results:**
- ✅ All 3 submissions succeed
- ✅ All 3 emails received
- ✅ No rate limiting errors
- ✅ Each email has correct data

**Actual Results:**
- [ ] All submissions successful
- [ ] All emails received
- [ ] No rate limit issues

---

### Scenario 10: Email Delivery Verification

**Objective:** Verify email content and formatting

**Steps:**
1. Submit a test form
2. Check received email

**Expected Results:**
- ✅ Subject line clear and descriptive
- ✅ Sender is Gmail account
- ✅ Reply-to is submitter's email
- ✅ Content formatted and readable
- ✅ All data fields present
- ✅ No HTML rendering errors
- ✅ CC to arvincia@sparrow-group.com visible

**Actual Results:**
- [ ] Subject: _________________
- [ ] Formatting: ☐ Good ☐ Issues
- [ ] All fields present: ☐ Yes ☐ No
- [ ] CC working: ☐ Yes ☐ No

---

## Summary Checklist

After completing all scenarios:

- [ ] Contact form works on desktop
- [ ] Contact form works on mobile
- [ ] RSVP form works on desktop
- [ ] RSVP form works on mobile
- [ ] Validation prevents invalid submissions
- [ ] Errors handled gracefully
- [ ] Emails arrive at both addresses
- [ ] Email formatting is correct
- [ ] Special characters handled
- [ ] Performance acceptable
- [ ] No console errors
- [ ] No 404 or 500 errors

## Issue Reporting Template

If any test fails, document using this template:

```
**Scenario:** [Scenario number and name]
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Browser:** [Chrome/Firefox/Safari/Mobile]
**Screenshots:** [Attach if relevant]
**Console Errors:** [Any errors in DevTools]
**Network Response:** [API response if relevant]
```

## Performance Benchmarks

Target metrics:

| Metric | Target | Actual |
|--------|--------|--------|
| API Response Time | < 5s | _____ |
| Email Delivery | < 2 min | _____ |
| Form Validation | Instant | _____ |
| Page Load Time | < 3s | _____ |

## Browser Compatibility

Test on:

- [ ] Chrome/Edge (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (iOS)
- [ ] Samsung Internet (Android)

## Post-Testing

After successful testing:

1. [ ] Document any issues found
2. [ ] Update EMAIL_MIGRATION_GUIDE.md if needed
3. [ ] Inform stakeholders of successful deployment
4. [ ] Monitor for first 24 hours
5. [ ] Set up email alerts for failures (optional)

## Monitoring Commands

Check API logs:
```bash
# View recent logs
vercel logs wedding-email-api --prod

# Follow logs in real-time
vercel logs wedding-email-api --prod --follow
```

Check Gmail sent folder:
1. Login to codestromhub@gmail.com
2. Go to "Sent" folder
3. Verify emails are being sent

## Success Criteria

All tests pass when:
- ✅ All 10 scenarios complete successfully
- ✅ No console errors
- ✅ Emails received within 2 minutes
- ✅ All data fields present in emails
- ✅ Works on mobile and desktop
- ✅ Performance meets benchmarks

## Next Steps After Testing

1. Mark all scenarios as tested
2. Document results in MIGRATION_COMPLETE.md
3. Close any related GitHub issues
4. Celebrate! 🎉

---

**Testing Date:** __________________
**Tester Name:** __________________
**Overall Result:** ☐ Pass ☐ Fail ☐ Partial

**Notes:**
_________________________________
_________________________________
_________________________________
