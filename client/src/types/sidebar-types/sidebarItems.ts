//client\src\types\sidebar-types\sidebarItems.ts
import { LucideIcon } from "lucide-react";

export interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
  translatedLabel?: string;
}

export interface SidebarItems {
  links: SidebarLink[];
}
