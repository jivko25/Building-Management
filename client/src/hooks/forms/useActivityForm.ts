//client\src\hooks\forms\useActivityForm.ts
import { activityDefaults, activitySchema, ActivitySchema } from "@/models/activity/activitySchema";
import { useDynamicForm } from "./dynamicForm/useDynamicForm";

export const useActivityFormHooks = () => {
  const { useCreateForm, useEditForm } = useDynamicForm<ActivitySchema>(activitySchema, activityDefaults);

  return {
    useCreateActivityForm: useCreateForm,
    useEditActivityForm: useEditForm
  };
};
