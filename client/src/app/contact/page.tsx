'use client';

import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { EnvelopeOpenIcon } from '@heroicons/react/24/outline'
import { submitContactForm } from '@/lib/serverless-forms'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Client-side validation function
  function validateForm(): Record<string, string> {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.subject) {
      errors.subject = "Please select a subject";
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }
    
    return errors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    setValidationErrors({});
    
    // Client-side validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Focus on first error field for accessibility
      const firstErrorField = Object.keys(errors)[0];
      const fieldElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      if (fieldElement) {
        fieldElement.focus();
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use serverless form submission (works in both static and server modes)
      const result = await submitContactForm(formData);
      
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setError('Failed to send message. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  return (
    <div className="min-h-screen bg-gradient-wedding">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-secondary mb-4 sm:mb-6">
            Contact Us
          </h1>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-primary mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Have questions about our wedding? We&apos;d love to hear from you!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xl">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="mb-4 flex justify-center">
                    <EnvelopeOpenIcon className="h-16 w-16 sm:h-20 sm:w-20 text-primary" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-secondary mb-4">
                    Thank You!
                  </h2>
                  <p className="text-muted mb-4 text-sm sm:text-base">
                    Please send your message directly to our email for fastest response.
                  </p>
                  <div className="bg-accent/10 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <p className="text-sm text-secondary font-medium mb-2">Email us at:</p>
                    <a href="mailto:arvincia@sparrow-group.com" className="text-primary hover:text-primary-dark font-semibold text-base sm:text-lg">
                      arvincia@sparrow-group.com
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
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

                  <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-secondary mb-6">
                    Send us a message
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">Fields marked with <span className="text-red-500">*</span> are required</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={(e) => {
                            handleChange(e);
                            if (validationErrors.name) {
                              setValidationErrors(prev => ({ ...prev, name: '' }));
                            }
                          }}
                          className={`w-full px-4 py-3 border-2 text-gray-900 bg-white rounded-lg focus:ring-2 focus:ring-primary font-medium placeholder-gray-500 transition-all min-h-[48px] ${
                            validationErrors.name ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-primary'
                          }`}
                          required
                        />
                        {validationErrors.name && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => {
                            handleChange(e);
                            if (validationErrors.email) {
                              setValidationErrors(prev => ({ ...prev, email: '' }));
                            }
                          }}
                          className={`w-full px-4 py-3 border-2 text-gray-900 bg-white rounded-lg focus:ring-2 focus:ring-primary font-medium placeholder-gray-500 transition-all min-h-[48px] ${
                            validationErrors.email ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-primary'
                          }`}
                          required
                        />
                        {validationErrors.email && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 text-gray-900 bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-medium placeholder-gray-500 transition-all min-h-[48px]"
                        placeholder="Your phone number (optional)"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-bold text-gray-900 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={(e) => {
                          handleChange(e);
                          if (validationErrors.subject) {
                            setValidationErrors(prev => ({ ...prev, subject: '' }));
                          }
                        }}
                        className={`w-full px-4 py-3 border-2 text-gray-900 bg-white rounded-lg focus:ring-2 focus:ring-primary font-medium transition-all min-h-[48px] ${
                          validationErrors.subject ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-primary'
                        }`}
                        required
                      >
                        <option value="">Please select a subject</option>
                        <option value="RSVP">RSVP Questions</option>
                        <option value="TRAVEL">Travel & Accommodation</option>
                        <option value="EVENTS">Event Details</option>
                        <option value="DIETARY">Dietary Requirements</option>
                        <option value="ACCESSIBILITY">Accessibility Needs</option>
                        <option value="GENERAL">General Questions</option>
                        <option value="EMERGENCY">Emergency</option>
                      </select>
                      {validationErrors.subject && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.subject}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={(e) => {
                          handleChange(e);
                          if (validationErrors.message) {
                            setValidationErrors(prev => ({ ...prev, message: '' }));
                          }
                        }}
                        rows={5}
                        className={`w-full px-4 py-3 border-2 text-gray-900 bg-white rounded-lg focus:ring-2 focus:ring-primary font-medium placeholder-gray-500 transition-all resize-vertical ${
                          validationErrors.message ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-primary'
                        }`}
                        placeholder="Tell us how we can help you..."
                        required
                      />
                      {validationErrors.message && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl min-h-[48px] text-lg"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Message...
                        </div>
                      ) : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">

              {/* Wedding Team Contacts */}
              {/* Emergency Contacts Only */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xl border-2 border-primary">
                <h3 className="text-xl sm:text-2xl font-serif font-semibold text-primary mb-4 sm:mb-6 text-center">Emergency Contacts</h3>
                <div className="flex flex-col gap-4 items-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-4">
                      <span className="font-bold text-gray-900 text-lg">Rana</span>
                      <a href="tel:+8801793403767" className="text-primary hover:underline font-semibold text-base">+880 17 9340 3767</a>
                    </div>
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-4">
                      <span className="font-bold text-gray-900 text-lg">Tahamina</span>
                      <a href="tel:+8801799997024" className="text-primary hover:underline font-semibold text-base">+880 17 9999 7024</a>
                    </div>
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-4">
                      <span className="font-bold text-gray-900 text-lg">Fazlu</span>
                      <a href="tel:+8801713302987" className="text-primary hover:underline font-semibold text-base">+880 17 1330 2987</a>
                    </div>
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-4">
                      <span className="font-bold text-gray-900 text-lg">Lalin</span>
                      <a href="tel:+8801730012090" className="text-primary hover:underline font-semibold text-base">+880 17 3001 2090</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}

      {/* CTA Section */}
      <section className="py-16 sm:py-20 gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary mb-4 sm:mb-6">
            Ready to Celebrate with Us?
          </h2>
          <p className="text-muted mb-8 text-sm sm:text-base">
            Don&apos;t forget to RSVP and check out all the wedding details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Link 
              href="/rsvp"
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              RSVP Now
            </Link>
            <Link 
              href="/events"
              className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300"
            >
              View Events
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}