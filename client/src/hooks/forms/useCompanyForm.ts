//client\src\hooks\forms\useCompanyForm.ts
import { companyDefaults, companySchema, CompanySchema } from "@/models/company/companySchema";
import { useDynamicForm } from "./dynamicForm/useDynamicForm";

export const useCompanyFormHooks = () => {
  const { useCreateForm, useEditForm } = useDynamicForm<CompanySchema>(companySchema, companyDefaults);

  return {
    useCreateCompanyForm: useCreateForm,
    useEditCompanyForm: useEditForm
  };
};
