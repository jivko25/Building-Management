//client\src\components\Forms\Projects\ProjectFormEdit\EditProject.tsx
import { projectSchema, ProjectSchema } from "@/models/project/projectSchema";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import EditProjectForm from "./EditProjectForm";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

type ProjectFormProps = {
  projectId: string;
};

const EditProject = ({ projectId }: ProjectFormProps) => {
  const { isOpen, setIsOpen } = useDialogState();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    title: "Edit project",
    success: "Project updated successfully!"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await translate("Edit project"),
        success: await translate("Project updated successfully!")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useEditEntity } = useMutationHook();

  const { mutate, isPending } = useEditEntity<ProjectSchema>({
    URL: `/projects/${projectId}/edit`,
    queryKey: ["projects"],
    successToast: translations.success,
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, projectSchema);

  return <DialogModal Component={EditProjectForm} props={{ handleSubmit, isPending, projectId }} isOpen={isOpen} setIsOpen={setIsOpen} title={translations.title} />;
};

export default EditProject;
