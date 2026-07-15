'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink, Calendar, User, CheckCircle2 } from 'lucide-react';
import ProjectGallery from './ProjectGallery';

interface ProjectDetailsProps {
  project: {
    id: string;
    title: any;
    description: any;
    full_description: any;
    challenges: any;
    solutions: any;
    features: any;
    cover_image: string | null;
    tech_stack: string[];
    github_link: string | null;
    live_demo: string | null;
    category: string;
    status: string;
    completion_date: string | null;
    client: any;
    project_images: { id: string; image_url: string }[];
  };
}

export default function ProjectDetailsContainer({ project }: ProjectDetailsProps) {
  const { t, tContent, locale } = useLanguage();

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const featuresList =
    project.features && typeof project.features === 'object'
      ? project.features[locale] || project.features['en'] || []
      : [];

  return (
    <div className="min-h-screen py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Link
          href="/#projects"
          className="inline-flex items-center space-x-2 rtl:space-x-reverse text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-12 cursor-pointer"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          <span>{t('back_to_projects', 'Back to Projects')}</span>
        </Link>

        {/* Header content */}
        <div className="space-y-4 mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded-md">
              {project.category}
            </span>
            <span className="px-3 py-1 bg-secondary text-foreground/80 text-xs font-bold uppercase tracking-wider rounded-md border border-border/40">
              {project.status === 'Completed' && t('status_completed', 'Completed')}
              {project.status === 'In Progress' && t('status_inprogress', 'In Progress')}
              {project.status === 'Draft' && t('status_draft', 'Draft')}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {tContent(project.title)}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-3xl leading-relaxed">
            {tContent(project.description)}
          </p>
        </div>

        {/* Layout details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <ProjectGallery
              coverImage={project.cover_image}
              images={project.project_images}
              title={tContent(project.title)}
            />

            {/* Technologies */}
            <div className="glass-card p-6 md:p-8 space-y-4">
              <h3 className="text-lg font-bold text-foreground">
                {t('tech_used', 'Technologies Used')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-lg bg-secondary text-foreground/80 border border-border/40 font-semibold text-xs md:text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links actions */}
            {(project.github_link || project.live_demo) && (
              <div className="glass-card p-6 md:p-8 flex flex-wrap gap-4">
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow sm:flex-grow-0 px-6 py-3.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-xl border border-border flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                  >
                    <Github size={18} />
                    <span>{t('github_repo', 'GitHub Repository')}</span>
                  </a>
                )}
                {project.live_demo && (
                  <a
                    href={project.live_demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow sm:flex-grow-0 px-6 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                  >
                    <ExternalLink size={18} />
                    <span>{t('live_demo', 'Live Demo')}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Meta grid */}
            <div className="glass-card p-6 md:p-8 grid grid-cols-2 gap-4 divide-x rtl:divide-x-reverse divide-border/40">
              {project.client && (
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground text-xs font-bold uppercase tracking-wider space-x-1.5 rtl:space-x-reverse">
                    <User size={14} />
                    <span>{t('client_label', 'Client')}</span>
                  </div>
                  <p className="font-bold text-foreground text-sm md:text-base">
                    {tContent(project.client)}
                  </p>
                </div>
              )}

              {project.completion_date && (
                <div className="space-y-1 pl-4 rtl:pl-0 rtl:pr-4">
                  <div className="flex items-center text-muted-foreground text-xs font-bold uppercase tracking-wider space-x-1.5 rtl:space-x-reverse">
                    <Calendar size={14} />
                    <span>{t('date_label', 'Date')}</span>
                  </div>
                  <p className="font-bold text-foreground text-sm md:text-base">
                    {formatDate(project.completion_date)}
                  </p>
                </div>
              )}
            </div>

            {/* About text description */}
            {project.full_description && (
              <div className="glass-card p-6 md:p-8 space-y-4">
                <h3 className="text-lg font-bold text-foreground">
                  {t('full_description', 'About Project')}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {tContent(project.full_description)}
                </p>
              </div>
            )}

            {/* Features Checklist */}
            {featuresList.length > 0 && (
              <div className="glass-card p-6 md:p-8 space-y-4">
                <h3 className="text-lg font-bold text-foreground">
                  {t('project_features', 'Key Features')}
                </h3>
                <ul className="space-y-3">
                  {featuresList.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2.5 rtl:space-x-reverse">
                      <CheckCircle2 size={16} className="text-primary mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Challenges & Solutions */}
            {(project.challenges || project.solutions) && (
              <div className="glass-card p-6 md:p-8 space-y-6">
                {project.challenges && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-foreground">
                      {t('project_challenges', 'The Challenge')}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                      {tContent(project.challenges)}
                    </p>
                  </div>
                )}

                {project.solutions && (
                  <div className="space-y-3 border-t border-border/40 pt-6">
                    <h3 className="text-lg font-bold text-foreground">
                      {t('project_solutions', 'The Solution')}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                      {tContent(project.solutions)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
