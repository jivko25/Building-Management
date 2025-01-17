//client\src\hooks\forms\useUserForm.ts
import { useDynamicForm } from "./dynamicForm/useDynamicForm";
import { EditUserSchema, editUserSchema, userDefaultValues, userSchema, UserSchema } from "@/models/user/userSchema";

export const useUserFormHooks = () => {
  const { useCreateForm } = useDynamicForm<UserSchema>(userSchema, userDefaultValues);
  const { useEditForm } = useDynamicForm<EditUserSchema>(editUserSchema, userDefaultValues);

  return {
    useCreateUserForm: useCreateForm,
    useEditUserForm: useEditForm
  };
};
