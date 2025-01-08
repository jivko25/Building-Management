import apiClient from "@/api/axiosConfig";
import { TableCell, TableRow } from "@/components/ui/table";
import { User } from "@/types/user-types/userTypes";
import { Button } from "primereact/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type ManagersCardProps = {
  managers: User[];
};

const ManagersCard = ({ managers }: ManagersCardProps) => {
  const { translate } = useLanguage();
  const [buttonLabels, setButtonLabels] = useState({
    add: "Add",
    remove: "Remove"
  });

  useEffect(() => {
    const translateLabels = async () => {
      setButtonLabels({
        add: await translate("Add"),
        remove: await translate("Remove")
      });
    };
    translateLabels();
  }, [translate]);

  const changePermissionsToReadOnly = (manager: User) => {
    console.log("User:", manager.readonly);
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
            <Button label={manager.readonly ? buttonLabels.remove : buttonLabels.add} onClick={() => changePermissionsToReadOnly(manager)} />
            {/* <EditManager managerId={manager.id!} /> */}
            {/* <button onClick={() => changePermissionsToReadOnly(manager)}>{manager.readonly ? 'Remove' : 'Add'}</button> */}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default ManagersCard;
