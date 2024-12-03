import Breadcrumb from './Breadcrumb';
import CreateProject from '@/components/Forms/Projects/ProjectFormCreate/CreateProject';

const ProjectsBreadcrumb = () => {
    return (
        <div className='fixed top-0 left-0 md:left-60 right-0 z-40 pt-5 mt-14 bg-transparent backdrop-blur-sm'>
            <div className='my-4 mx-8 space-y-4 px-4'>
                <Breadcrumb
                    items={[
                        {
                            label: 'Projects',
                            href: '/projects',
                        },
                    ]}
                />
            </div>
            <div className='flex flex-col border rounded-lg mx-8 space-y-4 p-4 backdrop-blur-sm bg-slate-900/20'>
                <CreateProject />
            </div>
        </div>
    );
};

export default ProjectsBreadcrumb;
