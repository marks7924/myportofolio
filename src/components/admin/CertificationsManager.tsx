'use client';

import React, { useState } from 'react';
import { upsertCertification, deleteCertification } from '@/app/actions/crud';
import { Plus, Trash2, Edit2, Loader2, Save, X } from 'lucide-react';
import MediaImagePicker from './MediaImagePicker';

interface CertificationItem {
  id: string;
  title: { en: string; ar: string };
  organization: { en: string; ar: string };
  issue_date: string;
  credential_url: string | null;
  image_url: string | null;
  sort_order: number;
}

interface CertificationsManagerProps {
  initialData: CertificationItem[];
}

export default function CertificationsManager({ initialData }: CertificationsManagerProps) {
  const [list, setList] = useState<CertificationItem[]>(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [langTab, setLangTab] = useState<'en' | 'ar'>('en');

  const [form, setForm] = useState<{
    id?: string;
    title: { en: string; ar: string };
    organization: { en: string; ar: string };
    issue_date: string;
    credential_url: string | null;
    image_url: string | null;
    sort_order: number;
  }>({
    title: { en: '', ar: '' },
    organization: { en: '', ar: '' },
    issue_date: '',
    credential_url: '',
    image_url: '',
    sort_order: 0,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await upsertCertification(form);
    if (res.success) {
      window.location.reload();
    } else {
      alert(`Error: ${res.error}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this certification record permanently?')) {
      const res = await deleteCertification(id);
      if (res.success) {
        setList((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(`Error: ${res.error}`);
      }
    }
  };

  const handleEdit = (item: CertificationItem) => {
    setForm(item);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Certifications CMS</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure licenses and professional credentials.
          </p>
        </div>
        <button
          onClick={() => {
            setForm({
              title: { en: '', ar: '' },
              organization: { en: '', ar: '' },
              issue_date: '',
              credential_url: '',
              image_url: '',
              sort_order: 0,
            });
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">No certifications found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item) => (
            <div key={item.id} className="glass-card p-6 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-lg">{item.title.en}</h3>
                <p className="text-xs text-primary font-semibold">{item.organization.en}</p>
                <span className="text-[10px] text-muted-foreground block mt-1">
                  Issued: {item.issue_date} | Order: {item.sort_order}
                </span>
              </div>
              <div className="flex space-x-2 border-t border-border/30 pt-3 rtl:space-x-reverse">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-1.5 bg-secondary hover:bg-secondary/85 text-foreground rounded-lg border border-border text-xs flex items-center space-x-1 cursor-pointer font-semibold"
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg border border-destructive/20 text-xs flex items-center space-x-1 cursor-pointer font-semibold"
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="glass-card max-w-md w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="font-bold text-lg text-foreground">
                {form.id ? 'Edit Certificate' : 'Add Certificate'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full hover:bg-secondary cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

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
                  {lang === 'en' ? 'English Content' : 'Arabic Content'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <MediaImagePicker
                label="Certificate Document Image"
                value={form.image_url || ''}
                onChange={(url) => setForm({ ...form, image_url: url })}
              />

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Certificate Title</label>
                <input
                  type="text"
                  required
                  value={langTab === 'en' ? form.title.en : form.title.ar}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: { ...form.title, [langTab]: e.target.value },
                    })
                  }
                  dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  required
                  value={langTab === 'en' ? form.organization.en : form.organization.ar}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      organization: { ...form.organization, [langTab]: e.target.value },
                    })
                  }
                  dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Issue Date</label>
                <input
                  type="date"
                  required
                  value={form.issue_date}
                  onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Verification URL</label>
                <input
                  type="text"
                  value={form.credential_url || ''}
                  onChange={(e) => setForm({ ...form, credential_url: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Sort Order</label>
                <input
                  type="number"
                  required
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>Save Certificate</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
