import { createServerSideClient } from '@/lib/supabase';
import MessagesManager from '@/components/admin/MessagesManager';

export default async function InboxPage() {
  const supabase = await createServerSideClient();

  // Load all contact messages, sorted from newest to oldest
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  return <MessagesManager initialMessages={messages || []} />;
}
