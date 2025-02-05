//client\src\components\tables\UserProjectTaskTable\UserProjectTaskTableBody.tsxlient\src\components\tables\UserProjectTaskTable\UserProjectTaskTableBody.tsx
import ProjectInformationCard from "@/components/Forms/UserWorkItem/InformationCards/ProjectInformationCard";
import TaskInformationCard from "@/components/Forms/UserWorkItem/InformationCards/TaskInformationCard";
import { ChevronDown, ClipboardList } from "lucide-react";
import { ProjectTask } from "@/types/task-types/taskTypes";
import { useParams } from "react-router-dom";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import UserProjectWorkItemsList from "./UserProjectWorkItemsList";
import UserProjectBreadcrumb from "@/components/common/Breadcrumbs/UserProjectBreadcrumb";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import { WorkItem } from "@/types/work-item-types/workItem";

const UserProjectTaskTableBody = () => {
  const { taskId } = useParams<{ taskId: string }>();

  const { data: task } = useFetchDataQuery<ProjectTask>({
    URL: `/my-projects/${taskId}/task`,
    queryKey: ["artisanTasks", taskId],
    options: {
      staleTime: 0
    }
  });

  return (
    <>
      <UserProjectBreadcrumb taskId={taskId!} projectId={task?.taskProjectData?.project_id as string}/>
      <ProjectInformationCard project={task?.project! as any} />
      <TaskInformationCard project={task!} />
      <div className="flex flex-col items-center justify-center">
        <span className="text-2xl pt-5">Work items</span>
        <ChevronDown className="motion-preset-oscillate motion-duration-2000 motion-loop-twice" />
      </div>
      <div className="flex flex-col border rounded-lg mb-20 mt-5 md:mt-0 mx-8 p-4 backdrop-blur-sm project-cards-wrapper">
        <div className="flex flex-wrap sm:w-full gap-4">
          <ConditionalRenderer
            data={task?.workItemsData}
            renderData={workItems => <UserProjectWorkItemsList workItemsData={workItems as WorkItem[]} />}
            noResults={{
              title: "No work items found",
              description: "It looks like you haven't added any work items yet",
              Icon: ClipboardList
            }}
          />
        </div>
      </div>
    </>
  );
};

export default UserProjectTaskTableBody;
