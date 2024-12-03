import UserWorkItemCreate from '@/components/Forms/UserWorkItem/UserWorkItemFormCreate/UserWorkItemCreate';
import Breadcrumb from './Breadcrumb';

type UserProjectBreadcrumbProps = {
    taskId: string;
};
const UserProjectBreadcrumb = ({ taskId }: UserProjectBreadcrumbProps) => {
    return (
        <div className='fixed top-0 left-0 md:left-60 right-0 z-40 pt-5 mt-14 bg-transparent backdrop-blur-sm'>
            <div className='my-4 mx-8 space-y-4'>
                <Breadcrumb
                    items={[
                        {
                            label: 'My projects',
                            href: '/my-projects',
                        },
                        {
                            label: 'Task',
                            href: `/my-projects/${taskId}/task`,
                        },
                    ]}
                />
            </div>
            <div className='flex flex-col border rounded-lg mx-8 space-y-4 p-4 backdrop-blur-sm bg-slate-900/20'>
                <UserWorkItemCreate />
            </div>
        </div>
    );
};

export default UserProjectBreadcrumb;
