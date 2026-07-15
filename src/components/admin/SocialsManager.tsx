'use client';

import React, { useState } from 'react';
import { updateSocialLinkItems } from '@/app/actions/cms';
import { ArrowUp, ArrowDown, Trash2, Plus, Save, Loader2, Eye, EyeOff, Info } from 'lucide-react';

interface SocialItem {
  id: string;
  platform: string;
  url: string;
  icon: string;
  sort_order: number;
  visible?: boolean;
}

interface SocialsManagerProps {
  initialItems: SocialItem[];
}

export default function SocialsManager({ initialItems }: SocialsManagerProps) {
  const [items, setItems] = useState<SocialItem[]>(
    initialItems.map(item => ({
      ...item,
      visible: item.visible !== false // default true
    })).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFieldChange = (id: string, field: 'platform' | 'url' | 'visible', val: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          // Auto-match icon from platform name
          if (field === 'platform') {
            updated.icon = val.toLowerCase();
          }
          return updated;
        }
        return item;
      })
    );
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[nextIndex];
    newItems[nextIndex] = temp;

    const updatedItems = newItems.map((item, idx) => ({
      ...item,
      sort_order: idx + 1,
    }));

    setItems(updatedItems);
  };

  const addNewItem = () => {
    const newItem: SocialItem = {
      id: 'new-' + Math.random().toString(36).substring(7),
      platform: 'WhatsApp',
      url: 'https://wa.me/',
      icon: 'whatsapp',
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

    const payload = items.map((item, idx) => ({
      id: item.id.startsWith('new-') ? undefined : item.id,
      platform: item.platform,
      url: item.url,
      icon: item.icon || item.platform.toLowerCase(),
      sort_order: idx + 1,
      visible: item.visible,
    }));

    const res = await updateSocialLinkItems(payload);
    if (res.success) {
      setMessage({ type: 'success', text: 'Social links updated successfully!' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update social links.' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Social Profile Links</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage links to external social media sites (GitHub, LinkedIn, WhatsApp, etc.) visible in the public Footer.
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

      {/* WhatsApp Helper Alert */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-sm">
        <Info size={18} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">WhatsApp Auto-Redirect Setup Guide:</p>
          <p className="text-xs mt-1 text-foreground/80 leading-relaxed">
            To set up a direct chat link that opens WhatsApp instantly, choose <strong>WhatsApp</strong> as the Platform name, and configure the URL as follows:
            <br />
            <code className="bg-secondary px-1.5 py-0.5 rounded font-mono text-[11px] select-all">https://wa.me/yournumber</code> (Replace <code className="font-semibold">yournumber</code> with your international country code and phone number, without spaces, zeros, or <code className="font-semibold">+</code> signs. E.g., <code className="font-semibold">https://wa.me/1234567890</code>).
          </p>
        </div>
      </div>

      {/* Editor List */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl text-muted-foreground">
            No social profile links configured. Click below to add one.
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="glass-card p-5 border border-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Order controls */}
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
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {/* Platform Name */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Platform Name</span>
                  <select
                    value={item.platform}
                    onChange={(e) => handleFieldChange(item.id, 'platform', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-xs text-foreground"
                  >
                    <option value="GitHub">GitHub</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Custom">Custom Link</option>
                  </select>
                </div>

                {/* Profile Link URL */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Connection URL Link</span>
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => handleFieldChange(item.id, 'url', e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-xs text-foreground font-mono"
                    placeholder="https://..."
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
                  title="Remove Link"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Link Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={addNewItem}
          className="flex items-center space-x-2 px-5 py-3 rounded-full border border-dashed border-border hover:border-primary/50 text-foreground font-semibold hover:text-primary transition-all text-xs cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Social Link</span>
        </button>
      </div>
    </div>
  );
}
