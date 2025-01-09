//client\src\components\Forms\Activities\ActivityFormCreate\CreateActivity.tsx
import { activitySchema, ActivitySchema } from "@/models/activity/activitySchema";
import CreateActivityForm from "./CreateActivityForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useTranslation } from "react-i18next";

const CreateActivity = () => {
  const { t } = useTranslation();
  const { isOpen, setIsOpen } = useDialogState();

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<ActivitySchema>({
    URL: "/activities/create",
    queryKey: ["activities"],
    successToast: t("Activity created successfully!"),
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, activitySchema);

  return <DialogModal Component={CreateActivityForm} props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} CreateButtonModal createButtonTitle={t("Add new activity")} title={t("New activity")} />;
};

export default CreateActivity;
