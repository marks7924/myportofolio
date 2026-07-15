'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  id: string;
  label: any;
  path: string;
  visible: boolean;
}

interface NavbarProps {
  navigation: NavItem[];
  siteName: string;
}

export default function Navbar({ navigation, siteName }: NavbarProps) {
  const { locale, setLocale, tContent } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeLinks = navigation.filter((item) => item.visible);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        {/* Brand */}
        <a
          href="#hero"
          className="font-display text-lg font-normal tracking-tight text-foreground hover:text-primary transition-colors"
        >
          {siteName || 'Portfolio'}
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {activeLinks.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className="px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
            >
              {tContent(item.label)}
            </a>
          ))}

          {/* Controls */}
          <div className="flex items-center gap-1 ml-3 pl-3 border-l border-border rtl:border-l-0 rtl:border-r rtl:pr-3 rtl:pl-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary text-xs font-semibold uppercase transition-colors cursor-pointer"
              aria-label="Switch language"
            >
              <Globe size={14} />
              {locale === 'en' ? 'AR' : 'EN'}
            </button>
          </div>
        </nav>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-muted-foreground hover:bg-secondary text-xs font-semibold uppercase transition-colors"
          >
            <Globe size={14} />
            {locale === 'en' ? 'AR' : 'EN'}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-foreground hover:bg-secondary transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {activeLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 px-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                >
                  {tContent(item.label)}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
