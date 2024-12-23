import useDialogState from "@/hooks/useDialogState";
import AddDefaultValuesTable from "./AddDefaultValuesTable";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { CircleDollarSign } from "lucide-react";

export default function ArtisanAddValues() {
  const { isOpen, setIsOpen } = useDialogState();

  return <DialogModal Component={AddDefaultValuesTable} props={{ isOpen, setIsOpen }} icon={<CircleDollarSign />} isOpen={isOpen} setIsOpen={setIsOpen} title="Add default prices for artisans" />;
}
