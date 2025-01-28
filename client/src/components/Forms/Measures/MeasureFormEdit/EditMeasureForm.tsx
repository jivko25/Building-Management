//client\src\components\Forms\Measures\MeasureFormEdit\EditMeasureForm.tsx
import { FormProvider } from "react-hook-form";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import { Ruler } from "lucide-react";
import { useMeasureFormHooks } from "@/hooks/forms/useMeasureForm";
import { MeasureSchema } from "@/models/measure/measureSchema";
import { Measure } from "@/types/measure-types/measureTypes";
import { useTranslation } from "react-i18next";

type EditMeasureFormProps = {
  handleSubmit: (measureData: MeasureSchema) => void;
  measureId: string;
  isPending: boolean;
  initialData?: Measure;
};

const EditMeasureForm = ({ handleSubmit, isPending, initialData }: EditMeasureFormProps) => {
  const { t } = useTranslation();

  const { useEditMeasureForm } = useMeasureFormHooks();
  const form = useEditMeasureForm(initialData as Partial<Measure>);

  return (
    <FormProvider {...form}>
      <form id="edit-measure" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={t("Measure name")} name="name" className="pl-10" Icon={Ruler} />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} isLoading={isPending} label={t("Submit changes")} formName="edit-measure" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditMeasureForm;
