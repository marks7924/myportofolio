'use client';

import React, { useState } from 'react';
import { updateSettings } from '@/app/actions/cms';
import { Save, Loader2 } from 'lucide-react';

interface SettingsData {
  site_name: string;
  contact_email: string;
  phone: string;
  meta_title: { en: string; ar: string };
  meta_description: { en: string; ar: string };
  keywords: { en: string[]; ar: string[] };
  location: { en: string; ar: string };
  footer_text: { en: string; ar: string };
  sections_visibility: Record<string, boolean>;
}

interface SettingsCMSFormProps {
  initialData: SettingsData;
}

export default function SettingsCMSForm({ initialData }: SettingsCMSFormProps) {
  const [data, setData] = useState<SettingsData>(initialData);
  const [langTab, setLangTab] = useState<'en' | 'ar'>('en');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleTextChange = (
    field: 'meta_title' | 'meta_description' | 'location' | 'footer_text',
    lang: 'en' | 'ar',
    val: string
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: val },
    }));
  };

  const handleVisibilityToggle = (section: string) => {
    setData((prev) => ({
      ...prev,
      sections_visibility: {
        ...prev.sections_visibility,
        [section]: !prev.sections_visibility[section],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await updateSettings(data);
    if (res.success) {
      setMessage({ type: 'success', text: 'Global configurations updated successfully!' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save settings.' });
    }
    setLoading(false);
  };

  const sectionsList = [
    'hero',
    'about',
    'skills',
    'experience',
    'projects',
    'services',
    'testimonials',
    'certifications',
    'contact',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Website Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage global metadata, contacts, and layouts visibility.
          </p>
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

      {/* Tabs */}
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
            {lang === 'en' ? 'English Settings' : 'Arabic Settings (العربية)'}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground/80">Website Name</label>
          <input
            type="text"
            value={data.site_name}
            onChange={(e) => setData({ ...data, site_name: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Contact Email</label>
          <input
            type="email"
            value={data.contact_email}
            onChange={(e) => setData({ ...data, contact_email: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Contact Phone</label>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Location Address</label>
          <input
            type="text"
            value={langTab === 'en' ? data.location.en : data.location.ar}
            onChange={(e) => handleTextChange('location', langTab, e.target.value)}
            dir={langTab === 'ar' ? 'rtl' : 'ltr'}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Footer Copyright Text</label>
          <input
            type="text"
            value={langTab === 'en' ? data.footer_text.en : data.footer_text.ar}
            onChange={(e) => handleTextChange('footer_text', langTab, e.target.value)}
            dir={langTab === 'ar' ? 'rtl' : 'ltr'}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
          />
        </div>

        <div className="space-y-2 md:col-span-2 border-t border-border/40 pt-6 mt-2">
          <h3 className="font-bold text-sm text-foreground">SEO Parameters</h3>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground/80">Meta Title (Tab tag)</label>
          <input
            type="text"
            value={langTab === 'en' ? data.meta_title.en : data.meta_title.ar}
            onChange={(e) => handleTextChange('meta_title', langTab, e.target.value)}
            dir={langTab === 'ar' ? 'rtl' : 'ltr'}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground/80">Meta Description</label>
          <textarea
            value={langTab === 'en' ? data.meta_description.en : data.meta_description.ar}
            onChange={(e) => handleTextChange('meta_description', langTab, e.target.value)}
            dir={langTab === 'ar' ? 'rtl' : 'ltr'}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm resize-none text-foreground"
          />
        </div>

        <div className="space-y-4 md:col-span-2 border-t border-border/40 pt-6 mt-2">
          <h3 className="font-bold text-sm text-foreground">Layout Section Toggles</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sectionsList.map((sec) => (
              <label
                key={sec}
                className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-xl bg-secondary/25 border border-border/40 cursor-pointer hover:bg-secondary/40 select-none"
              >
                <input
                  type="checkbox"
                  checked={!!data.sections_visibility[sec]}
                  onChange={() => handleVisibilityToggle(sec)}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-semibold capitalize text-foreground/90">{sec}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
