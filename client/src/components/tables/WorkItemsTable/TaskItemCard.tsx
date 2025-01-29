import React, { useState, useEffect, useMemo } from "react";
import { Chart } from "primereact/chart";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardList, DollarSign, Hammer, User } from "lucide-react";

type TaskItemCardProps = {
  task: {
    id: number;
    project_id: number;
    name: string;
    activity_id: number;
    measure_id: number;
    total_price: string;
    total_work_in_selected_measure: string;
    completedWork: string;
    start_date: string;
    end_date: string;
    note: string;
    status: string;
    artisans: Array<{
      id: number;
      name: string;
      note: string;
      number: string;
      email: string;
      company_id: number;
      user_id: number;
      status: string;
      activity_id: number | null;
      measure_id: number | null;
      default_pricing_id: number | null;
      creator_id: number;
    }>;
  };
};

const TaskItemCard = ({ task }: TaskItemCardProps) => {
  const taskDetails = useMemo(() => {
    const artisanNames = Array.from(
      new Set(task?.artisans.map((artisan) => artisan.name))
    ).join(", ");
    const taskStatuses = task?.status;

    return {
      taskName: task?.name,
      artisanName: artisanNames,
      measurePrice: task?.total_price,
      totalPrice: task?.total_price,
      taskStatus: taskStatuses,
      totalWork: Math.ceil(+task?.total_work_in_selected_measure || 0),
      completedWork: Math.ceil(+task?.completedWork || 0),
    };
  }, [task]);

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const remainingWork = taskDetails.totalWork - taskDetails.completedWork;

    const data = {
      labels: ["Completed Work", "Remaining Work"],
      datasets: [
        {
          data: [taskDetails.completedWork, remainingWork > 0 ? remainingWork : 0],
          backgroundColor: [
            documentStyle.getPropertyValue("--green-500"),
            documentStyle.getPropertyValue("--red-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--red-400"),
          ],
        },
      ],
    };

    const options = {
      cutout: "60%",
    };

    setChartData(data);
    setChartOptions(options);
  }, [taskDetails]);

  return (
    <>
      {taskDetails && (
        <div className="flex flex-col mt-44 border rounded-lg mx-8 space-y-4 p-4 backdrop-blur-sm bg-slate-900/20">
          <h1 className="text-2xl font-bold mb-4 text-foreground text-center motion-preset-shrink motion-duration-1000">
            {taskDetails.taskName}
          </h1>
          <Separator />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Лявата част: Графиката */}
            <div className="flex justify-center items-center">
              <div className="card flex justify-content-center">
                <Chart
                  type="doughnut"
                  data={chartData}
                  options={chartOptions}
                  className="w-full md:w-30rem"
                />
              </div>
            </div>
            {/* Дясната част: Полетата */}
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <Label htmlFor="text" className="font-bold text-md">
                  Task name
                </Label>
                <div className="relative">
                  <ClipboardList
                    size={15}
                    className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500"
                  />
                  <Separator
                    className="absolute left-8 top-1/2 transform -translate-y-1/2"
                    orientation="vertical"
                  />
                  <Input
                    disabled
                    type="text"
                    placeholder={`${taskDetails.taskName}`}
                    className="mt-2 pl-10"
                  />
                </div>
              </div>
              <div className="relative">
                <Label htmlFor="text" className="font-bold text-md">
                  Artisan name
                </Label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500"
                  />
                  <Separator
                    className="absolute left-8 top-1/2 transform -translate-y-1/2"
                    orientation="vertical"
                  />
                  <Input
                    disabled
                    type="text"
                    placeholder={`${taskDetails.artisanName}`}
                    className="mt-2 pl-10"
                  />
                </div>
              </div>
              <div className="relative">
                <Label htmlFor="text" className="font-bold text-md">
                  Measure price
                </Label>
                <div className="relative">
                  <DollarSign
                    size={15}
                    className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500"
                  />
                  <Separator
                    className="absolute left-8 top-1/2 transform -translate-y-1/2"
                    orientation="vertical"
                  />
                  <Input
                    disabled
                    type="text"
                    placeholder={`${taskDetails.measurePrice}`}
                    className="mt-2 pl-10"
                  />
                </div>
              </div>
              <div className="relative">
                <Label htmlFor="text" className="font-bold text-md">
                  Total work
                </Label>
                <div className="relative">
                  <Hammer
                    size={15}
                    className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500"
                  />
                  <Separator
                    className="absolute left-8 top-1/2 transform -translate-y-1/2"
                    orientation="vertical"
                  />
                  <Input
                    disabled
                    type="text"
                    placeholder={`${taskDetails.totalWork}`}
                    className="mt-2 pl-10"
                  />
                </div>
              </div>
              <div className="relative">
                <Label htmlFor="text" className="font-bold text-md">
                  Completed work
                </Label>
                <div className="relative">
                  <Hammer
                    size={15}
                    className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500"
                  />
                  <Separator
                    className="absolute left-8 top-1/2 transform -translate-y-1/2"
                    orientation="vertical"
                  />
                  <Input
                    disabled
                    type="text"
                    placeholder={`${taskDetails.completedWork}`}
                    className="mt-2 pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center text-center justify-center">
                <Label htmlFor="text" className="font-bold text-md">
                  Project status
                </Label>
                <Badge
                  className={`px-4 text-sm rounded-full 
                                ${
                                  taskDetails.taskStatus === "active"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                  variant="outline"
                >
                  {taskDetails.taskStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItemCard;
