//client\src\utils\SkeletonLoader\Activities\ActivitiesSkeleton.tsx
import { useMediaQuery } from "usehooks-ts";
import { Skeleton } from "../../../components/ui/skeleton";
import { TableCell, TableRow } from "../../../components/ui/table";

const ActivitiesSkeleton = () => {
  const onDesktop = useMediaQuery("(min-width: 968px)");

  return (
    <TableRow>
      <TableCell>
        <Skeleton className="p-2 align-middle h-5 w-20" />
      </TableCell>
      {onDesktop ? (
        <TableCell className="text-end">
          <Skeleton className="inline-flex items-center justify-center whitespace-nowrap w-14 h-8 px-4 py-2 mr-2" />
        </TableCell>
      ) : (
        <TableCell className="text-end">
          <Skeleton className="inline-flex items-center justify-center whitespace-nowrap w-1 h-7 px-4 py-2 mr-2" />
        </TableCell>
      )}
    </TableRow>
  );
};

export default ActivitiesSkeleton;
