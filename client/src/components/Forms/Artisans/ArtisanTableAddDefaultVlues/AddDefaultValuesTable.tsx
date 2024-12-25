import { Button } from "@/components/ui/button";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { Activity, ActivityResponse } from "@/types/activity-types/activityTypes";
import { Artisan } from "@/types/artisan-types/artisanTypes";
import { DefaultPricing } from "@/types/defaultPricingType/defaultPricingTypes";
import { Measure, MeasureResponse } from "@/types/measure-types/measureTypes";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useEffect, useState } from "react";

export default function AddDefaultValuesTable({ artisanId }: { artisanId: string }) {
  const [price, setPrice] = useState<number>(0);
  const [measure, setMeasure] = useState<Measure>();
  const [activity, setActivity] = useState<Activity>();
  const [artisan, setArtisan] = useState<Artisan>();
  const [defaultPricing, setDefaultPricing] = useState<DefaultPricing[]>([]);
  //Fetch Artisan
  const { data: artisanResponse } = useFetchDataQuery<Artisan>({ URL: `/artisans/${artisanId}`, queryKey: ["artisan"] }) as { data: Artisan; isPending: boolean; isError: boolean };

  //Fetch Measures
  const { data: measures } = useFetchDataQuery<MeasureResponse>({ URL: "/measures", queryKey: ["measures"] }) as { data: MeasureResponse; isPending: boolean; isError: boolean };
  //Fetch Activities
  const { data: activitiesResponse } = useFetchDataQuery<ActivityResponse>({
    URL: "/activities",
    queryKey: ["activities"]
  });
  const activities: Activity[] = activitiesResponse?.data || [];
  //Proffesions Dropdown
  const proffesionsBodyTemplate = () => {
    return (
      <Dropdown
        options={activities?.map(a => ({ label: a.name, value: a.id }))}
        value={activity}
        onChange={e => {
          setActivity(e.value);
        }}
        panelClassName="z-50 pointer-events-auto"
        scrollHeight="200px"
        className="w-full text-xs " // Ensures dropdown fits in column width
      />
    );
  };
  //Measure Dropdown
  const unitsBodyTemplate = () => {
    return <Dropdown options={measures?.data.map(m => ({ label: m.name, value: m }))} value={measure} panelClassName="z-50 pointer-events-auto" scrollHeight="200px" onChange={e => setMeasure(e.value)} className="w-full text-xs" />;
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
          const newDefaultPricing = addDefaultPricing();
          setDefaultPricing([...defaultPricing, newDefaultPricing]);
        }}
      />
    );
  };
  //Add Default Pricing
  const addDefaultPricing = () => {
    const defaultPricing: DefaultPricing = {
      activity_id: activity!.id!,
      measure_id: measure!.id!,
      artisan_id: artisanId,
      price: price
    };
    return defaultPricing;
  };
  useEffect(() => {
    setArtisan(artisanResponse);
  }, [artisanResponse]);
  console.log(defaultPricing);
  return (
    <div className="flex flex-col justify-center items-center">
      <DataTable
        value={artisan ? [artisan] : []}
        size="large" // Adjust table size for compact layout
        className="w-[800px]    " // Shrink the table size and font
      >
        <Column
          field="name"
          header="Name"
          body={() => <p>{artisan?.name}</p>}
          className="text-sm"
          style={{ width: "25%" }} // Allocate 25% width
        />
        <Column
          field="specialty"
          header="Specialty"
          body={proffesionsBodyTemplate}
          className="text-sm"
          style={{ width: "35%" }} // Allocate 35% width
        />
        <Column
          field="measure"
          header="Unit"
          className="text-sm"
          body={unitsBodyTemplate}
          style={{ width: "35%" }} // Allocate 20% width
        />
        <Column
          field="price"
          header="Price"
          body={priceBodyTemplate}
          className="text-xl"
          style={{ width: "15%" }} // Allocate 20% width
        />
      </DataTable>
      <Button>Add default values</Button>
    </div>
  );
}
