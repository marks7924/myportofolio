'use client';

import React, { useState } from 'react';
import { upsertProject, deleteProject, duplicateProject } from '@/app/actions/projects';
import { Plus, Trash2, Edit2, Copy, Loader2, Save, X, Star, ListPlus, ArrowUp, ArrowDown } from 'lucide-react';
import MediaImagePicker from './MediaImagePicker';
import MediaImagePickerModalOnly from './MediaImagePickerModalOnly';
import Image from 'next/image';

interface ProjectImage {
  id?: string;
  image_url: string;
  sort_order: number;
}

interface ProjectItem {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  full_description: { en: string; ar: string } | null;
  challenges: { en: string; ar: string } | null;
  solutions: { en: string; ar: string } | null;
  features: { en: string[]; ar: string[] };
  cover_image: string | null;
  tech_stack: string[];
  github_link: string | null;
  live_demo: string | null;
  category: string;
  featured: boolean;
  status: 'Draft' | 'In Progress' | 'Completed';
  completion_date: string | null;
  client: { en: string; ar: string } | null;
  sort_order: number;
  published: boolean;
  project_images?: ProjectImage[];
}

interface ProjectsManagerProps {
  initialData: ProjectItem[];
}

export default function ProjectsManager({ initialData }: ProjectsManagerProps) {
  const [list, setList] = useState<ProjectItem[]>(initialData);
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [langTab, setLangTab] = useState<'en' | 'ar'>('en');

  const [form, setForm] = useState<Partial<ProjectItem>>({
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    full_description: { en: '', ar: '' },
    challenges: { en: '', ar: '' },
    solutions: { en: '', ar: '' },
    features: { en: [], ar: [] },
    cover_image: '',
    tech_stack: [],
    github_link: '',
    live_demo: '',
    category: 'Web Development',
    featured: false,
    status: 'Completed',
    completion_date: '',
    client: { en: '', ar: '' },
    sort_order: 0,
    published: true,
  });

  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false);

  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  const handleEdit = (item: ProjectItem) => {
    setForm(item);
    setGalleryUrls((item.project_images || []).map((img) => img.image_url));
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project and all its gallery connections permanently?')) {
      const res = await deleteProject(id);
      if (res.success) {
        setList((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(`Error: ${res.error}`);
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    const res = await duplicateProject(id);
    if (res.success) {
      window.location.reload();
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: any = {
      ...form,
      full_description: form.full_description?.en ? form.full_description : null,
      challenges: form.challenges?.en ? form.challenges : null,
      solutions: form.solutions?.en ? form.solutions : null,
      client: form.client?.en ? form.client : null,
      completion_date: form.completion_date || null,
    };

    const res = await upsertProject(payload, galleryUrls);
    if (res.success) {
      window.location.reload();
    } else {
      alert(`Error: ${res.error}`);
    }
    setLoading(false);
  };

  const appendGalleryImage = (url: string) => {
    setGalleryUrls((prev) => [...prev, url]);
  };

  const removeGalleryImage = (idx: number) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveGalleryImage = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= galleryUrls.length) return;
    const updated = [...galleryUrls];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setGalleryUrls(updated);
  };

  const addTechTag = () => {
    if (techInput.trim() && !form.tech_stack?.includes(techInput.trim())) {
      setForm({ ...form, tech_stack: [...(form.tech_stack || []), techInput.trim()] });
      setTechInput('');
    }
  };

  const removeTechTag = (tag: string) => {
    setForm({ ...form, tech_stack: (form.tech_stack || []).filter((t) => t !== tag) });
  };

  const addFeatureItem = () => {
    if (featureInput.trim()) {
      const currentList = form.features?.[langTab] || [];
      setForm({
        ...form,
        features: {
          ...form.features,
          [langTab]: [...currentList, featureInput.trim()],
        } as any,
      });
      setFeatureInput('');
    }
  };

  const removeFeatureItem = (idx: number) => {
    const currentList = form.features?.[langTab] || [];
    setForm({
      ...form,
      features: {
        ...form.features,
        [langTab]: currentList.filter((_, i) => i !== idx),
      } as any,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Projects CMS</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage project portfolios, cover pictures, and descriptions.
          </p>
        </div>
        <button
          onClick={() => {
            setForm({
              title: { en: '', ar: '' },
              description: { en: '', ar: '' },
              full_description: { en: '', ar: '' },
              challenges: { en: '', ar: '' },
              solutions: { en: '', ar: '' },
              features: { en: [], ar: [] },
              cover_image: '',
              tech_stack: [],
              github_link: '',
              live_demo: '',
              category: 'Web Development',
              featured: false,
              status: 'Completed',
              completion_date: '',
              client: { en: '', ar: '' },
              sort_order: 0,
              published: true,
            });
            setGalleryUrls([]);
            setEditorOpen(true);
          }}
          className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Grid listing */}
      {list.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">No projects found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item) => (
            <div
              key={item.id}
              className="glass-card overflow-hidden flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-lg leading-snug">{item.title.en}</h3>
                  {item.featured && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  {item.category}
                </p>
                <div className="flex gap-2 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded ${
                      item.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}
                  >
                    {item.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="px-2 py-0.5 bg-secondary rounded text-muted-foreground">
                    Order: {item.sort_order}
                  </span>
                </div>
              </div>

              <div className="flex space-x-1 border-t border-border/30 p-3 rtl:space-x-reverse bg-secondary/10">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-grow py-2.5 bg-secondary hover:bg-secondary/85 text-foreground rounded-lg border border-border text-xs flex items-center justify-center space-x-1 cursor-pointer font-bold"
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDuplicate(item.id)}
                  className="p-2.5 bg-secondary hover:bg-secondary/85 text-foreground rounded-lg border border-border text-xs flex items-center justify-center cursor-pointer font-bold"
                  title="Duplicate Project"
                >
                  <Copy size={12} />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg border border-destructive/20 text-xs flex items-center justify-center cursor-pointer font-bold"
                  title="Delete Project"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Panel Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="glass-card max-w-4xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="font-bold text-lg text-foreground">
                {form.id ? 'Edit Project Profile' : 'Add Project Profile'}
              </h3>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
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
                  label="Project Display Cover Picture"
                  value={form.cover_image || ''}
                  onChange={(url) => setForm({ ...form, cover_image: url })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Project Title</label>
                <input
                  type="text"
                  required
                  value={langTab === 'en' ? form.title?.en : form.title?.ar}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: { ...(form.title || { en: '', ar: '' }), [langTab]: e.target.value } as any,
                    })
                  }
                  dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Project Category</label>
                <input
                  type="text"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="E.g. Web Development, UI/UX"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Short Card Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={langTab === 'en' ? form.description?.en : form.description?.ar}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: {
                        ...(form.description || { en: '', ar: '' }),
                        [langTab]: e.target.value,
                      } as any,
                    })
                  }
                  dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm resize-none text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Project Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Completion Date</label>
                  <input
                    type="date"
                    value={form.completion_date || ''}
                    onChange={(e) => setForm({ ...form, completion_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Client Name</label>
                  <input
                    type="text"
                    value={langTab === 'en' ? form.client?.en : form.client?.ar}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        client: {
                          ...(form.client || { en: '', ar: '' }),
                          [langTab]: e.target.value,
                        } as any,
                      })
                    }
                    dir={langTab === 'ar' ? 'rtl' : 'ltr'}
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

              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/15 border border-border/40 rounded-xl md:col-span-2 select-none">
                <label className="flex items-center space-x-2.5 rtl:space-x-reverse cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-foreground">Publish Project (Visible)</span>
                </label>

                <label className="flex items-center space-x-2.5 rtl:space-x-reverse cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-foreground flex items-center space-x-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span>Feature Project (Highlighted)</span>
                  </span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">GitHub Repo URL</label>
                <input
                  type="text"
                  value={form.github_link || ''}
                  onChange={(e) => setForm({ ...form, github_link: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Live Demo URL</label>
                <input
                  type="text"
                  value={form.live_demo || ''}
                  onChange={(e) => setForm({ ...form, live_demo: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="space-y-1 md:col-span-2 border-t border-border/40 pt-4 mt-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Full Details (Markdown description)
                </label>
                <textarea
                  rows={5}
                  value={langTab === 'en' ? form.full_description?.en : form.full_description?.ar}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      full_description: {
                        ...(form.full_description || { en: '', ar: '' }),
                        [langTab]: e.target.value,
                      } as any,
                    })
                  }
                  dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm resize-none text-foreground font-mono"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Project Challenges (Markdown)
                </label>
                <textarea
                  rows={3}
                  value={langTab === 'en' ? form.challenges?.en : form.challenges?.ar}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      challenges: {
                        ...(form.challenges || { en: '', ar: '' }),
                        [langTab]: e.target.value,
                      } as any,
                    })
                  }
                  dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm resize-none text-foreground font-mono"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Project Solutions (Markdown)
                </label>
                <textarea
                  rows={3}
                  value={langTab === 'en' ? form.solutions?.en : form.solutions?.ar}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      solutions: {
                        ...(form.solutions || { en: '', ar: '' }),
                        [langTab]: e.target.value,
                      } as any,
                    })
                  }
                  dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm resize-none text-foreground font-mono"
                />
              </div>

              <div className="space-y-2 md:col-span-2 border-t border-border/40 pt-4">
                <label className="text-xs font-semibold text-muted-foreground">Technologies list</label>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <input
                    type="text"
                    placeholder="E.g. Next.js, Redux (Press Enter)"
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
                  {(form.tech_stack || []).map((tech) => (
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

              <div className="space-y-2 md:col-span-2 border-t border-border/40 pt-4">
                <label className="text-xs font-semibold text-muted-foreground">
                  Features Highlights (Bullet list)
                </label>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <input
                    type="text"
                    placeholder="Enter feature text point..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeatureItem();
                      }
                    }}
                    className="flex-grow px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                  />
                  <button
                    type="button"
                    onClick={addFeatureItem}
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm border border-border font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <ul className="space-y-2 pt-2">
                  {(form.features?.[langTab] || []).map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center p-2 rounded bg-secondary/20 border border-border/40 text-xs text-foreground"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeFeatureItem(idx)}
                        className="text-destructive hover:text-destructive/80 font-bold px-2 cursor-pointer"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 md:col-span-2 border-t border-border/40 pt-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Gallery Image Catalog (Re-order / Select)
                  </label>
                  <button
                    type="button"
                    onClick={() => setGalleryPickerOpen(true)}
                    className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-semibold rounded-lg flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ListPlus size={14} />
                    <span>Select from Media Library</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 py-2">
                  {galleryUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square border border-border rounded-xl overflow-hidden bg-secondary group flex flex-col justify-between"
                    >
                      <Image src={url} alt={`Gallery image ${idx}`} fill className="object-cover" />

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-2 transition-all">
                        <div className="flex justify-between w-full">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveGalleryImage(idx, 'up')}
                            className="p-1 rounded bg-secondary/80 text-foreground disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === galleryUrls.length - 1}
                            onClick={() => moveGalleryImage(idx, 'down')}
                            className="p-1 rounded bg-secondary/80 text-foreground disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="w-full py-1 bg-destructive hover:bg-destructive/80 text-primary-foreground font-semibold rounded text-[10px] cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>Save Project Profile</span>
            </button>
          </form>
        </div>
      )}

      {galleryPickerOpen && (
        <MediaImagePickerModalOnly
          onClose={() => setGalleryPickerOpen(false)}
          onSelect={appendGalleryImage}
        />
      )}
    </div>
  );
}
