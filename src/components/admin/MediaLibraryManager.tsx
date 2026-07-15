'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadMedia, deleteMedia } from '@/app/actions/media';
import { Search, UploadCloud, Copy, Check, Trash2, HardDrive, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  filename: string;
  file_path: string;
  url: string;
  file_size: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  created_at: string;
}

interface MediaLibraryManagerProps {
  initialMedia: MediaItem[];
}

export default function MediaLibraryManager({ initialMedia }: MediaLibraryManagerProps) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadMedia(formData);
      if (res.success && res.data) {
        setMedia((prev) => [res.data, ...prev]);
      } else {
        alert(`Failed to upload ${file.name}: ${res.error}`);
      }
    }
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const handleDelete = async (id: string, filePath: string) => {
    if (confirm('Are you sure you want to delete this media asset permanently?')) {
      const res = await deleteMedia(id, filePath);
      if (res.success) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(`Error: ${res.error}`);
      }
    }
  };

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = media.filter((item) =>
    item.filename.toLowerCase().includes(search.toLowerCase())
  );

  const totalSizeBytes = media.reduce((acc, curr) => acc + curr.file_size, 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Media Library</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload, optimize, and manage static images.
        </p>
      </div>

      {/* Storage Capacity Used */}
      <div className="glass-card p-4 flex items-center justify-between border border-border/40 bg-secondary/15">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <HardDrive size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm">Storage Capacity Used</h4>
            <p className="text-xs text-muted-foreground">Calculated across database entries</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-extrabold text-primary">{totalSizeMB} MB</span>
          <p className="text-xs text-muted-foreground">{media.length} files total</p>
        </div>
      </div>

      {/* Drag & Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border/80 hover:border-primary/50 bg-secondary/10'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-3">
          {uploading ? (
            <>
              <Loader2 size={36} className="text-primary animate-spin" />
              <p className="text-sm font-semibold">Optimizing Image (WebP format)...</p>
            </>
          ) : (
            <>
              <UploadCloud size={36} className="text-muted-foreground" />
              <p className="text-sm font-semibold">Drag & drop files here, or click to browse</p>
              <p className="text-xs text-muted-foreground">Supported format: Images only. Max size: 10MB</p>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by filename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
        />
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">No media files found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="glass-card group overflow-hidden border border-border/40 relative flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  sizes="180px"
                  className="object-cover"
                />

                {item.width && item.height && (
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-background/70 backdrop-blur-sm text-[8px] font-bold text-foreground">
                    {item.width} x {item.height}
                  </div>
                )}
              </div>

              <div className="p-3 space-y-2 border-t border-border/30">
                <p className="text-[10px] font-bold text-foreground truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex justify-between items-center text-[9px] text-muted-foreground">
                  <span>{(item.file_size / 1024).toFixed(1)} KB</span>
                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => handleCopyLink(item.id, item.url)}
                      className="p-1 rounded bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? (
                        <Check size={10} className="text-emerald-500" />
                      ) : (
                        <Copy size={10} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.file_path)}
                      className="p-1 rounded bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      title="Delete asset"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
