//client\src\components\Forms\Tasks\TaskFormEdit\EditTask.tsx
import { editTaskSchema, TaskSchema } from "@/models/task/taskSchema";
import { useMutationHook } from "@/hooks/useMutationHook";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import EditTaskForm from "./EditTaskForm";
import useDialogState from "@/hooks/useDialogState";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type EditTaskFormProps = {
  id: string;
  taskId: string;
};

const EditTask = ({ id, taskId }: EditTaskFormProps) => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    title: "Edit task",
    success: "Task updated successfully!"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await translate("Edit task"),
        success: await translate("Task updated successfully!")
      });
    };
    loadTranslations();
  }, [translate]);

  const { isOpen, setIsOpen } = useDialogState();
  const { useEditEntity } = useMutationHook();

  const { mutate, isPending } = useEditEntity<TaskSchema>({
    URL: `/projects/${id}/tasks/${taskId}/edit`,
    queryKey: ["projects", id, "tasks"],
    successToast: translations.success,
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, editTaskSchema);

  console.log("✏️ Edit task component loaded with translations");

  return <DialogModal Component={EditTaskForm} props={{ handleSubmit, isPending, id, taskId }} isOpen={isOpen} setIsOpen={setIsOpen} title={translations.title} />;
};

export default EditTask;
