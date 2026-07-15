'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import * as Icons from 'lucide-react';
import CanvasBackground from './CanvasBackground';
import { translate } from '@/lib/i18n';

// Dynamic Icon Resolver Helper
export function DynamicIcon({ name, className = 'w-6 h-6' }: { name: string; className?: string }) {
  const iconName = name.trim().toLowerCase();
  
  // Custom mapping for common keys
  const map: Record<string, keyof typeof Icons> = {
    'laptop': 'Laptop',
    'palette': 'Palette',
    'zap': 'Zap',
    'react': 'Code',
    'database': 'Database',
    'server': 'Server',
    'cpu': 'Cpu',
    'cloud': 'Cloud',
    'git-branch': 'GitBranch',
    'container': 'Box',
    'code-2': 'Code2',
    'phone': 'Phone',
    'mail': 'Mail',
    'map-pin': 'MapPin',
    'award': 'Award',
    'external-link': 'ExternalLink',
    'calendar': 'Calendar',
    'user': 'User',
    'github': 'Github',
    'linkedin': 'Linkedin',
    'twitter': 'Twitter',
    'globe': 'Globe',
    'paint-brush': 'Paintbrush'
  };

  const matched = map[iconName];
  if (matched && Icons[matched]) {
    const Component = Icons[matched] as React.ComponentType<{ className?: string }>;
    return <Component className={className} />;
  }

  // Fallback to title case match
  const titleCased = name.charAt(0).toUpperCase() + name.slice(1);
  const TargetComponent = (Icons as any)[titleCased] || Icons.HelpCircle;
  return <TargetComponent className={className} />;
}

// ----------------------------------------------------
// 1. HERO SECTION
// ----------------------------------------------------
export function HeroSection({ data, locale, dict, socialLinks }: { data: any; locale: string; dict: any; socialLinks: any[] }) {
  if (!data?.visible) return null;

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 px-6 md:px-12">
      {/* Dynamic Background */}
      <CanvasBackground type={data.background_animation} />
      
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side Content */}
        <div className="lg:col-span-7 text-center lg:text-left rtl:lg:text-right flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-semibold mb-6 animate-pulse-slow">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {locale === 'ar' ? 'متاح للعمل الحر والمشروعات' : 'Available for Freelance & Contract'}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            <span className="block text-foreground mb-1">{locale === 'ar' ? 'مرحباً، أنا' : "Hi, I'm"}</span>
            <span className="text-gradient font-extrabold">{translate(data.name, locale)}</span>
          </h1>

          <h2 className="text-xl sm:text-2xl font-bold text-muted-foreground mb-6">
            {translate(data.title, locale)}
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
            {translate(data.subtitle, locale)}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
            <a
              href={data.cta_link}
              className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
            >
              {translate(data.cta_text, locale)}
            </a>
            <a
              href={data.cta_link_secondary}
              className="px-8 py-3.5 rounded-full bg-secondary border border-border text-foreground font-semibold hover:bg-muted/80 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
            >
              {translate(data.cta_text_secondary, locale)}
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-border bg-card/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:scale-110 active:scale-95 transition-all"
                title={link.platform}
              >
                <DynamicIcon name={link.icon || 'globe'} className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Right Side Visual Aura */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-primary to-violet-500 opacity-20 blur-3xl animate-pulse-slow pointer-events-none" />
          <div className="absolute w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full border border-border bg-card/20 backdrop-blur-md flex items-center justify-center shadow-2xl overflow-hidden hover:rotate-2 transition-transform duration-500">
            <div className="text-center p-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 animate-float">
                <Icons.Code2 className="w-10 h-10" />
              </div>
              <span className="text-xl font-bold block mb-1">
                {locale === 'ar' ? 'العمارة النظيفة' : 'Clean UI Architect'}
              </span>
              <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
                {locale === 'ar' 
                  ? 'بناء تجارب رقمية غامرة وسريعة للغاية وبأعلى كفاءة.' 
                  : 'Delivering micro-interactive, highly performant web applications.'}
              </p>
            </div>
            
            {/* Overlay indicators */}
            <div className="absolute top-6 right-6 px-3 py-1 bg-card/60 border border-border text-[10px] rounded-full text-green-500 font-semibold flex items-center gap-1.5 backdrop-blur-sm shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              SEO Optimized
            </div>
            <div className="absolute bottom-6 left-6 px-3 py-1 bg-card/60 border border-border text-[10px] rounded-full text-primary font-semibold flex items-center gap-1.5 backdrop-blur-sm shadow-md">
              <Icons.Zap className="w-3 h-3" />
              99+ Performance
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <a href="#about" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted-foreground/60 hover:text-primary transition-colors">
        <span className="text-xs font-semibold uppercase tracking-wider">{locale === 'ar' ? 'اسحب للأسفل' : 'Scroll Down'}</span>
        <Icons.ChevronDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
}

// ----------------------------------------------------
// 2. ABOUT SECTION
// ----------------------------------------------------
export function AboutSection({ data, locale, dict }: { data: any; locale: string; dict: any }) {
  if (!data) return null;

  return (
    <section id="about" className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-border">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Image / Profile Layout */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group">
            {/* Bottom Offset Card */}
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300" />
            
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 bg-secondary rounded-2xl overflow-hidden border border-border flex items-center justify-center">
              {data.profile_image_url ? (
                <Image
                  src={data.profile_image_url}
                  alt={locale === 'ar' ? 'الملف الشخصي' : 'Profile Avatar'}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover"
                />
              ) : (
                <div className="text-center p-6">
                  <Icons.User2 className="w-20 h-20 mx-auto text-muted-foreground/40 mb-4" />
                  <span className="text-sm font-semibold text-muted-foreground block">
                    {locale === 'ar' ? 'لم يتم تحميل صورة' : 'No photo uploaded'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left rtl:lg:text-right">
          <div className="inline-block px-3 py-1 rounded-full border border-border bg-muted/30 text-xs font-semibold mb-4">
            {dict.nav_about}
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
            {locale === 'ar' ? 'شغف بالتطوير والتصميم' : 'Architecting Beautiful Codebases'}
          </h2>

          <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl">
            <p className="whitespace-pre-line">{translate(data.biography, locale)}</p>
            <p className="border-t border-border/60 pt-4 font-medium text-foreground">
              {translate(data.skills_summary, locale)}
            </p>
          </div>

          {/* Key Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-md text-left rtl:text-right">
            {[
              locale === 'ar' ? 'حلول كاملة (Full-Stack)' : 'Robust Full-Stack Development',
              locale === 'ar' ? 'واجهات سلسة وتفاعلية' : 'Immersive & Interactive Layouts',
              locale === 'ar' ? 'تحسين الأداء بنسبة 100%' : 'High Performance Optimization',
              locale === 'ar' ? 'مراعاة شروط سهولة الوصول' : 'Accessiblity & SEO First'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-foreground">
                <Icons.CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href={data.cv_url || '#'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <Icons.Download className="w-4 h-4" />
              {dict.cv_download}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// 3. SKILLS SECTION
// ----------------------------------------------------
export function SkillsSection({ categories, skills, locale, dict }: { categories: any[]; skills: any[]; locale: string; dict: any }) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id || '');
  
  if (categories.length === 0) return null;

  const activeSkills = skills.filter((s) => s.category_id === activeCategoryId);

  return (
    <section id="skills" className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-border">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-block px-3 py-1 rounded-full border border-border bg-muted/30 text-xs font-semibold mb-4">
          {dict.nav_skills}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          {dict.skills_title}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          {dict.skills_subtitle}
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeCategoryId === cat.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {translate(cat.name, locale)}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeSkills.map((skill) => (
          <div
            key={skill.id}
            className="glass-card p-6 flex flex-col justify-between hover:translate-y-[-4px] hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <DynamicIcon name={skill.icon || 'code-2'} className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-foreground">{skill.name}</span>
            </div>
            
            <div>
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-1.5">
                <span>{locale === 'ar' ? 'مستوى الإتقان' : 'Proficiency'}</span>
                <span className="font-bold text-foreground">{skill.proficiency}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        {activeSkills.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-10">
            {locale === 'ar' ? 'لا توجد مهارات في هذا القسم حالياً.' : 'No skills available in this category.'}
          </div>
        )}
      </div>
    </section>
  );
}

// ----------------------------------------------------
// 4. EXPERIENCE SECTION
// ----------------------------------------------------
export function ExperienceSection({ data, locale, dict }: { data: any[]; locale: string; dict: any }) {
  if (data.length === 0) return null;

  return (
    <section id="experience" className="py-24 px-6 md:px-12 max-w-4xl mx-auto border-t border-border">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-block px-3 py-1 rounded-full border border-border bg-muted/30 text-xs font-semibold mb-4">
          {dict.nav_experience}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          {dict.experience_title}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          {dict.experience_subtitle}
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l border-border/80 dark:border-border rtl:border-l-0 rtl:border-r rtl:border-border/80 rtl:dark:border-border ml-4 rtl:ml-0 rtl:mr-4 space-y-12 pb-6">
        {data.map((item) => {
          const startDate = new Date(item.start_date).toLocaleDateString(locale, { year: 'numeric', month: 'short' });
          const endDate = item.current 
            ? (locale === 'ar' ? 'الآن' : 'Present')
            : item.end_date ? new Date(item.end_date).toLocaleDateString(locale, { year: 'numeric', month: 'short' }) : '';

          return (
            <div key={item.id} className="relative pl-8 rtl:pl-0 rtl:pr-8 group">
              {/* Timeline marker */}
              <div className="absolute left-[-6px] rtl:left-auto rtl:right-[-6px] top-1.5 w-3 h-3 rounded-full border-2 border-primary bg-background group-hover:bg-primary group-hover:scale-125 transition-all duration-300" />
              
              <div className="glass-card p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 border-b border-border/50 pb-3">
                  <div>
                    <h3 className="font-extrabold text-lg text-foreground">{translate(item.position, locale)}</h3>
                    <span className="text-sm font-semibold text-primary">{item.company}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-muted-foreground rounded-full text-xs font-medium">
                    <Icons.Calendar className="w-3.5 h-3.5" />
                    <span>{startDate} - {endDate}</span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {translate(item.description, locale)}
                </p>

                {/* Tech tags */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.technologies.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-2.5 py-0.5 rounded bg-primary/5 text-primary text-[11px] font-semibold tracking-wide"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ----------------------------------------------------
// 5. PROJECTS SECTION
// ----------------------------------------------------
export function ProjectsSection({ data, locale, dict }: { data: any[]; locale: string; dict: any }) {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  if (data.length === 0) return null;

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(data.map(p => p.category).filter(Boolean)))];

  const filteredProjects = data.filter(
    (p) => filterCategory === 'All' || p.category === filterCategory
  );

  return (
    <section id="projects" className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-border">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-block px-3 py-1 rounded-full border border-border bg-muted/30 text-xs font-semibold mb-4">
          {dict.nav_projects}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          {dict.projects_title}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          {dict.projects_subtitle}
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat === 'All' ? dict.all_categories : cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="group glass-card overflow-hidden flex flex-col justify-between hover:translate-y-[-6px] hover:border-primary/20 hover:shadow-2xl transition-all duration-300"
          >
            {/* Image Box */}
            <div className="relative h-48 w-full bg-gradient-to-tr from-indigo-900/60 to-violet-800/60 flex items-center justify-center overflow-hidden border-b border-border/40">
              {p.cover_image ? (
                <Image
                  src={p.cover_image}
                  alt={translate(p.title, locale)}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="text-center p-4">
                  <Icons.Image className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                  <span className="text-xs text-muted-foreground/50">{locale === 'ar' ? 'شعار المشروع' : 'Project Cover'}</span>
                </div>
              )}
              {p.featured && (
                <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                  {locale === 'ar' ? 'مميز' : 'Featured'}
                </span>
              )}
            </div>

            {/* Content Box */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2 block">
                  {p.category}
                </span>
                <h3 className="font-extrabold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {translate(p.title, locale)}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                  {translate(p.description, locale)}
                </p>
              </div>

              {/* Technologies */}
              <div className="mt-auto">
                <div className="flex flex-wrap gap-1 mb-6">
                  {p.tech_stack?.slice(0, 4).map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-secondary text-muted-foreground text-[10px] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {p.tech_stack?.length > 4 && (
                    <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground text-[10px] font-medium">
                      +{p.tech_stack.length - 4}
                    </span>
                  )}
                </div>

                {/* Details Button */}
                <div className="flex justify-between items-center gap-2 border-t border-border/40 pt-4">
                  <a
                    href={`/${locale}/projects/${p.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-80 transition-opacity"
                  >
                    <span>{dict.view_project}</span>
                    <Icons.ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  
                  <div className="flex items-center gap-3">
                    {p.github_link && (
                      <a
                        href={p.github_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title={dict.github_repo}
                      >
                        <Icons.Github className="w-4 h-4" />
                      </a>
                    )}
                    {p.live_demo && (
                      <a
                        href={p.live_demo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title={dict.live_demo}
                      >
                        <Icons.ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------
// 6. SERVICES SECTION
// ----------------------------------------------------
export function ServicesSection({ data, locale, dict }: { data: any[]; locale: string; dict: any }) {
  if (data.length === 0) return null;

  return (
    <section id="services" className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-border">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-block px-3 py-1 rounded-full border border-border bg-muted/30 text-xs font-semibold mb-4">
          {dict.nav_services}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          {dict.services_title}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          {dict.services_subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((srv) => (
          <div
            key={srv.id}
            className="glass-card p-8 hover:translate-y-[-4px] hover:border-primary/20 hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 animate-float">
              <DynamicIcon name={srv.icon || 'laptop'} className="w-6 h-6" />
            </div>
            
            <h3 className="font-extrabold text-xl text-foreground mb-3">
              {translate(srv.title, locale)}
            </h3>
            
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              {translate(srv.description, locale)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------
// 7. TESTIMONIALS SECTION
// ----------------------------------------------------
export function TestimonialsSection({ data, locale, dict }: { data: any[]; locale: string; dict: any }) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  if (data.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  const current = data[currentIndex];

  return (
    <section id="testimonials" className="py-24 px-6 md:px-12 max-w-4xl mx-auto border-t border-border">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-block px-3 py-1 rounded-full border border-border bg-muted/30 text-xs font-semibold mb-4">
          {dict.nav_testimonials}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          {dict.testimonials_title}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          {dict.testimonials_subtitle}
        </p>
      </div>

      <div className="relative glass-card p-8 md:p-12">
        {/* Quote watermark */}
        <Icons.Quote className="absolute top-6 left-6 rtl:left-auto rtl:right-6 w-16 h-16 text-muted/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-lg md:text-xl font-medium leading-relaxed italic text-foreground max-w-2xl mb-8">
            &ldquo;{translate(current.feedback, locale)}&rdquo;
          </p>

          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-secondary flex items-center justify-center">
              {current.image_url ? (
                <Image
                  src={current.image_url}
                  alt={current.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <Icons.User className="w-6 h-6 text-muted-foreground/40" />
              )}
            </div>
            <div className="text-left rtl:text-right">
              <h4 className="font-extrabold text-foreground">{current.name}</h4>
              <span className="text-xs text-muted-foreground">
                {translate(current.role, locale)} {current.company ? `@ ${current.company}` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        {data.length > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-border hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Previous testimonial"
            >
              <Icons.ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <span className="self-center text-xs text-muted-foreground font-semibold">
              {currentIndex + 1} / {data.length}
            </span>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-border hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Next testimonial"
            >
              <Icons.ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ----------------------------------------------------
// 8. CERTIFICATIONS SECTION
// ----------------------------------------------------
export function CertificationsSection({ data, locale, dict }: { data: any[]; locale: string; dict: any }) {
  if (data.length === 0) return null;

  return (
    <section id="certifications" className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-border">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-block px-3 py-1 rounded-full border border-border bg-muted/30 text-xs font-semibold mb-4">
          {dict.nav_certifications}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          {dict.certifications_title}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          {dict.certifications_subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((cert) => {
          const date = new Date(cert.issue_date).toLocaleDateString(locale, { year: 'numeric', month: 'long' });
          
          return (
            <div
              key={cert.id}
              className="glass-card p-6 flex flex-col justify-between hover:translate-y-[-4px] hover:border-primary/20 transition-all duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4 animate-float">
                  <Icons.Award className="w-5 h-5" />
                </div>
                
                <h3 className="font-extrabold text-base text-foreground mb-1 leading-snug">
                  {translate(cert.title, locale)}
                </h3>
                
                <span className="text-xs font-semibold text-primary block mb-3">
                  {translate(cert.organization, locale)}
                </span>
              </div>
              
              <div className="flex justify-between items-center gap-2 border-t border-border/40 pt-4 mt-4">
                <span className="text-xs text-muted-foreground">{date}</span>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:opacity-85"
                  >
                    <span>{locale === 'ar' ? 'عرض الاعتماد' : 'Verify'}</span>
                    <Icons.ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ----------------------------------------------------
// 9. CONTACT SECTION
// ----------------------------------------------------
export function ContactSection({
  email,
  phone,
  location,
  locale,
  dict,
  onSubmitAction
}: {
  email: string;
  phone: string;
  location: string;
  locale: string;
  dict: any;
  onSubmitAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      setStatus('idle');
      const res = await onSubmitAction(formData);
      if (res.success) {
        setStatus('success');
        form.reset();
        
        // Trigger visual confetti explosion!
        try {
          const confetti = (await import('canvas-confetti')).default;
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (err) {
          console.error(err);
        }
      } else {
        setStatus('error');
        setErrorMessage(res.error || 'Failed to submit form.');
      }
    });
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-border">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-block px-3 py-1 rounded-full border border-border bg-muted/30 text-xs font-semibold mb-4">
          {dict.nav_contact}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          {dict.contact_title}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          {dict.contact_subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Info Grid */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground">
              {locale === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
            </h3>
            
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-md">
              {locale === 'ar' 
                ? 'لا تتردد في الاتصال بي بخصوص أي أفكار لمشروعات أو فرص وظيفية. سأرد عليك في غضون 24 ساعة.'
                : 'Get in touch for building customized web solutions, freelancing gigs, or technical consultancies.'}
            </p>

            <div className="space-y-4">
              {email && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Icons.Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">{dict.contact_email}</span>
                    <a href={`mailto:${email}`} className="text-sm font-semibold hover:text-primary">
                      {email}
                    </a>
                  </div>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Icons.Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">{dict.contact_phone}</span>
                    <a href={`tel:${phone}`} className="text-sm font-semibold hover:text-primary">
                      {phone}
                    </a>
                  </div>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Icons.MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">{locale === 'ar' ? 'الموقع' : 'Location'}</span>
                    <span className="text-sm font-semibold text-foreground">
                      {location}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Aesthetic mini-visual */}
          <div className="hidden lg:block glass-card p-6 border-l-4 border-l-primary relative overflow-hidden">
            <Icons.Zap className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-primary/5 pointer-events-none" />
            <h4 className="font-bold mb-1 text-sm text-foreground">{locale === 'ar' ? 'استجابة سريعة' : 'Fast Turnaround'}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === 'ar' 
                ? 'أقوم بالرد على جميع الرسائل والطلبات البريدية خلال يوم عمل واحد كحد أقصى.' 
                : 'Average reply time is under 12 hours. I am always happy to hop on a Zoom call.'}
            </p>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="lg:col-span-7">
          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    {dict.contact_name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:border-primary/50 text-sm transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    {dict.contact_email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:border-primary/50 text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  {dict.contact_subject}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:border-primary/50 text-sm transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  {dict.contact_message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:border-primary/50 text-sm transition-colors resize-none"
                />
              </div>

              {status === 'success' && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-500 text-xs sm:text-sm rounded-lg">
                  {dict.contact_success}
                </div>
              )}

              {status === 'error' && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 animate-spin" />
                      <span>{dict.contact_sending}</span>
                    </>
                  ) : (
                    <>
                      <Icons.Send className="w-4 h-4" />
                      <span>{dict.contact_submit}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
