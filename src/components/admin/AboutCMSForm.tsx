'use client';

import React, { useState } from 'react';
import { updateAbout } from '@/app/actions/cms';
import { Save, Loader2 } from 'lucide-react';
import MediaImagePicker from './MediaImagePicker';

interface AboutData {
  biography: { en: string; ar: string };
  skills_summary: { en: string; ar: string };
  cv_url: string;
  profile_image_url: string;
}

interface AboutCMSFormProps {
  initialData: AboutData;
}

export default function AboutCMSForm({ initialData }: AboutCMSFormProps) {
  const [data, setData] = useState<AboutData>(initialData);
  const [langTab, setLangTab] = useState<'en' | 'ar'>('en');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleTextChange = (field: keyof AboutData, lang: 'en' | 'ar', val: string) => {
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

    const res = await updateAbout(data);
    if (res.success) {
      setMessage({ type: 'success', text: 'About CMS settings updated successfully!' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update about settings.' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">About CMS</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure biographies and profile documents.</p>
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
        {/* Profile Image Picker */}
        <MediaImagePicker
          label="Profile Display Picture"
          value={data.profile_image_url}
          onChange={(url) => setData({ ...data, profile_image_url: url })}
        />

        {/* Biography */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Biography (Full text)</label>
          <textarea
            value={langTab === 'en' ? data.biography.en : data.biography.ar}
            onChange={(e) => handleTextChange('biography', langTab, e.target.value)}
            dir={langTab === 'ar' ? 'rtl' : 'ltr'}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm resize-none text-foreground"
          />
        </div>

        {/* Skills Summary */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Skills Summary / Hook</label>
          <textarea
            value={langTab === 'en' ? data.skills_summary.en : data.skills_summary.ar}
            onChange={(e) => handleTextChange('skills_summary', langTab, e.target.value)}
            dir={langTab === 'ar' ? 'rtl' : 'ltr'}
            required
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm resize-none text-foreground"
          />
        </div>

        {/* CV Link */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Resume / CV Document URL</label>
          <input
            type="text"
            value={data.cv_url}
            onChange={(e) => setData({ ...data, cv_url: e.target.value })}
            placeholder="Choose or paste PDF link from Media library"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
          />
        </div>
      </div>
    </form>
  );
}
