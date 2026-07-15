import { createServerSideClient } from '@/lib/supabase';
import ProjectsManager from '@/components/admin/ProjectsManager';

export default async function AdminProjectsPage() {
  const supabase = await createServerSideClient();

  // Query all projects with their gallery images list
  const { data: projects } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .order('sort_order', { ascending: true });

  // Make sure project images are sorted inside each project
  const sortedProjects = (projects || []).map((project) => {
    if (project.project_images) {
      project.project_images.sort((a: any, b: any) => a.sort_order - b.sort_order);
    }
    return project;
  });

  return <ProjectsManager initialData={sortedProjects} />;
}
