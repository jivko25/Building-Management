import apiClient from "@/api/axiosConfig";
import { TableCell, TableRow } from "@/components/ui/table";
import { User } from "@/types/user-types/userTypes";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";

type ManagersCardProps = {
  managers: User[];
};

const ManagersCard = ({ managers }: ManagersCardProps) => {
  const { t } = useTranslation();

  const changePermissionsToReadOnly = (manager: User) => {
    console.log("User:", manager.readonly);
    // send patch request with axios to /users/managers/add-to-readonly/:id
    apiClient.patch(`/users/managers/update-readonly/${manager && manager?.id}`);
  };

  return (
    <>
      {managers.map(manager => (
        <TableRow key={manager.id}>
          <TableCell className="font-semibold">{manager.full_name}</TableCell>
          <TableCell>{manager.email}</TableCell>
          <TableCell>{manager.role}</TableCell>
          <TableCell className="text-end w-[200px]">
            <Button label={manager.readonly ? t("Remove") : t("Add")} onClick={() => changePermissionsToReadOnly(manager)} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default ManagersCard;
