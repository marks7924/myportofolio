'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Database, Server, Cloud, Cpu, Palette, GitBranch, Terminal, Code2, Layers } from 'lucide-react';

interface SkillCategory {
  id: string;
  name: any;
}

interface Skill {
  id: string;
  category_id: string;
  name: string;
  icon: string;
  proficiency: number;
}

interface SkillsProps {
  categories: SkillCategory[];
  skills: Skill[];
}

export default function Skills({ categories, skills }: SkillsProps) {
  const { t, tContent } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '');

  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'react':
      case 'next':
      case 'code2':
        return <Code2 className="text-primary" size={24} />;
      case 'database':
        return <Database className="text-primary" size={24} />;
      case 'server':
        return <Server className="text-primary" size={24} />;
      case 'cloud':
        return <Cloud className="text-primary" size={24} />;
      case 'cpu':
        return <Cpu className="text-primary" size={24} />;
      case 'paint-brush':
      case 'palette':
        return <Palette className="text-primary" size={24} />;
      case 'git-branch':
        return <GitBranch className="text-primary" size={24} />;
      case 'container':
      case 'terminal':
        return <Terminal className="text-primary" size={24} />;
      default:
        return <Layers className="text-primary" size={24} />;
    }
  };

  const activeSkills = skills.filter((skill) => skill.category_id === activeCategory);

  return (
    <section id="skills" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gradient">
            {t('skills_title', 'Skills & Expertise')}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {t('skills_subtitle', 'Categorized overview of my technical stack and proficiency levels')}
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                  : 'bg-secondary hover:bg-secondary/80 text-foreground/80'
              }`}
            >
              {tContent(cat.name)}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSkills.map((skill) => (
            <div
              key={skill.id}
              className="glass-card p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                <div className="p-3 rounded-xl bg-secondary/80 flex items-center justify-center">
                  {getIcon(skill.icon)}
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg">{skill.name}</h3>
                </div>
              </div>

              {/* Proficiency Bar */}
              {skill.proficiency !== null && skill.proficiency !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>{t('proficiency', 'Proficiency')}</span>
                    <span>{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
