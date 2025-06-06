import DialogFooter from "@/components/common/DialogElements/DialogFooter";
import ArtisanSingleSelector from "@/components/common/FormElements/FormArtisanSingleSelector";
import FormDatePicker from "@/components/common/FormElements/FormDatePicker";
import DefaultPricingSelector from "@/components/common/FormElements/FormDefaultValueSelector";
import FormFieldInput from "@/components/common/FormElements/FormFieldInput";
import FormTextareaInput from "@/components/common/FormElements/FormTextareaInput";
import TaskItemStatusSelector from "@/components/common/FormElements/TaskItemStatusSelector";
import { Separator } from "@/components/ui/separator";
import { useWorkItemFormHooks } from "@/hooks/forms/useWorkItemForm";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { WorkItemSchema } from "@/models/workItem/workItemSchema";
import { DefaultPricingResponse } from "@/types/defaultPricingType/defaultPricingTypes";
import { Calculator, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useParams } from "react-router-dom";

type CreateWorkItemFormProps = {
  handleSubmit: (workItemData: WorkItemSchema) => void;
  isPending: boolean;
};

const CreateWorkItemForm = ({ handleSubmit, isPending }: CreateWorkItemFormProps) => {
  const { useCreateWorkItemForm } = useWorkItemFormHooks();
  const form = useCreateWorkItemForm();
  const [measureValue, setMeasureValue] = useState("");
  const [showQuantity, setShowQuantity] = useState(true);
  const params = useParams();

  // Watch for changes in artisan (ID)
  const artisanId = form.watch("artisan"); // Получаваме стойността директно от формата
  const defaultPricing = form.watch("default_pricing"); // Получаваме стойността директно от формата

  const { data: defaultPricingsResponse, refetch } = useFetchDataQuery<DefaultPricingResponse>({
    URL: artisanId ? `/default-pricing/${artisanId}` : `/default-pricing`,
    queryKey: ["default-pricing"],
  });

  useEffect(() => {
    // Fetch default pricings for selected artisan on form change
    if (artisanId) {
      refetch();
      const foundedDefaultPrice = defaultPricingsResponse?.data.find((pricing: any) => {
        return pricing.id == defaultPricing;
      });
      if (foundedDefaultPrice) {
        const measureName = foundedDefaultPrice?.measure?.name.toLocaleLowerCase();
        const activityName = foundedDefaultPrice?.activity?.name.toLocaleLowerCase();
        setMeasureValue(measureName || "");
        setShowQuantity(!(measureName === 'hour' && activityName === 'hour'));
      }
    }
  }, [artisanId, defaultPricing, defaultPricingsResponse]);

  useEffect(() => {
    form.setValue('project_id', params.id as string)
  }, []);

  useEffect(() => {
    if (!showQuantity) {
      form.setValue('quantity', 0);
    }
  }, [showQuantity]);

  return (
    <FormProvider {...form}>

      <form id="task-item" onSubmit={form.handleSubmit(handleSubmit)}>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2 mb-2">
          <ArtisanSingleSelector name="artisan" label="Select artisan" />
          <DefaultPricingSelector name="default_pricing" label="Activity" artisan_id={artisanId} project_id={params.id} />
          {showQuantity && (
            <div className="flex items-center justify-center content-center flex-col">
              <FormFieldInput name="quantity" label="Quantity" type="number" className="pl-10" Icon={Calculator} />
              <p className="text-xs text-gray-500 text-wrap">{measureValue}</p>
            </div>
          )}
          <FormFieldInput name="hours" label="Hours" type="number" className="pl-10" Icon={Clock} />
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
        <DialogFooter
          disabled={!form.formState.isDirty || isPending}
          className="mt-6"
          formName="task-item"
          label="Submit"
        />
      </form>
    </FormProvider>
  );
};

export default CreateWorkItemForm;
