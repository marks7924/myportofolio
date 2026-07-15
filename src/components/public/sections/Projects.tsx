'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ExternalLink, Github, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Project {
  id: string;
  title: any;
  description: any;
  cover_image: string | null;
  tech_stack: string[];
  github_link: string | null;
  live_demo: string | null;
  category: string;
  featured: boolean;
  status: string;
  completion_date: string | null;
}

interface ProjectsProps {
  data: Project[];
}

export default function Projects({ data }: ProjectsProps) {
  const { t, tContent, locale } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(data.map((p) => p.category).filter(Boolean)))];

  const filteredProjects =
    selectedCategory === 'all'
      ? data
      : data.filter((p) => p.category === selectedCategory);

  const handleImageClick = (liveDemo: string | null) => {
    if (!liveDemo) return;
    const confirmMessage = locale === 'ar'
      ? 'هل تريد الانتقال لمشاهدة المعاينة الحية للمشروع؟'
      : 'Would you like to open the live preview of this project?';
    if (window.confirm(confirmMessage)) {
      window.open(liveDemo, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="tag mb-4 inline-block">Work</span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground leading-tight mb-4">
            {t('projects_title', 'Featured Projects')}
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            {t('projects_subtitle', 'A selection of products I have architected and delivered recently')}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
              }`}
            >
              {cat === 'all' ? t('all_categories', 'All') : cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card group flex flex-col overflow-hidden hover:scale-[1.01] transition-transform duration-500"
            >
              {/* Cover preview */}
              <div
                onClick={() => handleImageClick(project.live_demo)}
                className={`relative aspect-video w-full overflow-hidden bg-muted/30 border-b border-border/55 ${
                  project.live_demo ? 'cursor-pointer' : ''
                }`}
                title={project.live_demo ? (locale === 'ar' ? 'انقر لفتح معاينة مباشرة للموقع' : 'Click to open live website demo') : undefined}
              >
                {project.cover_image ? (
                  <Image
                    src={project.cover_image}
                    alt={tContent(project.title)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/80 text-muted-foreground">
                    <span className="font-semibold text-xs tracking-wider">No Preview Image</span>
                  </div>
                )}

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex items-center space-x-1/2 px-2.5 py-1 rounded-md bg-yellow-500/25 border border-yellow-500/40 text-yellow-500 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wide">
                    <Star size={10} fill="currentColor" />
                    <span>{t('featured', 'Featured')}</span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 px-2.5 py-1 rounded-md bg-background/60 border border-border/40 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wide">
                  {project.status === 'Completed' && t('status_completed', 'Completed')}
                  {project.status === 'In Progress' && t('status_inprogress', 'In Progress')}
                  {project.status === 'Draft' && t('status_draft', 'Draft')}
                </div>
              </div>

              {/* Texts */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider">
                    {project.category}
                  </div>

                  <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {tContent(project.title)}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {tContent(project.description)}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Tech stack */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tech_stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-secondary/80 text-foreground/80 border border-border/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-secondary/80 text-muted-foreground">
                          +{project.tech_stack.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions bar */}
                  <div className="border-t border-border/40 pt-4 flex items-center justify-between">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-xs font-bold text-foreground/80 hover:text-primary transition-colors flex items-center space-x-1.5 rtl:space-x-reverse"
                    >
                      <span>{t('view_project', 'View Details')}</span>
                      <ArrowRight size={14} className="rtl:rotate-180" />
                    </Link>

                    <div className="flex space-x-2 rtl:space-x-reverse">
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          aria-label="GitHub Link"
                        >
                          <Github size={15} />
                        </a>
                      )}

                      {project.live_demo && (
                        <a
                          href={project.live_demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          aria-label="Live Demo Link"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
