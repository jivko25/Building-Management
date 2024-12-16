//client\src\utils\SkeletonLoader\Companies\CompaniesLoader.tsx
import { Table, TableBody } from "../../../components/ui/table";
import CompaniesSkeleton from "./CompaniesSkeleton";
import { Company } from "@/types/company-types/companyTypes";
import { Skeleton } from "@/components/ui/skeleton";
import CompaniesHeader from "@/components/tables/CompaniesTable/CompaniesHeader";

type CompanyProps = {
  companies: Company[] | undefined;
};

const CompaniesLoader = ({ companies }: CompanyProps) => {
  const companiesCount = companies ? companies.length : 10;

  return (
    <div className="flex flex-col flex-1 py-8 items-center md:px-0">
      <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row gap-4 w-full justify-between mb-4 md:w-2/3">
        <Skeleton className="md:w-full lg:max-w-[12rem] h-9" />
        <Skeleton className="md:w-full lg:max-w-[12rem] h-9" />
      </div>
      <Table className="w-full min-w-full">
        <CompaniesHeader />
        <TableBody>
          {Array.from({ length: companiesCount }).map((_, i) => (
            <CompaniesSkeleton key={i} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesLoader;
