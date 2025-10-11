"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { HandRaisedIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function RSVPPage() {
  // Always show the simplified RSVP form per spec
  const [step, setStep] = useState<1 | 2 | 3>(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  // Form state based on RSVP_FORM_QUESTIONS.md
  type AttendDhaka = "yes" | "no" | "maybe";
  type FamilySide = "bride" | "groom" | "both";
  type GuestCount = "1" | "2" | "3" | "4" | "other";

  const [willAttendDhaka, setWillAttendDhaka] = useState<AttendDhaka | "">("");
  const [familySide, setFamilySide] = useState<FamilySide | "">("");
  const [guestCountOption, setGuestCountOption] = useState<GuestCount | "">("");
  const [guestCountOther, setGuestCountOther] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [contactPreferred, setContactPreferred] = useState<string>("");
  const [contactPreferredWhatsApp, setContactPreferredWhatsApp] = useState<boolean>(false);
  const [contactPreferredBotim, setContactPreferredBotim] = useState<boolean>(false);
  const [contactSecondary, setContactSecondary] = useState<string>("");
  const [contactSecondaryWhatsApp, setContactSecondaryWhatsApp] = useState<boolean>(false);
  const [contactSecondaryBotim, setContactSecondaryBotim] = useState<boolean>(false);
  const [emergencyName, setEmergencyName] = useState<string>("");
  const [emergencyPhone, setEmergencyPhone] = useState<string>("");
  const [emergencyEmail, setEmergencyEmail] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [guestName, setGuestName] = useState<string>("");

  // Client-side validation function
  function validateForm(): Record<string, string> {
    const errors: Record<string, string> = {};
    
    if (!guestName.trim()) {
      errors.guestName = "Please enter your name";
    }
    if (!willAttendDhaka) {
      errors.willAttendDhaka = "Please select whether you will attend";
    }
    if (!familySide) {
      errors.familySide = "Please select which family you are from";
    }
    if (!guestCountOption) {
      errors.guestCountOption = "Please select the number of guests";
    }
    if (guestCountOption === "other" && !guestCountOther) {
      errors.guestCountOther = "Please specify the number of people";
    }
    if (!emailAddress) {
      errors.emailAddress = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      errors.emailAddress = "Please enter a valid email address";
    }
    
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    setValidationErrors({});
    
    // Client-side validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Focus on first error field for mobile accessibility
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField === "willAttendDhaka" || firstErrorField === "familySide" || firstErrorField === "guestCountOption") {
        // Scroll to the top of the form for radio button errors
        const formElement = document.querySelector('form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        guestName: guestName.trim(),
        willAttendDhaka,
        familySide,
        guestCountOption,
        guestCountOther: guestCountOther || undefined,
        additionalInfo,
        contact: {
          preferred: { number: contactPreferred, whatsapp: contactPreferredWhatsApp, botim: contactPreferredBotim },
          secondary: { number: contactSecondary, whatsapp: contactSecondaryWhatsApp, botim: contactSecondaryBotim },
          emergency: { name: emergencyName, phone: emergencyPhone, email: emergencyEmail },
          email: emailAddress,
        },
      };
      // Check if we're in static export mode (API routes not available)
      const isStaticExport = typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_AVAILABLE;
      
      if (isStaticExport) {
        // In static mode, show success message with manual contact info
        console.log('RSVP Submission (Static Mode):', payload);
        setStep(3);
      } else {
        // In server mode, submit to API
        const res = await fetch('/api/rsvp/form', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to submit RSVP form');
        }
        setStep(3);
      }
    } catch (err) {
      console.error('RSVP form submit error:', err);
      // Use a structured approach to error parsing
      if (err && typeof err === 'object' && 'validationErrors' in err && err.validationErrors) {
        setError('Please fill in all required fields marked with *');
      } else {
        setError('Sorry, we could not submit your RSVP. Please try again or contact us for assistance.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-wedding">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-secondary mb-4 sm:mb-6">
            RSVP
          </h1>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-primary mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            We can&apos;t wait to celebrate with you! Please let us know if you&apos;ll be joining us.
          </p>
        </div>
      </section>

      {/* RSVP Form */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {step === 2 && (
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg">
              <div className="text-center mb-6 sm:mb-8">
                <div className="mb-4 flex justify-center">
                  <HandRaisedIcon className="h-10 w-10 text-primary" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-serif font-semibold text-secondary mb-2">RSVP Details</h2>
                <p className="text-gray-700">Please fill out the form below to complete your RSVP.</p>
                <p className="text-sm text-gray-600 mt-2">Fields marked with <span className="text-red-500">*</span> are required</p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white">
                  <div className="space-y-6">
                    {/* Guest Name Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required 
                        className={`w-full px-3 py-2 border-2 rounded-lg min-h-[44px] ${validationErrors.guestName ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
                        placeholder="Enter your full name" 
                        value={guestName} 
                        onChange={(e) => {
                          setGuestName(e.target.value);
                          if (validationErrors.guestName) {
                            setValidationErrors(prev => ({ ...prev, guestName: '' }));
                          }
                        }} 
                      />
                      {validationErrors.guestName && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.guestName}</p>
                      )}
                    </div>

                    {/* Q1 */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Will you be able to grace us with your presence in Dhaka? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {([
                          { key: 'yes', label: 'Yes, I will attend' },
                          { key: 'no', label: 'No, I will not attend' },
                          { key: 'maybe', label: 'Maybe' },
                        ] as { key: AttendDhaka; label: string }[]).map((opt) => (
                          <label key={opt.key} className={`flex items-center gap-2 border-2 rounded-lg p-3 cursor-pointer hover:border-primary/60 min-h-[44px] ${validationErrors.willAttendDhaka ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                            <input 
                              type="radio" 
                              name="attendDhaka" 
                              className="h-5 w-5 min-w-[20px]" 
                              checked={willAttendDhaka === opt.key} 
                              onChange={() => {
                                setWillAttendDhaka(opt.key);
                                if (validationErrors.willAttendDhaka) {
                                  setValidationErrors(prev => ({ ...prev, willAttendDhaka: '' }));
                                }
                              }} 
                            />
                            <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                      {validationErrors.willAttendDhaka && (
                        <p className="mt-2 text-sm text-red-600">{validationErrors.willAttendDhaka}</p>
                      )}
                    </div>

                    {/* Q2 */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Are you from The Bride&apos;s Family or The Groom&apos;s Family? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {([
                          { key: 'bride', label: "The Bride's Family" },
                          { key: 'groom', label: "The Groom's Family" },
                          { key: 'both', label: 'Both Families' },
                        ] as { key: FamilySide; label: string }[]).map((opt) => (
                          <label key={opt.key} className={`flex items-center gap-2 border-2 rounded-lg p-3 cursor-pointer hover:border-primary/60 min-h-[44px] ${validationErrors.familySide ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                            <input 
                              type="radio" 
                              name="familySide" 
                              className="h-5 w-5 min-w-[20px]" 
                              checked={familySide === opt.key} 
                              onChange={() => {
                                setFamilySide(opt.key);
                                if (validationErrors.familySide) {
                                  setValidationErrors(prev => ({ ...prev, familySide: '' }));
                                }
                              }} 
                            />
                            <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                      {validationErrors.familySide && (
                        <p className="mt-2 text-sm text-red-600">{validationErrors.familySide}</p>
                      )}
                    </div>

                    {/* Q3 */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        How many guests will be present? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                        {(['1','2','3','4','other'] as GuestCount[]).map((opt) => (
                          <label key={opt} className={`flex items-center gap-2 border-2 rounded-lg p-3 cursor-pointer hover:border-primary/60 min-h-[44px] ${validationErrors.guestCountOption ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                            <input 
                              type="radio" 
                              name="guestCount" 
                              className="h-5 w-5 min-w-[20px]" 
                              checked={guestCountOption === opt} 
                              onChange={() => {
                                setGuestCountOption(opt);
                                if (validationErrors.guestCountOption) {
                                  setValidationErrors(prev => ({ ...prev, guestCountOption: '' }));
                                }
                              }} 
                            />
                            <span className="text-sm font-medium text-gray-900">{opt==='other' ? 'Other' : `${opt} ${opt==='1'?'person':'people'}`}</span>
                          </label>
                        ))}
                      </div>
                      {guestCountOption==='other' && (
                        <div className="mt-3">
                          <input 
                            type="number" 
                            min={1} 
                            className={`w-full px-3 py-2 border-2 rounded-lg min-h-[44px] ${validationErrors.guestCountOther ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
                            placeholder="Please specify number of people" 
                            value={guestCountOther} 
                            onChange={(e) => {
                              setGuestCountOther(e.target.value);
                              if (validationErrors.guestCountOther) {
                                setValidationErrors(prev => ({ ...prev, guestCountOther: '' }));
                              }
                            }} 
                          />
                          {validationErrors.guestCountOther && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.guestCountOther}</p>
                          )}
                        </div>
                      )}
                      {validationErrors.guestCountOption && (
                        <p className="mt-2 text-sm text-red-600">{validationErrors.guestCountOption}</p>
                      )}
                    </div>

                    {/* Q4 */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Is there any additional information you’d like to share with us (food allergies, accommodation needs, medical conditions)?</label>
                      <textarea rows={3} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg" placeholder="Your notes…" value={additionalInfo} onChange={e=>setAdditionalInfo(e.target.value)} />
                    </div>

                    {/* Q5 */}
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold text-gray-900">Contact Details</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Preferred Number</label>
                          <div className="flex gap-3">
                            <input type="tel" className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg min-h-[44px]" placeholder="Phone number" value={contactPreferred} onChange={e=>setContactPreferred(e.target.value)} />
                          </div>
                          <div className="flex items-center gap-6 mt-2">
                            <label className="inline-flex items-center gap-2 text-sm min-h-[44px] cursor-pointer">
                              <input type="checkbox" className="h-5 w-5 min-w-[20px]" checked={contactPreferredWhatsApp} onChange={e=>setContactPreferredWhatsApp(e.target.checked)} /> WhatsApp
                            </label>
                            <label className="inline-flex items-center gap-2 text-sm min-h-[44px] cursor-pointer">
                              <input type="checkbox" className="h-5 w-5 min-w-[20px]" checked={contactPreferredBotim} onChange={e=>setContactPreferredBotim(e.target.checked)} /> Botim
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Secondary Number</label>
                          <input type="tel" className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg min-h-[44px]" placeholder="Secondary phone" value={contactSecondary} onChange={e=>setContactSecondary(e.target.value)} />
                          <div className="flex items-center gap-6 mt-2">
                            <label className="inline-flex items-center gap-2 text-sm min-h-[44px] cursor-pointer">
                              <input type="checkbox" className="h-5 w-5 min-w-[20px]" checked={contactSecondaryWhatsApp} onChange={e=>setContactSecondaryWhatsApp(e.target.checked)} /> WhatsApp
                            </label>
                            <label className="inline-flex items-center gap-2 text-sm min-h-[44px] cursor-pointer">
                              <input type="checkbox" className="h-5 w-5 min-w-[20px]" checked={contactSecondaryBotim} onChange={e=>setContactSecondaryBotim(e.target.checked)} /> Botim
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="emergency_name" className="block text-sm font-semibold text-gray-900 mb-2">Emergency Contact Name</label>
                          <input id="emergency_name" className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg min-h-[44px]" placeholder="Full name" value={emergencyName} onChange={e=>setEmergencyName(e.target.value)} />
                        </div>
                        <div>
                          <label htmlFor="emergency_phone" className="block text-sm font-semibold text-gray-900 mb-2">Emergency Contact Phone</label>
                          <input id="emergency_phone" type="tel" className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg min-h-[44px]" placeholder="Phone number" value={emergencyPhone} onChange={e=>setEmergencyPhone(e.target.value)} />
                        </div>
                        <div>
                          <label htmlFor="emergency_email" className="block text-sm font-semibold text-gray-900 mb-2">Emergency Contact Email</label>
                          <input id="emergency_email" type="email" className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg min-h-[44px]" placeholder="name@example.com" value={emergencyEmail} onChange={e=>setEmergencyEmail(e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="email" 
                          required 
                          className={`w-full px-3 py-2 border-2 rounded-lg min-h-[44px] ${validationErrors.emailAddress ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
                          placeholder="you@example.com" 
                          value={emailAddress} 
                          onChange={(e) => {
                            setEmailAddress(e.target.value);
                            if (validationErrors.emailAddress) {
                              setValidationErrors(prev => ({ ...prev, emailAddress: '' }));
                            }
                          }} 
                        />
                        {validationErrors.emailAddress && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.emailAddress}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-lg font-medium transition-colors min-h-[48px] text-lg">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting RSVP...
                    </div>
                  ) : 'Submit RSVP'}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="mb-6 flex justify-center">
                <SparklesIcon className="h-12 w-12 text-primary" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-serif font-semibold text-secondary mb-4">Thank You!</h2>
              <p className="text-muted mb-4 max-w-md mx-auto">
                Your RSVP has been received. Please send your details to our email for confirmation.
              </p>
              <div className="bg-accent/10 rounded-lg p-4 mb-8 max-w-md mx-auto">
                <p className="text-sm text-secondary font-medium mb-2">Please email your RSVP to:</p>
                <a href="mailto:arvincia@sparrow-group.com" className="text-primary hover:text-primary-dark font-semibold">
                  arvincia@sparrow-group.com
                </a>
              </div>
              
              <div className="space-y-4">
                <Link href="/events" className="block bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-colors">
                  View Event Details
                </Link>
                <Link href="/travel" className="block border border-primary text-primary hover:bg-primary hover:text-white py-3 px-6 rounded-lg font-medium transition-colors">
                  Travel Information
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}