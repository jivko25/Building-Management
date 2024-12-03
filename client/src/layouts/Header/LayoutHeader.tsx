import SidebarUserDropdown from '@/components/Sidebar/SidebarComponents/SidebarUserDropdown';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { User } from 'lucide-react';
import { Link } from "react-router-dom";

const LayoutHeader = () => {
    const { user } = useAuth();

    return (
        <header className="fixed shadow-lg shadow-blue-500/20 top-0 left-0 right-0 z-50 bg-background">
            <div className="container rounded-sm  mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="group flex items-center">
                            <span className="sr-only">ApeXCraft</span>
                            <span className="relative font-extrabold text-2xl tracking-tight">
                                <span className="relative">
                                    Ape
                                    <span className="inline-flex items-center">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 5L5 19M5 5L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    Craft
                                </span>
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {
                            user && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" className="flex items-center space-x-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                            <span className="sm:inline-block">{user.name_and_family}</span>
                                            <User className="h-5 w-5" />
                                        </Button>
                                    </PopoverTrigger>
                                    <SidebarUserDropdown />
                                </Popover>
                            )
                        }
                    </div>
                </div>
            </div>
            <Separator />
        </header>
    );
};

export default LayoutHeader;