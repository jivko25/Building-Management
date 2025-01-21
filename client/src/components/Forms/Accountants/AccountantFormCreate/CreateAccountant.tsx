//client\src\components\Forms\Accountants\AccountantsFormCreate\CreateAccountant.tsx
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useTranslation } from "react-i18next";
import { accountantSchema, AccountantSchema } from "@/models/accountant/accountantSchema";
import CreateAccountantForm from "./CreateAccountantForm";

const CreateAccountant = () => {
  const { t } = useTranslation();
  const { isOpen, setIsOpen } = useDialogState();

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<AccountantSchema>({
    URL: "/accountants/create",
    queryKey: ["accountants"],
    successToast: t("Accountant created successfully!"),
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, accountantSchema);

  return <DialogModal Component={CreateAccountantForm} CreateButtonModal props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} createButtonTitle={t("Add new accountant")} title={t("New accountant")} />;
};

export default CreateAccountant;
