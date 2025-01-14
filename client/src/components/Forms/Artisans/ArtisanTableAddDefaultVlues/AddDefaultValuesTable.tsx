import { createEntity } from "@/api/apiCall";
import ResponseMessage from "@/components/common/ResponseMessages/ResponseMessage";
import { Button } from "@/components/ui/button";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { Activity, ActivityResponse } from "@/types/activity-types/activityTypes";
import { Artisan } from "@/types/artisan-types/artisanTypes";
import { DefaultPricing, DefaultPricingResponse } from "@/types/defaultPricingType/defaultPricingTypes";
import { Measure, MeasureResponse } from "@/types/measure-types/measureTypes";
import { ResponseMessageType } from "@/types/response-message/responseMessageTypes";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useEffect, useState } from "react";

export default function AddDefaultValuesTable({ artisanId }: { artisanId: string }) {
  const [price, setPrice] = useState<number>(0);
  const [measure, setMeasure] = useState<Measure>();
  const [activity, setActivity] = useState<Activity>();
  const [artisan, setArtisan] = useState<Artisan>();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<ResponseMessageType | null>(null);
  // Fetch all data
  const { data: artisanResponse } = useFetchDataQuery<Artisan>({ URL: `/artisans/${artisanId}`, queryKey: ["artisan"] }) as { data: Artisan; isPending: boolean; isError: boolean };
  const { data: measures } = useFetchDataQuery<MeasureResponse>({ URL: "/measures", queryKey: ["measures"] }) as { data: MeasureResponse; isPending: boolean; isError: boolean };
  const { data: activitiesResponse } = useFetchDataQuery<ActivityResponse>({
    URL: "/activities",
    queryKey: ["activities"]
  });
  const { data: defaultPricingsResponse, refetch: refetchDefaultPricings } = useFetchDataQuery<DefaultPricingResponse>({ URL: `/default-pricing/${artisanId}`, queryKey: ["defaultPricings"] }) as { data: DefaultPricingResponse; refetch: () => void };

  const activities: Activity[] = activitiesResponse?.data || [];

  const activityBodyTemplate = () => {
    return (
      <Dropdown
        options={activities?.map(a => ({ label: a.name, value: a }))}
        value={activity}
        onChange={e => {
          handleUnsavedChanges(() => setActivity(e.value));
        }}
        panelClassName="z-50 pointer-events-auto"
        scrollHeight="200px"
        className="w-[150px] md:w-[200px] text-xs md:text-sm"
      />
    );
  };

  const measuresBodyTemplate = () => {
    return (
      <Dropdown
        options={measures?.data.map(m => ({ label: m.name, value: m }))}
        value={measure}
        panelClassName="z-50 pointer-events-auto"
        scrollHeight="200px"
        onChange={e => {
          handleUnsavedChanges(() => setMeasure(e.value));
        }}
        className="w-[150px] md:w-[200px] text-xs md:text-sm ml-12"
      />
    );
  };
  //Price Input Field
  const priceBodyTemplate = () => {
    return (
      <InputNumber
        className="w-full text-l" // Ensures input width fits in column
        value={price}
        inputId="currency-germany"
        currency="EUR"
        onChange={e => {
          setPrice(e.value ?? 0);
          setIsAdding(true);
        }}
        panelClassName="z-50 pointer-events-auto"
        scrollHeight="200px"
        className="w-full text-xs " // Ensures dropdown fits in column width
      />
    );
  };

  //Add default pricing (onSubmit)
  const addDefaultPricing = async () => {
    if (!activity?.id || !measure?.id) {
      setResponseMessage({ type: "error", message: "Please select both activity and measure" });
      return;
    }

    const defaultPricing: DefaultPricing = {
      activity_id: activity.id,
      measure_id: measure.id,
      price: price
    };

    try {
      await createEntity(`/default-pricing/${artisanId}`, defaultPricing);
      setIsAdding(false);
      setResponseMessage({ type: "success", message: "Values added successfully!" });
      refetchDefaultPricings();
    } catch (error) {
      console.error(error);
      setResponseMessage({ type: "error", message: "Something went wrong!" });
    }
  };

  //Handle unsaved changes
  const handleUnsavedChanges = (callback: () => void) => {
    if (isAdding) {
      confirmDialog({
        message: "Would you like to add the current values as a default pricing?",
        header: "Add Default Pricing",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Add Values",
        rejectLabel: "Cancel",
        acceptClassName: "p-button-success mx-2",
        rejectClassName: "p-button-danger mx-2",
        accept: () => {
          addDefaultPricing();
          callback();
        },
        reject: () => {
          setIsAdding(false);
        }
      });
    } else {
      callback();
    }
  };

  //Set the artisan
  useEffect(() => {
    setArtisan(artisanResponse);
  }, [artisanResponse]);

  //Set the price to the existing price if it exists
  useEffect(() => {
    const defaultPricings: DefaultPricing[] = defaultPricingsResponse?.defaultPricing || [];
    if (activity && measure && defaultPricings) {
      const existingPricing = defaultPricings.find(p => p.activity_id === activity.id && p.measure_id === measure.id);
      setPrice(existingPricing?.price || 0);
      setIsAdding(false);
    }
  }, [activity, measure, defaultPricingsResponse]);
  return (
    <div className="w-full flex flex-col justify-center items-center ">
      <DataTable value={artisan ? [artisan] : []} responsiveLayout="stack" breakpoint="960px" className="text-sm md:text-base max-w-full !overflow-x-hidden " style={{ width: "100%" }}>
        <Column field="name" header="Name" className="text-sm md:text-base" />
        <Column field="activity" header="Activity" body={activityBodyTemplate} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
        <Column field="measure" header="Measure" body={measuresBodyTemplate} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
        <Column field="measure" header="Measure" body={measuresBodyTemplate} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
        <Column field="price" header="Price" body={priceBodyTemplate} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
      </DataTable>
      <ConfirmDialog />
      <div className="flex flex-col justify-center items-center mt-4">
        <Button className="w-[150px] md:w-auto px-4 md:px-8 py-2" onClick={addDefaultPricing}>
          Add default pricings
        </Button>
        {responseMessage && <ResponseMessage type={responseMessage.type} message={responseMessage.message} duration={2000} onHide={() => setResponseMessage(null)} />}
      </div>
    </div>
  );
}
