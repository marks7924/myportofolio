'use server';

import { createServerSideClient, createAdminClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

/**
 * Ensures the public 'media' storage bucket exists in Supabase.
 * Uses the Service Role Key for administrative bucket creation.
 */
export async function ensureBucketExists() {
  try {
    const adminSupabase = createAdminClient();
    const { data: buckets, error: listError } = await adminSupabase.storage.listBuckets();
    if (listError) throw listError;

    const exists = buckets.some((b) => b.name === 'media');
    if (!exists) {
      const { error: createError } = await adminSupabase.storage.createBucket('media', {
        public: true,
      });
      if (createError) throw createError;
    }
    return { success: true };
  } catch (err: any) {
    console.error('Failed to ensure media bucket exists:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Saves media metadata AFTER the file has already been uploaded
 * directly to Supabase Storage from the browser.
 * This avoids Vercel's 4.5 MB serverless body limit.
 */
export async function saveMediaMetadata(item: {
  filename: string;
  file_path: string;
  url: string;
  file_size: number;
  mime_type: string;
  width?: number | null;
  height?: number | null;
}) {
  try {
    const supabase = await createServerSideClient();

    const { data, error } = await supabase
      .from('media_library')
      .insert(item)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'Uploaded media asset',
        details: `Filename: ${item.filename} | Size: ${(item.file_size / 1024).toFixed(1)} KB`,
      });
    }

    revalidatePath('/admin/dashboard/media');
    return { success: true, data };
  } catch (err: any) {
    console.error('saveMediaMetadata error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteMedia(id: string, filePath: string) {
  try {
    const supabase = await createServerSideClient();

    // Delete from storage bucket
    const { error: storageError } = await supabase.storage.from('media').remove([filePath]);
    if (storageError) console.warn('Storage removal warning:', storageError);

    // Delete database entry
    const { error: dbError } = await supabase.from('media_library').delete().eq('id', id);
    if (dbError) throw dbError;

    // Log activity
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'Deleted media asset',
        details: `Path: ${filePath}`,
      });
    }

    revalidatePath('/admin/dashboard/media');
    return { success: true };
  } catch (err: any) {
    console.error('deleteMedia error:', err);
    return { success: false, error: err.message };
  }
}
