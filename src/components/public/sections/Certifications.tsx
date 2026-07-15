'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Award, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Certification {
  id: string;
  title: any;
  organization: any;
  issue_date: string;
  credential_url: string | null;
  image_url: string | null;
}

interface CertificationsProps {
  data: Certification[];
}

export default function Certifications({ data }: CertificationsProps) {
  const { t, tContent } = useLanguage();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
  };

  return (
    <section id="certifications" className="py-24 bg-secondary/20 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gradient">
            {t('certifications_title', 'Certifications')}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {t('certifications_subtitle', 'Professional credentials and continuous learning verification')}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((cert) => (
            <div
              key={cert.id}
              className="glass-card overflow-hidden flex flex-col hover:scale-[1.01] transition-transform duration-300"
            >
              {/* Media image container */}
              {cert.image_url ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/20 border-b border-border/50">
                  <Image
                    src={cert.image_url}
                    alt={tContent(cert.title)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] w-full flex items-center justify-center bg-secondary text-primary/30 border-b border-border/50">
                  <Award size={64} />
                </div>
              )}

              {/* Text Area */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">
                    {tContent(cert.title)}
                  </h3>
                  <p className="text-primary font-semibold text-sm mb-3">
                    {tContent(cert.organization)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('issued_date', 'Issued')}: {formatDate(cert.issue_date)}
                  </p>
                </div>

                {cert.credential_url && (
                  <div className="border-t border-border/40 pt-4">
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-foreground/80 hover:text-primary transition-colors cursor-pointer"
                    >
                      <span>{t('verify_credential', 'Verify Credential')}</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
