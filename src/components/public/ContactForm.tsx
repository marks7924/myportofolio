'use client';

import React, { useState, useEffect, useRef } from 'react';
import { submitContactForm } from '@/app/actions/contact';
import { useLanguage } from '@/context/LanguageContext';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

declare global {
  interface Window {
    grecaptcha: any;
    onloadCallback: any;
  }
}

export default function ContactForm() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const recaptchaRef = useRef<string | null>(null);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'placeholder-site-key';

    window.onloadCallback = () => {
      if (window.grecaptcha && document.getElementById('recaptcha-container')) {
        window.grecaptcha.render('recaptcha-container', {
          sitekey: siteKey === 'placeholder-site-key' ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' : siteKey,
          callback: (token: string) => {
            recaptchaRef.current = token;
          },
          'expired-callback': () => {
            recaptchaRef.current = null;
          },
        });
      }
    };

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete window.onloadCallback;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);

    if (!recaptchaRef.current) {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'placeholder-site-key';
      if (siteKey === 'placeholder-site-key') {
        recaptchaRef.current = 'local-dev-bypass-token';
      } else {
        setError('Please complete the reCAPTCHA verification.');
        setLoading(false);
        return;
      }
    }

    formData.append('recaptchaToken', recaptchaRef.current || '');

    try {
      const response = await submitContactForm(null, formData);

      if (response.success) {
        setSuccess(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        event.currentTarget.reset();
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
        recaptchaRef.current = null;
      } else {
        if (response.errors) {
          setFieldErrors(response.errors);
        } else if (response.error) {
          setError(response.error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 md:p-10">
      {success ? (
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
          <CheckCircle2 size={64} className="text-emerald-500 animate-bounce" />
          <h3 className="text-2xl font-bold text-foreground">
            {t('contact_success_heading', 'Message Sent!')}
          </h3>
          <p className="text-muted-foreground max-w-sm">
            {t('contact_success', 'Thank you! Your message has been saved and sent successfully.')}
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 px-6 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-semibold rounded-full transition-colors cursor-pointer"
          >
            {t('send_another', 'Send Another')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-center space-x-2 rtl:space-x-reverse">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-foreground/80">
                {t('contact_name', 'Full Name')} <span className="text-primary">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
              />
              {fieldErrors.name && (
                <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-foreground/80">
                {t('contact_email', 'Email Address')} <span className="text-primary">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
              />
              {fieldErrors.email && (
                <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-semibold text-foreground/80">
                {t('contact_phone', 'Phone Number')}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-semibold text-foreground/80">
                {t('contact_subject', 'Subject')} <span className="text-primary">*</span>
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
              />
              {fieldErrors.subject && (
                <p className="text-xs text-destructive">{fieldErrors.subject[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-semibold text-foreground/80">
              {t('contact_message', 'Message')} <span className="text-primary">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm resize-none"
            />
            {fieldErrors.message && (
              <p className="text-xs text-destructive">{fieldErrors.message[0]}</p>
            )}
          </div>

          <div className="flex justify-center md:justify-start">
            <div id="recaptcha-container" className="my-2" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all duration-300 hover:scale-[1.01] shadow-lg hover:shadow-primary/20 cursor-pointer"
          >
            <Send size={16} />
            <span>
              {loading ? t('contact_sending', 'Sending...') : t('contact_submit', 'Send Message')}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
