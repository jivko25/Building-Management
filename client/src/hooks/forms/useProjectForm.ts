//client\src\hooks\forms\useProjectForm.ts
import { projectDefaults, projectSchema, ProjectSchema } from "@/models/project/projectSchema";
import { useDynamicForm } from "./dynamicForm/useDynamicForm";

export const useProjectFormHook = () => {
  const { useCreateForm, useEditForm } = useDynamicForm<ProjectSchema>(projectSchema as any, projectDefaults);

  return {
    useCreateProjectForm: useCreateForm,
    useEditProjectForm: useEditForm
  };
};
