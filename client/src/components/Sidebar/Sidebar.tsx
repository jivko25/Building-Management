import { useMediaQuery } from 'usehooks-ts'
import SidebarMobile from './SidebarMobile/SidebarMobile';
import SidebarDesktop from './SidebarDesktop/SidebarDesktop';

const Sidebar = () => {
    const onDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <div>
            {onDesktop ? (
                <aside className="fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 border-r px-2 py-6 md:w-56 overflow-y-auto">
                    <SidebarDesktop />
                </aside>
            ) : (
                <aside className="fixed bottom-0 left-0 right-0 z-50 bg-background shadow-sm border-t px-4 py-4 md:hidden">
                    <SidebarMobile />
                </aside>
            )}
        </div>
    );
}

export default Sidebar