import { LucideIcon } from 'lucide-react';

export type SidebarItems = {
    links: Array<{
        label: string;
        href: string;
        icon?: LucideIcon;
    }>
}