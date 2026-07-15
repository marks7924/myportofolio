'use client';

import React, { useState } from 'react';
import { upsertTestimonial, deleteTestimonial } from '@/app/actions/crud';
import { Plus, Trash2, Edit2, Loader2, Save, X } from 'lucide-react';
import MediaImagePicker from './MediaImagePicker';

interface TestimonialItem {
  id: string;
  name: string;
  role: { en: string; ar: string };
  company: string | null;
  feedback: { en: string; ar: string };
  image_url: string | null;
  published: boolean;
  sort_order: number;
}

interface TestimonialsManagerProps {
  initialData: TestimonialItem[];
}

export default function TestimonialsManager({ initialData }: TestimonialsManagerProps) {
  const [list, setList] = useState<TestimonialItem[]>(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [langTab, setLangTab] = useState<'en' | 'ar'>('en');

  const [form, setForm] = useState<{
    id?: string;
    name: string;
    role: { en: string; ar: string };
    company: string | null;
    feedback: { en: string; ar: string };
    image_url: string | null;
    published: boolean;
    sort_order: number;
  }>({
    name: '',
    role: { en: '', ar: '' },
    company: '',
    feedback: { en: '', ar: '' },
    image_url: '',
    published: true,
    sort_order: 0,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await upsertTestimonial(form);
    if (res.success) {
      window.location.reload();
    } else {
      alert(`Error: ${res.error}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this testimonial permanently?')) {
      const res = await deleteTestimonial(id);
      if (res.success) {
        setList((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(`Error: ${res.error}`);
      }
    }
  };

  const handleEdit = (item: TestimonialItem) => {
    setForm(item);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Testimonials CMS</h1>
          <p className="text-muted-foreground text-sm mt-1">Review and manage client recommendations.</p>
        </div>
        <button
          onClick={() => {
            setForm({
              name: '',
              role: { en: '', ar: '' },
              company: '',
              feedback: { en: '', ar: '' },
              image_url: '',
              published: true,
              sort_order: 0,
            });
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">No testimonials found.</div>
      ) : (
        <div className="space-y-4">
          {list.map((item) => (
            <div
              key={item.id}
              className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.role.en} {item.company && `at ${item.company}`} | Status:{' '}
                  <span className={`font-bold ${item.published ? 'text-green-500' : 'text-yellow-500'}`}>
                    {item.published ? 'Published' : 'Hidden'}
                  </span>{' '}
                  | Order: {item.sort_order}
                </p>
              </div>
              <div className="flex space-x-2 rtl:space-x-reverse">
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
                {form.id ? 'Edit Testimonial' : 'Add Testimonial'}
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
                label="Client Avatar Photo"
                value={form.image_url || ''}
                onChange={(url) => setForm({ ...form, image_url: url })}
              />

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Client Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Role / Position</label>
                <input
                  type="text"
                  required
                  value={langTab === 'en' ? form.role.en : form.role.ar}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: { ...form.role, [langTab]: e.target.value },
                    })
                  }
                  dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Company Name</label>
                <input
                  type="text"
                  value={form.company || ''}
                  onChange={(e) => setForm({ ...form, company: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Feedback Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={langTab === 'en' ? form.feedback.en : form.feedback.ar}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      feedback: { ...form.feedback, [langTab]: e.target.value },
                    })
                  }
                  dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm resize-none text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="flex flex-col justify-end pb-1.5">
                  <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-foreground">Publish Review</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>Save Testimonial</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
