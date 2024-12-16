//client\src\components\Forms\UserWorkItem\UserWorkItemFormEdit\UserWorkItemEdit.tsx
import useDialogState from "@/hooks/useDialogState";
import { useMutationHook } from "@/hooks/useMutationHook";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import UserWorkItemEditForm from "./UserWorkItemEditForm";
import { workItemSchema, WorkItemSchema } from "@/models/workItem/workItemSchema";
import { useParams } from "react-router-dom";
import DialogModal from "@/components/common/DialogElements/DialogModal";

type UserWorkItemEditProps = {
  workItemId?: string;
};

const UserWorkItemEdit = ({ workItemId }: UserWorkItemEditProps) => {
  const { taskId } = useParams();

  const { isOpen, setIsOpen } = useDialogState();

  const { useEditEntity } = useMutationHook();

  const { mutate, isPending } = useEditEntity<WorkItemSchema>({
    URL: `/my-projects/${taskId}/task/${workItemId}/edit`,
    queryKey: ["artisanTasks", taskId],
    successToast: "Work item updated successfully!",
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, workItemSchema);

  return <DialogModal Component={UserWorkItemEditForm} props={{ handleSubmit, isPending, taskId, workItemId }} isOpen={isOpen} setIsOpen={setIsOpen} title="Edit work item" />;
};

export default UserWorkItemEdit;
