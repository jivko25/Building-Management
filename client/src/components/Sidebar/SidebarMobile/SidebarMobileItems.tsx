//client\src\components\Sidebar\SidebarMobile\SidebarMobileItems.tsx
import SidebarLinks from "../SidebarComponents/SidebarLinks";
import SidebarDesktopUser from "../SidebarDesktop/SidebarDesktopUser";

const SidebarMobileItems = () => {
  return <SidebarLinks Component={SidebarDesktopUser} />;
};

export default SidebarMobileItems;
