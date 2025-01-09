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
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type EditTaskFormProps = {
  id: string;
  taskId: string;
  isPending: boolean;
  handleSubmit: (taskData: TaskSchema) => void;
};

const EditTaskForm = ({ id, taskId, isPending, handleSubmit }: EditTaskFormProps) => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    labels: {
      taskName: "Task name",
      pricePerMeasure: "Price per measure",
      totalWork: "Total work in measure",
      totalPrice: "Total price",
      artisan: "Select artisan",
      activity: "Select activity",
      status: "Status",
      measure: "Select measure",
      startDate: "Select new start date",
      endDate: "Select new end date",
      note: "Task note"
    },
    placeholders: {
      note: "Task notes..."
    },
    buttons: {
      save: "Save changes"
    }
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        labels: {
          taskName: await translate("Task name"),
          pricePerMeasure: await translate("Price per measure"),
          totalWork: await translate("Total work in measure"),
          totalPrice: await translate("Total price"),
          artisan: await translate("Select artisan"),
          activity: await translate("Select activity"),
          status: await translate("Status"),
          measure: await translate("Select measure"),
          startDate: await translate("Select new start date"),
          endDate: await translate("Select new end date"),
          note: await translate("Task note")
        },
        placeholders: {
          note: await translate("Task notes...")
        },
        buttons: {
          save: await translate("Save changes")
        }
      });
    };
    loadTranslations();
  }, [translate]);

  const task = useCachedData<Task>({
    queryKey: ["projects", id, "tasks"],
    selectFn: data => findItemById<Task>(data as Task[], taskId, task => task.id as string)
  });

  const { useEditTaskForm } = useTaskFormHooks();
  const form = useEditTaskForm(task as Task);

  console.log("📝 Edit task form loaded with translations");

  return (
    <FormProvider {...form}>
      <form id="task-edit" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={translations.labels.taskName} name="name" className="pl-10" Icon={ClipboardList} />
          <FormFieldInput type="text" label={translations.labels.pricePerMeasure} name="price_per_measure" className="pl-10" Icon={DollarSign} />
          <FormFieldInput type="text" label={translations.labels.totalWork} name="total_work_in_selected_measure" className="pl-10" Icon={Hammer} />
          <FormFieldInput type="text" label={translations.labels.totalPrice} name="total_price" className="pl-10" Icon={DollarSign} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2 mb-4">
          <ArtisanSelector name="artisan" label={translations.labels.artisan} defaultVal={task && task.artisan} />
          <ActivitySelector name="activity" label={translations.labels.activity} defaultVal={task && task.activity} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 content-around gap-2 mb-4">
          <StatusSelector label={translations.labels.status} name="status" defaultVal={task && task.status} />
          <MeasureSelector name="measure" label={translations.labels.measure} defaultVal={task && task.measure} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2 pt-1.5">
          <FormDatePicker name="start_date" label={translations.labels.startDate} selected={new Date(`${task && task.start_date}`).toLocaleDateString().slice(0, 10)} />
          <FormDatePicker name="end_date" label={translations.labels.endDate} selected={new Date(`${task && task.end_date}`).toLocaleDateString().slice(0, 10)} />
        </div>
        <Separator className="mt-2 mb-2" />
        <FormTextareaInput name="note" type="text" label={translations.labels.note} placeholder={translations.placeholders.note} />
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={translations.buttons.save} formName="task-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditTaskForm;
