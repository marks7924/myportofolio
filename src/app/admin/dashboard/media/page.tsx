import { createServerSideClient } from '@/lib/supabase';
import MediaLibraryManager from '@/components/admin/MediaLibraryManager';

export default async function MediaPage() {
  const supabase = await createServerSideClient();

  // Query all media files, showing newest uploads first
  const { data: media } = await supabase
    .from('media_library')
    .select('*')
    .order('created_at', { ascending: false });

  return <MediaLibraryManager initialMedia={media || []} />;
}
