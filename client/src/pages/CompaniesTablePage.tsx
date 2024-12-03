import CompaniesTableBody from '@/components/tables/CompaniesTable/CompaniesTableBody';
import Sidebar from '../components/Sidebar/Sidebar';

const CompaniesTablePage = () => {
    return (
        <div className='flex md:gap-60 min-h-screen'>
            <Sidebar />

            <div className='flex-1 flex px-2 md:gap-8'>
                <CompaniesTableBody />
            </div>
        </div>
    );
};

export default CompaniesTablePage;
