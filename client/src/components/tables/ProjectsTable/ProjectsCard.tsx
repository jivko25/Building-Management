// src/components/tables/ProjectsTable/ProjectsCard.tsx
import EditProject from "@/components/Forms/Projects/ProjectFormEdit/EditProject";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/types/project-types/projectTypes";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type CardFormProps = {
  projects: Project[];
};

const ProjectsCard = ({ projects }: CardFormProps) => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    address: "Address",
    location: "Location",
    deadline: "Deadline",
    status: "Status",
    company: "Company"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        address: await translate("Address"),
        location: await translate("Location"),
        deadline: await translate("Deadline"),
        status: await translate("Status"),
        company: await translate("Company")
      });
    };
    loadTranslations();
  }, [translate]);

  return (
    <>
      {projects.map(project => (
        <Card className="w-full sm:w-full md:w-full lg:max-w-[21rem] shadow-md shadow-slate-700/20 transition duration-300 ease-in-out hover:shadow-md dark:hover:shadow-slate-700/40" key={project.id}>
          <CardHeader className="bg-header rounded-t-lg p-5">
            <CardTitle>
              <Link to={`/projects/${project.id}/tasks`} className="transition duration-300 ease-in-out hover:text-slate-400">
                {project.name}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <CardDescription className="break-words">
              <span className="font-semibold pr-1">{translations.address}:</span>
              <span>{project.address}</span>
            </CardDescription>
            <CardDescription>
              <span className="font-semibold pr-1">{translations.location}:</span>
              <span>{project.location}</span>
            </CardDescription>
            <CardDescription>
              <span className="font-semibold pr-1">{translations.deadline}:</span>
              <span>{new Date(project.end_date!).toLocaleDateString().slice(0, 10)}</span>
            </CardDescription>
            <CardDescription>
              <span className="font-semibold pr-1">{translations.status}:</span>
              <span>{project.status}</span>
            </CardDescription>
            <CardDescription>
              <span className="font-semibold pr-1">{translations.company}:</span>
              <span>{project.company_name}</span>
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
