import React from 'react';
import { getNavigation } from '@/lib/db';
import NavigationManager from '@/components/admin/NavigationManager';

export const dynamic = 'force-dynamic';

export default async function NavigationPage() {
  const navigationItems = await getNavigation();

  return (
    <div className="space-y-6">
      <NavigationManager initialItems={navigationItems} />
    </div>
  );
}
