//client\src\components\Forms\Activities\ActivityFormCreate\CreateActivityForm.tsx
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import { Separator } from "@/components/ui/separator";
import { useActivityFormHooks } from "@/hooks/forms/useActivityForm";
import { ActivitySchema } from "@/models/activity/activitySchema";
import { Activity } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

type CreateActivityFormProps = {
  handleSubmit: (activityData: ActivitySchema) => void;
  isPending: boolean;
};

const CreateActivityForm = ({ handleSubmit, isPending }: CreateActivityFormProps) => {
  const { t } = useTranslation();
  const { useCreateActivityForm } = useActivityFormHooks();
  const form = useCreateActivityForm();

  return (
    <FormProvider {...form}>
      <form id="activity-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Activity name")} name="name" className="pl-10" Icon={Activity} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label={t("Status")} name="status" placeholder={t("active")} />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={t("Submit")} formName="activity-form" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default CreateActivityForm;
