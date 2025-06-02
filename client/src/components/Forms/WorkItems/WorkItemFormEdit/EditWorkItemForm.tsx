//client\src\components\Forms\WorkItems\WorkItemFormEdit\EditWorkItemForm.tsx
import apiClient from "@/api/axiosConfig";
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
import { WorkItem } from "@/types/work-item-types/workItem";
import { Calculator, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useParams } from "react-router-dom";

type EditWorkItemFormProps = {
  handleSubmit: (data: WorkItemSchema) => void;
  isPending: boolean;
  workItemId: string;
};

const EditWorkItemForm = ({ handleSubmit, isPending, workItemId }: EditWorkItemFormProps) => {
  const [measureValue, setMeasureValue] = useState("");
  const [showQuantity, setShowQuantity] = useState(true);
  const [userWorkItem, setUserWorkItem] = useState<WorkItem | null>(null);
  const [artisanIdValue, setArtisanIdValue] = useState<string | null>(null);
  const [defaultPricingValue, setDefaultPricingValue] = useState<string | null>(null);
  const { id: projectId, taskId } = useParams();
  const { useEditWorkItemForm } = useWorkItemFormHooks();

  const form = useEditWorkItemForm({
    artisan: "",
    default_pricing: "",
    quantity: "" as any,
    hours: "" as any,
    start_date: "",
    end_date: "",
    note: "",
    status: "pending" as any,
    project_id: projectId || ""
  });

  // Watch for changes in artisan and default pricing
  const artisanId = form.watch("artisan");
  const defaultPricing = form.watch("default_pricing");

  const { data: defaultPricingsResponse, refetch } = useFetchDataQuery<DefaultPricingResponse>({
    URL: artisanId ? `/default-pricing/${artisanId}` : `/default-pricing`,
    queryKey: ["default-pricing"]
  });

  useEffect(() => {
    const fetchWorkItem = async () => {
      try {
        const response = await apiClient.get<WorkItem>(`/projects/${projectId}/tasks/${taskId}/workitems/${workItemId}`);
        setUserWorkItem(response.data);   
        
        console.log(response.data.status, 'status');
        

        // Установяваме стойностите във формата след като получим данните
        form.reset({
          artisan: response.data.artisan_id?.toString(),
          default_pricing: defaultPricingsResponse?.data.find(pricing => pricing?.activity_id === response?.data?.activity_id)?.id || "",
          quantity: response.data.quantity,
          hours: response.data.hours,
          start_date: response.data.start_date,
          end_date: response.data.end_date,
          note: response.data.note,
          status: response.data.status,
          project_id: projectId || ""
        });
        setArtisanIdValue(response.data.artisan_id?.toString() || "");
        setDefaultPricingValue(defaultPricingsResponse?.data.find(pricing => pricing?.activity_id === response?.data?.activity_id)?.id || "");
      } catch (error) {
        console.error("Error fetching work item:", error);
      }

    };

    if (projectId && taskId && workItemId) {
      fetchWorkItem();
    }
  }, [projectId, taskId, workItemId, defaultPricingsResponse?.data.length]);

  useEffect(() => {
    if (artisanId) {
      refetch();
      const foundedDefaultPrice = defaultPricingsResponse?.data.find((pricing: any) => {
        return pricing.id == defaultPricing;
      });
      if (foundedDefaultPrice) {
        const measureName = foundedDefaultPrice?.measure?.name.toLocaleLowerCase();
        const activityName = foundedDefaultPrice?.activity?.name.toLocaleLowerCase();
        
        setMeasureValue(measureName || "");
        setShowQuantity(measureName !== 'hour' && activityName !== 'hour');
      }
    }
  }, [artisanId, defaultPricing, defaultPricingsResponse]);

  // Инициализация на measureValue при зареждане
  useEffect(() => {
    if (userWorkItem?.measure?.name.toLowerCase() !== "hour") {
      setMeasureValue(userWorkItem?.measure?.name || "");
    }
  }, [userWorkItem]);

  useEffect(() => {
    if(!showQuantity) {
      form.setValue('quantity', 0);
    }
  }, [showQuantity]);

  // // Ако данните все още не са заредени, показваме loading или нищо
  // if (!userWorkItem) {
  //   return null;
  // }

  console.log(form.formState.errors, 'errors');
  

  return (
    <FormProvider {...form}>
      <form id="user-work-item-edit" onSubmit={form.handleSubmit(handleSubmit)}>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2 mb-2">
          <ArtisanSingleSelector name="artisan" label="Select artisan" defaultVal={userWorkItem?.artisan_id?.toString()} />
            <DefaultPricingSelector name="default_pricing" label="Activity" artisan_id={artisanId as any || artisanIdValue} defaultVal={defaultPricingValue as any} />
            <div className="flex items-center justify-center content-center flex-col">
              <FormFieldInput name="quantity" label="Quantity" type="number" className="pl-10" Icon={Calculator} />
              <p className="text-xs text-gray-500 text-wrap">{measureValue}</p>
            </div>
          {
            !showQuantity && (
              <FormFieldInput name="hours" label="Hours" type="number" className="pl-10" Icon={Clock} />
            )
          }
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 content-around gap-2">
          <FormDatePicker name="start_date" label="Select a start date" selected={userWorkItem?.start_date ? new Date(userWorkItem.start_date).toLocaleDateString().slice(0, 10) : undefined} />
          <FormDatePicker name="end_date" label="Select an end date" selected={userWorkItem?.end_date ? new Date(userWorkItem.end_date).toLocaleDateString().slice(0, 10) : undefined} />
        </div>
        <Separator className="mt-4 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          <TaskItemStatusSelector name="status" label="Select status" defaultVal={userWorkItem?.status} />
        </div>
        <FormTextareaInput name="note" label="Note" type="text" className="pt-2" />
        <DialogFooter disabled={!form.formState.isDirty || isPending} label="Submit changes" formName="user-work-item-edit" className="mt-6" />
      </form>
    </FormProvider>
  );
};

export default EditWorkItemForm;
