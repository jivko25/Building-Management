import { Table, TableBody } from '../../../components/ui/table';
import { Artisan } from '@/types/artisan-types/artisanTypes';
import ArtisansSkeleton from './ArtisansSkeleton';
import { PaginatedData } from '@/components/common/Pagination/Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import ArtisansHeader from '@/components/tables/ArtisansTable/ArtisansHeader';

type ActivitiesProps = {
    artisans: PaginatedData<Artisan> | undefined;
};

const ArtisansLoader = ({ artisans }: ActivitiesProps) => {
    const artisansCount = artisans ? artisans.data.length : 10;

    return (
        <div className='flex flex-col flex-1 py-8 items-center md:px-0'>
            <div className='flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full justify-between mb-4 md:w-2/3'>
                <Skeleton className='md:w-full lg:max-w-[12rem] h-9' />
                <Skeleton className='md:w-full lg:max-w-[12rem] h-9' />
            </div>
            <Table className='w-full min-w-full'>
                <ArtisansHeader />
                <TableBody>
                    {Array.from({ length: artisansCount }).map((_, i) => (
                        <ArtisansSkeleton key={i} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ArtisansLoader;
