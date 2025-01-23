//client\src\components\tables\WorkItemsTable\WorkItemsTableBody.tsx
import { useGetInfiniteData } from "@/hooks/useQueryHook";
import { ChevronDown, CircleAlert, ClipboardList } from "lucide-react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { PaginatedWorkItems } from "@/types/work-item-types/workItem";
import { useEffect } from "react";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import WorkItemsBreadcrumb from "@/components/common/Breadcrumbs/WorkItemsBreadcrumb";
import TaskItemCard from "@/components/tables/WorkItemsTable/TaskItemCard";
import WorkItemCard from "@/components/tables/WorkItemsTable/WorkItemCard";

const WorkItemsTableBody = () => {
  const { ref, inView } = useInView();
  const { id, taskId } = useParams();

  const {
    data: workItems,
    fetchNextPage,
    isFetchingNextPage,
    isPending,
    isError
  } = useGetInfiniteData<PaginatedWorkItems>({
    URL: `/projects/${id}/tasks/${taskId}`,
    queryKey: ["projects", id, "tasks", taskId, "work-items"]
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (isError) {
    return <ErrorMessage title="Oops..." Icon={CircleAlert} />;
  }

  return (
    <>
      <WorkItemsBreadcrumb />
      <TaskItemCard workItems={workItems as PaginatedWorkItems} />
      <div className="flex flex-col items-center justify-center">
        <span className="text-2xl pt-5">Work items</span>
        <ChevronDown className="motion-preset-oscillate motion-duration-2000 motion-loop-twice" />
      </div>
      <div className="flex flex-col border rounded-lg mb-20 mt-5 md:mt-0 mx-8 p-4 backdrop-blur-sm bg-slate-900/20">
        <div className="flex flex-wrap sm:w-full gap-4">
          <ConditionalRenderer
            data={workItems as PaginatedWorkItems}
            renderData={workItems => <WorkItemCard workItems={workItems as PaginatedWorkItems} />}
            noResults={{
              title: "No work items found",
              description: "It looks like you haven't added any work items yet",
              Icon: ClipboardList
            }}
          />
        </div>
      </div>
      <div ref={ref}>{isFetchingNextPage || isPending}</div>
    </>
  );
};

export default WorkItemsTableBody;
