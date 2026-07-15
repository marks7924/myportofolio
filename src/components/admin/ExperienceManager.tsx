'use client';

import React, { useState } from 'react';
import { upsertExperience, deleteExperience } from '@/app/actions/crud';
import { Plus, Trash2, Edit2, Loader2, Save, X, Calendar } from 'lucide-react';
import MediaImagePicker from './MediaImagePicker';

interface ExperienceItem {
  id: string;
  company: string;
  position: { en: string; ar: string };
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: { en: string; ar: string };
  technologies: string[];
  logo_url: string | null;
  sort_order: number;
}

interface ExperienceManagerProps {
  initialData: ExperienceItem[];
}

export default function ExperienceManager({ initialData }: ExperienceManagerProps) {
  const [list, setList] = useState<ExperienceItem[]>(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [langTab, setLangTab] = useState<'en' | 'ar'>('en');

  const [form, setForm] = useState<{
    id?: string;
    company: string;
    position: { en: string; ar: string };
    start_date: string;
    end_date: string | null;
    current: boolean;
    description: { en: string; ar: string };
    technologies: string[];
    logo_url: string | null;
    sort_order: number;
  }>({
    company: '',
    position: { en: '', ar: '' },
    start_date: '',
    end_date: '',
    current: false,
    description: { en: '', ar: '' },
    technologies: [],
    logo_url: '',
    sort_order: 0,
  });

  const [techInput, setTechInput] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await upsertExperience({
      ...form,
      end_date: form.current ? null : form.end_date || null,
    });
    if (res.success) {
      window.location.reload();
    } else {
      alert(`Error: ${res.error}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience record permanently?')) {
      const res = await deleteExperience(id);
      if (res.success) {
        setList((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(`Error: ${res.error}`);
      }
    }
  };

  const handleEdit = (item: ExperienceItem) => {
    setForm(item);
    setModalOpen(true);
  };

  const addTechTag = () => {
    if (techInput.trim() && !form.technologies.includes(techInput.trim())) {
      setForm({ ...form, technologies: [...form.technologies, techInput.trim()] });
      setTechInput('');
    }
  };

  const removeTechTag = (tag: string) => {
    setForm({ ...form, technologies: form.technologies.filter((t) => t !== tag) });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Experience CMS</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage employment timelines and achievements.
          </p>
        </div>
        <button
          onClick={() => {
            setForm({
              company: '',
              position: { en: '', ar: '' },
              start_date: '',
              end_date: '',
              current: false,
              description: { en: '', ar: '' },
              technologies: [],
              logo_url: '',
              sort_order: 0,
            });
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Record</span>
        </button>
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">No experience records found.</div>
      ) : (
        <div className="space-y-4">
          {list.map((item) => (
            <div
              key={item.id}
              className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <h3 className="font-bold text-lg">
                  {item.position.en} at <span className="text-primary">{item.company}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Calendar size={12} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  {item.start_date} - {item.current ? 'Present' : item.end_date || ''} | Order:{' '}
                  {item.sort_order}
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

      {/* Upsert Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="glass-card max-w-2xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="font-bold text-lg text-foreground">
                {form.id ? 'Edit Experience Record' : 'Add Experience Record'}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <MediaImagePicker
                  label="Company Logo Picture"
                  value={form.logo_url || ''}
                  onChange={(url) => setForm({ ...form, logo_url: url })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Company Name</label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Position Title</label>
                <input
                  type="text"
                  required
                  value={langTab === 'en' ? form.position.en : form.position.ar}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      position: { ...form.position, [langTab]: e.target.value },
                    })
                  }
                  dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Start Date</label>
                <input
                  type="date"
                  required
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">End Date</label>
                  <input
                    type="date"
                    disabled={form.current}
                    value={form.end_date || ''}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground disabled:opacity-50"
                  />
                </div>
                <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.current}
                    onChange={(e) => setForm({ ...form, current: e.target.checked })}
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-foreground">Currently Employed Here</span>
                </label>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Description (Activities)
                </label>
                <textarea
                  required
                  rows={4}
                  value={langTab === 'en' ? form.description.en : form.description.ar}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: { ...form.description, [langTab]: e.target.value },
                    })
                  }
                  dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm resize-none text-foreground"
                />
              </div>

              <div className="space-y-2 md:col-span-2 border-t border-border/40 pt-4">
                <label className="text-xs font-semibold text-muted-foreground">
                  Technologies Used
                </label>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <input
                    type="text"
                    placeholder="E.g. React, Docker (Press Enter to add)"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechTag();
                      }
                    }}
                    className="flex-grow px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                  />
                  <button
                    type="button"
                    onClick={addTechTag}
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm border border-border font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {form.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTechTag(tech)}
                        className="text-primary hover:text-red-500 font-bold cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Sort Order Index
                </label>
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
              className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>Save Record</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
