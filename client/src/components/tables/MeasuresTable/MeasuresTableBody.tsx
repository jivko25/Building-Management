import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import MeasuresLoader from '@/utils/SkeletonLoader/Measures/MeasuresLoader';
import { CircleAlert, Ruler } from 'lucide-react';
import ErrorMessage from '@/components/common/FormMessages/ErrorMessage';
import { Measure } from '@/types/measure-types/measureTypes';
import CreateMeasure from '@/components/Forms/Measures/MeasureFormCreate/CreateMeasure';
import ConditionalRenderer from '@/components/common/ConditionalRenderer/ConditionalRenderer';
import { useFetchDataQuery } from '@/hooks/useQueryHook';
import MeasuresHeader from './MeasuresHeader';
import MeasuresCard from './MeasuresCard';

const MeasuresTableBody = () => {
    const {
        data: measures,
        isPending,
        isError,
    } = useFetchDataQuery<Measure[]>({
        URL: '/measures',
        queryKey: ['measures'],
    });

    if (isPending) {
        return <MeasuresLoader measures={measures} />;
    }

    if (isError) {
        return <ErrorMessage title='Oops...' Icon={CircleAlert} />;
    }

    return (
        <div className='flex w-full flex-col flex-1 py-8 items-center md:px-0'>
            <div className='flex gap-4 items-end justify-end w-full mb-4 md:w-2/3'>
                <CreateMeasure />
            </div>
            <Table className='w-full min-w-full'>
                <MeasuresHeader />
                <TableBody>
                    <ConditionalRenderer
                        data={measures || []}
                        renderData={(measures) => (
                            <MeasuresCard measures={measures as Measure[]} />
                        )}
                        noResults={{
                            title: 'No measures found',
                            description:
                                "It looks like you haven't added any measures yet.",
                            Icon: Ruler,
                        }}
                        wrapper={(content) => (
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className='text-center text-3xl'
                                >
                                    {content}
                                </TableCell>
                            </TableRow>
                        )}
                    />
                </TableBody>
            </Table>
        </div>
    );
};

export default MeasuresTableBody;
