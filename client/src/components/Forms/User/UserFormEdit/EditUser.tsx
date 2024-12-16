//client\src\components\Forms\User\UserFormEdit\EditUser.tsx
import { userSchema, UserSchema } from "@/models/user/userSchema";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import EditUserForm from "./EditUserForm";

type UserFormProps = {
  userId: string;
};

const EditUser = ({ userId }: UserFormProps) => {
  const { isOpen, setIsOpen } = useDialogState();

  const { useEditEntity } = useMutationHook();

  const { mutate, isPending } = useEditEntity<UserSchema>({
    URL: `/users/${userId}/edit`,
    queryKey: ["users"],
    successToast: "User updated successfully!",
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, userSchema);

  return <DialogModal Component={EditUserForm} props={{ handleSubmit, isPending, userId }} isOpen={isOpen} setIsOpen={setIsOpen} title="Edit user" />;
};

export default EditUser;
