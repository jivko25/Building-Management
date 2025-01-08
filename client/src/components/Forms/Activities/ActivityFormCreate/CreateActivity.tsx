//client\src\components\Forms\Activities\ActivityFormCreate\CreateActivity.tsx
import { activitySchema, ActivitySchema } from "@/models/activity/activitySchema";
import CreateActivityForm from "./CreateActivityForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const CreateActivity = () => {
  const { isOpen, setIsOpen } = useDialogState();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    addNew: "Add new activity",
    title: "New activity",
    success: "Activity created successfully!"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        addNew: await translate("Add new activity"),
        title: await translate("New activity"),
        success: await translate("Activity created successfully!")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<ActivitySchema>({
    URL: "/activities/create",
    queryKey: ["activities"],
    successToast: "Activity created successfully!",
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, activitySchema);

  return <DialogModal Component={CreateActivityForm} props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} CreateButtonModal createButtonTitle={translations.addNew} title={translations.title} />;
};

export default CreateActivity;
