'use server';

import { createServerSideClient } from '@/lib/supabase';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createServerSideClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Double check profiles list role for safety
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      await supabase.auth.signOut();
      return { success: false, error: 'Unauthorized: Admin credentials required.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Authentication check error:', err);
    return { success: false, error: 'An unexpected authorization error occurred.' };
  }
}

export async function logout() {
  const supabase = await createServerSideClient();
  await supabase.auth.signOut();
}
