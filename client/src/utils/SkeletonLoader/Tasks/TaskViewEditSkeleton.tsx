//client\src\utils\SkeletonLoader\Tasks\TaskViewEditSkeleton.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const TaskViewEditSkeleton = () => {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="h-8 w-[15rem] mb-7" />
      <div className="grid md:grid-cols-2 gap-20">
        {/* Task information skeleton card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[12rem] mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-5 w-1/4 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Separator />
            <div>
              <Skeleton className="h-5 w-1/4 mb-2" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            <Separator />
            <div>
              <Skeleton className="h-5 w-1/4 mb-2" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            <Separator />
            <div>
              <Skeleton className="h-5 w-1/4 mb-2" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            <Separator />
            <div className="flex items-center pt-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-[14rem] ml-2" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-[14rem] ml-2" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-[10rem] ml-2" />
            </div>
          </CardContent>
        </Card>

        {/* Edit task card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[8rem] mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="flex flex-col flex-wrap pt-1 sm:flex-row sm:flex-1 sm:justify-between">
              <div className="pb-4">
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-9 w-[14rem]" />
              </div>
              <div>
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-9 w-[14rem]" />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row flex-1 justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[5rem]" />
                <Skeleton className="h-9 w-[8rem]" />
                <Skeleton className="h-4 w-[5rem]" />
                <Skeleton className="h-9 w-[8rem]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[5rem]" />
                <Skeleton className="h-9 w-[8rem]" />
                <Skeleton className="h-4 w-[5rem]" />
                <Skeleton className="h-9 w-[8rem]" />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-[5rem]" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="w-full h-9" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskViewEditSkeleton;
