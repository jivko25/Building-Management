//client\src\components\Forms\Companies\CompanyFormEdit\EditCompany.tsx
import { companySchema, CompanySchema } from "@/models/company/companySchema";
import useDialogState from "@/hooks/useDialogState";
import { useSubmitHandler } from "@/utils/helpers/submitHandler";
import { useMutationHook } from "@/hooks/useMutationHook";
import DialogModal from "@/components/common/DialogElements/DialogModal";
import EditCompanyForm from "./EditCompanyForm";

type CompanyFormProps = {
  company_id: string;
};

const EditCompany = ({ company_id }: CompanyFormProps) => {
  const { isOpen, setIsOpen } = useDialogState();

  const { useEditEntity } = useMutationHook();
  const { mutate, isPending } = useEditEntity<CompanySchema>({
    URL: `/companies/${company_id}/edit`,
    queryKey: ["companies"],
    successToast: "Company updated successfully!",
    setIsOpen
  });

  const handleSubmit = useSubmitHandler(mutate, companySchema);

  return <DialogModal Component={EditCompanyForm} props={{ company_id, handleSubmit, isPending }} isOpen={isOpen} setIsOpen={setIsOpen} title="Edit company" />;
};

export default EditCompany;
