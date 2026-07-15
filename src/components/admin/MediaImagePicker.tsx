'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Image as ImageIcon, X, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  url: string;
  filename: string;
}

interface MediaImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

export default function MediaImagePicker({ value, onChange, label }: MediaImagePickerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
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
    if (modalOpen) {
      fetchMedia();
    }
  }, [modalOpen]);

  return (
    <div className="space-y-2">
      <span className="text-sm font-semibold text-foreground/80">{label}</span>

      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        {/* Preview image */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-secondary border border-border flex items-center justify-center">
          {value ? (
            <Image src={value} alt="Preview thumbnail" fill className="object-cover" />
          ) : (
            <ImageIcon size={24} className="text-muted-foreground" />
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg text-xs border border-border cursor-pointer transition-colors"
          >
            Choose from Media Library
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive font-semibold rounded-lg text-xs border border-destructive/20 cursor-pointer transition-colors"
            >
              Clear Image
            </button>
          )}
        </div>
      </div>

      {/* Select Modal Popup */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-6 md:p-8 space-y-6 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="font-bold text-lg text-foreground">Select Image</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {loading ? (
              <div className="flex-grow flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={36} />
              </div>
            ) : mediaList.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center py-12 space-y-3 text-muted-foreground text-center">
                <ImageIcon size={48} />
                <p className="text-sm">
                  No uploads found. Please upload images in the Media Library first.
                </p>
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 py-2 pr-2">
                {mediaList.map((item) => {
                  const isSelected = value === item.url;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onChange(item.url);
                        setModalOpen(false);
                      }}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                        isSelected ? 'border-primary' : 'border-border/60 hover:border-foreground/35'
                      }`}
                    >
                      <Image src={item.url} alt={item.filename} fill className="object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check
                            size={24}
                            className="text-primary-foreground bg-primary p-1.5 rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
