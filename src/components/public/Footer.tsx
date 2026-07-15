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
  visible?: boolean;
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
      case 'whatsapp':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[17px] h-[17px]">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.028L2 22l5.13-1.346a9.921 9.921 0 004.877 1.28h.005c5.505 0 9.989-4.478 9.99-9.985A9.983 9.983 0 0012.012 2zm5.72 14.12c-.25.704-1.44 1.285-1.99 1.344-.49.05-1.13.06-1.82-.16-.68-.22-1.57-.59-2.63-1.05-4.52-1.95-7.4-6.56-7.62-6.86-.22-.3-1.78-2.37-1.78-4.53 0-2.16 1.13-3.21 1.53-3.64.4-.43.87-.54 1.16-.54.29 0 .58.01.83.02.26.01.61-.1.95.72.35.84 1.21 2.96 1.32 3.18.11.22.18.47.03.76-.15.3-.22.49-.44.75-.22.26-.46.58-.66.78-.22.22-.45.47-.19.92.26.45 1.15 1.9 2.47 3.08 1.7 1.52 3.12 1.99 3.56 2.19.45.2.72.17.99-.15.27-.32 1.16-1.81.3-.46.61-.39 1.03-.23.42.16 2.68 1.26 2.8 1.32.12.06.18.1.25.21.06.11.06.66-.19 1.37z" />
          </svg>
        );
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
            {socialLinks
              .filter((link) => link.visible !== false)
              .map((link) => (
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
