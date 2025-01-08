//client\src\components\Forms\Measures\MeasureFormCreate\CreateMeasureForm.tsx
import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import { useMeasureFormHooks } from "@/hooks/forms/useMeasureForm";
import { MeasureSchema } from "@/models/measure/measureSchema";
import { Ruler } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type CreateMeasureFormProps = {
  handleSubmit: (measureData: MeasureSchema) => void;
  isPending: boolean;
};

const CreateMeasureForm = ({ handleSubmit, isPending }: CreateMeasureFormProps) => {
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    measureType: "Measure type",
    submit: "Submit"
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        measureType: await translate("Measure type"),
        submit: await translate("Submit")
      });
    };
    loadTranslations();
  }, [translate]);

  const { useCreateMeasureForm } = useMeasureFormHooks();
  const form = useCreateMeasureForm();

  return (
    <FormProvider {...form}>
      <form id="measure-form" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 gap-2 mb-2">
          <FormFieldInput type="text" label={translations.measureType} name="name" className="pl-10" Icon={Ruler} />
        </div>
        <DialogFooter disabled={!form.formState.isDirty || isPending} label={translations.submit} formName="measure-form" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default CreateMeasureForm;
