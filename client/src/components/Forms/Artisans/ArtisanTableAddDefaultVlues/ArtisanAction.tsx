import useDialogState from "@/hooks/useDialogState";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import EditDefaultValuesTable from "./EditDefaultValuesTable";
import { EditDefaultValuesTableProps } from "@/types/defaultPricingType/defaultPricingTypes";
import AllDefaultValuesTable from "./AllDefaultValuesTable";
import { CircleDollarSign, Edit } from "lucide-react";
import { useState } from "react";
import CreateDefaultValuesTable from "./CreateDefaultValuesTable";
import { useTranslation } from "react-i18next";
type artisanActionType = "edit" | "all" | "create";

export default function ArtisanAction({ artisanId, type, editProps, artisanName, refetch }: { artisanId: string; type: artisanActionType; editProps?: EditDefaultValuesTableProps; artisanName?: string; refetch?: () => void }) {
  const { t } = useTranslation();
  const { isOpen, setIsOpen } = useDialogState();
  const [title, setTitle] = useState<string>("");
  const actionComponent = () => {
    switch (type) {
      case "edit":
        setTitle(`Edit default price for ${artisanName}`);
        if (!editProps) throw new Error("Edit props are required for edit action");
        return <EditDefaultValuesTable editProps={editProps} refetch={refetch!} />;
      case "create":
        setTitle(t("Add default price for") + " " + artisanName);
        return <CreateDefaultValuesTable artisanId={artisanId} refetch={refetch!} />;
      case "all":
        setTitle(t("All default prices"));
        return <AllDefaultValuesTable artisanId={artisanId} artisanName={artisanName!} />;
    }
  };

  return <DialogModal Component={actionComponent} props={{ isOpen, setIsOpen, artisanId }} CreateButtonModal={type === "create"} createButtonTitle={t("Add default price")} isOpen={isOpen} title={title} setIsOpen={setIsOpen} maxWidth="900px" icon={type === "all" ? <CircleDollarSign /> : <Edit />} />;
}
