//client\src\components\Sidebar\SidebarComponents\SidebarLinks.tsx
import { sidebarItems } from "../SidebarComponents/sidebarItems";
import { Link } from "react-router-dom";
import SidebarButton from "../SidebarComponents/SidebarButton";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

type SidebarComponent = {
  Component: React.ComponentType;
};

const SidebarLinks = ({ Component }: SidebarComponent) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  console.log("Current user role:", user?.role);

  const guardedLinkRoutes = sidebarItems.links.filter(link => {
    if (link.label === "managers" && user?.role !== "admin") {
      return false;
    }

    if (user?.role === "admin" && link.label !== "myProjects") {
      return true;
    }
    if (user?.role === "manager" && link.label !== "myProjects") {
      return true;
    }
    if (user?.role === "user" && link.label === "myProjects") {
      return true;
    }
    return false;
  });

  return (
    <div className="mt-1 px-2 flex flex-col w-full gap-1">
      {guardedLinkRoutes.map((link, i) => {
        const isActive = link.href === "/" ? location.pathname === link.href : location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href));

        return (
          <Link to={link.href} key={i} className="pb-1">
            <SidebarButton variant={isActive ? "secondary" : "ghost"} icon={link.icon} className="w-full">
              {t(link.label.toLowerCase())}
            </SidebarButton>
          </Link>
        );
      })}
      <Component />
    </div>
  );
};

export default SidebarLinks;
