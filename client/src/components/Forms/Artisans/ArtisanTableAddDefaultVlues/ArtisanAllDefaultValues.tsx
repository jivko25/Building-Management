import useDialogState from "@/hooks/useDialogState";
import AllDefaultValuesTable from "./AllDefaultValuesTable";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { CircleDollarSign } from "lucide-react";

export default function ArtisanAllDefaultValues({ artisanId, artisanName }: { artisanId: string; artisanName: string }) {
  const { isOpen, setIsOpen } = useDialogState();

  return <DialogModal Component={AllDefaultValuesTable} props={{ isOpen, setIsOpen, artisanId, artisanName }} icon={<CircleDollarSign />} isOpen={isOpen} setIsOpen={setIsOpen} maxWidth="900px" />;
}
