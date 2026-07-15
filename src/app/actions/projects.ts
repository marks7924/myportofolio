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
    console.error('Activity logs failed:', err);
  }
}

export async function upsertProject(
  projectData: {
    id?: string;
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    full_description: { en: string; ar: string } | null;
    challenges: { en: string; ar: string } | null;
    solutions: { en: string; ar: string } | null;
    features: { en: string[]; ar: string[] };
    cover_image: string | null;
    tech_stack: string[];
    github_link: string | null;
    live_demo: string | null;
    category: string;
    featured: boolean;
    status: 'Draft' | 'In Progress' | 'Completed';
    completion_date: string | null;
    client: { en: string; ar: string } | null;
    sort_order: number;
    published: boolean;
  },
  galleryImages: string[]
) {
  try {
    const supabase = await createServerSideClient();
    let projectId = projectData.id;

    if (projectId) {
      const { error } = await supabase.from('projects').update(projectData).eq('id', projectId);
      if (error) throw error;
      await logAdminActivity('Updated Project', `Title: ${projectData.title.en}`);
    } else {
      const { data, error } = await supabase.from('projects').insert(projectData).select('id').single();
      if (error) throw error;
      projectId = data.id;
      await logAdminActivity('Created Project', `Title: ${projectData.title.en}`);
    }

    if (projectId) {
      // Remove all current references
      const { error: clearError } = await supabase
        .from('project_images')
        .delete()
        .eq('project_id', projectId);

      if (clearError) throw clearError;

      // Populate new references with sorting index
      if (galleryImages.length > 0) {
        const imageRows = galleryImages.map((url, index) => ({
          project_id: projectId,
          image_url: url,
          sort_order: index,
        }));
        const { error: insertImgError } = await supabase.from('project_images').insert(imageRows);
        if (insertImgError) throw insertImgError;
      }
    }

    revalidatePath('/');
    revalidatePath(`/projects/${projectId}`);
    revalidatePath('/admin/dashboard/projects');
    return { success: true, id: projectId };
  } catch (err: any) {
    console.error('Project CMS save error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteProject(id: string) {
  try {
    const supabase = await createServerSideClient();

    const { data: proj } = await supabase.from('projects').select('title').eq('id', id).maybeSingle();

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;

    if (proj) {
      await logAdminActivity('Deleted Project', `Title: ${proj.title.en}`);
    }

    revalidatePath('/');
    revalidatePath('/admin/dashboard/projects');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function duplicateProject(id: string) {
  try {
    const supabase = await createServerSideClient();

    // Query original settings row and images separately
    const [projectResult, imagesResult] = await Promise.all([
      supabase.from('projects').select('*').eq('id', id).single(),
      supabase.from('project_images').select('*').eq('project_id', id),
    ]);

    if (projectResult.error || !projectResult.data) throw new Error('Original project record not found.');
    const original = projectResult.data;
    const project_images = imagesResult.data || [];

    const { id: _, created_at: __, ...projectCopy } = original;

    projectCopy.title = {
      en: `${original.title.en} - Copy`,
      ar: `${original.title.ar} - نسخة`,
    };
    projectCopy.published = false;
    projectCopy.featured = false;

    // Insert cloned row
    const { data: clone, error: cloneErr } = await supabase
      .from('projects')
      .insert(projectCopy)
      .select('id')
      .single();

    if (cloneErr) throw cloneErr;

    // Insert copy references in project_images
    if (project_images && project_images.length > 0) {
      const clonedImages = project_images.map((img: any) => ({
        project_id: clone.id,
        image_url: img.image_url,
        sort_order: img.sort_order,
      }));
      const { error: imgErr } = await supabase.from('project_images').insert(clonedImages);
      if (imgErr) throw imgErr;
    }

    await logAdminActivity('Duplicated Project', `Cloned from ID: ${id} to ${clone.id}`);
    revalidatePath('/');
    revalidatePath('/admin/dashboard/projects');
    return { success: true };
  } catch (err: any) {
    console.error('Project duplicate action failed:', err);
    return { success: false, error: err.message };
  }
}
