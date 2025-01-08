//client\src\components\Forms\User\UserFormCreate\CreateUser.tsx
import { userSchema, UserSchema } from "@/models/user/userSchema";
import CreateUserForm from "./CreateUserForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

const CreateUser = () => {
  const { isOpen, setIsOpen } = useDialogState();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    addNew: "Add new user",
    title: "New user",
    success: "User created successfully!"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        addNew: await translate("Add new user"),
        title: await translate("New user"),
        success: await translate("User created successfully!")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<UserSchema>({
    URL: "/users/create",
    queryKey: ["users"],
    successToast: "User created successfully!",
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, userSchema);

  return <DialogModal Component={CreateUserForm} props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} CreateButtonModal createButtonTitle={translations.addNew} title={translations.title} />;
};

export default CreateUser;
