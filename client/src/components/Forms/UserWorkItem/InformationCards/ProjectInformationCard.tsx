//client\src\components\Forms\UserWorkItem\InformationCards\ProjectInformationCard.tsx
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProjectTask } from "@/types/task-types/taskTypes";
import { format } from "date-fns";
import { Building, Calendar, ClipboardList, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
const ProjectInformationCard = ({ project }: { project: ProjectTask }) => {
  const { t } = useTranslation();
  return (
    <>
      {project && (
        <div className="flex flex-col mt-44 border rounded-lg mx-8 space-y-4 p-4 backdrop-blur-sm project-cards-wrapper">
          <h1 className="text-2xl font-bold mb-2 text-foreground text-center motion-preset-shrink motion-duration-1000">
            {t("Project name")} <br />
            {project.taskProjectData.project_name}
          </h1>
          <Separator />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                {t("Project name")}
              </Label>
              <div className="relative">
                <ClipboardList size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={project.taskProjectData.project_name} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                {t("Company name")}
              </Label>
              <div className="relative">
                <Building size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={project.taskProjectData.project_company_name} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                {t("Project address")}
              </Label>
              <div className="relative">
                <MapPin size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={project.taskProjectData.project_address} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                {t("Project location")}
              </Label>
              <div className="relative">
                <MapPin size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={project.taskProjectData.project_location} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                {t("Project start date")}
              </Label>
              <div className="relative">
                <Calendar size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={project.taskProjectData.project_start_date ? format(new Date(project.taskProjectData.project_start_date), "PPP") : t("No start date available")  } className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                {t("Project end date")}
              </Label>
              <div className="relative">
                <Calendar size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={project.taskProjectData.project_end_date ? format(new Date(project.taskProjectData.project_end_date), "PPP") : t("No start date available")  } className="mt-2 pl-10" />
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center text-center justify-center">
              <Label htmlFor="text" className="font-bold text-md">
                {t("Project status")}
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
