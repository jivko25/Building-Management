//client\src\components\Forms\UserWorkItem\InformationCards\ProjectInformationCard.tsx
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProjectTask } from "@/types/task-types/taskTypes";
import { format } from "date-fns";
import { Building, Calendar, ClipboardList, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const ProjectInformationCard = ({ project }: { project: ProjectTask }) => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    title: {
      project: "Project name",
    },
    labels: {
      projectName: "Project name",
      companyName: "Company name",
      projectAddress: "Project address",
      projectLocation: "Project location",
      projectStartDate: "Project start date",
      projectEndDate: "Project end date",
      projectStatus: "Project status"
    }
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: {
          project: await translate("Project name"),
        },
        labels: {
          projectName: await translate("Project name"),
          companyName: await translate("Company name"),
          projectAddress: await translate("Project address"),
          projectLocation: await translate("Project location"),
          projectStartDate: await translate("Project start date"),
          projectEndDate: await translate("Project end date"),
          projectStatus: await translate("Project status")
        }
      });
    };
    loadTranslations();
  }, [translate]);

  return (
    <>
      {project && (
        <div className="flex flex-col mt-44 border rounded-lg mx-8 space-y-4 p-4 backdrop-blur-sm bg-slate-900/20">
          <h1 className="text-2xl font-bold mb-2 text-foreground text-center motion-preset-shrink motion-duration-1000">
            {translations.title.project} <br />
            {project.taskProjectData.project_name}
          </h1>
          <Separator />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                {translations.labels.projectName}
              </Label>
              <div className="relative">
                <ClipboardList size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={project.taskProjectData.project_name} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                {translations.labels.companyName}
              </Label>
              <div className="relative">
                <Building size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={project.taskProjectData.project_company_name} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                {translations.labels.projectAddress}
              </Label>
              <div className="relative">
                <MapPin size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={project.taskProjectData.project_address} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                {translations.labels.projectLocation}
              </Label>
              <div className="relative">
                <MapPin size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={project.taskProjectData.project_location} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                {translations.labels.projectStartDate}
              </Label>
              <div className="relative">
                <Calendar size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={format(project.taskProjectData.project_start_date as string, "PPP")} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                {translations.labels.projectEndDate}
              </Label>
              <div className="relative">
                <Calendar size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={format(project.taskProjectData.project_end_date as string, "PPP")} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center text-center justify-center">
              <Label htmlFor="text" className="font-bold text-md">
                {translations.labels.projectStatus}
              </Label>
              <Badge
                className={`px-4 text-sm rounded-full 
                                ${project.taskProjectData.project_status === "active" ? "text-green-500" : "text-red-500"}`}
                variant="outline">
                {project.taskProjectData.project_status}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectInformationCard;
