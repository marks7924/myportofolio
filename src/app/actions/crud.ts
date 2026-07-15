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
    console.error('Failed to log admin action:', err);
  }
}

// ================= SKILLS & CATEGORIES =================

export async function createSkillCategory(data: { name: { en: string; ar: string }; sort_order: number }) {
  try {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('skill_categories').insert(data);
    if (error) throw error;
    await logAdminActivity('Created skill category', `Name: ${data.name.en}`);
    revalidatePath('/');
    revalidatePath('/admin/dashboard/skills');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteSkillCategory(id: string) {
  try {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('skill_categories').delete().eq('id', id);
    if (error) throw error;
    await logAdminActivity('Deleted skill category', `ID: ${id}`);
    revalidatePath('/');
    revalidatePath('/admin/dashboard/skills');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function upsertSkill(data: {
  id?: string;
  category_id: string;
  name: string;
  icon: string;
  proficiency: number;
  sort_order: number;
}) {
  try {
    const supabase = await createServerSideClient();
    let error;
    if (data.id) {
      const { error: err } = await supabase.from('skills').update(data).eq('id', data.id);
      error = err;
      await logAdminActivity('Updated Skill item', `Name: ${data.name}`);
    } else {
      const { error: err } = await supabase.from('skills').insert(data);
      error = err;
      await logAdminActivity('Created Skill item', `Name: ${data.name}`);
    }
    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/admin/dashboard/skills');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteSkill(id: string) {
  try {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
    await logAdminActivity('Deleted Skill item', `ID: ${id}`);
    revalidatePath('/');
    revalidatePath('/admin/dashboard/skills');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ================= WORK EXPERIENCE =================

export async function upsertExperience(data: {
  id?: string;
  company: string;
  position: { en: string; ar: string };
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: { en: string; ar: string };
  technologies: string[];
  logo_url: string | null;
  sort_order: number;
}) {
  try {
    const supabase = await createServerSideClient();
    let error;
    if (data.id) {
      const { error: err } = await supabase.from('experience').update(data).eq('id', data.id);
      error = err;
      await logAdminActivity(
        'Updated Work Experience',
        `Company: ${data.company} | Position: ${data.position.en}`
      );
    } else {
      const { error: err } = await supabase.from('experience').insert(data);
      error = err;
      await logAdminActivity(
        'Created Work Experience',
        `Company: ${data.company} | Position: ${data.position.en}`
      );
    }
    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/admin/dashboard/experience');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteExperience(id: string) {
  try {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) throw error;
    await logAdminActivity('Deleted Work Experience item', `ID: ${id}`);
    revalidatePath('/');
    revalidatePath('/admin/dashboard/experience');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ================= SERVICES =================

export async function upsertService(data: {
  id?: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  sort_order: number;
}) {
  try {
    const supabase = await createServerSideClient();
    let error;
    if (data.id) {
      const { error: err } = await supabase.from('services').update(data).eq('id', data.id);
      error = err;
      await logAdminActivity('Updated Service item', `Title: ${data.title.en}`);
    } else {
      const { error: err } = await supabase.from('services').insert(data);
      error = err;
      await logAdminActivity('Created Service item', `Title: ${data.title.en}`);
    }
    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/admin/dashboard/services');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteService(id: string) {
  try {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
    await logAdminActivity('Deleted Service item', `ID: ${id}`);
    revalidatePath('/');
    revalidatePath('/admin/dashboard/services');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ================= CERTIFICATIONS =================

export async function upsertCertification(data: {
  id?: string;
  title: { en: string; ar: string };
  organization: { en: string; ar: string };
  issue_date: string;
  credential_url: string | null;
  image_url: string | null;
  sort_order: number;
}) {
  try {
    const supabase = await createServerSideClient();
    let error;
    if (data.id) {
      const { error: err } = await supabase.from('certifications').update(data).eq('id', data.id);
      error = err;
      await logAdminActivity('Updated Certification', `Title: ${data.title.en}`);
    } else {
      const { error: err } = await supabase.from('certifications').insert(data);
      error = err;
      await logAdminActivity('Created Certification', `Title: ${data.title.en}`);
    }
    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/admin/dashboard/certifications');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteCertification(id: string) {
  try {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (error) throw error;
    await logAdminActivity('Deleted Certification item', `ID: ${id}`);
    revalidatePath('/');
    revalidatePath('/admin/dashboard/certifications');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ================= TESTIMONIALS =================

export async function upsertTestimonial(data: {
  id?: string;
  name: string;
  role: { en: string; ar: string };
  company: string | null;
  feedback: { en: string; ar: string };
  image_url: string | null;
  published: boolean;
  sort_order: number;
}) {
  try {
    const supabase = await createServerSideClient();
    let error;
    if (data.id) {
      const { error: err } = await supabase.from('testimonials').update(data).eq('id', data.id);
      error = err;
      await logAdminActivity('Updated Testimonial', `Name: ${data.name}`);
    } else {
      const { error: err } = await supabase.from('testimonials').insert(data);
      error = err;
      await logAdminActivity('Created Testimonial', `Name: ${data.name}`);
    }
    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/admin/dashboard/testimonials');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    await logAdminActivity('Deleted Testimonial item', `ID: ${id}`);
    revalidatePath('/');
    revalidatePath('/admin/dashboard/testimonials');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
