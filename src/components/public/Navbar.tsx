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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeLinks = navigation.filter((item) => item.visible);

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass py-4 shadow-lg border-b border-border'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand Logo */}
        <a href="#hero" className="text-xl font-bold text-gradient tracking-wider font-en">
          {siteName || 'Portfolio'}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 rtl:space-x-reverse">
          {activeLinks.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className="px-4 py-2 rounded-full text-sm font-medium hover:text-primary transition-colors text-foreground/80"
            >
              {tContent(item.label)}
            </a>
          ))}

          {/* Theme & Language Switchers */}
          <div className="flex items-center pl-4 border-l border-border rtl:border-l-0 rtl:border-r rtl:pr-4 rtl:pl-0 space-x-2 rtl:space-x-reverse">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary text-foreground/80 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-secondary text-foreground/80 flex items-center space-x-1 rtl:space-x-reverse transition-colors cursor-pointer"
              aria-label="Switch Language"
            >
              <Globe size={18} />
              <span className="text-xs font-bold uppercase">{locale === 'en' ? 'ar' : 'en'}</span>
            </button>
          </div>
        </nav>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center space-x-3 rtl:space-x-reverse">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary text-foreground/80 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-secondary text-foreground/80 flex items-center space-x-1 rtl:space-x-reverse transition-colors"
          >
            <Globe size={18} />
            <span className="text-xs font-bold uppercase">{locale === 'en' ? 'ar' : 'en'}</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-3">
              {activeLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="py-2 text-base font-medium text-foreground/90 hover:text-primary transition-colors border-b border-border/50 last:border-0"
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
