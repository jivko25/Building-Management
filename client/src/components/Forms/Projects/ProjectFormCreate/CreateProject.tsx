//client\src\components\Forms\Projects\ProjectFormCreate\CreateProject.tsx
import { projectSchema, ProjectSchema } from "@/models/project/projectSchema";
import CreateProjectForm from "./CreateProjectForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useTranslation } from "react-i18next";
const CreateProject = () => {
  const { isOpen, setIsOpen } = useDialogState();
  const { t } = useTranslation();
  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<ProjectSchema>({
    URL: "/projects/create",
    queryKey: ["projects"],
    successToast: t("Project created successfully!"),
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, projectSchema);

  return <DialogModal Component={CreateProjectForm} CreateButtonModal props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} createButtonTitle={t("Add new project")} title={t("Create project")} />;
};

export default CreateProject;
