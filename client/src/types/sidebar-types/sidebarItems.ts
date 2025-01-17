//client\src\types\sidebar-types\sidebarItems.ts
import { LucideIcon } from "lucide-react";

export type SidebarItems = {
  links: Array<{
    label: string;
    href: string;
    icon?: LucideIcon;
  }>;
};
