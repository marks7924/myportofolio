'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FileText } from 'lucide-react';
import Image from 'next/image';

interface AboutProps {
  data: {
    biography: any;
    skills_summary: any;
    cv_url: string;
    profile_image_url: string;
  };
}

export default function About({ data }: AboutProps) {
  const { t, tContent } = useLanguage();

  return (
    <section id="about" className="py-24 bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Profile Image Container */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-[280px] h-[340px] md:w-[350px] md:h-[420px]">
              {/* Geometric borders */}
              <div className="absolute inset-0 rounded-2xl border border-border translate-x-3 translate-y-3 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform duration-300" />

              {/* Graphic wrapper */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden glass-card">
                {data.profile_image_url ? (
                  <Image
                    src={data.profile_image_url}
                    alt="Profile Avatar"
                    fill
                    sizes="(max-width: 768px) 280px, 350px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground font-en text-lg uppercase font-bold tracking-widest">
                    <span>Alex Morgan</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text/Bio Description */}
          <div className="lg:col-span-7 space-y-6">
            <span className="tag mb-3 inline-block">About</span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
              {t('nav_about', 'About Me')}
            </h2>

            <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-line">{tContent(data.biography)}</p>
              <p className="border-t border-border/60 pt-4 font-medium text-foreground/80">
                {tContent(data.skills_summary)}
              </p>
            </div>

            {/* CV Action link */}
            {data.cv_url && (
              <div className="pt-4">
                <a
                  href={data.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold text-sm rounded-full transition-opacity hover:opacity-75 cursor-pointer"
                >
                  <FileText size={18} />
                  <span>{t('cv_download', 'Download Resume / CV')}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
