import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Project } from '@/types/project-types/projectTypes';

type ProjectTypeProps = {
    projects: Project[] | undefined;
};

const ProjectsSkeletonCard = ({ projects }: ProjectTypeProps) => {
    const projectsCardCount = projects ? projects.length : 4;

    return (
        <>
            <div className='flex flex-col border rounded-lg mt-24 mx-8 space-y-4 p-4 backdrop-blur-sm bg-slate-900/20'>
                <Skeleton className='md:w-full lg:max-w-[12rem] h-9' />
            </div>
            <div className='flex flex-col border rounded-lg mt-8 mb-24 md:mt-0 mx-8 p-4 backdrop-blur-sm bg-slate-900/20'>
                <div className='flex flex-wrap sm:w-full gap-4'>
                    {Array.from({ length: projectsCardCount }).map(
                        (_, index) => (
                            <Card className='w-[21rem]' key={index}>
                                <CardHeader className='bg-header rounded-t-lg p-5'>
                                    <CardTitle>
                                        <Skeleton className='w-full h-[1rem]' />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-1.5 p-5'>
                                    <Skeleton className='w-1/2 h-[1rem]' />
                                    <Skeleton className='w-1/2 h-[1rem]' />
                                    <Skeleton className='w-1/2 h-[1rem]' />
                                    <Skeleton className='w-1/2 h-[1rem]' />
                                </CardContent>
                                <CardFooter className='p-1.5 justify-center items-center rounded-b-lg border-t'>
                                    <Skeleton className='h-[2rem] w-[2rem]' />
                                </CardFooter>
                            </Card>
                        )
                    )}
                </div>
            </div>
        </>
    );
};

export default ProjectsSkeletonCard;
