import { MetadataRoute } from 'next';
import { createServerSideClient } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://antigrav-portfolio.vercel.app';

  let projectUrls: any[] = [];
  try {
    const supabase = await createServerSideClient();
    const { data: projects } = await supabase
      .from('projects')
      .select('id, updated_at')
      .eq('published', true);

    if (projects) {
      projectUrls = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: new Date(project.updated_at || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.warn('Failed to load project database logs for sitemap generating:', error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...projectUrls,
  ];
}
