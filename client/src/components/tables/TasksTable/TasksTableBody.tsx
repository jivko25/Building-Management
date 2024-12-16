//client\src\components\tables\TasksTable\TasksTableBody.tsx
import { useParams } from "react-router-dom";
import ProjectTasksSkeleton from "@/utils/SkeletonLoader/Tasks/ProjectTasksSkeleton";
import { CircleAlert, ClipboardList } from "lucide-react";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import { Task } from "@/types/task-types/taskTypes";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import TasksCard from "@/components/tables/TasksTable/TasksCard";
import TasksBreadcrumbs from "@/components/common/Breadcrumbs/TasksBreadcrumb";

const ProjectsTasksBody = () => {
  const { id } = useParams();

  const {
    data: tasks,
    isPending,
    isError
  } = useFetchDataQuery<Task[]>({
    URL: `/projects/${id}/tasks`,
    queryKey: ["projects", id, "tasks"],
    options: {
      staleTime: 0
    }
  });

  if (isPending) {
    return <ProjectTasksSkeleton tasks={tasks} />;
  }

  if (isError) {
    return <ErrorMessage title="Oops..." Icon={CircleAlert} />;
  }

  return (
    <>
      <TasksBreadcrumbs />
      <div className="flex flex-col border rounded-lg mt-48 mb-28 mx-8 p-4 backdrop-blur-sm bg-slate-900/20">
        <div className="flex flex-wrap sm:w-full gap-4">
          <ConditionalRenderer
            data={tasks}
            renderData={tasks => <TasksCard tasks={tasks as Task[]} id={id!} />}
            noResults={{
              title: "No tasks found",
              description: "It looks like you haven't added any tasks yet.",
              Icon: ClipboardList
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ProjectsTasksBody;
