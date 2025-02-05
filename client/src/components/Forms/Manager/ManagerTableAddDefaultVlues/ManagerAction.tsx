import useDialogState from "@/hooks/useDialogState";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import EditDefaultValuesTable from "./ManagerEditDefaultValuesTable";
import { EditDefaultValuesTableProps } from "@/types/defaultPricingType/defaultPricingTypes";
import AllDefaultValuesTable from "./ManagerAllDefaultValuesTable";
import { CircleDollarSign, Edit } from "lucide-react";
import { useState } from "react";
import CreateDefaultValuesTable from "./ManagerCreateDefaultValuesTable";
import { useTranslation } from "react-i18next";
type artisanActionType = "edit" | "all" | "create";

export default function ManagerAction({ artisanId, type, editProps, refetch }: { artisanId: string; type: artisanActionType; editProps?: EditDefaultValuesTableProps; artisanName?: string; refetch?: () => void }) {
  const { t } = useTranslation();
  const { isOpen, setIsOpen } = useDialogState();
  const [title, setTitle] = useState<string>("");
  
  const actionComponent = () => {
    switch (type) {
      case "edit":
        setTitle(t("Edit default price for manager"));
        if (!editProps) throw new Error(t("Edit props are required for edit action"));
        return <EditDefaultValuesTable editProps={editProps} refetch={refetch!} setIsOpen={setIsOpen} />;
      case "create":
        setTitle(t("Add default price for manager"));
        return <CreateDefaultValuesTable refetch={refetch!} setIsOpen={setIsOpen} />;
      case "all":
        setTitle(t("All default prices"));
        return <AllDefaultValuesTable />;
    }
  };

  return <DialogModal 
    Component={actionComponent} 
    props={{ isOpen, setIsOpen, artisanId }} 
    CreateButtonModal={type === "create"} 
    createButtonTitle={t("Add default price")} 
    isOpen={isOpen} 
    title={title} 
    setIsOpen={setIsOpen} 
    maxWidth="900px" 
    icon={type === "all" ? <CircleDollarSign /> : <Edit />} 
  />;
}
