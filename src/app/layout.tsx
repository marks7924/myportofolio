import type { Metadata } from "next";
import { getPublicData } from "@/lib/data";
import { Providers } from "@/components/providers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { settings } = await getPublicData();
    const titleEn = settings?.meta_title?.en || "Alex Morgan | Portfolio";
    const descEn = settings?.meta_description?.en || "Professional software engineering portfolio.";
    const keywordsEn = settings?.keywords?.en || [];
    
    return {
      title: titleEn,
      description: descEn,
      keywords: keywordsEn,
      alternates: {
        canonical: '/',
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: "Alex Morgan | Creative Developer",
      description: "Professional software engineering portfolio.",
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch initial translations dictionary on server
  const { dictionary } = await getPublicData();

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <Providers initialDictionary={dictionary}>{children}</Providers>
      </body>
    </html>
  );
}
