//client\src\hooks\forms\useUserForm.ts
import { useDynamicForm } from "./dynamicForm/useDynamicForm";
import { userDefaultValues, userSchema, UserSchema } from "@/models/user/userSchema";

export const useUserFormHooks = () => {
  const { useCreateForm, useEditForm } = useDynamicForm<UserSchema>(userSchema, userDefaultValues);

  return {
    useCreateUserForm: useCreateForm,
    useEditUserForm: useEditForm
  };
};
