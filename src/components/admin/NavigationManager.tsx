'use client';

import React, { useState } from 'react';
import { updateNavigationItems } from '@/app/actions/cms';
import { ArrowUp, ArrowDown, Trash2, Plus, Save, Loader2, ToggleLeft, ToggleRight, Eye, EyeOff } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: { en: string; ar: string };
  path: string;
  sort_order: number;
  visible: boolean;
}

interface NavigationManagerProps {
  initialItems: NavigationItem[];
}

export default function NavigationManager({ initialItems }: NavigationManagerProps) {
  const [items, setItems] = useState<NavigationItem[]>(
    [...initialItems].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFieldChange = (id: string, field: 'path' | 'visible', val: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleLabelChange = (id: string, lang: 'en' | 'ar', val: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, label: { ...item.label, [lang]: val } } : item
      )
    );
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[nextIndex];
    newItems[nextIndex] = temp;

    // Recalculate sort order based on new array order
    const updatedItems = newItems.map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }));

    setItems(updatedItems);
  };

  const addNewItem = () => {
    const newItem: NavigationItem = {
      id: 'new-' + Math.random().toString(36).substring(7),
      label: { en: 'New Link', ar: 'رابط جديد' },
      path: '#',
      sort_order: items.length + 1,
      visible: true,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    // Strip out client-side prefix for IDs if database is Supabase, or keep it if it is JSON
    const payload = items.map((item, idx) => ({
      id: item.id.startsWith('new-') ? undefined : item.id, // Supabase will auto-gen UUID
      label: item.label,
      path: item.path,
      sort_order: idx + 1,
      visible: item.visible,
    }));

    const res = await updateNavigationItems(payload);
    if (res.success) {
      setMessage({ type: 'success', text: 'Navigation menu items updated successfully!' });
      // Reload page to refresh initial server items
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update navigation menu items.' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Navigation Menu Items</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure header links, custom anchor navigation, and ordering visible to public guests.
          </p>
        </div>
        <button
          onClick={handleSave}
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

      {/* Editor List */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl text-muted-foreground">
            No navigation menu items. Click below to add a new link.
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="glass-card p-5 border border-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Order buttons */}
              <div className="flex items-center space-x-1 rtl:space-x-reverse self-center">
                <button
                  type="button"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                >
                  <ArrowDown size={16} />
                </button>
              </div>

              {/* Input Forms */}
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                {/* English Label */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">English Label</span>
                  <input
                    type="text"
                    value={item.label.en}
                    onChange={(e) => handleLabelChange(item.id, 'en', e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-xs text-foreground"
                  />
                </div>

                {/* Arabic Label */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Arabic Label</span>
                  <input
                    type="text"
                    value={item.label.ar}
                    onChange={(e) => handleLabelChange(item.id, 'ar', e.target.value)}
                    required
                    dir="rtl"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-xs text-foreground"
                  />
                </div>

                {/* Navigation Path */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">URL / Section ID Path</span>
                  <input
                    type="text"
                    value={item.path}
                    onChange={(e) => handleFieldChange(item.id, 'path', e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-xs text-foreground"
                  />
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center space-x-3 rtl:space-x-reverse self-center">
                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => handleFieldChange(item.id, 'visible', !item.visible)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    item.visible
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                      : 'bg-muted border-border/80 text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {item.visible ? (
                    <>
                      <Eye size={14} />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff size={14} />
                      <span>Hidden</span>
                    </>
                  )}
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-2 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive rounded-lg cursor-pointer transition-colors"
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Item Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={addNewItem}
          className="flex items-center space-x-2 px-5 py-3 rounded-full border border-dashed border-border hover:border-primary/50 text-foreground font-semibold hover:text-primary transition-all text-xs cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Navigation Link</span>
        </button>
      </div>
    </div>
  );
}
