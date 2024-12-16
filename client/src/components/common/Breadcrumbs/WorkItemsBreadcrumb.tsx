//client\src\components\common\Breadcrumbs\WorkItemsBreadcrumb.tsx
import Breadcrumb from "./Breadcrumb";
import { useParams } from "react-router-dom";
import CreateWorkItem from "@/components/Forms/WorkItems/WorkItemFormCreate/CreateWorkItem";

type WorkItemsBreadcrumbProps = {};

const WorkItemsBreadcrumb = ({}: WorkItemsBreadcrumbProps) => {
  const { id, taskId } = useParams();

  return (
    <div className="fixed top-0 left-0 md:left-60 right-0 z-40 pt-5 mt-14 bg-transparent backdrop-blur-sm">
      <div className="my-4 mx-8 space-y-4">
        <Breadcrumb
          items={[
            {
              label: "Projects",
              href: "/projects"
            },
            {
              label: "Tasks",
              href: `/projects/${id}/tasks`
            },
            {
              label: "Work items",
              href: `/projects/${id}/tasks/${taskId}/work-items`
            }
          ]}
        />
      </div>
      <div className="flex flex-col border rounded-lg mx-8 space-y-4 p-4 backdrop-blur-sm bg-slate-900/20">
        <CreateWorkItem />
      </div>
    </div>
  );
};

export default WorkItemsBreadcrumb;
