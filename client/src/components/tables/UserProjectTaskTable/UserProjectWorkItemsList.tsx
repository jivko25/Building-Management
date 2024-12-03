import UserWorkItemEdit from '@/components/Forms/UserWorkItem/UserWorkItemFormEdit/UserWorkItemEdit';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WorkItem } from '@/types/work-item-types/workItem';
import { format } from 'date-fns';

interface UserProjectWorkItemsListProps {
    workItemsData: WorkItem[];
}

const UserProjectWorkItemsList = ({
    workItemsData,
}: UserProjectWorkItemsListProps) => {
    return (
        <>
            {workItemsData &&
                workItemsData.map((workItem) => (
                    <Card
                        className='w-full sm:w-full md:w-full lg:max-w-[24rem] shadow-md shadow-slate-700/20 transition duration-300 ease-in-out hover:shadow-md dark:hover:shadow-slate-700/40 motion-preset-pop motion-duration-700'
                        key={workItem.id}
                    >
                        <CardHeader className='px-6 py-4'>
                            <div className='flex items-center justify-between gap-4'>
                                <CardTitle>{workItem.name}</CardTitle>
                                <Badge
                                    className={`${
                                        workItem.status === 'done'
                                            ? 'bg-green-500 hover:bg-green-700'
                                            : 'bg-orange-500 hover:bg-orange-700'
                                    } text-white transition-colors duration-200 rounded-full`}
                                >
                                    {workItem.status === 'done'
                                        ? 'Done'
                                        : 'In progress'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className='p-6'>
                            <div className='flex flex-col lg:flex-row gap-2 justify-between text-sm text-muted-foreground'>
                                <div className=''>
                                    <div>
                                        Start:{' '}
                                        {format(
                                            new Date(workItem.start_date!),
                                            'PP'
                                        )}
                                    </div>
                                    <div>
                                        End:{' '}
                                        {format(
                                            new Date(workItem.end_date!),
                                            'PP'
                                        )}
                                    </div>
                                </div>
                                <div className='flex items-end'></div>
                            </div>
                        </CardContent>
                        <Separator />
                        <CardFooter className='flex flex-1 justify-evenly'>
                            <UserWorkItemEdit workItemId={workItem.id} />
                        </CardFooter>
                    </Card>
                ))}
        </>
    );
};

export default UserProjectWorkItemsList;
