import { createServerSideClient } from '@/lib/supabase';
import ServicesManager from '@/components/admin/ServicesManager';

export default async function AdminServicesPage() {
  const supabase = await createServerSideClient();

  // Query all services ordered
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });

  return <ServicesManager initialData={services || []} />;
}
