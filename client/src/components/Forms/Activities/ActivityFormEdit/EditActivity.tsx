//client\src\components\Forms\Activities\ActivityFormEdit\EditActivity.tsx
import { activitySchema, ActivitySchema } from "@/models/activity/activitySchema";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import EditActivityForm from "./EditActivityForm";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import useDialogState from "@/hooks/useDialogState";
import { useTranslation } from "react-i18next";
type ActivityFormProps = {
  activityId: string;
};

const EditActivity = ({ activityId }: ActivityFormProps) => {
  const { isOpen, setIsOpen } = useDialogState();
  const { t } = useTranslation();
  const { useEditEntity } = useMutationHook();

  const { mutate, isPending } = useEditEntity<ActivitySchema>({
    URL: `/activities/${activityId}/edit`,
    queryKey: ["activities"],
    successToast: t("Activity updated successfully!"),
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, activitySchema);

  return <DialogModal Component={EditActivityForm} props={{ activityId, handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} title={t("Edit activity")} />;
};

export default EditActivity;
