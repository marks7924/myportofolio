import { createServerSideClient } from '@/lib/supabase';
import AboutCMSForm from '@/components/admin/AboutCMSForm';

export default async function AdminAboutPage() {
  const supabase = await createServerSideClient();

  // Query the single About row
  const { data: about } = await supabase.from('about').select('*').eq('id', true).single();

  return <AboutCMSForm initialData={about} />;
}
