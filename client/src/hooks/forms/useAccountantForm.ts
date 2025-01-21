//client\src\hooks\forms\useAccountantForm.ts
import { accountantDefaults, accountantSchema, AccountantSchema } from "@/models/accountant/accountantSchema";
import { useDynamicForm } from "./dynamicForm/useDynamicForm";

export const useAccountantFormHooks = () => {
    const { useCreateForm, useEditForm } = useDynamicForm<AccountantSchema>(accountantSchema, accountantDefaults);

    return {
        useCreateAccountantForm: useCreateForm,
        useEditAccountantForm: useEditForm
    };
};
