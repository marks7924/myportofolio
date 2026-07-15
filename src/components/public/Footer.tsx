'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Globe, Sun, Moon, Github, Linkedin, Twitter, ArrowUp } from 'lucide-react';

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
      case 'github':
        return <Github size={20} />;
      case 'linkedin':
        return <Linkedin size={20} />;
      case 'twitter':
      case 'x':
        return <Twitter size={20} />;
      default:
        return null;
    }
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-secondary/40 border-t border-border py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left rtl:md:text-right">
        {/* Left Column: Copyright text */}
        <div>
          <p className="text-sm text-muted-foreground">
            {tContent(footerText) || `© ${new Date().getFullYear()} Alex Morgan. All rights reserved.`}
          </p>
        </div>

        {/* Center Column: Social platforms */}
        <div className="flex justify-center space-x-4 rtl:space-x-reverse">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-border hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-300"
              aria-label={link.platform}
            >
              {getIcon(link.platform)}
            </a>
          ))}
        </div>

        {/* Right Column: Configuration actions & scroll top */}
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-end space-y-4 md:space-y-0 md:space-x-6 rtl:space-x-reverse">
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center space-x-1 rtl:space-x-reverse transition-colors cursor-pointer"
              aria-label="Toggle Language"
            >
              <Globe size={16} />
              <span className="text-xs uppercase font-bold">{locale === 'en' ? 'ar' : 'en'}</span>
            </button>
          </div>

          <button
            onClick={handleScrollTop}
            className="p-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-full transition-all hover:scale-105 duration-300 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
