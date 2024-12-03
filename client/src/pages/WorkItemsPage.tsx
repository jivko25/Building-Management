import Sidebar from '@/components/Sidebar/Sidebar';
import WorkItemsTableBody from '@/components/tables/WorkItemsTable/WorkItemsTableBody';

const WorkItemsPage = () => {
    return (
        <div className='flex md:gap-60 min-h-screen'>
            <Sidebar />

            <div className='flex flex-col w-full overflow-x-auto md:gap-8'>
                <WorkItemsTableBody />
            </div>
        </div>
    );
};

export default WorkItemsPage;
