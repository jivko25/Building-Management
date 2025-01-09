//client\src\components\Forms\Projects\ProjectFormCreate\CreateProject.tsx
import { projectSchema, ProjectSchema } from "@/models/project/projectSchema";
import CreateProjectForm from "./CreateProjectForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

const CreateProject = () => {
  const { isOpen, setIsOpen } = useDialogState();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    addNew: "Add new project",
    title: "Create project",
    success: "Project created successfully!"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        addNew: await translate("Add new project"),
        title: await translate("Create project"),
        success: await translate("Project created successfully!")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<ProjectSchema>({
    URL: "/projects/create",
    queryKey: ["projects"],
    successToast: translations.success,
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, projectSchema);

  return <DialogModal Component={CreateProjectForm} CreateButtonModal props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} createButtonTitle={translations.addNew} title={translations.title} />;
};

export default CreateProject;
