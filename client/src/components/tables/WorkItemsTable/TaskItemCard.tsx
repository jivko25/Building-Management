//client\src\components\tables\WorkItemsTable\TaskItemCard.tsx
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PaginatedWorkItems } from "@/types/work-item-types/workItem";
import { ClipboardList, DollarSign, Hammer, User } from "lucide-react";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

type TaskItemCardProps = {
  workItems: PaginatedWorkItems;
};

const TaskItemCard = ({ workItems }: TaskItemCardProps) => {
  const location = useLocation();
  const { task } = location.state || {};

  const taskDetails = useMemo(() => {

    if (!workItems || !Array.isArray(workItems.pages)) {
      console.error("Invalid workItems format:", workItems);
      return null;
    }

    const workItemsPages = workItems.pages.flatMap((page: any) => page.workItems || []);

    if (!workItemsPages.length) {
      return {
        taskName: task.name,
        artisanName: task.artisans.map((artisan: { name: any; }) => artisan.name).join(", "),
        measurePrice: task.price_per_measure,
        totalPrice: task.total_price,
        taskStatus: task.status,
        totalWork: task.total_work_in_selected_measure
      }
    }

    const taskNames = Array.from(new Set(workItemsPages.map(item => item.task?.name))).join(", ");
    const artisanNames = Array.from(
      new Set(
        workItemsPages.flatMap(item => item.task?.artisans.map((artisan: { name: any; }) => artisan.name))
      )
    ).join(", ");
    const measurePrices = Array.from(new Set(workItemsPages.map(item => item.task?.price_per_measure))).join(", ");
    const totalWorks = Array.from(new Set(workItemsPages.map(item => item.task?.total_work_in_selected_measure))).join(", ");
    const totalPrices = Array.from(new Set(workItemsPages.map(item => item.task?.total_price))).join(", ");
    const taskStatuses = Array.from(new Set(workItemsPages.map(item => item.task?.status)));

    return {
      taskName: taskNames,
      artisanName: artisanNames,
      measurePrice: measurePrices,
      totalPrice: totalPrices,
      taskStatus: taskStatuses,
      totalWork: totalWorks,
    };
  }, [workItems]);

  return (
    <>
      {taskDetails && (
        <div className="flex flex-col mt-44 border rounded-lg mx-8 space-y-4 p-4 backdrop-blur-sm bg-slate-900/20">
          <h1 className="text-2xl font-bold mb-2 text-foreground text-center motion-preset-shrink motion-duration-1000">{taskDetails.taskName}</h1>
          <Separator />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                Task name
              </Label>
              <div className="relative">
                <ClipboardList size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={`${taskDetails.taskName}`} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                Artisan name
              </Label>
              <div className="relative">
                <User size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={`${taskDetails.artisanName}`} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                Measure price
              </Label>
              <div className="relative">
                <DollarSign size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={`${taskDetails.measurePrice}`} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                Total price
              </Label>
              <div className="relative">
                <DollarSign size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={`${taskDetails.totalPrice}`} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="text" className="font-bold text-md">
                Total work
              </Label>
              <div className="relative">
                <Hammer size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Separator className="absolute left-8 top-1/2 transform -translate-y-1/2" orientation="vertical" />
                <Input disabled type="text" placeholder={`${taskDetails.totalWork}`} className="mt-2 pl-10" />
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center text-center justify-center">
              <Label htmlFor="text" className="font-bold text-md">
                Project status
              </Label>
              <Badge
                className={`px-4 text-sm rounded-full 
                                ${taskDetails.taskStatus.toString() === "active" ? "text-green-500" : "text-red-500"}`}
                variant="outline">
                {taskDetails.taskStatus}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItemCard;
