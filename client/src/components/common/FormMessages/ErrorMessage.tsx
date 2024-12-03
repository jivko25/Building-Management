import { LucideProps } from 'lucide-react'
import { ReactNode } from 'react';

type ErrorMessageProps = {
    title: string;
    error?: ReactNode
    Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

const ErrorMessage = ({
    title,
    error = 'Something went wrong while fetching your data. Please try again.',
    Icon
}: ErrorMessageProps) => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center space-y-3 bg-background text-center p-8 rounded-lg border border-dashed">
            <div className="bg-muted rounded-full p-3">
                <Icon size={24} className='text-muted-foreground' />
            </div>
            <h2 className="text-lg font-semibold">
                {title}
            </h2>
            <p className="text-muted-foreground text-sm">
                {error}
            </p>
        </div>
    )
}

export default ErrorMessage