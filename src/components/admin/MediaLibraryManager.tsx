'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase';
import { saveMediaMetadata, deleteMedia } from '@/app/actions/media';
import { Search, UploadCloud, Copy, Check, Trash2, HardDrive, Loader2, AlertCircle } from 'lucide-react';
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

const MAX_FILE_MB = 50;

async function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

export default function MediaLibraryManager({ initialMedia }: MediaLibraryManagerProps) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setUploadError(null);
    const supabase = createClient();

    for (const file of acceptedFiles) {
      // Validate size client-side
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds ${MAX_FILE_MB}MB limit.`);
        continue;
      }

      const fileId = crypto.randomUUID();
      const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
      const storageFilename = `${fileId}.${ext}`;
      const filePath = `uploads/${storageFilename}`;

      setUploadProgress(`Uploading ${file.name}…`);

      try {
        // ── Step 1: Upload directly from browser → Supabase Storage ──
        // This bypasses Vercel's 4.5MB serverless body limit entirely.
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          // Auto-create bucket if it doesn't exist
          if (
            uploadError.message.includes('bucket not found') ||
            uploadError.message.includes('does not exist')
          ) {
            await supabase.storage.createBucket('media', { public: true });
            const { error: retryErr } = await supabase.storage
              .from('media')
              .upload(filePath, file, { contentType: file.type, upsert: true });
            if (retryErr) throw retryErr;
          } else {
            throw uploadError;
          }
        }

        // ── Step 2: Get the public URL ──
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);

        // ── Step 3: Get image dimensions in browser ──
        const dims = await getImageDimensions(file);

        // ── Step 4: Save metadata via lightweight server action ──
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        const res = await saveMediaMetadata({
          filename: `${baseName}.${ext}`,
          file_path: filePath,
          url: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          width: dims?.width ?? null,
          height: dims?.height ?? null,
        });

        if (res.success && res.data) {
          setMedia((prev) => [res.data as MediaItem, ...prev]);
        } else {
          setUploadError(`Metadata save failed for ${file.name}: ${res.error}`);
        }
      } catch (err: any) {
        console.error('Upload error:', err);
        setUploadError(`Failed to upload "${file.name}": ${err.message}`);
      }
    }

    setUploading(false);
    setUploadProgress('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: MAX_FILE_MB * 1024 * 1024,
  });

  const handleDelete = async (id: string, filePath: string) => {
    if (confirm('Delete this media asset permanently?')) {
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

  const totalSizeMB = (media.reduce((acc, curr) => acc + curr.file_size, 0) / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Media Library</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload images directly to Supabase Storage — no size limit from Vercel.
        </p>
      </div>

      {/* Storage used */}
      <div className="glass-card p-4 flex items-center justify-between border border-border/40 bg-secondary/15">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <HardDrive size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm">Storage Used</h4>
            <p className="text-xs text-muted-foreground">Based on database entries</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-extrabold text-primary">{totalSizeMB} MB</span>
          <p className="text-xs text-muted-foreground">{media.length} files</p>
        </div>
      </div>

      {/* Error banner */}
      {uploadError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="ml-auto text-xs underline">Dismiss</button>
        </div>
      )}

      {/* Drop zone */}
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
              <p className="text-sm font-semibold">{uploadProgress || 'Uploading…'}</p>
              <p className="text-xs text-muted-foreground">Sending directly to Supabase Storage</p>
            </>
          ) : (
            <>
              <UploadCloud size={36} className="text-muted-foreground" />
              <p className="text-sm font-semibold">Drag & drop images, or click to browse</p>
              <p className="text-xs text-muted-foreground">Images only · Up to {MAX_FILE_MB}MB per file</p>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by filename…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm text-foreground"
        />
      </div>

      {/* Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">No media files found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="glass-card group overflow-hidden border border-border/40 relative flex flex-col hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
                <Image src={item.url} alt={item.filename} fill sizes="180px" className="object-cover" />
                {item.width && item.height && (
                  <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-background/70 backdrop-blur-sm text-[8px] font-bold text-foreground">
                    {item.width}×{item.height}
                  </div>
                )}
              </div>

              <div className="p-2.5 space-y-1.5 border-t border-border/30">
                <p className="text-[10px] font-bold text-foreground truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-muted-foreground">{(item.file_size / 1024).toFixed(1)} KB</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleCopyLink(item.id, item.url)}
                      className="p-1 rounded bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.file_path)}
                      className="p-1 rounded bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      title="Delete"
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
