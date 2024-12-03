import { Button } from '@/components/ui/button'
import { SheetClose, SheetHeader } from '@/components/ui/sheet'
import { X } from 'lucide-react'

const SidebarSheetHeader = () => {
    return (
        <SheetHeader className='flex flex-row pl-2 justify-between items-center space-y-0 mb-4'>
            <div className="flex-shrink-0">
                <span className="sr-only">ApeXCraft</span>
                <span className="relative font-extrabold text-1xl tracking-tight">
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
            </div>
            <SheetClose asChild>
                <Button className='h-7 w-7 p-0' variant='ghost'>
                    <X size={15} />
                </Button>
            </SheetClose>
        </SheetHeader>
    )
}

export default SidebarSheetHeader