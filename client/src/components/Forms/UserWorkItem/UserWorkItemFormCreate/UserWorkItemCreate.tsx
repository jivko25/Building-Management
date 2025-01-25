//client\src\components\Forms\UserWorkItem\UserWorkItemFormCreate\UserWorkItemCreate.tsx
import { useParams } from "react-router-dom";
import UserWorkItemCreateForm from "./UserWorkItemCreateForm";
import useDialogState from "@/hooks/useDialogState";
import { useMutationHook } from "@/hooks/useMutationHook";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { workItemSchema, WorkItemSchema } from "@/models/workItem/workItemSchema";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useUserWorkitem } from "@/context/UserWorkitemContext";
import { useEffect } from "react";

type UserWorkItemCreate = {
  projectId: string;
};

const UserWorkItemCreate = ({projectId} : UserWorkItemCreate) => {
  const { taskId } = useParams();
  const { dispatch } = useUserWorkitem();
  const { isOpen, setIsOpen } = useDialogState();

  const { useCreateNewEntity } = useMutationHook();
  const { mutate, isPending } = useCreateNewEntity<WorkItemSchema>({
    URL: `/my-projects/${taskId}/task/create`,
    queryKey: ["artisanTasks", taskId],
    successToast: "Work item created successfully!",
    setIsOpen
  });  

  useEffect(() => {
    dispatch({ type: "RESET_MEASURE" });
  }, [isOpen]);

  const handleSubmit = useSubmitHandler(mutate, workItemSchema);
  return <DialogModal Component={UserWorkItemCreateForm} CreateButtonModal createButtonTitle="Add work item" props={{ handleSubmit, isPending, projectId }} isOpen={isOpen} setIsOpen={setIsOpen} title="New work item" />;
};

export default UserWorkItemCreate;
