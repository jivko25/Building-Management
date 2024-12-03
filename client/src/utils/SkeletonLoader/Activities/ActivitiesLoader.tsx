import { Activity } from '@/types/activity-types/activityTypes';
import { Table, TableBody } from '../../../components/ui/table';
import ActivitiesSkeleton from './ActivitiesSkeleton';
import { PaginatedData } from '@/components/common/Pagination/Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import ActivitiesHeader from '@/components/tables/ActivitiesTable/ActivitiesHeader';

type ActivitiesProps = {
    activity: PaginatedData<Activity> | undefined;
};

const ActivitiesLoader = ({ activity }: ActivitiesProps) => {
    const activitiesCount = activity ? activity.data.length : 10;

    return (
        <div className='flex flex-col flex-1 py-8 items-center md:px-0'>
            <div className='flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full justify-between mb-4 md:w-2/3'>
                <Skeleton className='md:w-full lg:max-w-[12rem] h-9' />
                <Skeleton className='md:w-full lg:max-w-[12rem] h-9' />
            </div>
            <Table className='w-full min-w-full'>
                <ActivitiesHeader />
                <TableBody>
                    {Array.from({ length: activitiesCount }).map((_, i) => (
                        <ActivitiesSkeleton key={i} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ActivitiesLoader;
