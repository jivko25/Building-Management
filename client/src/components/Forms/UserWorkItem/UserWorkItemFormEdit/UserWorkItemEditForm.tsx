//client\src\components\Forms\UserWorkItem\UserWorkItemFormEdit\UserWorkItemEditForm.tsx
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import FormDatePicker from "@/components/common/FormElements/FormDatePicker";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import FormTextareaInput from "@/components/common/FormElements/FormTextareaInput";
import TaskItemStatusSelector from "@/components/common/FormElements/TaskItemStatusSelector";
import { Separator } from "@/components/ui/separator";
import { useWorkItemFormHooks } from "@/hooks/forms/useWorkItemForm";
import { useCachedData } from "@/hooks/useQueryHook";
import { WorkItemSchema } from "@/models/workItem/workItemSchema";
import { ProjectTask } from "@/types/task-types/taskTypes";
import { WorkItem } from "@/types/work-item-types/workItem";
import { findItemById } from "@/utils/helpers/findItemById";
import { ClipboardList, Hammer } from "lucide-react";
import { FormProvider } from "react-hook-form";

type UserWorkItemEditFormProps = {
  taskId?: string;
  handleSubmit: (data: WorkItemSchema) => void;
  isPending: boolean;
  workItemId?: string;
};

const UserWorkItemEditForm = ({ handleSubmit, taskId, workItemId, isPending }: UserWorkItemEditFormProps) => {
  const userWorkItem = useCachedData<WorkItem>({
    queryKey: ["artisanTasks", taskId],
    selectFn: data => findItemById<WorkItem>(data as ProjectTask, workItemId as string, item => item.id as string)
  });

  const { useEditWorkItemForm } = useWorkItemFormHooks();

  const form = useEditWorkItemForm(userWorkItem as Partial<WorkItem>);
  return (
    <FormProvider {...form}>
      <form id="user-work-item-edit" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput name="name" label="Item title" type="text" className="pl-10" Icon={ClipboardList} />
          <FormFieldInput name="finished_work" label="Finished work" type="text" className="pl-10" Icon={Hammer} />
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
