// src/components/tables/MeasuresTable/MeasuresCard.tsx
import EditMeasure from "@/components/Forms/Measures/MeasureFormEdit/EditMeasure";
import { TableCell, TableRow } from "@/components/ui/table";
import { Measure } from "@/types/measure-types/measureTypes";

type MeasuresCardProps = {
  measures: Measure[];
};

const MeasuresCard = ({ measures }: MeasuresCardProps) => {
  console.log("📏 MeasuresCard received measures:", measures);

  return (
    <>
      {Array.isArray(measures) &&
        measures.map(measure => (
          <TableRow key={measure.id}>
            <TableCell className="font-semibold">{measure.name}</TableCell>
            <TableCell className="text-end w-[200px]">
              <EditMeasure measureId={measure.id!} />
            </TableCell>
          </TableRow>
        ))}
    </>
  );
};

export default MeasuresCard;
