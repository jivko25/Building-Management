//client\src\components\common\Breadcrumbs\TasksEditBreadcrumbs.tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

type TasksEditBreadcrumbsProps = {
  id: string;
  taskId: string;
};

const TasksEditBreadcrumbs = ({ id, taskId }: TasksEditBreadcrumbsProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="text-base">
          <BreadcrumbLink asChild>
            <Link to="/projects">Projects</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="[&>svg]:size-5" />
        <BreadcrumbItem className="text-base">
          <BreadcrumbLink asChild>
            <Link to={`/projects/${id}`}>{id}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="[&>svg]:size-5" />
        <BreadcrumbItem className="text-base">
          <BreadcrumbLink asChild>
            <Link to={`/projects/${id}/tasks`}>Tasks</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="[&>svg]:size-5" />
        <BreadcrumbItem className="text-base">
          <BreadcrumbLink asChild>
            <Link to={`/projects/${id}/tasks/${taskId}`}>{taskId}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="[&>svg]:size-5" />
        <BreadcrumbItem className="text-base">
          <BreadcrumbLink asChild>
            <Link to={`/projects/${id}/tasks/${taskId}/edit`}>Edit</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default TasksEditBreadcrumbs;
