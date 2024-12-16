//client\src\components\Forms\Measures\MeasureFormCreate\CreateMeasureForm.tsx
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import { useMeasureFormHooks } from "@/hooks/forms/useMeasureForm";
import { MeasureSchema } from "@/models/measure/measureSchema";
import { Ruler } from "lucide-react";
import { FormProvider } from "react-hook-form";

type CreateMeasureFormProps = {
  handleSubmit: (measureData: MeasureSchema) => void;
  isPending: boolean;
};

const CreateMeasureForm = ({ handleSubmit, isPending }: CreateMeasureFormProps) => {
  const { useCreateMeasureForm } = useMeasureFormHooks();
  const form = useCreateMeasureForm();

  return (
    <FormProvider {...form}>
      <form id="measure-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label="Measure type" name="name" className="pl-10" Icon={Ruler} />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label="Submit" formName="measure-form" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default CreateMeasureForm;
