// src/components/tables/ProjectsTable/ProjectsTableBody.tsx
import ProjectsSkeletonCard from "@/utils/SkeletonLoader/Projects/ProjectsSkeletonCard";
import { BrickWall, CircleAlert } from "lucide-react";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import { Project } from "@/types/project-types/projectTypes";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import ProjectsCard from "./ProjectsCard";
import ProjectsBreadcrumb from "@/components/common/Breadcrumbs/ProjectsBreadcrumb";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import useSearchHandler from "@/hooks/useSearchHandler";
import useSearchParamsHook from "@/hooks/useSearchParamsHook";
import CreateProject from "@/components/Forms/Projects/ProjectFormCreate/CreateProject";

const ProjectsTableBody = () => {
  const { setSearchParams } = useSearchParamsHook();

  const { search, handleSearch, debounceSearchTerm } = useSearchHandler({
    setSearchParams
  });

  const {
    data: projects,
    isPending,
    isError
  } = useFetchDataQuery<Project[]>({
    URL: `/projects${debounceSearchTerm ? `?search=${debounceSearchTerm}` : ""}`,
    queryKey: ["projects", debounceSearchTerm]
  });

  if (isPending) {
    return <ProjectsSkeletonCard projects={projects} />;
  }

  if (isError) {
    return <ErrorMessage title="Oops..." Icon={CircleAlert} />;
  }

  return (
    <>
      <ProjectsBreadcrumb />
      <div className="flex flex-col border rounded-lg mt-48 mb-28 mx-8 p-4 backdrop-blur-sm bg-slate-900/20">
        <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full mb-4 justify-between">
          <SearchBar handleSearch={handleSearch} placeholder="Търсене на проекти..." search={search} />
          <div className="flex justify-end">
            <CreateProject />
          </div>
        </div>
        <div className="flex flex-wrap sm:w-full gap-4">
          <ConditionalRenderer
            data={projects}
            renderData={projects => <ProjectsCard projects={projects as Project[]} />}
            noResults={{
              title: "Няма намерени проекти",
              description: "Изглежда все още не сте добавили проекти",
              Icon: BrickWall
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ProjectsTableBody;
