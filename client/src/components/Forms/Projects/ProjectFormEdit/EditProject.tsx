//client\src\components\Forms\Projects\ProjectFormEdit\EditProject.tsx
import { projectSchema, ProjectSchema } from "@/models/project/projectSchema";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import EditProjectForm from "./EditProjectForm";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useTranslation } from "react-i18next";
type ProjectFormProps = {
  projectId: string;
};

const EditProject = ({ projectId }: ProjectFormProps) => {
  const { t } = useTranslation();
  const { isOpen, setIsOpen } = useDialogState();

  const { useEditEntity } = useMutationHook();

  const { mutate, isPending } = useEditEntity<ProjectSchema>({
    URL: `/projects/${projectId}/edit`,
    queryKey: ["projects"],
    successToast: t("Project updated successfully!"),
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, projectSchema);

  return <DialogModal Component={EditProjectForm} props={{ handleSubmit, isPending, projectId }} isOpen={isOpen} setIsOpen={setIsOpen} title={t("Edit project")} />;
};

export default EditProject;
