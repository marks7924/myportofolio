'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'en' | 'ar';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, defaultValue?: string) => string;
  tContent: (field: any, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialDictionary,
}: {
  children: React.ReactNode;
  initialDictionary: Record<string, { en: string; ar: string }>;
}) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved === 'en' || saved === 'ar') {
      setLocaleState(saved);
    } else {
      setLocaleState('en');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale, mounted]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  // Helper to translate static UI dictionary keys
  const t = (key: string, defaultValue = ''): string => {
    const item = initialDictionary[key];
    if (!item) return defaultValue || key;
    return item[locale] || item['en'] || defaultValue || key;
  };

  // Helper to resolve dynamic database content stored in JSONB objects
  const tContent = (field: any, defaultValue = ''): string => {
    if (!field) return defaultValue;
    if (typeof field === 'string') return field;
    if (typeof field === 'object') {
      return field[locale] || field['en'] || defaultValue || '';
    }
    return defaultValue;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tContent }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
