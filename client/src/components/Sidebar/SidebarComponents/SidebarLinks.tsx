//client\src\components\Sidebar\SidebarComponents\SidebarLinks.tsx
import { sidebarItems } from "./sidebarItems";
import { Link } from "react-router-dom";
import SidebarButton from "./SidebarButton";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { SidebarLink } from "@/types/sidebar-types/sidebarItems";

type SidebarComponent = {
  Component: React.ComponentType;
};

const SidebarLinks = ({ Component }: SidebarComponent) => {
  const { user } = useAuth();
  const { translate } = useLanguage();
  const [translatedLinks, setTranslatedLinks] = useState<SidebarLink[]>([]);

  useEffect(() => {
    const translateLinks = async () => {
      console.log("Translating sidebar links");
      const translatedItems = await Promise.all(
        sidebarItems.links.map(async link => ({
          ...link,
          translatedLabel: await translate(link.label)
        }))
      );
      setTranslatedLinks(translatedItems);
    };

    translateLinks();
  }, [translate]);

  const guardedLinkRoutes = translatedLinks.filter(link => {
    if (link.label === "Managers" && user?.role !== "admin") {
      return false;
    }

    if (user?.role === "admin" && link.label !== "My projects") {
      return true;
    }
    if (user?.role === "manager" && link.label !== "My projects") {
      return true;
    }
    if (user?.role === "user" && link.label === "My projects") {
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
              {link.translatedLabel || link.label}
            </SidebarButton>
          </Link>
        );
      })}
      <Component />
    </div>
  );
};

export default SidebarLinks;
