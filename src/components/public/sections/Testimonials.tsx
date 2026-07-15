'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Quote } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  role: any;
  company: string | null;
  feedback: any;
  image_url: string | null;
}

interface TestimonialsProps {
  data: Testimonial[];
}

export default function Testimonials({ data }: TestimonialsProps) {
  const { t, tContent } = useLanguage();

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-display text-4xl md:text-6xl text-foreground leading-tight">
            {t('testimonials_title', 'Client Recommendations')}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {t('testimonials_subtitle', 'Kind words from colleagues, clients, and engineering leaders')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.map((item) => (
            <div
              key={item.id}
              className="glass-card p-8 md:p-10 flex flex-col justify-between space-y-6 relative hover:scale-[1.01] transition-transform duration-300"
            >
              {/* Quote icon watermark */}
              <Quote
                className="absolute top-6 right-6 rtl:right-auto rtl:left-6 text-primary/10"
                size={54}
              />

              <p className="text-foreground/80 text-sm md:text-base leading-relaxed italic relative z-10">
                "{tContent(item.feedback)}"
              </p>

              <div className="flex items-center space-x-4 rtl:space-x-reverse border-t border-border/40 pt-6">
                {item.image_url ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted border border-border">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-sm md:text-base text-foreground">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {tContent(item.role)} {item.company && `at ${item.company}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
