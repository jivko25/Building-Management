import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link, useParams } from 'react-router-dom';

const TasksBreadcrumbs = () => {
    const { id } = useParams();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className='text-base'>
                    <BreadcrumbLink asChild>
                        <Link to='/projects'>Projects</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="[&>svg]:size-5" />
                <BreadcrumbItem className='text-base'>
                    <BreadcrumbLink asChild>
                        <Link to={`/projects/${id}/tasks`}>{id}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="[&>svg]:size-5" />
                <BreadcrumbItem className='text-base'>
                    <BreadcrumbLink asChild>
                        <Link to={`/projects/${id}/tasks`}>Tasks</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default TasksBreadcrumbs