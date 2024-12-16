//client\src\components\Forms\UserWorkItem\UserWorkItemFormCreate\UserWorkItemCreateForm.tsx
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import FormDatePicker from "@/components/common/FormElements/FormDatePicker";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import FormTextareaInput from "@/components/common/FormElements/FormTextareaInput";
import TaskItemStatusSelector from "@/components/common/FormElements/TaskItemStatusSelector";
import { Separator } from "@/components/ui/separator";
import { useWorkItemFormHooks } from "@/hooks/forms/useWorkItemForm";
import { WorkItemSchema } from "@/models/workItem/workItemSchema";
import { ClipboardList, Hammer } from "lucide-react";
import { FormProvider } from "react-hook-form";

type UserWorkItemCreateFormProps = {
  handleSubmit: (workItemData: WorkItemSchema) => void;
  isPending: boolean;
};

const UserWorkItemCreateForm = ({ handleSubmit, isPending }: UserWorkItemCreateFormProps) => {
  const { useCreateWorkItemForm } = useWorkItemFormHooks();

  const form = useCreateWorkItemForm();

  return (
    <FormProvider {...form}>
      <form id="task-item" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput className="pl-10" label="Task name" name="name" type="text" Icon={ClipboardList} />
          <FormFieldInput label="Finished work" name="finished_work" type="text" className="pl-10" Icon={Hammer} />
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
