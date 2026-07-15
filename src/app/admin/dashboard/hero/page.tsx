import { createServerSideClient } from '@/lib/supabase';
import HeroCMSForm from '@/components/admin/HeroCMSForm';

export default async function AdminHeroPage() {
  const supabase = await createServerSideClient();

  // Query the single Hero row
  const { data: hero } = await supabase.from('hero').select('*').eq('id', true).single();

  return <HeroCMSForm initialData={hero} />;
}
