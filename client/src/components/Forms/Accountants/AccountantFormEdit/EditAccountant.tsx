//client\src\components\Forms\Accountants\AccountantFormEdit\EditAccountant.tsx
import { AccountantSchema, accountantSchema } from "@/models/accountant/accountantSchema";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useTranslation } from "react-i18next";
import EditAccountantForm from "./EditAccountantForm";

type AccountantFormProps = {
  accountantId: string;
};

const EditAccountant = ({ accountantId }: AccountantFormProps) => {
  const { t } = useTranslation();
  const { isOpen, setIsOpen } = useDialogState();

  const { useEditEntity } = useMutationHook();

  const { mutate, isPending } = useEditEntity<AccountantSchema>({
    URL: `/accountants/${accountantId}/edit`,
    queryKey: ["accountants"],
    successToast: t("Accountant updated successfully!"),
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, accountantSchema);

  return <DialogModal Component={EditAccountantForm} props={{ accountantId, handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} title={t("Edit accountant")} />;
};

export default EditAccountant;
