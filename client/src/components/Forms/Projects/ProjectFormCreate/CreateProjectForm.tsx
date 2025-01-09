//client\src\components\Forms\Projects\ProjectFormCreate\CreateProjectForm.tsx
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import CompanySelector from "@/components/common/FormElements/FormCompanySelector";
import FormDatePicker from "@/components/common/FormElements/FormDatePicker";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import FormTextareaInput from "@/components/common/FormElements/FormTextareaInput";
import { Separator } from "@/components/ui/separator";
import { useProjectFormHook } from "@/hooks/forms/useProjectForm";
import { ProjectSchema } from "@/models/project/projectSchema";
import { ClipboardList, Mail, MapPin } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

type CreateProjectFormProps = {
  handleSubmit: (projectData: ProjectSchema) => void;
  isPending: boolean;
};

const CreateProjectForm = ({ handleSubmit, isPending }: CreateProjectFormProps) => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    projectName: "Project name",
    projectEmail: "Project email",
    projectAddress: "Project address",
    projectLocation: "Project location",
    status: "Status",
    selectCompany: "Select company",
    startDate: "Select a start date",
    endDate: "Select an end date",
    projectNote: "Project note",
    notesPlaceholder: "Project notes...",
    submit: "Submit"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        projectName: await translate("Project name"),
        projectEmail: await translate("Project email"),
        projectAddress: await translate("Project address"),
        projectLocation: await translate("Project location"),
        status: await translate("Status"),
        selectCompany: await translate("Select company"),
        startDate: await translate("Select a start date"),
        endDate: await translate("Select an end date"),
        projectNote: await translate("Project note"),
        notesPlaceholder: await translate("Project notes..."),
        submit: await translate("Submit")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useCreateProjectForm } = useProjectFormHook();
  const form = useCreateProjectForm();

  return (
    <FormProvider {...form}>
      <form id="project-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={translations.projectName} name="name" className="pl-10" Icon={ClipboardList} />
          <FormFieldInput type="email" label={translations.projectEmail} name="email" className="pl-10" Icon={Mail} />
          <FormFieldInput type="text" label={translations.projectAddress} name="address" className="pl-10" Icon={MapPin} />
          <FormFieldInput type="text" label={translations.projectLocation} name="location" className="pl-10" Icon={MapPin} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 ">
          <StatusSelector label={translations.status} name="status" defaultVal="active" />
          <CompanySelector label={translations.selectCompany} name="company_name" />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2">
          <FormDatePicker name="start_date" label={translations.startDate} />
          <FormDatePicker name="end_date" label={translations.endDate} />
        </div>
        <Separator className="mt-2 mb-2" />
        <FormTextareaInput name="note" label={translations.projectNote} placeholder={translations.notesPlaceholder} type="text" />
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={translations.submit} formName="project-form" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default CreateProjectForm;
