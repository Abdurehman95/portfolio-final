import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { supabase } from '../supabaseClient';

const Contact = () => {
  // Formspree endpoint hook for form ID: xpppprda
  const [state, handleFormspreeSubmit] = useForm('xpppprda');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error when user modifies value
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    }

    if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Submit to Formspree endpoint (https://formspree.io/f/xpppprda)
    // using FormData to capture all fields including hidden _subject & honeypot
    const formElement = e.currentTarget;
    const submissionData = new FormData(formElement);

    try {
      await handleFormspreeSubmit(submissionData);

      // Best-effort optional backup to Supabase messages table if configured
      try {
        if (supabase) {
          await supabase.from('messages').insert([
            {
              name: formData.name.trim(),
              email: formData.email.trim(),
              message: formData.message.trim(),
              subject: `Portfolio Inquiry from ${formData.name.trim()}`,
              is_read: false
            }
          ]);
        }
      } catch (err) {
        // Optional fallback logging
        console.warn('Optional Supabase message backup skipped:', err);
      }
    } catch (error) {
      setErrors({ form: 'Failed to send message. Please check your network connection.' });
    }
  };

  return (
    <section id="contact" className="py-20 bg-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 fade-in-up">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto fade-in-up stagger-1"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="fade-in-left">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <p className="text-slate-400 mb-8">
              Feel free to reach out to me for any questions or opportunities.
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
            </p>

            <div className="space-y-6">
              <div className="flex items-start group">
                <div className="bg-slate-800 p-4 rounded-full mr-4 group-hover:bg-primary transition-all duration-300">
                  <i className="fas fa-map-marker-alt text-primary text-xl group-hover:text-white"></i>
                </div>
                <div>
                  <h4 className="font-bold mb-1 text-lg">Location</h4>
                  <p className="text-slate-400">Ethiopia, Woldia</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="bg-slate-800 p-4 rounded-full mr-4 group-hover:bg-primary transition-all duration-300">
                  <i className="fas fa-envelope text-primary text-xl group-hover:text-white"></i>
                </div>
                <div>
                  <h4 className="font-bold mb-1 text-lg">Email</h4>
                  <a
                    href="mailto:abdurehmanseid856@gmail.com"
                    className="text-slate-400 hover:text-primary transition-colors"
                  >
                    abdurehmanseid856@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="bg-slate-800 p-4 rounded-full mr-4 group-hover:bg-primary transition-all duration-300">
                  <i className="fas fa-phone-alt text-primary text-xl group-hover:text-white"></i>
                </div>
                <div>
                  <h4 className="font-bold mb-1 text-lg">Phone</h4>
                  <a
                    href="tel:+251967192079"
                    className="text-slate-400 hover:text-primary transition-colors"
                  >
                    +251967192079
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-bold mb-4 text-lg">Follow Me</h4>
              <div className="flex space-x-4">
                <a href="https://github.com/Abdurehman95" target="_blank" rel="noopener noreferrer" className="social-icon w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-white">
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" className="social-icon w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-white">
                  <i className="fab fa-linkedin-in text-xl"></i>
                </a>
                <a href="https://x.com/home" target="_blank" rel="noopener noreferrer" className="social-icon w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-white">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="https://t.me/abdu_8995" target="_blank" rel="noopener noreferrer" className="social-icon w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-white">
                  <i className="fab fa-telegram text-xl"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="fade-in-right">
            <h3 className="text-2xl font-bold mb-6">Contact me</h3>

            {state.succeeded ? (
              <div className="bg-slate-800/90 border border-green-500/40 rounded-2xl p-8 text-center backdrop-blur-sm shadow-2xl scale-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(34,197,94,0.35)]">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Submitted!</h4>
                <p className="text-slate-300">
                  Thank you{formData.name ? `, ${formData.name}` : ''}! Your message has been sent successfully.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Formspree Email Subject Configuration & Bot Honeypot */}
                <input
                  type="hidden"
                  name="_subject"
                  value={`New Portfolio Inquiry from ${formData.name || 'Website Visitor'}`}
                />
                <input
                  type="text"
                  name="_gotcha"
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div>
                  <label htmlFor="name" className="block mb-2 font-medium">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    autoComplete="name"
                    disabled={state.submitting}
                    className={`w-full px-4 py-3 rounded-lg contact-input focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 bg-slate-800 ${errors.name ? 'border border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  {errors.name && <p className="mt-1 text-red-400 text-sm">{errors.name}</p>}
                  <ValidationError prefix="Name" field="name" errors={state.errors} className="mt-1 text-red-400 text-sm" />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                    disabled={state.submitting}
                    className={`w-full px-4 py-3 rounded-lg contact-input focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 bg-slate-800 ${errors.email ? 'border border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  {errors.email && <p className="mt-1 text-red-400 text-sm">{errors.email}</p>}
                  <ValidationError prefix="Email" field="email" errors={state.errors} className="mt-1 text-red-400 text-sm" />
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 font-medium">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message or inquiry here..."
                    disabled={state.submitting}
                    className={`w-full px-4 py-3 rounded-lg contact-input focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 bg-slate-800 ${errors.message ? 'border border-red-500 focus:ring-red-500' : ''}`}
                    required
                  ></textarea>
                  {errors.message && <p className="mt-1 text-red-400 text-sm">{errors.message}</p>}
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="mt-1 text-red-400 text-sm" />
                </div>

                <button
                  type="submit"
                  disabled={state.submitting}
                  className={`px-8 py-3 rounded-full btn-primary font-medium w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200 ${state.submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {state.submitting ? (
                    <>Sending... <i className="fas fa-spinner fa-spin"></i></>
                  ) : (
                    <>Send Message <i className="fas fa-paper-plane"></i></>
                  )}
                </button>

                {errors.form && (
                  <div className="mt-4 p-3 rounded-lg bg-red-600/90 text-white text-center animate-fade-in text-sm">
                    {errors.form}
                  </div>
                )}

                <ValidationError errors={state.errors} className="mt-4 p-3 rounded-lg bg-red-600/90 text-white text-center animate-fade-in text-sm" />
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
