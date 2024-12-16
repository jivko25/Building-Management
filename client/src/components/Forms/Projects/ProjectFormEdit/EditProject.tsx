//client\src\components\Forms\Projects\ProjectFormEdit\EditProject.tsx
import { projectSchema, ProjectSchema } from "@/models/project/projectSchema";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import EditProjectForm from "./EditProjectForm";
import DialogModal from "@/components/common/DialogElements/DialogModal";

type ProjectFormProps = {
  projectId: string;
};

const EditProject = ({ projectId }: ProjectFormProps) => {
  const { isOpen, setIsOpen } = useDialogState();

  const { useEditEntity } = useMutationHook();

  const { mutate, isPending } = useEditEntity<ProjectSchema>({
    URL: `/projects/${projectId}/edit`,
    queryKey: ["projects"],
    successToast: "Project updated successfully!",
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, projectSchema);

  return <DialogModal Component={EditProjectForm} props={{ handleSubmit, isPending, projectId }} isOpen={isOpen} setIsOpen={setIsOpen} title="Edit project" />;
};

export default EditProject;
