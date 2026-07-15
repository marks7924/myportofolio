'use server';

import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { createServerSideClient, createAdminClient } from './supabase';
import { DEFAULT_MOCK_DATA } from './mock_data';

// Determine if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    url &&
    url !== 'https://placeholder.supabase.co' &&
    !url.includes('placeholder') &&
    key &&
    key !== 'placeholder-anon-key' &&
    !key.includes('placeholder')
  );
};

const mockFilePath = path.join(process.cwd(), 'src/lib/mock_db.json');

// Read Mock Database JSON
async function readMockDB(): Promise<typeof DEFAULT_MOCK_DATA> {
  try {
    if (!fs.existsSync(mockFilePath)) {
      fs.writeFileSync(mockFilePath, JSON.stringify(DEFAULT_MOCK_DATA, null, 2), 'utf-8');
      return DEFAULT_MOCK_DATA;
    }
    const data = fs.readFileSync(mockFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading mock database, using defaults:', e);
    return DEFAULT_MOCK_DATA;
  }
}

// Write Mock Database JSON
async function writeMockDB(data: typeof DEFAULT_MOCK_DATA) {
  try {
    fs.writeFileSync(mockFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing mock database:', e);
  }
}

// Log Actions
export async function logActivity(action: string, details?: string) {
  const timestamp = new Date().toISOString();
  let userEmail = 'System';
  
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSideClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userEmail = user.email || user.id;
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          action,
          details: details || `Performed by ${userEmail}`
        });
      }
    } catch (e) {
      console.error('Error logging supabase activity:', e);
    }
  } else {
    const cookieStore = await cookies();
    const isDemoAdmin = cookieStore.get('mock_admin_session')?.value === 'true';
    if (isDemoAdmin) {
      userEmail = 'admin@example.com (Demo)';
    }
    const db = await readMockDB();
    db.activity_logs.unshift({
      id: Math.random().toString(36).substring(7),
      user_id: isDemoAdmin ? 'demo-admin-id' : undefined,
      action,
      details: details || `Performed by ${userEmail}`,
      created_at: timestamp
    });
    await writeMockDB(db);
  }
}

// ----------------------------------------------------
// 1. Site Settings
// ----------------------------------------------------
export async function getSiteSettings() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('site_settings').select('*').single();
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.site_settings;
}

export async function updateSiteSettings(settings: any) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('site_settings').update(settings).eq('id', true);
    if (!error) {
      await logActivity('Update Site Settings', 'Updated site configuration');
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  db.site_settings = { ...db.site_settings, ...settings, updated_at: new Date().toISOString() };
  await writeMockDB(db);
  await logActivity('Update Site Settings (Demo)', 'Updated site configuration');
  return { success: true };
}

// ----------------------------------------------------
// 2. Hero Section
// ----------------------------------------------------
export async function getHero() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('hero').select('*').single();
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.hero;
}

export async function updateHero(heroData: any) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('hero').update(heroData).eq('id', true);
    if (!error) {
      await logActivity('Update Hero', 'Updated hero presentation fields');
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  db.hero = { ...db.hero, ...heroData, updated_at: new Date().toISOString() };
  await writeMockDB(db);
  await logActivity('Update Hero (Demo)', 'Updated hero presentation fields');
  return { success: true };
}

// ----------------------------------------------------
// 3. About Section
// ----------------------------------------------------
export async function getAbout() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('about').select('*').single();
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.about;
}

export async function updateAbout(aboutData: any) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('about').update(aboutData).eq('id', true);
    if (!error) {
      await logActivity('Update About', 'Updated bio and CV details');
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  db.about = { ...db.about, ...aboutData, updated_at: new Date().toISOString() };
  await writeMockDB(db);
  await logActivity('Update About (Demo)', 'Updated bio and CV details');
  return { success: true };
}

// ----------------------------------------------------
// 4. Skills & Categories
// ----------------------------------------------------
export async function getSkillCategories() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('skill_categories').select('*').order('sort_order', { ascending: true });
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.skill_categories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export async function saveSkillCategory(category: any) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    let error;
    if (category.id) {
      ({ error } = await supabase.from('skill_categories').update(category).eq('id', category.id));
    } else {
      ({ error } = await supabase.from('skill_categories').insert([category]));
    }
    if (!error) {
      await logActivity('Save Skill Category', `Saved category: ${JSON.stringify(category.name)}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  if (category.id) {
    const index = db.skill_categories.findIndex(c => c.id === category.id);
    if (index !== -1) db.skill_categories[index] = { ...db.skill_categories[index], ...category };
  } else {
    category.id = Math.random().toString(36).substring(7);
    db.skill_categories.push(category);
  }
  await writeMockDB(db);
  await logActivity('Save Skill Category (Demo)', `Saved category: ${JSON.stringify(category.name)}`);
  return { success: true };
}

export async function deleteSkillCategory(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('skill_categories').delete().eq('id', id);
    if (!error) {
      await logActivity('Delete Skill Category', `Deleted category ID: ${id}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  db.skill_categories = db.skill_categories.filter(c => c.id !== id);
  db.skills = db.skills.filter(s => s.category_id !== id); // Cascade delete
  await writeMockDB(db);
  await logActivity('Delete Skill Category (Demo)', `Deleted category ID: ${id}`);
  return { success: true };
}

export async function getSkills() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.skills.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export async function saveSkill(skill: any) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    let error;
    if (skill.id) {
      ({ error } = await supabase.from('skills').update(skill).eq('id', skill.id));
    } else {
      ({ error } = await supabase.from('skills').insert([skill]));
    }
    if (!error) {
      await logActivity('Save Skill', `Saved skill: ${skill.name}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  if (skill.id) {
    const index = db.skills.findIndex(s => s.id === skill.id);
    if (index !== -1) db.skills[index] = { ...db.skills[index], ...skill };
  } else {
    skill.id = Math.random().toString(36).substring(7);
    db.skills.push(skill);
  }
  await writeMockDB(db);
  await logActivity('Save Skill (Demo)', `Saved skill: ${skill.name}`);
  return { success: true };
}

export async function deleteSkill(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (!error) {
      await logActivity('Delete Skill', `Deleted skill ID: ${id}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  db.skills = db.skills.filter(s => s.id !== id);
  await writeMockDB(db);
  await logActivity('Delete Skill (Demo)', `Deleted skill ID: ${id}`);
  return { success: true };
}

// ----------------------------------------------------
// 5. Work Experience
// ----------------------------------------------------
export async function getExperiences() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('experience').select('*').order('sort_order', { ascending: true });
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.experience.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export async function saveExperience(exp: any) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    let error;
    if (exp.id) {
      ({ error } = await supabase.from('experience').update(exp).eq('id', exp.id));
    } else {
      ({ error } = await supabase.from('experience').insert([exp]));
    }
    if (!error) {
      await logActivity('Save Experience', `Saved job at: ${exp.company}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  if (exp.id) {
    const index = db.experience.findIndex(e => e.id === exp.id);
    if (index !== -1) db.experience[index] = { ...db.experience[index], ...exp };
  } else {
    exp.id = Math.random().toString(36).substring(7);
    db.experience.push(exp);
  }
  await writeMockDB(db);
  await logActivity('Save Experience (Demo)', `Saved job at: ${exp.company}`);
  return { success: true };
}

export async function deleteExperience(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (!error) {
      await logActivity('Delete Experience', `Deleted job experience ID: ${id}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  db.experience = db.experience.filter(e => e.id !== id);
  await writeMockDB(db);
  await logActivity('Delete Experience (Demo)', `Deleted job experience ID: ${id}`);
  return { success: true };
}

// ----------------------------------------------------
// 6. Projects & Gallery
// ----------------------------------------------------
export async function getProjects() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.projects.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export async function getProjectById(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data: project, error: pError } = await supabase.from('projects').select('*').eq('id', id).single();
    if (!pError && project) {
      const { data: images } = await supabase.from('project_images').select('*').eq('project_id', id).order('sort_order', { ascending: true });
      return { ...project, images: images || [] };
    }
  }
  const db = await readMockDB();
  const project = db.projects.find(p => p.id === id);
  if (project) {
    const images = db.project_images.filter(img => img.project_id === id).sort((a, b) => a.sort_order - b.sort_order);
    return { ...project, images };
  }
  return null;
}

export async function saveProject(project: any, galleryImages: string[] = []) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    let error;
    let projectId = project.id;
    
    if (projectId) {
      ({ error } = await supabase.from('projects').update(project).eq('id', projectId));
    } else {
      const { data, error: insError } = await supabase.from('projects').insert([project]).select('id').single();
      error = insError;
      if (data) projectId = data.id;
    }
    
    if (!error && projectId) {
      // Clear old gallery images and insert new ones
      await supabase.from('project_images').delete().eq('project_id', projectId);
      if (galleryImages.length > 0) {
        const imageInserts = galleryImages.map((url, index) => ({
          project_id: projectId,
          image_url: url,
          sort_order: index
        }));
        await supabase.from('project_images').insert(imageInserts);
      }
      await logActivity('Save Project', `Saved project: ${JSON.stringify(project.title)}`);
      return { success: true, id: projectId };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  let projectId = project.id;
  
  if (projectId) {
    const index = db.projects.findIndex(p => p.id === projectId);
    if (index !== -1) db.projects[index] = { ...db.projects[index], ...project };
  } else {
    projectId = Math.random().toString(36).substring(7);
    project.id = projectId;
    db.projects.push(project);
  }
  
  // Update gallery images
  db.project_images = db.project_images.filter(img => img.project_id !== projectId);
  galleryImages.forEach((url, index) => {
    db.project_images.push({
      id: Math.random().toString(36).substring(7),
      project_id: projectId,
      image_url: url,
      sort_order: index
    });
  });
  
  await writeMockDB(db);
  await logActivity('Save Project (Demo)', `Saved project: ${JSON.stringify(project.title)}`);
  return { success: true, id: projectId };
}

export async function deleteProject(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      await logActivity('Delete Project', `Deleted project ID: ${id}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  db.projects = db.projects.filter(p => p.id !== id);
  db.project_images = db.project_images.filter(img => img.project_id !== id); // Cascade delete
  await writeMockDB(db);
  await logActivity('Delete Project (Demo)', `Deleted project ID: ${id}`);
  return { success: true };
}

// ----------------------------------------------------
// 7. Services
// ----------------------------------------------------
export async function getServices() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.services.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export async function saveService(service: any) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    let error;
    if (service.id) {
      ({ error } = await supabase.from('services').update(service).eq('id', service.id));
    } else {
      ({ error } = await supabase.from('services').insert([service]));
    }
    if (!error) {
      await logActivity('Save Service', `Saved service: ${JSON.stringify(service.title)}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  if (service.id) {
    const index = db.services.findIndex(s => s.id === service.id);
    if (index !== -1) db.services[index] = { ...db.services[index], ...service };
  } else {
    service.id = Math.random().toString(36).substring(7);
    db.services.push(service);
  }
  await writeMockDB(db);
  await logActivity('Save Service (Demo)', `Saved service: ${JSON.stringify(service.title)}`);
  return { success: true };
}

export async function deleteService(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) {
      await logActivity('Delete Service', `Deleted service ID: ${id}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  db.services = db.services.filter(s => s.id !== id);
  await writeMockDB(db);
  await logActivity('Delete Service (Demo)', `Deleted service ID: ${id}`);
  return { success: true };
}

// ----------------------------------------------------
// 8. Testimonials
// ----------------------------------------------------
export async function getTestimonials() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.testimonials.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export async function saveTestimonial(testimonial: any) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    let error;
    if (testimonial.id) {
      ({ error } = await supabase.from('testimonials').update(testimonial).eq('id', testimonial.id));
    } else {
      ({ error } = await supabase.from('testimonials').insert([testimonial]));
    }
    if (!error) {
      await logActivity('Save Testimonial', `Saved testimonial from: ${testimonial.name}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  if (testimonial.id) {
    const index = db.testimonials.findIndex(t => t.id === testimonial.id);
    if (index !== -1) db.testimonials[index] = { ...db.testimonials[index], ...testimonial };
  } else {
    testimonial.id = Math.random().toString(36).substring(7);
    db.testimonials.push(testimonial);
  }
  await writeMockDB(db);
  await logActivity('Save Testimonial (Demo)', `Saved testimonial from: ${testimonial.name}`);
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) {
      await logActivity('Delete Testimonial', `Deleted testimonial ID: ${id}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  db.testimonials = db.testimonials.filter(t => t.id !== id);
  await writeMockDB(db);
  await logActivity('Delete Testimonial (Demo)', `Deleted testimonial ID: ${id}`);
  return { success: true };
}

// ----------------------------------------------------
// 9. Certifications
// ----------------------------------------------------
export async function getCertifications() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('certifications').select('*').order('sort_order', { ascending: true });
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.certifications.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export async function saveCertification(cert: any) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    let error;
    if (cert.id) {
      ({ error } = await supabase.from('certifications').update(cert).eq('id', cert.id));
    } else {
      ({ error } = await supabase.from('certifications').insert([cert]));
    }
    if (!error) {
      await logActivity('Save Certification', `Saved certificate: ${JSON.stringify(cert.title)}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  if (cert.id) {
    const index = db.certifications.findIndex(c => c.id === cert.id);
    if (index !== -1) db.certifications[index] = { ...db.certifications[index], ...cert };
  } else {
    cert.id = Math.random().toString(36).substring(7);
    db.certifications.push(cert);
  }
  await writeMockDB(db);
  await logActivity('Save Certification (Demo)', `Saved certificate: ${JSON.stringify(cert.title)}`);
  return { success: true };
}

export async function deleteCertification(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (!error) {
      await logActivity('Delete Certification', `Deleted certificate ID: ${id}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  db.certifications = db.certifications.filter(c => c.id !== id);
  await writeMockDB(db);
  await logActivity('Delete Certification (Demo)', `Deleted certificate ID: ${id}`);
  return { success: true };
}

// ----------------------------------------------------
// 10. Contact Messages
// ----------------------------------------------------
export async function getContactMessages() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.contact_messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function submitContactMessage(msg: any) {
  const timestamp = new Date().toISOString();
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('contact_messages').insert([{ ...msg, created_at: timestamp, status: 'unread' }]);
    if (!error) return { success: true };
    return { success: false, error };
  }
  const db = await readMockDB();
  db.contact_messages.unshift({
    id: Math.random().toString(36).substring(7),
    ...msg,
    status: 'unread',
    created_at: timestamp
  });
  await writeMockDB(db);
  return { success: true };
}

export async function updateContactMessageStatus(id: string, status: 'unread' | 'read' | 'archived') {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
    if (!error) {
      await logActivity('Update Contact Message Status', `Status set to ${status} for message ID ${id}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  const index = db.contact_messages.findIndex(m => m.id === id);
  if (index !== -1) {
    db.contact_messages[index].status = status;
    await writeMockDB(db);
    await logActivity('Update Contact Message Status (Demo)', `Status set to ${status} for message ID ${id}`);
    return { success: true };
  }
  return { success: false, error: 'Message not found' };
}

export async function deleteContactMessage(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (!error) {
      await logActivity('Delete Contact Message', `Deleted contact message ID: ${id}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  db.contact_messages = db.contact_messages.filter(m => m.id !== id);
  await writeMockDB(db);
  await logActivity('Delete Contact Message (Demo)', `Deleted contact message ID: ${id}`);
  return { success: true };
}

// ----------------------------------------------------
// 11. Navigation & Social Links
// ----------------------------------------------------
export async function getNavigation() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('navigation').select('*').order('sort_order', { ascending: true });
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.navigation.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export async function saveNavigation(navItems: any[]) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    // Since it's a small list, we can write updates
    for (const item of navItems) {
      if (item.id) {
        await supabase.from('navigation').update(item).eq('id', item.id);
      } else {
        await supabase.from('navigation').insert([item]);
      }
    }
    await logActivity('Save Navigation', 'Updated navigation structure');
    return { success: true };
  }
  const db = await readMockDB();
  navItems.forEach(item => {
    if (item.id) {
      const index = db.navigation.findIndex(n => n.id === item.id);
      if (index !== -1) db.navigation[index] = { ...db.navigation[index], ...item };
    } else {
      item.id = Math.random().toString(36).substring(7);
      db.navigation.push(item);
    }
  });
  // Sort
  db.navigation.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  await writeMockDB(db);
  await logActivity('Save Navigation (Demo)', 'Updated navigation structure');
  return { success: true };
}

export async function getSocialLinks() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('social_links').select('*').order('sort_order', { ascending: true });
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.social_links.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export async function saveSocialLink(link: any) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    let error;
    if (link.id) {
      ({ error } = await supabase.from('social_links').update(link).eq('id', link.id));
    } else {
      ({ error } = await supabase.from('social_links').insert([link]));
    }
    if (!error) {
      await logActivity('Save Social Link', `Saved social link: ${link.platform}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  if (link.id) {
    const index = db.social_links.findIndex(s => s.id === link.id);
    if (index !== -1) db.social_links[index] = { ...db.social_links[index], ...link };
  } else {
    link.id = Math.random().toString(36).substring(7);
    db.social_links.push(link);
  }
  await writeMockDB(db);
  await logActivity('Save Social Link (Demo)', `Saved social link: ${link.platform}`);
  return { success: true };
}

export async function deleteSocialLink(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('social_links').delete().eq('id', id);
    if (!error) {
      await logActivity('Delete Social Link', `Deleted link ID: ${id}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  db.social_links = db.social_links.filter(s => s.id !== id);
  await writeMockDB(db);
  await logActivity('Delete Social Link (Demo)', `Deleted link ID: ${id}`);
  return { success: true };
}

// ----------------------------------------------------
// 12. Dynamic Static Translations CRUD
// ----------------------------------------------------
export async function getTranslations() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('translations').select('*');
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.translations;
}

export async function saveTranslation(translation: any) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    let error;
    if (translation.id) {
      ({ error } = await supabase.from('translations').update(translation).eq('id', translation.id));
    } else {
      ({ error } = await supabase.from('translations').insert([translation]));
    }
    if (!error) {
      await logActivity('Save Translation', `Saved translation key: ${translation.key}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  if (translation.id) {
    const index = db.translations.findIndex((t: any) => t.id === translation.id || t.key === translation.key);
    if (index !== -1) db.translations[index] = { ...db.translations[index], ...translation } as any;
  } else {
    // Check if key already exists
    const exists = db.translations.some((t: any) => t.key === translation.key);
    if (exists) return { success: false, error: 'Key already exists' };
    
    db.translations.push({
      key: translation.key,
      en: translation.en,
      ar: translation.ar,
    } as any);
  }
  await writeMockDB(db);
  await logActivity('Save Translation (Demo)', `Saved translation key: ${translation.key}`);
  return { success: true };
}

// ----------------------------------------------------
// 13. Media Library Operations
// ----------------------------------------------------
export async function getMediaLibrary() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('media_library').select('*').order('created_at', { ascending: false });
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.media_library.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function saveMediaItem(item: any) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.from('media_library').insert([item]);
    if (!error) {
      await logActivity('Save Media Item', `Uploaded media item: ${item.filename}`);
      return { success: true };
    }
    return { success: false, error };
  }
  const db = await readMockDB();
  db.media_library.unshift(item);
  await writeMockDB(db);
  await logActivity('Save Media Item (Demo)', `Uploaded media item: ${item.filename}`);
  return { success: true };
}

export async function deleteMediaItem(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data: item } = await supabase.from('media_library').select('*').eq('id', id).single();
    
    if (item) {
      // Try to delete from Supabase storage bucket
      const storage = supabase.storage.from('media');
      await storage.remove([item.file_path]);
    }
    
    const { error } = await supabase.from('media_library').delete().eq('id', id);
    if (!error) {
      await logActivity('Delete Media Item', `Deleted media file ID: ${id}`);
      return { success: true };
    }
    return { success: false, error };
  }
  
  const db = await readMockDB();
  db.media_library = db.media_library.filter(m => m.id !== id);
  await writeMockDB(db);
  await logActivity('Delete Media Item (Demo)', `Deleted media file ID: ${id}`);
  return { success: true };
}

// ----------------------------------------------------
// 14. Activity Logs
// ----------------------------------------------------
export async function getActivityLogs() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50);
    if (!error && data) return data;
  }
  const db = await readMockDB();
  return db.activity_logs.slice(0, 50);
}

// ----------------------------------------------------
// 15. Authentication Bypass & Mock login
// ----------------------------------------------------
export async function checkAdminCredentials(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    
    // Log in the user via standard auth
    const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    
    if (session?.user) {
      // Query profile role
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (profile && profile.role === 'admin') {
        return { success: true };
      } else {
        // Sign out if not admin
        await supabase.auth.signOut();
        return { success: false, error: 'Unauthorized: User is not an administrator.' };
      }
    }
    return { success: false, error: 'Login failed' };
  }
  
  // Mock login bypass
  if (email === 'admin@example.com' && password === 'admin123') {
    const cookieStore = await cookies();
    cookieStore.set('mock_admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    });
    await logActivity('Admin Log In (Demo)', 'Successfully authenticated with demo credentials');
    return { success: true };
  }
  
  return { success: false, error: 'Invalid credentials. Try admin@example.com / admin123' };
}

export async function adminLogout() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    await supabase.auth.signOut();
  } else {
    const cookieStore = await cookies();
    cookieStore.delete('mock_admin_session');
    await logActivity('Admin Log Out (Demo)', 'Demo session ended');
  }
  return { success: true };
}

export async function checkIsAdmin(): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSideClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    return profile?.role === 'admin';
  }
  const cookieStore = await cookies();
  return cookieStore.get('mock_admin_session')?.value === 'true';
}

export async function getSupabaseConfigStatus() {
  return {
    configured: isSupabaseConfigured(),
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not Set'
  };
}
