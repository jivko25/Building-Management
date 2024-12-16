//client\src\components\Forms\Projects\ProjectFormCreate\CreateProject.tsx
import { projectSchema, ProjectSchema } from "@/models/project/projectSchema";
import CreateProjectForm from "./CreateProjectForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";

const CreateProject = () => {
  const { isOpen, setIsOpen } = useDialogState();

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<ProjectSchema>({
    URL: "/projects/create",
    queryKey: ["projects"],
    successToast: "Project created successfully!",
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, projectSchema);

  return <DialogModal Component={CreateProjectForm} CreateButtonModal props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} createButtonTitle="Add new project" title="Create project" />;
};

export default CreateProject;
