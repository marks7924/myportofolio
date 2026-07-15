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
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action,
        details,
      });
    }
  } catch (err) {
    console.error('Failed to write activity logs:', err);
  }
}

export async function updateMessageStatus(id: string, status: 'unread' | 'read' | 'archived') {
  try {
    const supabase = await createServerSideClient();

    const { data: msg } = await supabase
      .from('contact_messages')
      .select('name, subject')
      .eq('id', id)
      .maybeSingle();

    const { error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    if (msg) {
      await logAdminActivity(
        `Marked message as ${status}`,
        `From: ${msg.name} | Subject: ${msg.subject}`
      );
    }

    revalidatePath('/admin/dashboard/messages');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteMessage(id: string) {
  try {
    const supabase = await createServerSideClient();

    const { data: msg } = await supabase
      .from('contact_messages')
      .select('name, subject')
      .eq('id', id)
      .maybeSingle();

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (msg) {
      await logAdminActivity(
        'Deleted message',
        `From: ${msg.name} | Subject: ${msg.subject}`
      );
    }

    revalidatePath('/admin/dashboard/messages');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
