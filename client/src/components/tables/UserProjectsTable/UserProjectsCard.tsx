//client\src\components\tables\UserProjectsTable\UserProjectsCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/types/task-types/taskTypes";
import { Link } from "react-router-dom";

type UserProjectsCardProps = {
  tasks: Task[];
};

const UserProjectsCard = ({ tasks }: UserProjectsCardProps) => {
  return (
    <>
      {tasks.map(task => (
        <Card className="w-full sm:w-full md:w-full lg:max-w-[21rem] shadow-md shadow-slate-700/20 transition duration-300 ease-in-out hover:shadow-md dark:hover:shadow-slate-700/40" key={task.id}>
          <CardHeader className="bg-header rounded-t-lg p-5">
            <CardTitle>
              <Link to={`/my-projects/${task.id}/task`} className="transition duration-300 ease-in-out hover:text-slate-400">
                {task.name}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <CardDescription className="break-words">
              <span className="font-semibold pr-1">Start date:</span>
              <span>{new Date(task.start_date!).toLocaleDateString().slice(0, 10)}</span>
            </CardDescription>
            <CardDescription>
              <span className="font-semibold pr-1">End date:</span>
              <span>{new Date(task.end_date!).toLocaleDateString().slice(0, 10)}</span>
            </CardDescription>
            <CardDescription>
              <span className="font-semibold pr-1">Task status:</span>
              <span>{task.status}</span>
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default UserProjectsCard;
