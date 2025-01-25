//client\src\components\tables\WorkItemsTable\WorkItemsTableBody.tsx
import { useFetchDataQuery, useGetInfiniteData } from "@/hooks/useQueryHook";
import { ChevronDown, CircleAlert, ClipboardList } from "lucide-react";
import { useParams } from "react-router-dom";
import WorkItemsBreadcrumb from "@/components/common/Breadcrumbs/WorkItemsBreadcrumb";
import TaskItemCard from "@/components/tables/WorkItemsTable/TaskItemCard";
import WorkItemCard from "@/components/tables/WorkItemsTable/WorkItemCard";

const WorkItemsTableBody = () => {
  const { id, taskId } = useParams();

  const { data: workItems } = useFetchDataQuery<any>({
    URL: `/projects/${id}/tasks/${taskId}/work-items`,
    queryKey: ["projects", id, "tasks", taskId, "work-items"],
    options: {
      staleTime: 0
    }
  });

  return (
    <>
      <WorkItemsBreadcrumb />
      <TaskItemCard task={workItems.task as any} />
      <div className="flex flex-col items-center justify-center mt-10">
        <span className="text-2xl pt-5">Work items</span>
        <ChevronDown className="motion-preset-oscillate motion-duration-2000 motion-loop-twice" />
      </div>
      <div className="flex flex-col border rounded-lg mb-20 mt-5 md:mt-0 mx-8 p-4 backdrop-blur-sm bg-slate-900/20">
        <div className="flex flex-wrap sm:w-full gap-4">
          <WorkItemCard workItemsData={workItems as any} />
        </div>
      </div>
    </>
  );
};

export default WorkItemsTableBody;
