import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/db';
import { translate } from '@/lib/i18n';
import '@/app/globals.css';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'en';
  const settings = await getSiteSettings();
  const titleText = translate(settings.meta_title, locale) || 'Portfolio';
  const descText = translate(settings.meta_description, locale) || 'Welcome';
  
  let keywordList: string[] = [];
  if (settings.keywords) {
    if (Array.isArray(settings.keywords)) {
      keywordList = settings.keywords;
    } else if (settings.keywords[locale]) {
      keywordList = settings.keywords[locale];
    } else if (settings.keywords['en']) {
      keywordList = settings.keywords['en'];
    }
  }

  return {
    title: titleText,
    description: descText,
    keywords: keywordList,
    icons: {
      icon: settings.favicon_url || '/favicon.ico',
    },
    openGraph: {
      title: titleText,
      description: descText,
      images: settings.og_image_url ? [{ url: settings.og_image_url }] : [],
    }
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'en';
  const lang = locale === 'ar' ? 'ar' : 'en';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const fontClass = lang === 'ar' ? 'font-[Cairo]' : 'font-[Outfit]';

  // Inject a small script to avoid flash of light/dark themes
  const themeScript = `
    (function() {
      try {
        const theme = localStorage.getItem('portfolio-theme') || 'dark';
        if (theme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang={lang} dir={dir} className="h-full scroll-smooth select-none" style={{ colorScheme: 'dark' }}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`min-h-full flex flex-col ${fontClass} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}
