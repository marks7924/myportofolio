import React from 'react';
import { getPublicData } from '@/lib/data';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const data = await getPublicData();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar navigation={data.navigation} siteName={data.settings.site_name} />
      <main className="flex-grow">{children}</main>
      <Footer
        socialLinks={data.socialLinks}
        footerText={data.settings.footer_text}
        navigation={data.navigation}
      />
    </div>
  );
}
