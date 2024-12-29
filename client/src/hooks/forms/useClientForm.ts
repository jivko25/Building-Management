import { useDynamicForm } from "./dynamicForm/useDynamicForm";
import { clientDefaultValues, clientSchema, ClientSchema } from "@/models/client/clientSchema";

export const useClientFormHooks = () => {
  const { useCreateForm, useEditForm } = useDynamicForm<ClientSchema>(clientSchema, clientDefaultValues);

  return {
    useCreateClientForm: useCreateForm,
    useEditClientForm: useEditForm
  };
};
