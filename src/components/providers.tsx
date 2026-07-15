'use client';

import React from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

interface ProvidersProps {
  children: React.ReactNode;
  initialDictionary: Record<string, { en: string; ar: string }>;
}

export function Providers({ children, initialDictionary }: ProvidersProps) {
  return (
    <LanguageProvider initialDictionary={initialDictionary}>
      <ThemeProvider>{children}</ThemeProvider>
    </LanguageProvider>
  );
}
