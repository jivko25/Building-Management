//client\src\utils\SkeletonLoader\Measures\MeasuresLoader.tsx
import { Measure } from "@/types/measure-types/measureTypes";
import { Table, TableBody } from "../../../components/ui/table";
import MeasuresSkeleton from "./MeasuresSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import MeasuresHeader from "@/components/tables/MeasuresTable/MeasuresHeader";

type MeasureProps = {
  measures: Measure[] | undefined;
};

const MeasuresLoader = ({ measures }: MeasureProps) => {
  const companiesCount = measures ? measures.length : 10;

  return (
    <div className="flex flex-col flex-1 py-8 items-center md:px-0">
      <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full justify-end mb-4 md:w-2/3">
        <Skeleton className="md:w-full lg:max-w-[12rem] h-9" />
      </div>
      <Table className="w-full min-w-full">
        <MeasuresHeader />
        <TableBody>
          {Array.from({ length: companiesCount }).map((_, i) => (
            <MeasuresSkeleton key={i} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MeasuresLoader;
