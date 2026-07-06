/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { contactService, cmsService } from '../services';
import { ContactChannel } from '../types';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [contactChannels, setContactChannels] = useState<ContactChannel[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channels = await cmsService.getContactChannels();
        setContactChannels(channels);
      } catch (err) {
        console.error('Failed to load contact channels in Contact page:', err);
      }
    };
    fetchChannels();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      await contactService.submitMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
      });

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'An error occurred while submitting your message.');
    }
  };

  return (
    <div className="pt-28 pb-24 px-6 min-h-[90vh] bg-[#050505] text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Pitch Information column */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#f27d26]">CONSULTATIONS</span>
            <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-[0.9]">
              LET'S CREATE SOMETHING TIMELESS.
            </h1>
            <p className="font-sans text-sm text-zinc-400 leading-relaxed font-light">
              Have an interactive layout concept, complex frontend requirement, or custom design system project in mind? Fill out the form or transmit an inquiry directly.
            </p>
          </div>

          <div className="space-y-6">
            {contactChannels.length > 0 ? (
              contactChannels
                .filter((cc) => cc.type === 'contact')
                .map((cc) => {
                  const IconComp = cc.iconName === 'Mail' ? Mail : MapPin;
                  return (
                    <div key={cc.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-zinc-900 border border-white/10 flex items-center justify-center text-[#f27d26]">
                        <IconComp size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider">
                          {cc.label}
                        </span>
                        {cc.label.toUpperCase().includes('INBOX') || cc.label.toUpperCase().includes('EMAIL') || cc.value.includes('@') ? (
                          <a
                            href={`mailto:${cc.value}`}
                            className="font-mono text-sm font-semibold text-white hover:text-[#f27d26] transition-colors break-all"
                          >
                            {cc.value}
                          </a>
                        ) : (
                          <span className="font-sans text-sm text-white font-semibold">
                            {cc.value}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-zinc-900 border border-white/10 flex items-center justify-center text-[#f27d26]">
                    <Mail size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider">DIRECT INBOX</span>
                    <a
                      href="mailto:dodan556@gmail.com"
                      className="font-mono text-sm font-semibold text-white hover:text-[#f27d26] transition-colors"
                    >
                      dodan556@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-zinc-900 border border-white/10 flex items-center justify-center text-[#f27d26]">
                    <MapPin size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider">GEOGRAPHY</span>
                    <span className="font-sans text-sm text-white font-semibold">
                      Seoul, South Korea / Available Globally
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contact Form column */}
        <div className="lg:col-span-7">
          <div className="p-8 md:p-10 rounded-sm bg-[#090909] border border-white/10">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-14 h-14 bg-[#f27d26]/10 text-[#f27d26] flex items-center justify-center mx-auto rounded-full">
                  <CheckCircle size={32} />
                </div>
                <h3 className="font-display text-xl font-bold uppercase text-white tracking-wider">INQUIRY TRANSMITTED</h3>
                <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed font-light">
                  Thank you for reaching out. I will personally review your concept details and follow up with you within 24–48 hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-2.5 text-[10px] font-mono uppercase tracking-widest border border-white/10 text-zinc-400 hover:text-white hover:border-[#f27d26] cursor-pointer"
                >
                  TRANSMIT ANOTHER MESSAGE
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      YOUR NAME <span className="text-[#f27d26]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="JANE DOE"
                      className="w-full px-4 py-3 bg-zinc-950 border border-white/10 focus:outline-none focus:border-[#f27d26] text-sm text-white font-mono placeholder:text-zinc-650 rounded-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      EMAIL ADDRESS <span className="text-[#f27d26]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="JANE@EXAMPLE.COM"
                      className="w-full px-4 py-3 bg-zinc-950 border border-white/10 focus:outline-none focus:border-[#f27d26] text-sm text-white font-mono placeholder:text-zinc-650 rounded-sm"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    INQUIRY TOPIC
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                    placeholder="BRAND ARCHITECTURE / DEVELOPMENT..."
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 focus:outline-none focus:border-[#f27d26] text-sm text-white font-mono placeholder:text-zinc-650 rounded-sm"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    PROJECT CONCEPT DETAILS <span className="text-[#f27d26]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                    placeholder="DESCRIBE THE CORE LAYOUT IDEAS, TIMELINE, AND TECHNICAL HIGHLIGHTS..."
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 focus:outline-none focus:border-[#f27d26] text-sm text-white font-sans placeholder:text-zinc-650 resize-none rounded-sm"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-[#f27d26] font-mono">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  id="submit-contact-form"
                  className="w-full py-4 text-xs font-mono font-black tracking-widest uppercase bg-[#f27d26] hover:bg-white text-black hover:text-black transition-all disabled:opacity-50 rounded-sm cursor-pointer"
                >
                  {status === 'submitting' ? (
                    'TRANSMITTING INFORMATION...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      TRANSMIT INQUIRY <Send size={12} />
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
