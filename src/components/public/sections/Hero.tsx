'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

interface HeroProps {
  data: {
    name: any;
    title: any;
    subtitle: any;
    cta_text: any;
    cta_link: string;
    cta_text_secondary: any;
    cta_link_secondary: string;
    background_animation: string;
  };
}

export default function Hero({ data }: HeroProps) {
  const { tContent } = useLanguage();

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-background py-32"
    >
      {/* Clean diagonal stripe — subtle texture, no glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
          backgroundSize: '18px 18px',
        }}
      />

      {/* Thin horizontal rule top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Eyebrow label */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <span className="tag">✦ Available for freelance</span>
        </motion.div>

        {/* Name — large serif display */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tight text-foreground mb-4"
        >
          {tContent(data.name)}
        </motion.h1>

        {/* Title — accent color, lighter weight */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-xl sm:text-2xl font-medium text-primary mb-6 tracking-wide"
        >
          {tContent(data.title)}
        </motion.p>

        {/* Thin separator */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <hr className="section-rule mb-8" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed mb-10"
        >
          {tContent(data.subtitle)}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href={data.cta_link || '#projects'}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-foreground text-background font-semibold rounded-full text-sm transition-all duration-200 hover:opacity-80"
          >
            {tContent(data.cta_text) || 'View Work'}
            <ArrowRight size={15} className="rtl:rotate-180 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href={data.cta_link_secondary || '#contact'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent text-foreground font-semibold rounded-full text-sm border border-border transition-all duration-200 hover:border-foreground/40 hover:bg-secondary"
          >
            <Mail size={15} />
            {tContent(data.cta_text_secondary) || 'Get in Touch'}
          </a>
        </motion.div>
      </div>

      {/* Bottom thin rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </section>
  );
}
