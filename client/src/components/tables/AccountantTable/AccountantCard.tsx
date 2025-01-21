//client\src\components\tables\AccountantsTable\AccountantsCard.tsx
import EditAccountant from "@/components/Forms/Accountants/AccountantFormEdit/EditAccountant";
import { TableCell, TableRow } from "@/components/ui/table";
import { Accountant } from "@/types/accountant-types/accountantTypes";

type AccountantsCardProps = {
  accountants: Accountant[];
};

const AccountantCard = ({ accountants }: AccountantsCardProps) => {
  return (
    <>
      {accountants.map(accountant => (
        <TableRow key={accountant.id}>
          <TableCell className="font-semibold">{accountant.name}</TableCell>
          <TableCell className="text-end w-[200px]">
            <EditAccountant accountantId={accountant.id!} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default AccountantCard;
