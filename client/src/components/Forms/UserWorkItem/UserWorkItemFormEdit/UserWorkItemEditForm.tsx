//client\src\components\Forms\UserWorkItem\UserWorkItemFormEdit\UserWorkItemEditForm.tsx
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import FormDatePicker from "@/components/common/FormElements/FormDatePicker";
import DefaultPricingSelector from "@/components/common/FormElements/FormDefaultValueSelector";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import FormTextareaInput from "@/components/common/FormElements/FormTextareaInput";
import TaskItemStatusSelector from "@/components/common/FormElements/TaskItemStatusSelector";
import { Separator } from "@/components/ui/separator";
import { useWorkItemFormHooks } from "@/hooks/forms/useWorkItemForm";
import { useCachedData, useFetchDataQuery } from "@/hooks/useQueryHook";
import { WorkItemSchema } from "@/models/workItem/workItemSchema";
import { DefaultPricingResponse } from "@/types/defaultPricingType/defaultPricingTypes";
import { ProjectTask } from "@/types/task-types/taskTypes";
import { WorkItem } from "@/types/work-item-types/workItem";
import { findItemById } from "@/utils/helpers/findItemById";
import { Calculator, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";

type UserWorkItemEditFormProps = {
  taskId?: string;
  handleSubmit: (data: WorkItemSchema) => void;
  isPending: boolean;
  workItemId?: string;
};

const UserWorkItemEditForm = ({ handleSubmit, taskId, workItemId, isPending }: UserWorkItemEditFormProps) => {
  const [measure, setMeasure] = useState("");

  const userWorkItem = useCachedData<WorkItem>({
    queryKey: ["artisanTasks", taskId],
    selectFn: data => findItemById<WorkItem>(data as ProjectTask, workItemId as string, item => item.id as string)
  });
  console.log(userWorkItem);

  const { data: defaultPricingsResponse, refetch } = useFetchDataQuery<DefaultPricingResponse>({
    URL: userWorkItem?.artisan_id ? `/default-pricing/${userWorkItem.artisan_id}` : `/default-pricing`,
    queryKey: ["default-pricing"]
  });
  const { useEditWorkItemForm } = useWorkItemFormHooks();
  const form = useEditWorkItemForm({
    ...(userWorkItem as Partial<WorkItem>),
    hours: userWorkItem?.hours ?? 0
  });
  const defaultPrinceId = form.watch("default_pricing");

  const onError = (errors: any) => {
    console.log("❌ Form Errors:", errors); // Check if there are validation errors
  };
  useEffect(() => {
    if (defaultPrinceId) {
      refetch();
      const price = defaultPricingsResponse?.defaultPricing.find(pricing => pricing.id == defaultPrinceId);
      setMeasure(price?.measure?.name || "");
    }
  }, [defaultPrinceId, defaultPricingsResponse]);
  return (
    <FormProvider {...form}>
      <form id="user-work-item-edit" onSubmit={form.handleSubmit(handleSubmit, onError)}>
        <Separator className="mt-4 mb-2" />
        <DefaultPricingSelector name="default_pricing" label="Activity" artisan_id={userWorkItem?.artisan_id} defaultVal={userWorkItem?.activity_id} />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2 mb-2">
          <FormFieldInput name="hours" label="Hours" type="number" className="pl-10" Icon={Clock} />
          <div className="flex items-center justify-center content-center flex-col">
            <FormFieldInput name="quantity" label="Quantity" type="number" className="pl-10" Icon={Calculator} />
            <p className="text-xs text-gray-500 text-wrap"> {measure}</p>
          </div>
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2">
          <FormDatePicker name="start_date" label="Select a start date" />
          <FormDatePicker name="end_date" label="Select an end date" />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          <TaskItemStatusSelector name="status" label="Select status" defaultVal={userWorkItem?.status} />
        </div>

        <FormTextareaInput name="note" label="Item note" type="text" className="pt-2" />
        <DialogFooter disabled={!form.formState.isDirty || isPending} label="Submit changes" formName="user-work-item-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default UserWorkItemEditForm;
