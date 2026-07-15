'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '../ContactForm';

interface ContactProps {
  contactEmail: string | null;
  phone: string | null;
  location: any;
}

export default function Contact({ contactEmail, phone, location }: ContactProps) {
  const { t, tContent } = useLanguage();

  return (
    <section id="contact" className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-display text-4xl md:text-6xl text-foreground leading-tight">
            {t('contact_title', "Let's Create Together")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {t('contact_subtitle', 'Send a message to discuss your project or job opportunities')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info details */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-center">
            {contactEmail && (
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="p-4 rounded-xl bg-secondary text-primary border border-border/40">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground/80">{t('email_label', 'Email')}</h4>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base font-semibold"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>
            )}

            {phone && (
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="p-4 rounded-xl bg-secondary text-primary border border-border/40">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground/80">{t('phone_label', 'Phone')}</h4>
                  <a
                    href={`tel:${phone}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base font-semibold"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            )}

            {location && (
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="p-4 rounded-xl bg-secondary text-primary border border-border/40">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground/80">{t('location_label', 'Location')}</h4>
                  <p className="text-muted-foreground text-sm md:text-base font-semibold">
                    {tContent(location)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form wrapper */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
