import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type BreadcrumbItem = {
    label: string;
    href: string;
};

type BreadcrumbProps = {
    items: BreadcrumbItem[];
};

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <nav className='flex' aria-label='Breadcrumb'>
            <ol className='inline-flex flex-wrap items-center space-x-1 md:space-x-2'>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className='flex items-center'>
                            {index > 0 && (
                                <ChevronRight className='w-5 h-5 text-gray-400' />
                            )}
                            <Link
                                to={item.href}
                                className='flex ml-1 text-sm font-medium text-foreground transition hover:text-gray-400 hover:ease-in delay-150 md:ml-2'
                            >
                                {item.label}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
