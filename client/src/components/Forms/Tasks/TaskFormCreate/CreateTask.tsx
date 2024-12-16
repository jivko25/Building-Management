//client\src\components\Forms\Tasks\TaskFormCreate\CreateTask.tsx
import { useParams } from "react-router-dom";
import { taskSchema, TaskSchema } from "@/models/task/taskSchema";
import CreateTaskForm from "./CreateTaskForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";

const CreateTask = () => {
  const { id } = useParams();

  const { isOpen, setIsOpen } = useDialogState();

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<TaskSchema>({
    URL: `/projects/${id}/create-task`,
    queryKey: ["projects", id, "tasks"],
    successToast: "Task created successfully!",
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, taskSchema);

  return <DialogModal Component={CreateTaskForm} CreateButtonModal props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} createButtonTitle="Add new task" title="New task" />;
};

export default CreateTask;
