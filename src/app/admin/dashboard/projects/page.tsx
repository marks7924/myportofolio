import { createServerSideClient } from '@/lib/supabase';
import ProjectsManager from '@/components/admin/ProjectsManager';

export default async function AdminProjectsPage() {
  const supabase = await createServerSideClient();

  // Query all projects and project images separately
  const [projectsResult, imagesResult] = await Promise.all([
    supabase.from('projects').select('*').order('sort_order', { ascending: true }),
    supabase.from('project_images').select('*').order('sort_order', { ascending: true }),
  ]);

  const projects = projectsResult.data || [];
  const images = imagesResult.data || [];

  const sortedProjects = projects.map((project: any) => {
    const projectImages = images.filter((img: any) => img.project_id === project.id);
    return {
      ...project,
      project_images: projectImages,
    };
  });

  return <ProjectsManager initialData={sortedProjects} />;
}
