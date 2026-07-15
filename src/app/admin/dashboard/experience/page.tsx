import { createServerSideClient } from '@/lib/supabase';
import ExperienceManager from '@/components/admin/ExperienceManager';

export default async function AdminExperiencePage() {
  const supabase = await createServerSideClient();

  // Query all work experience records sorted
  const { data: experience } = await supabase
    .from('experience')
    .select('*')
    .order('sort_order', { ascending: true });

  return <ExperienceManager initialData={experience || []} />;
}
