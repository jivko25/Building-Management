//client\src\components\common\Breadcrumbs\TasksBreadcrumb.tsx
import CreateTask from "@/components/Forms/Tasks/TaskFormCreate/CreateTask";
import { useParams } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";

const TasksBreadcrumbs = () => {
  const { id } = useParams();

  return (
    <div className="fixed top-0 left-0 md:left-60 right-0 z-40 pt-5 mt-14 bg-transparent backdrop-blur-sm">
      <div className="my-4 mx-8 space-y-4 px-4">
        <Breadcrumb
          items={[
            {
              label: "Projects",
              href: "/projects"
            },
            {
              label: "Tasks",
              href: `/projects/${id}/tasks`
            }
          ]}
        />
      </div>
      <div className="flex flex-col border rounded-lg mx-8 space-y-4 p-4 backdrop-blur-sm bg-slate-900/20">
        <CreateTask />
      </div>
    </div>
  );
};

export default TasksBreadcrumbs;
