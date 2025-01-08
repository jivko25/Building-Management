//client\src\components\Forms\User\UserFormEdit\EditUser.tsx
import { userSchema, UserSchema } from "@/models/user/userSchema";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import EditUserForm from "./EditUserForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

type UserFormProps = {
  userId: string;
};

const EditUser = ({ userId }: UserFormProps) => {
  const { isOpen, setIsOpen } = useDialogState();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    title: "Edit user",
    success: "User updated successfully!"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await translate("Edit user"),
        success: await translate("User updated successfully!")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useEditEntity } = useMutationHook();

  const { mutate, isPending } = useEditEntity<UserSchema>({
    URL: `/users/${userId}/edit`,
    queryKey: ["users"],
    successToast: "User updated successfully!",
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, userSchema);

  return <DialogModal Component={EditUserForm} props={{ handleSubmit, isPending, userId }} isOpen={isOpen} setIsOpen={setIsOpen} title={translations.title} />;
};

export default EditUser;
