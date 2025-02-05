import { useParams } from "react-router-dom";
import ProjectTasksSkeleton from "@/utils/SkeletonLoader/Tasks/ProjectTasksSkeleton";
import { CircleAlert, ClipboardList } from "lucide-react";
import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import { Task } from "@/types/task-types/taskTypes";
import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import TasksCard from "@/components/tables/TasksTable/TasksCard";
import TasksBreadcrumbs from "@/components/common/Breadcrumbs/TasksBreadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProjectGallery from "../ProjectsTable/ProjectGalery";
import { WeeklyReportTable } from "@/components/reports/WeeklyReportTable";

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
      <div className="flex flex-col border rounded-lg mt-48 mb-28 mx-8 p-4 backdrop-blur-sm project-cards-wrapper">
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks">
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
          </TabsContent>
          <TabsContent value="images">
            <ProjectGallery />
          </TabsContent>
          <TabsContent value="reports">
            <WeeklyReportTable 
              projectId={id!} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProjectsTasksBody;