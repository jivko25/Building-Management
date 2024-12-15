import ProjectsSkeletonCard from "@/utils/SkeletonLoader/Projects/ProjectsSkeletonCard";
import { BrickWall, CircleAlert } from "lucide-react";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import { Project } from "@/types/project-types/projectTypes";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import ProjectsCard from "./ProjectsCard";
import ProjectsBreadcrumb from "@/components/common/Breadcrumbs/ProjectsBreadcrumb";

// src/components/tables/ProjectsTable/ProjectsTableBody.tsx
const ProjectsTableBody = () => {
  const {
    data: projectsResponse,
    isPending,
    isError,
  } = useFetchDataQuery<{
    success: boolean;
    data: Project[];
  }>({
    URL: "/projects",
    queryKey: ["projects"],
  });

  console.log("🚀 Projects response:", projectsResponse);

  if (isPending) {
    return <ProjectsSkeletonCard projects={projectsResponse?.data} />;
  }

  if (isError) {
    return <ErrorMessage title="Oops..." Icon={CircleAlert} />;
  }

  return (
    <>
      <ProjectsBreadcrumb />
      <div className="flex flex-col border rounded-lg mt-48 mb-28 mx-8 p-4 backdrop-blur-sm bg-slate-900/20">
        <div className="flex flex-wrap sm:w-full gap-4">
          <ConditionalRenderer
            data={projectsResponse?.data}
            renderData={(projects) => (
              <ProjectsCard projects={projects as Project[]} />
            )}
            noResults={{
              title: "No projects found",
              description: "It looks like you haven't added any projects yet",
              Icon: BrickWall,
            }}
          />
        </div>
      </div>
    </>
  );
};
export default ProjectsTableBody;
