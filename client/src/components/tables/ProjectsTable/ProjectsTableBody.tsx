// src/components/tables/ProjectsTable/ProjectsTableBody.tsx
import ProjectsSkeletonCard from "@/utils/SkeletonLoader/Projects/ProjectsSkeletonCard";
import { BrickWall, CircleAlert } from "lucide-react";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import { Project } from "@/types/project-types/projectTypes";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import { useGetPaginatedData } from "@/hooks/useQueryHook";
import ProjectsCard from "./ProjectsCard";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import useSearchHandler from "@/hooks/useSearchHandler";
import useSearchParamsHook from "@/hooks/useSearchParamsHook";
import CreateProject from "@/components/Forms/Projects/ProjectFormCreate/CreateProject";
import { useTranslation } from "react-i18next";
import Pagination from "@/components/common/Pagination/Pagination";
const ProjectsTableBody = () => {
  const { t } = useTranslation();
  const { setSearchParams, page, itemsLimit } = useSearchParamsHook();
  const { search, handleSearch, debounceSearchTerm } = useSearchHandler({ setSearchParams });

  const {
    data: projectsResponse,
    isPending,
    isError
  } = useGetPaginatedData<Project[]>({
    URL: "/projects/paginated",
    queryKey: ["projects"],
    page,
    limit: itemsLimit,
    search: debounceSearchTerm
  });

  console.log("Projects table response:", projectsResponse);

  const projects = projectsResponse?.data || [];
  const totalPages = projectsResponse?.totalPages || 0;

  if (isPending) {
    return <ProjectsSkeletonCard projects={projects as unknown as Project[]} />;
  }

  if (isError) {
    return <ErrorMessage title="Oops..." Icon={CircleAlert} />;
  }

  return (
    <div className="flex flex-col flex-1 py-8 items-center">
      <div className="flex flex-row justify-between w-full mb-4 px-4 xl:w-4/5 2xl:w-3/4 gap-4">
        <SearchBar handleSearch={handleSearch} placeholder={t("Search projects...")} search={search} />
        <CreateProject />
      </div>

      <div className="w-full px-4 xl:w-4/5 2xl:w-3/4">
        <div className="border rounded-lg p-6 backdrop-blur-sm bg-slate-900/20 min-h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ConditionalRenderer
              data={projects}
              renderData={projects => <ProjectsCard projects={projects as unknown as Project[]} />}
              noResults={{
                title: t("No projects found"),
                description: t("It seems you haven't added any projects yet"),
                Icon: BrickWall
              }}
            />
          </div>
        </div>
      </div>
      <Pagination totalPages={totalPages} page={page} setSearchParams={params => setSearchParams(params)} />
    </div>
  );
};

export default ProjectsTableBody;
