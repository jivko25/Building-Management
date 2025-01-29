//client\src\components\Forms\Tasks\TaskFormEdit\EditTaskForm.tsx
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import ActivitySelector from "@/components/common/FormElements/FormActivitySelector";
import ArtisanSelector from "@/components/common/FormElements/FormArtisanSelector";
import FormDatePicker from "@/components/common/FormElements/FormDatePicker";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import MeasureSelector from "@/components/common/FormElements/FormMeasureSelector";
import StatusSelector from "@/components/common/FormElements/FormStatusSelector";
import FormTextareaInput from "@/components/common/FormElements/FormTextareaInput";
import { Separator } from "@/components/ui/separator";
import { useTaskFormHooks } from "@/hooks/forms/useTaskForm";
import { useCachedData } from "@/hooks/useQueryHook";
import { TaskSchema } from "@/models/task/taskSchema";
import { Task } from "@/types/task-types/taskTypes";
import { findItemById } from "@/utils/helpers/findItemById";
import { ClipboardList, DollarSign, Hammer } from "lucide-react";
import { FormProvider } from "react-hook-form";

type EditTaskFormProps = {
  id: string;
  taskId: string;
  isPending: boolean;
  handleSubmit: (taskData: TaskSchema) => void;
};

const EditTaskForm = ({ id, taskId, isPending, handleSubmit }: EditTaskFormProps) => {
  const task = useCachedData<Task>({
    queryKey: ["projects", id, "tasks"],
    selectFn: data => {
      const foundTask = findItemById<Task>(data as Task[], taskId, task => task.id as string);
      console.log("Found task in cache:", foundTask);
      return {
        ...foundTask,
        activity: foundTask?.activityName,
        measure: foundTask?.measureName,
        price_per_measure: foundTask?.price_per_measure
      };
    }
  });

  const { useEditTaskForm } = useTaskFormHooks();
  const form = useEditTaskForm({
    ...task,
    artisans: task?.artisans?.map((a: any) => a.name) || []
  });

  const artisanPlaceholder = task?.artisans?.map((artisan: any) => artisan.name).join(", ") || "Select artisans";

  if (task) {
    task.activity = task?.activity || "";
    task.measure = task?.measure || "";
    task.artisans = task?.artisans || [];
  }

  return (
    <FormProvider {...form}>
      <form id="task-edit" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label="Task name" name="name" className="pl-10" Icon={ClipboardList} />
          <FormFieldInput type="text" label="Price per measure" name="price_per_measure" className="pl-10" Icon={DollarSign} />
          <FormFieldInput type="text" label="Total work in measure" name="total_work_in_selected_measure" className="pl-10" Icon={Hammer} />
          <FormFieldInput type="text" label="Total price" name="total_price" className="pl-10" Icon={DollarSign} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-1 content-around gap-2 pt-1.5">
          <ArtisanSelector name="artisans" label="Select artisans" placeholder={artisanPlaceholder} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 content-around gap-2 pt-1.5">
          <ActivitySelector name="activity" label="Select activity" defaultVal={task && task.activity} placeholder={task?.activity} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2 mb-4">
          <StatusSelector label="Status" name="status" defaultVal={task && task.status} />
          <MeasureSelector name="measure" label="Select measure" defaultVal={task && task.measure} placeholder={task?.measure} />
        </div>

        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2 pt-1.5">
          <FormDatePicker name="start_date" label="Select new start date" selected={new Date(`${task && task.start_date}`).toLocaleDateString().slice(0, 10)} />
          <FormDatePicker name="end_date" label="Select new end date" selected={new Date(`${task && task.end_date}`).toLocaleDateString().slice(0, 10)} />
        </div>
        <Separator className="mt-2 mb-2" />
        <FormTextareaInput name="note" type="text" label="Task note" placeholder="Task notes..." />
        <DialogFooter disabled={!form.formState.isDirty || isPending} label="Save changes" formName="task-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditTaskForm;
