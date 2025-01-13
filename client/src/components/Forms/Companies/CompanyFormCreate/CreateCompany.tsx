//client\src\components\Forms\Companies\CompanyFormCreate\CreateCompany.tsx
import { companySchema, CompanySchema } from "@/models/company/companySchema";
import CreateCompanyForm from "./CreateCompanyForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useTranslation } from "react-i18next";

const CreateCompany = () => {
  const { t } = useTranslation();
  const { isOpen, setIsOpen } = useDialogState();

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<CompanySchema>({
    URL: "/companies/create",
    queryKey: ["companies"],
    successToast: t("Company created successfully!"),
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, companySchema);

  return <DialogModal Component={CreateCompanyForm} CreateButtonModal props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} createButtonTitle={t("Add new company")} title={t("New company")} />;
};

export default CreateCompany;
