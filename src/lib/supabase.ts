import { createBrowserClient, createServerClient } from '@supabase/ssr';

// Client-side Supabase client (for use in Browser components)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server-side Supabase client (for use in Server Components, API routes, and Server Actions)
export async function createServerSideClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Under Next.js App Router, cookies cannot be modified during static render or inside layout components.
            // This is ignored because middleware handles session token refresh.
          }
        },
      },
    }
  );
}

// Admin-level Supabase client using Service Role key
// WARNING: Only use this in secure server environments; never expose the service role key to the client!
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  // Return standard client configured with service key for bypassing RLS
  return createServerClient(url, serviceKey, {
    cookies: {
      getAll() { return []; },
      setAll() {}
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
