'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, X } from 'lucide-react';

interface ProjectImage {
  id: string;
  image_url: string;
}

interface ProjectGalleryProps {
  coverImage: string | null;
  images: ProjectImage[];
  title: string;
}

export default function ProjectGallery({ coverImage, images, title }: ProjectGalleryProps) {
  const allImages = [
    ...(coverImage ? [{ id: 'cover', image_url: coverImage }] : []),
    ...images,
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (allImages.length === 0) {
    return (
      <div className="aspect-video w-full rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground border border-border">
        <span>No images available</span>
      </div>
    );
  }

  const activeImage = allImages[activeIdx];

  return (
    <div className="space-y-4">
      {/* Main Image Viewport */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted/20 border border-border group">
        <Image
          src={activeImage.image_url}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover"
          priority
        />

        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 p-3 rounded-xl bg-background/80 text-foreground border border-border/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg cursor-pointer"
          aria-label="View Fullscreen"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Thumbnails grid */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-2">
          {allImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-20 h-14 md:w-28 md:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'border-primary scale-[1.02]'
                  : 'border-border/60 hover:border-foreground/45'
              }`}
            >
              <Image
                src={img.image_url}
                alt={`${title} thumbnail ${idx}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen overlay */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          <div className="relative max-w-5xl w-full aspect-video animate-float">
            <Image
              src={activeImage.image_url}
              alt={title}
              fill
              sizes="1200px; q=95"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
