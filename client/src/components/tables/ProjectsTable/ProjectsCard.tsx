// src/components/tables/ProjectsTable/ProjectsCard.tsx
import EditProject from "@/components/Forms/Projects/ProjectFormEdit/EditProject";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/types/project-types/projectTypes";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type CardFormProps = {
  projects: Project[];
};

const ProjectsCard = ({ projects }: CardFormProps) => {
  const { t } = useTranslation();

  return (
    <>
      {projects.map(project => (
        <Card className="w-full sm:w-full md:w-full lg:max-w-[21rem] shadow-md shadow-slate-700/20 transition duration-300 ease-in-out hover:shadow-md dark:hover:shadow-slate-700/40 project-card" key={project.id}>
          <CardHeader className="bg-header rounded-t-lg p-3">
            <CardTitle className="text-lg">
              <Link to={`/projects/${project.id}/tasks`} className="transition duration-300 ease-in-out hover:text-slate-400">
                {project.name}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <CardDescription className="break-words">
              <span className="font-semibold pr-1 text-black">{t("Address")} </span>
              <span>{project.address}</span>
            </CardDescription>

            <CardDescription>
              <span className="font-semibold pr-1 text-black">{t("Location")} </span>
              <span>{project.location}</span>
            </CardDescription>
            <CardDescription>
              <span className="font-semibold pr-1 text-black">{t("Deadline")} </span>
              <span>{new Date(project.end_date!).toLocaleDateString().slice(0, 10)}</span>
            </CardDescription>
            <CardDescription>
              <span className="font-semibold pr-1 text-black">{t("Status")} </span>
              <span>{project.status}</span>
            </CardDescription>
            <CardDescription>
              <span className="font-semibold pr-1 text-black">{t("Company")} </span>
              <span>{project.company_name}</span>
            </CardDescription>
            <CardDescription>
              <span className="font-semibold pr-1 text-black">{t("Client")} </span>
              <span>{project.client_company_name}</span>
            </CardDescription>
          </CardContent>

          <CardFooter className="p-1 justify-center items-center rounded-b-lg border-t">
            <EditProject projectId={project.id!} />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default ProjectsCard;
