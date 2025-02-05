//client\src\utils\SkeletonLoader\Tasks\ProjectTasksSkeleton.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Task } from "@/types/task-types/taskTypes";

type TasksProps = {
  tasks: Task[] | undefined;
};
const ProjectTasksSkeleton = ({ tasks }: TasksProps) => {
  const taskLength = tasks ? tasks.length : 4;

  return (
    <>
      <div className="flex flex-col border rounded-lg mt-24 mx-8 space-y-4 p-4 backdrop-blur-sm project-cards-wrapper">
        <Skeleton className="md:w-full lg:max-w-[12rem] h-9" />
      </div>
      <div className="flex flex-col border rounded-lg mb-24 mt-8 md:mt-0 mx-8 p-4 backdrop-blur-sm project-cards-wrapper">
        <div className="flex flex-wrap sm:w-full gap-4">
          {Array.from({ length: taskLength }).map((_, index) => (
            <Card className="w-[300px]" key={index}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="w-full h-[1rem]" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <Skeleton className="w-1/2 h-[1rem]" />
                <Skeleton className="w-1/2 h-[1rem]" />
                <Skeleton className="w-1/2 h-[1rem]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectTasksSkeleton;
