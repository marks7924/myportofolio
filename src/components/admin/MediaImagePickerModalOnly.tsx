'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Image as ImageIcon, X, Loader2, Search } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  url: string;
  filename: string;
}

interface MediaImagePickerModalProps {
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaImagePickerModalOnly({
  onClose,
  onSelect,
}: MediaImagePickerModalProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('media_library')
      .select('id, url, filename')
      .order('created_at', { ascending: false });

    setMediaList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const filteredMedia = mediaList.filter((item) =>
    item.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card max-w-2xl w-full p-6 md:p-8 space-y-6 flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center border-b border-border/40 pb-4">
          <h3 className="font-bold text-lg text-foreground">Select Image</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search filenames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-xs text-foreground"
          />
        </div>

        {loading ? (
          <div className="flex-grow flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center py-12 space-y-3 text-muted-foreground text-center">
            <ImageIcon size={48} />
            <p className="text-sm">No media files matched.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 py-2 pr-2">
            {filteredMedia.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  className="relative aspect-square rounded-lg overflow-hidden border border-border/60 cursor-pointer transition-all hover:scale-[1.02] hover:border-primary"
                >
                  <Image src={item.url} alt={item.filename} fill className="object-cover" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
