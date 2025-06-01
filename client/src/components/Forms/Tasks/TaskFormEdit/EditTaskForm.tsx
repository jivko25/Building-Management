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
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { TaskSchema } from "@/models/task/taskSchema";
import { ClipboardList, DollarSign, Hammer } from "lucide-react";
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";

type EditTaskFormProps = {
  id: string;
  taskId: string;
  isPending: boolean;
  handleSubmit: (taskData: TaskSchema) => void;
};

const EditTaskForm = ({ id, taskId, isPending, handleSubmit }: EditTaskFormProps) => {
  const { data: task, isLoading, refetch } = useFetchDataQuery<any>({
    URL: `/projects/${id}/tasks/${taskId}`,
    queryKey: ["projects", id, "tasks", taskId],
    options: {
      refetchOnMount: true,
      staleTime: 0
    }
  });

  const { useEditTaskForm } = useTaskFormHooks();

  useEffect(() => {
    if (taskId) {
      refetch();
      const formattedTask = task ? {
        ...task,
        activity: task.activity?.name || "",
        measure: task.measure?.name || "",
        artisans: task.artisans?.map((artisan: any) => artisan.name) || []
      } : {};
      form.reset(formattedTask)
    }
  }, [taskId, refetch, isLoading]);
  
  // Трансформираме данните преди да ги подадем на формата
  const transformedTask = task ? {
    ...task,
    activity: task.activity?.name || "",
    measure: task.measure?.name || "",
    artisans: task.artisans?.map((artisan: any) => artisan.name) || []
  } : {};

  const form = useEditTaskForm(transformedTask);

  // Създаваме placeholder за артисаните
  const artisanPlaceholder = task?.artisans?.map((artisan: any) => artisan.name).join(", ") || "Select artisans";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FormProvider {...form}>
      <form id="task-edit" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label="Task name" name="name" className="pl-10" Icon={ClipboardList} />
          <FormFieldInput type="number" label="Total work in measure" name="total_work_in_selected_measure" className="pl-10" Icon={Hammer} />
          <FormFieldInput type="text" label="Total price" name="total_price" className="pl-10" Icon={DollarSign} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-1 content-around gap-2 pt-1.5">
          <ArtisanSelector 
            name="artisans" 
            label="Select artisans" 
            placeholder={artisanPlaceholder}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 content-around gap-2 pt-1.5">
          <ActivitySelector 
            name="activity" 
            label="Select activity" 
            defaultVal={transformedTask.activity}
          />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2 mb-4">
          <StatusSelector 
            label="Status" 
            name="status" 
            defaultVal={task?.status}
          />
          <MeasureSelector 
            name="measure" 
            label="Select measure" 
            defaultVal={transformedTask.measure}
          />
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
