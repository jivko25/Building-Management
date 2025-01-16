//client\src\components\Forms\User\UserFormCreate\CreateUser.tsx
import { userSchema, UserSchema } from "@/models/user/userSchema";
import CreateUserForm from "./CreateUserForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useTranslation } from "react-i18next";

const CreateUser = () => {
  const { t } = useTranslation();
  const { isOpen, setIsOpen } = useDialogState();

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<UserSchema>({
    URL: "/users/create",
    queryKey: ["users"],
    successToast: t("User created successfully!"),
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, userSchema);

  return <DialogModal Component={CreateUserForm} props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} CreateButtonModal createButtonTitle={t("Add new user")} title={t("New user")} />;
};

export default CreateUser;
