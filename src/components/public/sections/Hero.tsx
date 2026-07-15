'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 bg-background"
    >
      {/* Handcrafted animated canvas backgrounds */}
      {data.background_animation !== 'none' && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-35">
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] rounded-full bg-primary/20 blur-[80px] lg:blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] rounded-full bg-indigo-500/10 blur-[60px] lg:blur-[100px] animate-float" />
          
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider"
          >
            <span>🚀 Ready for hire</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight"
          >
            <span className="block text-foreground">{tContent(data.name)}</span>
            <span className="block text-gradient mt-2 font-en">{tContent(data.title)}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-base sm:text-xl text-muted-foreground leading-relaxed"
          >
            {tContent(data.subtitle)}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a
              href={data.cta_link || '#projects'}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full shadow-lg hover:shadow-primary/25 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <span>{tContent(data.cta_text) || 'Explore Work'}</span>
              <ArrowRight size={18} className="rtl:rotate-180" />
            </a>

            <a
              href={data.cta_link_secondary || '#contact'}
              className="w-full sm:w-auto px-8 py-4 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-full border border-border flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <MessageSquare size={18} />
              <span>{tContent(data.cta_text_secondary) || 'Contact Me'}</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
