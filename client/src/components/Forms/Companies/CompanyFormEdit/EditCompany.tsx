//client\src\components\Forms\Companies\CompanyFormEdit\EditCompany.tsx
import { companySchema, CompanySchema } from "@/models/company/companySchema";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import EditCompanyForm from "./EditCompanyForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type CompanyFormProps = {
  company_id: string;
};

const EditCompany = ({ company_id }: CompanyFormProps) => {
  const { isOpen, setIsOpen } = useDialogState();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    title: "Edit company",
    success: "Company updated successfully!"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        title: await translate("Edit company"),
        success: await translate("Company updated successfully!")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useEditEntity } = useMutationHook();
  const { mutate, isPending } = useEditEntity<CompanySchema>({
    URL: `/companies/${company_id}/edit`,
    queryKey: ["companies"],
    successToast: translations.success,
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, companySchema);

  return <DialogModal Component={EditCompanyForm} props={{ company_id, handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} title={translations.title} />;
};

export default EditCompany;
