//client\src\components\Forms\UserWorkItem\UserWorkItemFormCreate\UserWorkItemCreateForm.tsx
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import FormDatePicker from "@/components/common/FormElements/FormDatePicker";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import FormTextareaInput from "@/components/common/FormElements/FormTextareaInput";
import WorkItemActiviySelector from "@/components/common/FormElements/FormWorkitemActivitySelector";
import TaskItemStatusSelector from "@/components/common/FormElements/TaskItemStatusSelector";
import { Separator } from "@/components/ui/separator";
import { useUserWorkitem } from "@/context/UserWorkitemContext";
import { useWorkItemFormHooks } from "@/hooks/forms/useWorkItemForm";
import { WorkItemSchema } from "@/models/workItem/workItemSchema";
import { ClipboardList, Hammer, Calculator } from "lucide-react";
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
type UserWorkItemCreateFormProps = {
  handleSubmit: (workItemData: WorkItemSchema) => void;
  isPending: boolean;
};

const UserWorkItemCreateForm = ({ handleSubmit, isPending }: UserWorkItemCreateFormProps) => {
  const { useCreateWorkItemForm } = useWorkItemFormHooks();
  const form = useCreateWorkItemForm();
  const { measure, defaultPricingId } = useUserWorkitem();

  useEffect(() => {
      form.setValue("defaultPriceId", `${defaultPricingId}`);
  }, [defaultPricingId, form]);

  return (
    <FormProvider {...form}>
      <form id="task-item" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput className="pl-10" label="Work item name" name="name" type="text" Icon={ClipboardList} />
          <FormFieldInput label="Finished work" name="finished_work" type="text" className="pl-10" Icon={Hammer} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2 mb-2">
          <WorkItemActiviySelector label="Select activity" name="activity" />
          <div className="flex items-center justify-center content-center flex-col">
            <FormFieldInput name="quantity" label="Quantity" type="number" className="pl-10" Icon={Calculator} />
            <p className="text-xs text-gray-500 text-wrap"> {measure?.name}</p>
          </div>
          <input {...form.register("defaultPriceId")} type="hidden" name="defaultPriceId" value={defaultPricingId} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2">
          <FormDatePicker name="start_date" label="Select a start date" />
          <FormDatePicker name="end_date" label="Select an end date" />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 ">
          <TaskItemStatusSelector label="Status" name="status" />
        </div>
        <FormTextareaInput label="Note" name="note" type="text" className="pt-2" />
        <DialogFooter disabled={!form.formState.isDirty || isPending} className="mt-6" formName="task-item" label="Submit" />
      </form>
    </FormProvider>
  );
};

export default UserWorkItemCreateForm;
