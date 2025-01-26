// src/components/tables/ProjectsTable/ProjectsTableBody.tsx
import ProjectsSkeletonCard from "@/utils/SkeletonLoader/Projects/ProjectsSkeletonCard";
import { BrickWall, CircleAlert } from "lucide-react";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import { Project } from "@/types/project-types/projectTypes";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import ProjectsCard from "./ProjectsCard";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import useSearchHandler from "@/hooks/useSearchHandler";
import useSearchParamsHook from "@/hooks/useSearchParamsHook";
import CreateProject from "@/components/Forms/Projects/ProjectFormCreate/CreateProject";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const ProjectsTableBody = () => {
  const { t } = useTranslation();
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
    <div className="flex flex-col flex-1 py-8 items-center md:px-0">
      <div className="flex flex-row justify-between w-full mb-4 md:w-2/3 gap-4">
        <SearchBar handleSearch={handleSearch} placeholder={t("Search projects...")} search={search} />
        <CreateProject />
      </div>

      <div className="w-full md:w-2/3">
        <div className="border rounded-lg p-4 backdrop-blur-sm bg-slate-900/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <ConditionalRenderer
              data={projects}
              renderData={projects => <ProjectsCard projects={projects as Project[]} />}
              noResults={{
                title: t("No projects found"),
                description: t("It seems you haven't added any projects yet"),
                Icon: BrickWall
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTableBody;
