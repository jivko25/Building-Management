import useDialogState from "@/hooks/useDialogState";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import EditDefaultValuesTable from "./ManagerEditDefaultValuesTable";
import { EditDefaultValuesTableProps } from "@/types/defaultPricingType/defaultPricingTypes";
import AllDefaultValuesTable from "./ManagerAllDefaultValuesTable";
import { CircleDollarSign, Edit } from "lucide-react";
import { useState } from "react";
import CreateDefaultValuesTable from "./ManagerCreateDefaultValuesTable";
type artisanActionType = "edit" | "all" | "create";

export default function ManagerAction({ artisanId, type, editProps, artisanName, refetch }: { artisanId: string; type: artisanActionType; editProps?: EditDefaultValuesTableProps; artisanName?: string; refetch?: () => void }) {
  const { isOpen, setIsOpen } = useDialogState();
  const [title, setTitle] = useState<string>("");
  const actionComponent = () => {
    switch (type) {
      case "edit":
        setTitle(`Edit default price for ${artisanName}`);
        if (!editProps) throw new Error("Edit props are required for edit action");
        return <EditDefaultValuesTable editProps={editProps} refetch={refetch!} />;
      case "create":
        setTitle(`Add default price for ${artisanName}`);
        return <CreateDefaultValuesTable refetch={refetch!} />;
      case "all":
        setTitle("All default prices");
        return <AllDefaultValuesTable />;
    }
  };

  return <DialogModal Component={actionComponent} props={{ isOpen, setIsOpen, artisanId }} CreateButtonModal={type === "create"} createButtonTitle="Add default price" isOpen={isOpen} title={title} setIsOpen={setIsOpen} maxWidth="900px" icon={type === "all" ? <CircleDollarSign /> : <Edit />} />;
}
