'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Laptop, Palette, Zap, Server, Globe, Shield, Activity } from 'lucide-react';

interface Service {
  id: string;
  title: any;
  description: any;
  icon: string;
}

interface ServicesProps {
  data: Service[];
}

export default function Services({ data }: ServicesProps) {
  const { t, tContent } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'laptop':
        return <Laptop size={32} className="text-primary" />;
      case 'palette':
        return <Palette size={32} className="text-primary" />;
      case 'zap':
        return <Zap size={32} className="text-primary" />;
      case 'server':
        return <Server size={32} className="text-primary" />;
      case 'globe':
        return <Globe size={32} className="text-primary" />;
      case 'shield':
        return <Shield size={32} className="text-primary" />;
      default:
        return <Activity size={32} className="text-primary" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-secondary/20 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-display text-4xl md:text-6xl text-foreground leading-tight">
            {t('services_title', 'Services')}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {t('services_subtitle', 'How I can help bring your ideas and digital designs to life')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((service) => (
            <div
              key={service.id}
              className="glass-card p-8 flex flex-col items-start hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="p-4 rounded-2xl bg-secondary mb-6 flex items-center justify-center border border-border/40">
                {getIcon(service.icon)}
              </div>

              <h3 className="text-xl font-bold mb-3 text-foreground">
                {tContent(service.title)}
              </h3>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {tContent(service.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
