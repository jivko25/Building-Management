import { PopoverContent } from '@/components/ui/popover'
import { Link } from 'react-router-dom'
import SidebarButton from './SidebarButton'
import { sidebarUserItems } from './sidebarItems'
import { Separator } from '@/components/ui/separator'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { Switch } from '@/components/ui/switch'
import { PopoverClose } from '@radix-ui/react-popover'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

const SidebarUserDropdown = () => {
    const { theme, setTheme } = useTheme();
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const { logout } = useAuth();

    const handleLogoutClick = async () => {
        await logout();
    }

    const themeToggleHandler = () => {
        if (theme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    }

    return (
        <PopoverContent className='w-[180px] p-0'>
            <>
                <div className='flex items-center py-2'>
                    {theme === 'dark'
                        ? <Moon className="h-[1.2rem] w-[1.9rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        : <Sun className="h-[1.2rem] w-[1.9rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    }
                    <span className='text-sm pl-1 pr-6'>{theme === 'dark'
                        ? 'Dark Mode'
                        : 'Light Mode'
                    }
                    </span>
                    <PopoverClose asChild>
                        <Switch
                            checked={isChecked}
                            onCheckedChange={setIsChecked}
                            onClick={themeToggleHandler}
                            id="dark-mode"
                        />
                    </PopoverClose>
                </div>
                <Separator />
                {sidebarUserItems.links.map((link, index) => (
                    <Link to={link.href} key={index}>
                        <SidebarButton
                            className='w-full p-1.5 text-sm'
                            size='sm'
                            icon={link.icon}
                            onClick={link.label === 'Sign out' ? handleLogoutClick : undefined}
                        >
                            {link.label}
                        </SidebarButton>
                    </Link>
                ))}
            </>
        </PopoverContent>
    )
}

export default SidebarUserDropdown