import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { Client } from "@/types/client-types/clientTypes";

const ClientsLoader = ({ clients }: { clients: Client[] }) => {
  return (
    <>
      {[1, 2, 3, 4, 5].map(index => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-[250px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[200px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[250px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[200px]" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-4 w-[100px] mx-auto" />
          </TableCell>
          <TableCell className="text-end">
            <Skeleton className="h-8 w-8 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default ClientsLoader;
