import { Button } from '@/components/ui/button'
import { SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

const SidebarSheetTrigger = () => {
    return (
        <>
            <SheetTrigger asChild>
                <Button size='icon' variant='ghost'>
                    <Menu size={22} />
                </Button>
            </SheetTrigger>
        </>
    )
}

export default SidebarSheetTrigger