import Breadcrumb from './Breadcrumb';

const UserBreadcrumb = () => {
    return (
        <div className='fixed top-0 left-0 md:left-60 right-0 z-40 pt-5 mt-14 bg-transparent backdrop-blur-sm'>
            <div className='my-4 mx-8 space-y-4'>
                <Breadcrumb
                    items={[
                        {
                            label: 'My projects',
                            href: '/my-projects',
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default UserBreadcrumb;
