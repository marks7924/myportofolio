'use server';

import { createServerSideClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';

export async function uploadMedia(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: 'No file provided.' };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Process and Optimize using Sharp
    let optimizedBuffer: Buffer = buffer as any;
    let width: number | undefined;
    let height: number | undefined;

    try {
      const sharpImg = sharp(buffer);
      const metadata = await sharpImg.metadata();

      // Convert to WebP and bound dimensions to max 1600px width/height for web efficiency
      optimizedBuffer = await sharpImg
        .resize({
          width: 1600,
          height: 1600,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();

      const processedMeta = await sharp(optimizedBuffer).metadata();
      width = processedMeta.width;
      height = processedMeta.height;
    } catch (sharpErr) {
      console.warn('Sharp compression failed, uploading original stream.', sharpErr);
    }

    const supabase = await createServerSideClient();

    // 2. Generate random path UUID
    const fileId = crypto.randomUUID();
    const filename = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const webpFilename = `${fileId}.webp`;
    const filePath = `uploads/${webpFilename}`;

    // 3. Upload to Supabase Storage bucket 'media'
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, optimizedBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      // Dynamic Bucket creation if it does not exist
      if (
        uploadError.message.includes('bucket not found') ||
        uploadError.message.includes('does not exist')
      ) {
        await supabase.storage.createBucket('media', { public: true });

        // Retry Upload
        const { error: retryError } = await supabase.storage
          .from('media')
          .upload(filePath, optimizedBuffer, {
            contentType: 'image/webp',
            cacheControl: '3600',
            upsert: true,
          });
        if (retryError) throw retryError;
      } else {
        throw uploadError;
      }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('media').getPublicUrl(filePath);

    // 4. Save metadata to database
    const { data: dbItem, error: dbError } = await supabase
      .from('media_library')
      .insert({
        filename: `${filename}.webp`,
        file_path: filePath,
        url: publicUrl,
        file_size: optimizedBuffer.length,
        mime_type: 'image/webp',
        width,
        height,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Log activity
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'Uploaded media asset',
        details: `Filename: ${filename}.webp | Size: ${(optimizedBuffer.length / 1024).toFixed(1)} KB`,
      });
    }

    revalidatePath('/admin/dashboard/media');
    return { success: true, data: dbItem };
  } catch (err: any) {
    console.error('Media upload server error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteMedia(id: string, filePath: string) {
  try {
    const supabase = await createServerSideClient();

    // 1. Delete from bucket
    const { error: storageError } = await supabase.storage.from('media').remove([filePath]);
    if (storageError) console.error('Storage removal warning:', storageError);

    // 2. Delete database entry
    const { error: dbError } = await supabase.from('media_library').delete().eq('id', id);
    if (dbError) throw dbError;

    // Log activity
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
    console.error('Media delete server error:', err);
    return { success: false, error: err.message };
  }
}
