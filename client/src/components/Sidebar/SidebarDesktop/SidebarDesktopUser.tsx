//client\src\components\Sidebar\SidebarDesktop\SidebarDesktopUser.tsx
import { Popover } from "@/components/ui/popover";
import SidebarUserDropdown from "../SidebarComponents/SidebarUserDropdown";

const SidebarDesktopUser = () => {
  return (
    <>
      <Popover>
        <SidebarUserDropdown />
      </Popover>
    </>
  );
};

export default SidebarDesktopUser;
