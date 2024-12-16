//client\src\components\tables\CompaniesTable\CompaniesCard.tsx
import EditCompany from "@/components/Forms/Companies/CompanyFormEdit/EditCompany";
import { TableCell, TableRow } from "@/components/ui/table";
import { Company } from "@/types/company-types/companyTypes";

type CompaniesCardProps = {
  companies: Company[];
};

const CompaniesCard = ({ companies }: CompaniesCardProps) => {
  return (
    <>
      {companies &&
        companies.map(company => (
          <TableRow key={company.id}>
            <TableCell className="font-semibold">{company.name}</TableCell>
            <TableCell className="text-center font-semibold">{company.number}</TableCell>
            <TableCell className="text-center font-semibold">{company.mol}</TableCell>
            <TableCell className="text-end w-[200px]">
              <EditCompany companyId={company.id!} />
            </TableCell>
          </TableRow>
        ))}
    </>
  );
};

export default CompaniesCard;
