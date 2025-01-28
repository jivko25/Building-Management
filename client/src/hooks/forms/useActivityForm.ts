//client\src\hooks\forms\useActivityForm.ts
import { activityDefaults, activitySchema, ActivitySchema } from "@/models/activity/activitySchema";
import { useDynamicForm } from "./dynamicForm/useDynamicForm";
import { Activity } from "@/types/activity-types/activityTypes";

export const useActivityFormHooks = () => {
  const { useCreateForm, useEditForm } = useDynamicForm<ActivitySchema>(activitySchema, activityDefaults);

  const useEditActivityForm = (initialData: Partial<Activity>) => {
    console.log("useEditActivityForm - Initial Data:", initialData);
    return useEditForm({
      name: initialData?.name || "",
      status: initialData?.status || "active"
    });
  };

  return {
    useCreateActivityForm: useCreateForm,
    useEditActivityForm
  };
};
