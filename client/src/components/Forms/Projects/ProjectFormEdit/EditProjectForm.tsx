//client\src\components\Forms\Projects\ProjectFormEdit\EditProjectForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import FormTextareaInput from "@/components/common/FormElements/FormTextareaInput";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import CompanySelector from "@/components/common/FormElements/FormCompanySelector";
import FormDatePicker from "@/components/common/FormElements/FormDatePicker";
import { ClipboardList, Mail, MapPin } from "lucide-react";
import { useProjectFormHook } from "@/hooks/forms/useProjectForm";
import { Project } from "@/types/project-types/projectTypes";
import { ProjectSchema } from "@/models/project/projectSchema";
import { useCachedData } from "@/hooks/useQueryHook";
import { findItemById } from "@/utils/helpers/findItemById";
import { PaginatedDataResponse } from "@/types/query-data-types/paginatedDataTypes";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type EditProjectFormProps = {
  handleSubmit: (projectData: ProjectSchema) => void;
  isPending: boolean;
  projectId: string;
};

const EditProjectForm = ({ handleSubmit, isPending, projectId }: EditProjectFormProps) => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    projectName: "Project name",
    projectAddress: "Project address",
    projectLocation: "Project location",
    projectEmail: "Project email",
    status: "Status",
    selectCompany: "Select company",
    startDate: "Select new start date",
    endDate: "Select new end date",
    projectNote: "Project note",
    notesPlaceholder: "Project notes...",
    submit: "Save changes"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        projectName: await translate("Project name"),
        projectAddress: await translate("Project address"),
        projectLocation: await translate("Project location"),
        projectEmail: await translate("Project email"),
        status: await translate("Status"),
        selectCompany: await translate("Select company"),
        startDate: await translate("Select new start date"),
        endDate: await translate("Select new end date"),
        projectNote: await translate("Project note"),
        notesPlaceholder: await translate("Project notes..."),
        submit: await translate("Save changes")
      });
    };
    loadTranslations();
  }, [translate]);

  const project = useCachedData<Project>({
    queryKey: ["projects"],
    selectFn: data => findItemById<Project>(data as PaginatedDataResponse<Project>, projectId, project => project.id as string)
  });

  const { useEditProjectForm } = useProjectFormHook();
  const form = useEditProjectForm(project as Partial<Project>);

  return (
    <FormProvider {...form}>
      <form id="edit-project" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={translations.projectName} name="name" className="pl-10" Icon={ClipboardList} />
          <FormFieldInput type="text" label={translations.projectAddress} name="address" className="pl-10" Icon={MapPin} />
          <FormFieldInput type="text" label={translations.projectLocation} name="location" className="pl-10" Icon={MapPin} />
          <FormFieldInput type="email" label={translations.projectEmail} name="email" className="pl-10" Icon={Mail} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2 mb-4">
          <StatusSelector label={translations.status} name="status" defaultVal={project && project.status} />
          <CompanySelector label={translations.selectCompany} name="company_name" defaultVal={project && project.company_name} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
          <FormDatePicker name="start_date" label={translations.startDate} selected={new Date(`${project && project.start_date}`).toLocaleDateString().slice(0, 10)} />
          <FormDatePicker name="end_date" label={translations.endDate} selected={new Date(`${project && project.end_date}`).toLocaleDateString().slice(0, 10)} />
        </div>
        <Separator className="my-2" />
        <FormTextareaInput placeholder={translations.notesPlaceholder} className="resize-none" name="note" type="text" label={translations.projectNote} />
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={translations.submit} formName="edit-project" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditProjectForm;
