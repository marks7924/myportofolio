import { createServerSideClient } from '@/lib/supabase';
import CertificationsManager from '@/components/admin/CertificationsManager';

export default async function AdminCertificationsPage() {
  const supabase = await createServerSideClient();

  // Query all certifications ordered
  const { data: certifications } = await supabase
    .from('certifications')
    .select('*')
    .order('sort_order', { ascending: true });

  return <CertificationsManager initialData={certifications || []} />;
}
