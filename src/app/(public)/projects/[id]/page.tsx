import React from 'react';
import { createServerSideClient } from '@/lib/supabase';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ProjectDetailsContainer from '@/components/public/ProjectDetailsContainer';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { notFound } from 'next/navigation';

export const revalidate = 0;

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  let project: any = null;
  let gallery: any[] = [];
  let dbTranslations: any[] = [];
  let settings: any = null;
  let navItems: any[] = [];
  let socialLinks: any[] = [];

  try {
    const supabase = await createServerSideClient();

    // Fetch project details, translations, settings, navs, and social links in parallel
    const [projectRes, imagesRes, translationsRes, settingsRes, navRes, socialsRes] = await Promise.all([
      supabase.from('projects').select('*').eq('id', id).maybeSingle(),
      supabase.from('project_images').select('*').eq('project_id', id).order('sort_order', { ascending: true }),
      supabase.from('translations').select('*'),
      supabase.from('site_settings').select('*').maybeSingle(),
      supabase.from('navigation').select('*').eq('visible', true).order('sort_order', { ascending: true }),
      supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
    ]);

    if (projectRes.data) project = projectRes.data;
    if (imagesRes.data) gallery = imagesRes.data;
    if (translationsRes.data) dbTranslations = translationsRes.data;
    if (settingsRes.data) settings = settingsRes.data;
    if (navRes.data) navItems = navRes.data;
    if (socialsRes.data) socialLinks = socialsRes.data;
  } catch (error) {
    console.warn('Database error in project page, using fallback mock project details:', error);
  }

  // Fallbacks if not found in database to allow viewing/compiling
  if (!project && id === 'e2a84f33-1000-4b2e-a579-24751f211eb7') {
    project = {
      id: 'e2a84f33-1000-4b2e-a579-24751f211eb7',
      title: { en: "E-Commerce Experience Engine", ar: "محرك تجربة التجارة الإلكترونية" },
      description: { en: "A highly interactive marketplace with animations.", ar: "نظام سوق حديث تفاعلي للغاية." },
      full_description: {
        en: "This e-commerce engine delivers an immersive shopping experience. It features fully custom layout configurations, animated cart interactions, dynamic price calculation engines, and Stripe token integrations.",
        ar: "يقدم محرك التجارة الإلكترونية هذا تجربة تسوق غامرة. ويتميز بتكوينات تخطيط مخصصة بالكامل ورسوم متحركة تفاعلية للسلة وحسابات أسعار ديناميكية مع دمج Stripe."
      },
      challenges: {
        en: "Handling high-volume image loading under slow networks while maintaining 60fps animations during product state swaps.",
        ar: "التعامل مع تحميل الصور الكثيفة في الشبكات البطيئة مع الحفاظ على رسوم متحركة بمعدل 60 إطاراً في الثانية أثناء تغيير حالة المنتج."
      },
      solutions: {
        en: "Implemented next/image with blur placeholders, server-side pre-rendering, and CSS hardware-accelerated transform layers.",
        ar: "تم تنفيذ next/image مع عناصر نائبة مشوشة، وتقديم الصفحات مسبقاً على الخادم، وطبقات تحويل تسريع الأجهزة باستخدام CSS."
      },
      features: {
        en: ["Dynamic cart processing", "RTL/LTR switching layouts", "Admin panel stats logs"],
        ar: ["معالجة سلة تسوق ديناميكية", "تخطيطات تبديل RTL/LTR", "سجلات إحصاءات لوحة التحكم للمشرف"]
      },
      cover_image: '',
      tech_stack: ['Next.js', 'React', 'Supabase', 'Stripe', 'Tailwind CSS', 'Framer Motion'],
      github_link: 'https://github.com',
      live_demo: 'https://example.com',
      category: 'Web Development',
      status: 'Completed',
      completion_date: '2025-11-20',
      client: { en: 'Retail Tech Group', ar: 'مجموعة تقنيات التجزئة' },
    };
  }

  if (!project) {
    return notFound();
  }

  const activeSettings = settings || {
    site_name: 'Alex Morgan',
    contact_email: 'contact@alexmorgan.dev',
    phone: '',
    footer_text: { en: '© 2026 Alex Morgan. All rights reserved.', ar: '© 2026 أليكس مورجان. جميع الحقوق محفوظة.' },
  };

  const activeNav = navItems.length > 0 ? navItems : [
    { id: '1', label: { en: 'Home', ar: 'الرئيسية' }, path: '/#hero', visible: true },
    { id: '2', label: { en: 'About', ar: 'من أنا' }, path: '/#about', visible: true },
    { id: '3', label: { en: 'Skills', ar: 'المهارات' }, path: '/#skills', visible: true },
    { id: '4', label: { en: 'Experience', ar: 'الخبرة' }, path: '/#experience', visible: true },
    { id: '5', label: { en: 'Projects', ar: 'المشاريع' }, path: '/#projects', visible: true },
    { id: '6', label: { en: 'Services', ar: 'الخدمات' }, path: '/#services', visible: true },
    { id: '7', label: { en: 'Testimonials', ar: 'الآراء' }, path: '/#testimonials', visible: true },
    { id: '8', label: { en: 'Certifications', ar: 'الشهادات' }, path: '/#certifications', visible: true },
    { id: '9', label: { en: 'Contact', ar: 'اتصل بي' }, path: '/#contact', visible: true },
  ];

  const activeSocials = socialLinks.length > 0 ? socialLinks : [
    { id: '1', platform: 'GitHub', url: 'https://github.com', icon: 'github' },
    { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  ];

  const projectWithImages = {
    ...project,
    project_images: gallery,
  };

  const dictionary: Record<string, { en: string; ar: string }> = {};
  dbTranslations.forEach((item) => {
    dictionary[item.key] = { en: item.en, ar: item.ar };
  });

  return (
    <ThemeProvider>
      <LanguageProvider initialDictionary={dictionary}>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Navbar navigation={activeNav} siteName={activeSettings.site_name} />
          <main className="flex-grow pt-24 pb-20">
            <ProjectDetailsContainer project={projectWithImages} />
          </main>
          <Footer footerText={activeSettings.footer_text} socialLinks={activeSocials} navigation={activeNav} />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
