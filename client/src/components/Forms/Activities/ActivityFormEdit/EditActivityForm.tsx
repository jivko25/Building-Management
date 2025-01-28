//client\src\components\Forms\Activities\ActivityFormEdit\EditActivityForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import { Activity as ActivityIcon } from "lucide-react";
import { useActivityFormHooks } from "@/hooks/forms/useActivityForm";
import { useCachedData } from "@/hooks/useQueryHook";
import { Activity } from "@/types/activity-types/activityTypes";
import { ActivitySchema } from "@/models/activity/activitySchema";
import { findItemById } from "@/utils/helpers/findItemById";
import { PaginatedDataResponse } from "@/types/query-data-types/paginatedDataTypes";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

type EditActivityFormProps = {
  handleSubmit: (activityData: ActivitySchema) => void;
  activityId: string;
  isPending: boolean;
};

const EditActivityForm = ({ activityId, handleSubmit, isPending }: EditActivityFormProps) => {
  const { t } = useTranslation();

  const activity = useCachedData<Activity>({
    queryKey: ["activities"],
    selectFn: data => {
      console.log("Searching for activity ID:", activityId);
      const found = findItemById<Activity>(data as PaginatedDataResponse<Activity>, activityId, activity => activity.id as string);
      console.log("Found activity data:", found);
      return found;
    }
  });

  const { useEditActivityForm } = useActivityFormHooks();
  const form = useEditActivityForm(activity as Partial<Activity>);

  return (
    <FormProvider {...form}>
      <form id="form-edit" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Activity name")} name="name" className="pl-10" Icon={ActivityIcon} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2">
          <StatusSelector label={t("Status")} name="status" placeholder={t("active")} defaultVal={activity && activity.status} />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={t("Submit changes")} formName="form-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditActivityForm;
