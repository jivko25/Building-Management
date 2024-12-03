import ArtisansTableBody from '@/components/tables/ArtisansTable/ArtisansTableBody';
import Sidebar from '../components/Sidebar/Sidebar';

const ArtisansTablePage = () => {
    return (
        <div className='flex md:gap-60 min-h-screen'>
            <Sidebar />
            <div className='flex-1 flex px-2 md:gap-8'>
                <ArtisansTableBody />
            </div>
        </div>
    );
};

export default ArtisansTablePage;
