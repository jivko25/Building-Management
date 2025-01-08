//client\src\components\Forms\Activities\ActivityFormCreate\CreateActivityForm.tsx
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import { Separator } from "@/components/ui/separator";
import { useActivityFormHooks } from "@/hooks/forms/useActivityForm";
import { ActivitySchema } from "@/models/activity/activitySchema";
import { Activity } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type CreateActivityFormProps = {
  handleSubmit: (activityData: ActivitySchema) => void;
  isPending: boolean;
};

const CreateActivityForm = ({ handleSubmit, isPending }: CreateActivityFormProps) => {
  const { useCreateActivityForm } = useActivityFormHooks();
  const form = useCreateActivityForm();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    activityName: "Activity name",
    status: "Status",
    submit: "Submit"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        activityName: await translate("Activity name"),
        status: await translate("Status"),
        submit: await translate("Submit")
      });
    };
    loadTranslations();
  }, [translate]);

  return (
    <FormProvider {...form}>
      <form id="activity-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={translations.activityName} name="name" className="pl-10" Icon={Activity} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label={translations.status} name="status" placeholder="active" />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={translations.submit} formName="activity-form" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default CreateActivityForm;
