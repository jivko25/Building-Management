//client\src\components\Forms\Tasks\TaskFormCreate\CreateTask.tsx
import { useParams } from "react-router-dom";
import { taskSchema, TaskSchema } from "@/models/task/taskSchema";
import CreateTaskForm from "./CreateTaskForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const CreateTask = () => {
  const { id } = useParams();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    title: "New task",
    buttonTitle: "Add new task",
    success: "Task created successfully!"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await translate("New task"),
        buttonTitle: await translate("Add new task"),
        success: await translate("Task created successfully!")
      });
    };
    loadTranslations();
  }, [translate]);

  const { isOpen, setIsOpen } = useDialogState();
  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<TaskSchema>({
    URL: `/projects/${id}/create-task`,
    queryKey: ["projects", id, "tasks"],
    successToast: translations.success,
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, taskSchema);

  console.log("📝 Create task component loaded with translations");

  return <DialogModal Component={CreateTaskForm} CreateButtonModal props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} createButtonTitle={translations.buttonTitle} title={translations.title} />;
};

export default CreateTask;
