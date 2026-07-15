import { createServerSideClient } from '@/lib/supabase';
import SettingsCMSForm from '@/components/admin/SettingsCMSForm';

export default async function AdminSettingsPage() {
  const supabase = await createServerSideClient();

  // Query the single settings row
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', true)
    .single();

  return <SettingsCMSForm initialData={settings} />;
}
