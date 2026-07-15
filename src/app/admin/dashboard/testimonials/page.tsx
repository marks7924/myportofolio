import { createServerSideClient } from '@/lib/supabase';
import TestimonialsManager from '@/components/admin/TestimonialsManager';

export default async function AdminTestimonialsPage() {
  const supabase = await createServerSideClient();

  // Query all testimonials ordered
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });

  return <TestimonialsManager initialData={testimonials || []} />;
}
