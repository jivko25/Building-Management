import EditTask from '@/components/Forms/Tasks/TaskFormEdit/EditTask';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Task } from '@/types/task-types/taskTypes';
import { Link } from 'react-router-dom';

type TasksCardProps = {
    tasks: Task[];
    id: string;
};

const TasksCard = ({ tasks, id }: TasksCardProps) => {
    return (
        <>
            {tasks.map((task) => (
                <Card
                    className='w-full sm:w-full md:w-full lg:max-w-[21rem] shadow-md shadow-slate-700/20 transition duration-300 ease-in-out hover:shadow-md dark:hover:shadow-slate-700/40'
                    key={task.id}
                >
                    <CardHeader className='bg-header rounded-t-lg p-5'>
                        <CardTitle>
                            <Link
                                to={`/projects/${id}/tasks/${task.id}/work-items`}
                                className='transition duration-300 ease-in-out hover:text-slate-400'
                            >
                                {task.name}
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='p-5'>
                        <CardDescription className='break-words'>
                            <span className='font-semibold pr-1'>
                                Start date:
                            </span>
                            <span>
                                {new Date(task.start_date!)
                                    .toLocaleDateString()
                                    .slice(0, 10)}
                            </span>
                        </CardDescription>
                        <CardDescription>
                            <span className='font-semibold pr-1'>
                                End date:
                            </span>
                            <span>
                                {new Date(task.end_date!)
                                    .toLocaleDateString()
                                    .slice(0, 10)}
                            </span>
                        </CardDescription>
                        <CardDescription>
                            <span className='font-semibold pr-1'>
                                Task status:
                            </span>
                            <span>{task.status}</span>
                        </CardDescription>
                    </CardContent>
                    <CardFooter className='p-1 justify-center items-center rounded-b-lg border-t'>
                        <EditTask id={id} taskId={task.id!} />
                    </CardFooter>
                </Card>
            ))}
        </>
    );
};

export default TasksCard;
