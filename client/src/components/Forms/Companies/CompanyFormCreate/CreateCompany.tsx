//client\src\components\Forms\Companies\CompanyFormCreate\CreateCompany.tsx
import { companySchema, CompanySchema } from "@/models/company/companySchema";
import CreateCompanyForm from "./CreateCompanyForm";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

const CreateCompany = () => {
  const { isOpen, setIsOpen } = useDialogState();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    addNew: "Add new company",
    title: "New company",
    success: "Company created successfully!"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        addNew: await translate("Add new company"),
        title: await translate("New company"),
        success: await translate("Company created successfully!")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useCreateNewEntity } = useMutationHook();

  const { mutate, isPending } = useCreateNewEntity<CompanySchema>({
    URL: "/companies/create",
    queryKey: ["companies"],
    successToast: translations.success,
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, companySchema);

  return <DialogModal Component={CreateCompanyForm} CreateButtonModal props={{ handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} createButtonTitle={translations.addNew} title={translations.title} />;
};

export default CreateCompany;
