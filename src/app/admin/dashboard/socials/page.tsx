import React from 'react';
import { getSocialLinks } from '@/lib/db';
import SocialsManager from '@/components/admin/SocialsManager';

export const dynamic = 'force-dynamic';

export default async function SocialsPage() {
  const socials = await getSocialLinks();

  return (
    <div className="space-y-6">
      <SocialsManager initialItems={socials} />
    </div>
  );
}
