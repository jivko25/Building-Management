import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import FormDatePicker from "@/components/common/FormElements/FormDatePicker";
import DefaultPricingSelector from "@/components/common/FormElements/FormDefaultValueSelector";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import FormTextareaInput from "@/components/common/FormElements/FormTextareaInput";
import WorkItemActiviySelector from "@/components/common/FormElements/FormWorkitemActivitySelector";
import TaskItemStatusSelector from "@/components/common/FormElements/TaskItemStatusSelector";
import { Separator } from "@/components/ui/separator";
import { useUserWorkitem } from "@/context/UserWorkitemContext";
import { useWorkItemFormHooks } from "@/hooks/forms/useWorkItemForm";
import { WorkItemSchema } from "@/models/workItem/workItemSchema";
import { Calculator, Clock } from "lucide-react";
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";

type UserWorkItemCreateFormProps = {
  handleSubmit: (workItemData: WorkItemSchema) => void;
  isPending: boolean;
  projectId: string;
};

const UserWorkItemCreateForm = ({ handleSubmit, isPending, projectId }: UserWorkItemCreateFormProps) => {
  const { useCreateWorkItemForm } = useWorkItemFormHooks();
  const form = useCreateWorkItemForm();
  const { measure, defaultPricingId } = useUserWorkitem();

  useEffect(() => {
    form.setValue("default_pricing", `${defaultPricingId}`);
  }, [defaultPricingId, form]);

  useEffect(() => {
    form.setValue("project_id", projectId);
  }, []);

  return (
    <FormProvider {...form}>
      <form id="task-item" onSubmit={form.handleSubmit(handleSubmit)}>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2 mb-2">
          <DefaultPricingSelector name="default_pricing" label="Activity" />
          <div className="flex items-center justify-center content-center flex-col">
            <FormFieldInput name="quantity" label="Quantity" type="number" className="pl-10" Icon={Calculator} />
            <p className="text-xs text-gray-500 text-wrap">{measure?.name}</p>
          </div>
          <FormFieldInput name="hours" label="Hours" type="number" className="pl-10" Icon={Clock} />
          <input {...form.register("default_pricing")} type="hidden" name="default_pricing" value={defaultPricingId} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2">
          <FormDatePicker name="start_date" label="Select a start date" />
          <FormDatePicker name="end_date" label="Select an end date" />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          <TaskItemStatusSelector label="Status" name="status" />
        </div>
        <FormTextareaInput label="Note" name="note" type="text" className="pt-2" />
        <DialogFooter disabled={!form.formState.isDirty || isPending} className="mt-6" formName="task-item" label="Submit" />
      </form>
    </FormProvider>
  );
};

export default UserWorkItemCreateForm;
