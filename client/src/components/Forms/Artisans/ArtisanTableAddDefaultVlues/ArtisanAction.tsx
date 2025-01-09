import useDialogState from "@/hooks/useDialogState";
import AddDefaultValuesTable from "./AddDefaultValuesTable";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import EditDefaultValuesTable from "./EditDefaultValuesTable";
import { EditDefaultValuesTableProps } from "@/types/defaultPricingType/defaultPricingTypes";
import { useState } from "react";
type artisanActionType = "edit" | "delete" | "create";

export default function ArtisanAction({ artisanId, type, editProps }: { artisanId: string; type: artisanActionType; editProps?: EditDefaultValuesTableProps }) {
  const { isOpen, setIsOpen } = useDialogState();

  const actionComponent = () => {
    switch (type) {
      case "edit":
        if (!editProps) throw new Error("Edit props are required for edit action");
        return <EditDefaultValuesTable editProps={editProps} />;
      case "create":
        return <AddDefaultValuesTable artisanId={artisanId} />;
      default:
        return <AddDefaultValuesTable artisanId={artisanId} />;
    }
  };

  return <DialogModal Component={() => actionComponent()} props={{ isOpen, setIsOpen, artisanId }} CreateButtonModal={type === "create"} createButtonTitle="Add default price" isOpen={isOpen} setIsOpen={setIsOpen} title="Add default prices for artisans" maxWidth="900px" />;
}
