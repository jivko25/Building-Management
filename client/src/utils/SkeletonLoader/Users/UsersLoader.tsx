import { User } from '@/types/user-types/userTypes';
import { Table, TableBody } from '../../../components/ui/table';
import UsersSkeleton from './UsersSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import UsersHeader from '@/components/tables/UsersTable/TableHeader';

type UsersProps = {
    users: User[] | undefined;
};

const UsersLoader = ({ users }: UsersProps) => {
    const usersLength = users ? users.length : 10;

    return (
        <div className='flex flex-col flex-1 py-8 items-center md:px-0'>
            <div className='flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full justify-between mb-4 md:w-2/3'>
                <Skeleton className='md:w-full lg:max-w-[12rem] h-9' />
                <Skeleton className='md:w-full lg:max-w-[12rem] h-9' />
            </div>
            <Table className='w-full min-w-full'>
                <UsersHeader />
                <TableBody>
                    {Array.from({ length: usersLength }).map((_, i) => (
                        <UsersSkeleton key={i} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default UsersLoader;
