'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Briefcase } from 'lucide-react';
import Image from 'next/image';

interface ExperienceItem {
  id: string;
  company: string;
  position: any;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: any;
  technologies: string[];
  logo_url: string | null;
}

interface ExperienceProps {
  data: ExperienceItem[];
}

export default function Experience({ data }: ExperienceProps) {
  const { t, tContent } = useLanguage();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  };

  return (
    <section id="experience" className="py-24 bg-secondary/20 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <div className="text-center space-y-4 mb-20">
          <h2 className="font-display text-4xl md:text-6xl text-foreground leading-tight">
            {t('experience_title', 'Work Experience')}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {t('experience_subtitle', 'Timeline of my professional journey in software engineering')}
          </p>
        </div>

        {/* Timeline wrapper */}
        <div className="relative border-l border-border/80 rtl:border-l-0 rtl:border-r ml-4 rtl:ml-0 rtl:mr-4 pl-8 rtl:pl-0 rtl:pr-8 space-y-12">
          {data.map((item) => (
            <div key={item.id} className="relative group">
              {/* Marker pin */}
              <div className="absolute -left-[41px] rtl:-left-0 rtl:-right-[41px] top-1 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center transition-colors duration-300 group-hover:bg-primary z-10">
                <Briefcase
                  size={12}
                  className="text-primary group-hover:text-primary-foreground transition-colors"
                />
              </div>

              {/* Experience Card */}
              <div className="glass-card p-6 md:p-8 hover:scale-[1.01] transition-transform duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  {/* Job details */}
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    {item.logo_url ? (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-border">
                        <Image
                          src={item.logo_url}
                          alt={item.company}
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                        {item.company.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground">
                        {tContent(item.position)}
                      </h3>
                      <p className="text-primary font-semibold text-sm">{item.company}</p>
                    </div>
                  </div>

                  {/* Period tag */}
                  <div className="flex items-center text-xs font-semibold text-muted-foreground bg-secondary/80 px-3 py-1.5 rounded-full w-fit">
                    <Calendar size={12} className="mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                    <span>
                      {formatDate(item.start_date)} -{' '}
                      {item.current ? t('current', 'Present') : formatDate(item.end_date || '')}
                    </span>
                  </div>
                </div>

                {/* Tasks text */}
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 whitespace-pre-line">
                  {tContent(item.description)}
                </p>

                {/* Tech specifications */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md bg-secondary text-foreground/80 border border-border/40"
                      >
                        {tech}
                      </span>
                    ))}
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
