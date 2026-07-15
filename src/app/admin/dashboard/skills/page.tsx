import { createServerSideClient } from '@/lib/supabase';
import SkillsManager from '@/components/admin/SkillsManager';

export default async function AdminSkillsPage() {
  const supabase = await createServerSideClient();

  const [categoriesRes, skillsRes] = await Promise.all([
    supabase.from('skill_categories').select('*').order('sort_order', { ascending: true }),
    supabase.from('skills').select('*').order('sort_order', { ascending: true }),
  ]);

  return (
    <SkillsManager
      categories={categoriesRes.data || []}
      skills={skillsRes.data || []}
    />
  );
}
