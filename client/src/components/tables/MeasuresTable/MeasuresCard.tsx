import EditMeasure from '@/components/Forms/Measures/MeasureFormEdit/EditMeasure';
import { TableCell, TableRow } from '@/components/ui/table';
import { Measure } from '@/types/measure-types/measureTypes';

type MeasuresCardProps = {
    measures: Measure[];
};

const MeasuresCard = ({ measures }: MeasuresCardProps) => {
    return (
        <>
            {measures.map((measure) => (
                <TableRow key={measure.id}>
                    <TableCell className='font-semibold'>
                        {measure.name}
                    </TableCell>
                    <TableCell className='text-end w-[200px]'>
                        <EditMeasure measureId={measure.id!} />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
};

export default MeasuresCard;
