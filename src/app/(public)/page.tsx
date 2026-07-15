import React from 'react';
import { getPublicData } from '@/lib/data';
import Hero from '@/components/public/sections/Hero';
import About from '@/components/public/sections/About';
import Skills from '@/components/public/sections/Skills';
import Experience from '@/components/public/sections/Experience';
import Projects from '@/components/public/sections/Projects';
import Services from '@/components/public/sections/Services';
import Testimonials from '@/components/public/sections/Testimonials';
import Certifications from '@/components/public/sections/Certifications';
import Contact from '@/components/public/sections/Contact';

export default async function HomePage() {
  const data = await getPublicData();

  // Load layout ordering and visibility rules directly from the database settings row
  const sectionsOrder = data.settings?.sections_order || [
    'hero',
    'about',
    'skills',
    'experience',
    'projects',
    'services',
    'testimonials',
    'certifications',
    'contact',
  ];
  
  const sectionsVisibility = data.settings?.sections_visibility || {
    hero: true,
    about: true,
    skills: true,
    experience: true,
    projects: true,
    services: true,
    testimonials: true,
    certifications: true,
    contact: true,
  };

  return (
    <>
      {sectionsOrder.map((sectionId: string) => {
        if (!sectionsVisibility[sectionId]) return null;

        switch (sectionId) {
          case 'hero':
            return <Hero key="hero" data={data.hero} />;
          case 'about':
            return <About key="about" data={data.about} />;
          case 'skills':
            return (
              <Skills
                key="skills"
                categories={data.skillCategories}
                skills={data.skills}
              />
            );
          case 'experience':
            return <Experience key="experience" data={data.experience} />;
          case 'projects':
            return <Projects key="projects" data={data.projects} />;
          case 'services':
            return <Services key="services" data={data.services} />;
          case 'testimonials':
            return <Testimonials key="testimonials" data={data.testimonials} />;
          case 'certifications':
            return <Certifications key="certifications" data={data.certifications} />;
          case 'contact':
            return (
              <Contact
                key="contact"
                contactEmail={data.settings.contact_email}
                phone={data.settings.phone}
                location={data.settings.location}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
