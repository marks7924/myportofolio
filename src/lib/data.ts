import { createServerSideClient } from './supabase';

export async function getPublicData() {
  const supabase = await createServerSideClient();

  // Run all fetches in parallel to minimize latency on static/ssr load
  const [
    settingsResult,
    heroResult,
    aboutResult,
    navigationResult,
    socialLinksResult,
    skillCategoriesResult,
    skillsResult,
    experienceResult,
    projectsResult,
    servicesResult,
    testimonialsResult,
    certificationsResult,
    translationsResult,
  ] = await Promise.all([
    supabase.from('site_settings').select('*').maybeSingle(),
    supabase.from('hero').select('*').maybeSingle(),
    supabase.from('about').select('*').maybeSingle(),
    supabase.from('navigation').select('*').order('sort_order', { ascending: true }),
    supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
    supabase.from('skill_categories').select('*').order('sort_order', { ascending: true }),
    supabase.from('skills').select('*').order('sort_order', { ascending: true }),
    supabase.from('experience').select('*').order('sort_order', { ascending: true }),
    supabase.from('projects').select('*, project_images(*)').eq('published', true).order('sort_order', { ascending: true }),
    supabase.from('services').select('*').order('sort_order', { ascending: true }),
    supabase.from('testimonials').select('*').eq('published', true).order('sort_order', { ascending: true }),
    supabase.from('certifications').select('*').order('sort_order', { ascending: true }),
    supabase.from('translations').select('key, en, ar'),
  ]);

  // Construct key-value static translations dictionary
  const dictionary: Record<string, { en: string; ar: string }> = {};
  if (translationsResult.data) {
    translationsResult.data.forEach((item) => {
      dictionary[item.key] = { en: item.en, ar: item.ar };
    });
  }

  return {
    settings: settingsResult.data || {},
    hero: heroResult.data || {},
    about: aboutResult.data || {},
    navigation: navigationResult.data || [],
    socialLinks: socialLinksResult.data || [],
    skillCategories: skillCategoriesResult.data || [],
    skills: skillsResult.data || [],
    experience: experienceResult.data || [],
    projects: projectsResult.data || [],
    services: servicesResult.data || [],
    testimonials: testimonialsResult.data || [],
    certifications: certificationsResult.data || [],
    dictionary,
  };
}
