//client\src\components\Forms\Activities\ActivityFormEdit\EditActivityForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import { Activity as ActivityIcon } from "lucide-react";
import { useActivityFormHooks } from "@/hooks/forms/useActivityForm";
import { ActivitySchema } from "@/models/activity/activitySchema";
import { Activity } from "@/types/activity-types/activityTypes";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

type EditActivityFormProps = {
  handleSubmit: (activityData: ActivitySchema) => void;
  activityId: string;
  isPending: boolean;
  initialData?: Activity;
};

const EditActivityForm = ({ handleSubmit, isPending, initialData }: EditActivityFormProps) => {
  const { t } = useTranslation();
  console.log("EditActivityForm - Initial Data:", initialData);

  const { useEditActivityForm } = useActivityFormHooks();
  const form = useEditActivityForm({
    name: initialData?.name || "",
    status: initialData?.status || "active"
  });

  console.log("Form values:", form.getValues());

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        status: initialData.status
      });
    }
  }, [initialData, form]);

  return (
    <FormProvider {...form}>
      <form id="form-edit" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Activity name")} name="name" className="pl-10" Icon={ActivityIcon} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label={t("Status")} name="status" placeholder={t("active")} defaultVal={initialData?.status} />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={t("Submit changes")} formName="form-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditActivityForm;
