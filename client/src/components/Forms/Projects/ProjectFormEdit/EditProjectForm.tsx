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
import { ProjectSchema } from "@/models/project/projectSchema";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import FormClientSelector from "@/components/common/FormElements/FormClientSelector";
import { useEffect, useState } from "react";
import apiClient from "@/api/axiosConfig";
import { Project } from "@/types/project-types/projectTypes";

type EditProjectFormProps = {
  handleSubmit: (projectData: ProjectSchema) => void;
  isPending: boolean;
  projectId: string;
};

const EditProjectForm = ({ handleSubmit, isPending, projectId }: EditProjectFormProps) => {
  const { t } = useTranslation();
  const [projectData, setProjectData] = useState<Project | null>(null);
  const { useEditProjectForm } = useProjectFormHook();

  const form = useEditProjectForm({
    name: "",
    company_name: "",
    email: "",
    address: "",
    location: "",
    status: "active",
    client_id: 0
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiClient.get<Project>(`/projects/${projectId}`);
        setProjectData(response.data);
        
        form.reset({
          name: response.data.name,
          company_name: response.data.company_name,
          email: response.data.email,
          address: response.data.address,
          location: response.data.location,
          status: response.data.status,
          client_id: response.data.client_id,
          start_date: response.data.start_date,
          end_date: response.data.end_date,
          note: response.data.note
        });
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  console.log(projectData?.status, 'projectData');
  

  return (
    <FormProvider {...form}>
      <form id="edit-project" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Project name")} name="name" className="pl-10" Icon={ClipboardList} />
          <FormFieldInput type="text" label={t("Project address")} name="address" className="pl-10" Icon={MapPin} />
          <FormFieldInput type="text" label={t("Project location")} name="location" className="pl-10" Icon={MapPin} />
          <FormFieldInput type="email" label={t("Project email")} name="email" className="pl-10" Icon={Mail} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2 mb-4">
          <StatusSelector label={t("Status")} name="status" defaultVal={projectData?.status} />
          <CompanySelector label={t("Select company")} name="company_name" defaultVal={projectData?.company_name} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <FormClientSelector label={t("Select client")} name="client_id" defaultVal={projectData?.client_id?.toString()} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
          <FormDatePicker name="start_date" label={t("Select new start date")} selected={projectData?.start_date} />
          <FormDatePicker name="end_date" label={t("Select new end date")} selected={projectData?.end_date} />
        </div>
        <Separator className="my-2" />
        <FormTextareaInput placeholder={t("Project notes...")} className="resize-none" name="note" type="text" label={t("Project note")} />
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={t("Save changes")} formName="edit-project" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditProjectForm;
