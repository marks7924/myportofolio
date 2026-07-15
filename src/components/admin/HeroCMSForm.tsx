'use client';

import React, { useState } from 'react';
import { updateHero } from '@/app/actions/cms';
import { Save, Loader2 } from 'lucide-react';

interface HeroData {
  name: { en: string; ar: string };
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  cta_text: { en: string; ar: string };
  cta_link: string;
  cta_text_secondary: { en: string; ar: string };
  cta_link_secondary: string;
  background_animation: string;
}

interface HeroCMSFormProps {
  initialData: HeroData;
}

export default function HeroCMSForm({ initialData }: HeroCMSFormProps) {
  const [data, setData] = useState<HeroData>(initialData);
  const [langTab, setLangTab] = useState<'en' | 'ar'>('en');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleTextChange = (field: keyof HeroData, lang: 'en' | 'ar', val: string) => {
    setData((prev) => {
      const obj = prev[field];
      if (typeof obj === 'object' && obj !== null) {
        return {
          ...prev,
          [field]: { ...obj, [lang]: val },
        };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await updateHero(data);
    if (res.success) {
      setMessage({ type: 'success', text: 'Hero CMS saved successfully!' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update hero settings.' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Hero CMS</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure landing page typography and actions.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl flex items-center space-x-2 transition-all cursor-pointer text-sm"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>Save Changes</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-sm ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Language Switcher Tabs */}
      <div className="flex space-x-2 border-b border-border pb-px">
        {(['en', 'ar'] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setLangTab(lang)}
            className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              langTab === lang
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {lang === 'en' ? 'English Fields' : 'Arabic Fields (العربية)'}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Developer Name</label>
          <input
            type="text"
            value={langTab === 'en' ? data.name.en : data.name.ar}
            onChange={(e) => handleTextChange('name', langTab, e.target.value)}
            dir={langTab === 'ar' ? 'rtl' : 'ltr'}
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Professional Title</label>
          <input
            type="text"
            value={langTab === 'en' ? data.title.en : data.title.ar}
            onChange={(e) => handleTextChange('title', langTab, e.target.value)}
            dir={langTab === 'ar' ? 'rtl' : 'ltr'}
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Short Introduction / Subtitle</label>
          <textarea
            value={langTab === 'en' ? data.subtitle.en : data.subtitle.ar}
            onChange={(e) => handleTextChange('subtitle', langTab, e.target.value)}
            dir={langTab === 'ar' ? 'rtl' : 'ltr'}
            required
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm resize-none text-foreground"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border border-border bg-secondary/10">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Primary CTA Label</label>
            <input
              type="text"
              value={langTab === 'en' ? data.cta_text.en : data.cta_text.ar}
              onChange={(e) => handleTextChange('cta_text', langTab, e.target.value)}
              dir={langTab === 'ar' ? 'rtl' : 'ltr'}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Primary CTA Route / Path</label>
            <input
              type="text"
              value={data.cta_link}
              onChange={(e) => setData({ ...data, cta_link: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border border-border bg-secondary/10">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Secondary CTA Label</label>
            <input
              type="text"
              value={langTab === 'en' ? data.cta_text_secondary.en : data.cta_text_secondary.ar}
              onChange={(e) => handleTextChange('cta_text_secondary', langTab, e.target.value)}
              dir={langTab === 'ar' ? 'rtl' : 'ltr'}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Secondary CTA Route / Path</label>
            <input
              type="text"
              value={data.cta_link_secondary}
              onChange={(e) => setData({ ...data, cta_link_secondary: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Background Animation</label>
          <select
            value={data.background_animation}
            onChange={(e) => setData({ ...data, background_animation: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
          >
            <option value="particles">Interactive Particles</option>
            <option value="waves">Polished Waves</option>
            <option value="none">No Animation</option>
          </select>
        </div>
      </div>
    </form>
  );
}
