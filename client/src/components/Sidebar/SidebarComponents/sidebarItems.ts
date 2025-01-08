//client\src\components\Sidebar\SidebarComponents\sidebarItems.ts
import { SidebarItems } from "@/types/sidebar-types/sidebarItems";
import { Activity, BrickWall, Building2, ClipboardList, ContactRound, Home, LogOut, Ruler, Users, Receipt, UserRound, UserCog, Settings } from "lucide-react";

export const sidebarItems: SidebarItems = {
  links: [
    { label: "Home", href: "/", icon: Home },
    { label: "Managers", href: "/managers", icon: UserCog },
    { label: "Activities", href: "/activities", icon: Activity },
    { label: "Measures", href: "/measures", icon: Ruler },
    { label: "Users", href: "/users", icon: Users },
    { label: "Artisans", href: "/artisans", icon: ContactRound },
    { label: "Companies", href: "/companies", icon: Building2 },
    { label: "Projects", href: "/projects", icon: BrickWall },
    { label: "Invoices", href: "/invoices", icon: Receipt },
    { label: "My projects", href: "/my-projects", icon: ClipboardList },
    { label: "Clients", href: "/clients", icon: UserRound }
  ]
};

export const sidebarUserItems: SidebarItems = {
  links: [
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Sign out", href: "/logout", icon: LogOut }
  ]
};
