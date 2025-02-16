//client\src\components\Forms\UserWorkItem\InformationCards\TaskInformationCard.tsx
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProjectTask } from "@/types/task-types/taskTypes";
import { format } from "date-fns";
import { Calendar, DollarSign, Hammer } from "lucide-react";

const TaskInformationCard = ({ project }: { project: ProjectTask }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return format(date, "PPP");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <>
      {project && (
        <div className="flex flex-col mt-10 border rounded-lg mx-8 space-y-4 p-4 backdrop-blur-sm project-cards-wrapper">
          <h1 className="text-2xl font-bold mb-2 text-foreground text-center motion-preset-shrink motion-duration-1000">
            Task name <br />
            {project.taskProjectData.name}
          </h1>
          <Separator />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                Measure price
              </Label>
              <div className="relative">
                <DollarSign size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={project.taskProjectData.price_per_measure as string} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                Total work
              </Label>
              <div className="relative">
                <Hammer size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={project.taskProjectData.total_work_in_selected_measure as string} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                Start date
              </Label>
              <div className="relative">
                <Calendar size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input 
                  disabled 
                  type="text" 
                  placeholder={formatDate(project.taskProjectData.start_date as string)} 
                  className="mt-2 pl-10" 
                />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                End date
              </Label>
              <div className="relative">
                <Calendar size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input 
                  disabled 
                  type="text" 
                  placeholder={formatDate(project.taskProjectData.end_date as string)} 
                  className="mt-2 pl-10" 
                />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                Total price
              </Label>
              <div className="relative">
                <DollarSign size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={project.taskProjectData.total_price as string} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center text-center justify-center">
              <Label htmlFor="text" className="font-bold text-md">
                Task status
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

export default TaskInformationCard;
