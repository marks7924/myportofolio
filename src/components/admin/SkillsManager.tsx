'use client';

import React, { useState } from 'react';
import { upsertSkill, deleteSkill, createSkillCategory, deleteSkillCategory } from '@/app/actions/crud';
import { Plus, Trash2, Edit2, Loader2, Save, X } from 'lucide-react';

interface Category {
  id: string;
  name: { en: string; ar: string };
  sort_order: number;
}

interface Skill {
  id: string;
  category_id: string;
  name: string;
  icon: string;
  proficiency: number;
  sort_order: number;
}

interface SkillsManagerProps {
  categories: Category[];
  skills: Skill[];
}

export default function SkillsManager({ categories, skills }: SkillsManagerProps) {
  const [catList, setCatList] = useState<Category[]>(categories);
  const [skillList, setSkillList] = useState<Skill[]>(skills);

  const [catModal, setCatModal] = useState(false);
  const [skillModal, setSkillModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [skillForm, setSkillForm] = useState<{
    id?: string;
    category_id: string;
    name: string;
    icon: string;
    proficiency: number;
    sort_order: number;
  }>({
    category_id: categories[0]?.id || '',
    name: '',
    icon: 'react',
    proficiency: 90,
    sort_order: 0,
  });

  const [catForm, setCatForm] = useState({
    name_en: '',
    name_ar: '',
    sort_order: 0,
  });

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: { en: catForm.name_en, ar: catForm.name_ar },
      sort_order: catForm.sort_order,
    };
    const res = await createSkillCategory(payload);
    if (res.success) {
      window.location.reload();
    } else {
      alert(`Error: ${res.error}`);
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Delete this category and all its skills permanently?')) {
      const res = await deleteSkillCategory(id);
      if (res.success) {
        setCatList((prev) => prev.filter((c) => c.id !== id));
        setSkillList((prev) => prev.filter((s) => s.category_id !== id));
      } else {
        alert(`Error: ${res.error}`);
      }
    }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await upsertSkill(skillForm);
    if (res.success) {
      window.location.reload();
    } else {
      alert(`Error: ${res.error}`);
    }
    setLoading(false);
  };

  const handleDeleteSkill = async (id: string) => {
    if (confirm('Delete this skill permanently?')) {
      const res = await deleteSkill(id);
      if (res.success) {
        setSkillList((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(`Error: ${res.error}`);
      }
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setSkillForm(skill);
    setSkillModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Skills CMS</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage skill categories, proficiency levels, and icons.
          </p>
        </div>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => {
              setCatForm({ name_en: '', name_ar: '', sort_order: 0 });
              setCatModal(true);
            }}
            className="px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-xl border border-border text-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>

          <button
            onClick={() => {
              setSkillForm({
                category_id: catList[0]?.id || '',
                name: '',
                icon: 'react',
                proficiency: 90,
                sort_order: 0,
              });
              setSkillModal(true);
            }}
            disabled={catList.length === 0}
            className="px-4 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold rounded-xl text-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Skill Item</span>
          </button>
        </div>
      </div>

      {/* Main Categories and Skills */}
      <div className="space-y-8">
        {catList.map((cat) => {
          const catSkills = skillList.filter((s) => s.category_id === cat.id);
          return (
            <div key={cat.id} className="glass-card p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    {cat.name.en}{' '}
                    <span className="text-muted-foreground font-normal">/ {cat.name.ar}</span>
                  </h3>
                  <span className="text-xs text-muted-foreground">Order Index: {cat.sort_order}</span>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 rounded-lg transition-colors cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {catSkills.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No skills registered in this category.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-4 rounded-xl border border-border/60 bg-secondary/15 flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{skill.name}</h4>
                        <p className="text-[10px] text-muted-foreground">
                          Icon: <span className="font-mono text-primary">{skill.icon}</span> |
                          Proficiency: <span className="font-bold">{skill.proficiency}%</span> |
                          Order: {skill.sort_order}
                        </p>
                      </div>
                      <div className="flex space-x-1 rtl:space-x-reverse">
                        <button
                          onClick={() => handleEditSkill(skill)}
                          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Category Creation Modal */}
      {catModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCategory}
            className="glass-card max-w-md w-full p-6 md:p-8 space-y-6"
          >
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="font-bold text-lg text-foreground">Add Skill Category</h3>
              <button
                type="button"
                onClick={() => setCatModal(false)}
                className="p-1 rounded-full hover:bg-secondary cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Category Name (English)
                </label>
                <input
                  type="text"
                  required
                  value={catForm.name_en}
                  onChange={(e) => setCatForm({ ...catForm, name_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Category Name (Arabic)
                </label>
                <input
                  type="text"
                  required
                  value={catForm.name_ar}
                  onChange={(e) => setCatForm({ ...catForm, name_ar: e.target.value })}
                  dir="rtl"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Sort Order Index
                </label>
                <input
                  type="number"
                  required
                  value={catForm.sort_order}
                  onChange={(e) => setCatForm({ ...catForm, sort_order: parseInt(e.target.value, 10) })}
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
              <span>Save Category</span>
            </button>
          </form>
        </div>
      )}

      {/* Skill upsert Modal */}
      {skillModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveSkill} className="glass-card max-w-md w-full p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="font-bold text-lg text-foreground">
                {skillForm.id ? 'Edit Skill Item' : 'Add Skill Item'}
              </h3>
              <button
                type="button"
                onClick={() => setSkillModal(false)}
                className="p-1 rounded-full hover:bg-secondary cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Parent Category</label>
                <select
                  value={skillForm.category_id}
                  onChange={(e) => setSkillForm({ ...skillForm, category_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                >
                  {catList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name.en} / {c.name.ar}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Skill Name</label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Proficiency %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={skillForm.proficiency}
                    onChange={(e) =>
                      setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Sort Order</label>
                  <input
                    type="number"
                    required
                    value={skillForm.sort_order}
                    onChange={(e) =>
                      setSkillForm({ ...skillForm, sort_order: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Vector Icon Tag</label>
                <select
                  value={skillForm.icon}
                  onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
                >
                  <option value="react">React / Next framework</option>
                  <option value="code2">TypeScript / Javascript code</option>
                  <option value="database">PostgreSQL / SQL database</option>
                  <option value="server">Node / backend Server</option>
                  <option value="cloud">Cloud / AWS hosting</option>
                  <option value="paint-brush">Tailwind / CSS styles</option>
                  <option value="git-branch">Git versioning</option>
                  <option value="terminal">Docker / Command tools</option>
                  <option value="cpu">General processor / tech</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>Save Skill Item</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
