import SidebarDesktopUser from './SidebarDesktopUser'
import SidebarLinks from '../SidebarComponents/SidebarLinks'

const SidebarDesktop = () => {

    return (
        <SidebarLinks
            Component={SidebarDesktopUser}
        />
    )
}

export default SidebarDesktop