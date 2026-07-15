'use server';

import { createServerSideClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Log admin action helper
async function logAdminActivity(action: string, details: string) {
  try {
    const supabase = await createServerSideClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('activity_logs').insert({ user_id: user.id, action, details });
    }
  } catch (err) {
    console.error('Failed to write activity logs:', err);
  }
}

export async function updateHero(data: {
  name: { en: string; ar: string };
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  cta_text: { en: string; ar: string };
  cta_link: string;
  cta_text_secondary: { en: string; ar: string };
  cta_link_secondary: string;
  background_animation: string;
}) {
  try {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('hero').update(data).eq('id', true);

    if (error) throw error;

    await logAdminActivity('Updated Hero CMS settings', `Name: ${data.name.en}`);
    revalidatePath('/');
    revalidatePath('/admin/dashboard/hero');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateAbout(data: {
  biography: { en: string; ar: string };
  skills_summary: { en: string; ar: string };
  cv_url: string;
  profile_image_url: string;
}) {
  try {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('about').update(data).eq('id', true);

    if (error) throw error;

    await logAdminActivity('Updated About CMS settings', 'Biography and skills summary refreshed');
    revalidatePath('/');
    revalidatePath('/admin/dashboard/about');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateSettings(data: {
  site_name: string;
  contact_email: string;
  phone: string;
  meta_title: { en: string; ar: string };
  meta_description: { en: string; ar: string };
  keywords: { en: string[]; ar: string[] };
  location: { en: string; ar: string };
  footer_text: { en: string; ar: string };
  sections_visibility: Record<string, boolean>;
}) {
  try {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('site_settings').update(data).eq('id', true);

    if (error) throw error;

    await logAdminActivity('Updated Site Settings CMS', `Title: ${data.site_name}`);
    revalidatePath('/');
    revalidatePath('/admin/dashboard/settings');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
