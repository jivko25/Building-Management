//client\src\components\Forms\User\UserFormEdit\EditUser.tsx
import { userSchema, UserSchema } from "@/models/user/userSchema";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import EditUserForm from "./EditUserForm";
import { useTranslation } from "react-i18next";

type UserFormProps = {
  userId: string;
};

const EditUser = ({ userId }: UserFormProps) => {
  const { t } = useTranslation();
  const { isOpen, setIsOpen } = useDialogState();

  const { useEditEntity } = useMutationHook();

  const { mutate, isPending } = useEditEntity<UserSchema>({
    URL: `/users/${userId}/edit`,
    queryKey: ["users"],
    successToast: t("User updated successfully!"),
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, userSchema);

  return <DialogModal Component={EditUserForm} props={{ handleSubmit, isPending, userId }} isOpen={isOpen} setIsOpen={setIsOpen} title={t("Edit user")} />;
};

export default EditUser;
