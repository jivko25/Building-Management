import { LucideProps } from 'lucide-react';

export type FormInputType = {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    value?: string;
    className?: string;
    Icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

export type TableFormSelectType = {
    name: string;
    label: string;
    placeholder?: string;
    defaultVal?: string;
    className?: string;
}