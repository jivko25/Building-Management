import { DialogDescription, DialogHeader as Header } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'

type DialogHeaderProps = {
    title: string;
    user?: string;
}

const DialogHeader = ({ title = 'Add new user', user }: DialogHeaderProps) => {
    return (
        <>
            <Header>
                <DialogTitle className='text-center font-semibold text-lg'>
                    {title}
                </DialogTitle>
                <DialogDescription className='text-center font-semibold text-md'>
                    {user}
                </DialogDescription>
            </Header>
        </>
    )
}

export default DialogHeader