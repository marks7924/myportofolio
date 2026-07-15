'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Github, Linkedin, Twitter, Sun, Moon, Globe, ArrowUp } from 'lucide-react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

interface FooterProps {
  socialLinks: SocialLink[];
  footerText: any;
  navigation: any[];
}

export default function Footer({ socialLinks, footerText, navigation }: FooterProps) {
  const { locale, setLocale, tContent } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':    return <Github size={17} />;
      case 'linkedin':  return <Linkedin size={17} />;
      case 'twitter':
      case 'x':         return <Twitter size={17} />;
      default:          return null;
    }
  };

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center md:text-left rtl:md:text-right">
            {tContent(footerText) || `© ${new Date().getFullYear()} Portfolio. All rights reserved.`}
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                aria-label={link.platform}
              >
                {getIcon(link.platform)}
              </a>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1 px-2.5 py-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary text-xs font-semibold uppercase transition-colors cursor-pointer"
            >
              <Globe size={14} />
              {locale === 'en' ? 'AR' : 'EN'}
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
