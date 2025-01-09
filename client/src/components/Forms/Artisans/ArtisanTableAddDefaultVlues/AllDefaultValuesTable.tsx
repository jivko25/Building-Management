import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { ActivityResponse } from "@/types/activity-types/activityTypes";
import { DefaultPricing, DefaultPricingResponse } from "@/types/defaultPricingType/defaultPricingTypes";
import { MeasureResponse } from "@/types/measure-types/measureTypes";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import ArtisanAction from "./ArtisanAction";

export default function AllDefaultValuesTable({ artisanId, artisanName }: { artisanId: string; artisanName: string }) {
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  console.log(artisanName);
  const { data: defaultPricingsResponse } = useFetchDataQuery<DefaultPricingResponse>({
    URL: `/default-pricing/${artisanId}`,
    queryKey: ["defaultPricings"]
  });

  const { data: activitiesResponse } = useFetchDataQuery<ActivityResponse>({
    URL: "/activities",
    queryKey: ["activities"]
  });

  const { data: measuresResponse } = useFetchDataQuery<MeasureResponse>({
    URL: "/measures",
    queryKey: ["measures"]
  });

  const defaultPricings = defaultPricingsResponse?.defaultPricing || [];
  const activities = activitiesResponse?.data || [];
  const measures = measuresResponse?.data || [];

  const activityBodyTemplate = (rowData: DefaultPricing) => {
    const activity = activities.find(a => a.id === rowData.activity_id);
    return <InputText value={activity?.name || ""} readOnly className="w-[150px]  text-xs md:text-sm  p-2" />;
  };

  const measureBodyTemplate = (rowData: DefaultPricing) => {
    const measure = measures.find(m => m.id === rowData.measure_id);
    return <InputText value={measure?.name || ""} readOnly className="w-[150px]  text-xs md:text-sm border rounded p-2" />;
  };

  const priceBodyTemplate = (rowData: DefaultPricing) => {
    return <InputText value={rowData.price} readOnly className="w-[65px] text-xs md:text-sm border rounded  p-2" />;
  };
  const managerPriceBodyTemplate = (rowData: DefaultPricing) => {
    return <InputText value={rowData.price} readOnly className="w-[65px] text-xs md:text-sm border rounded  p-2" />;
  };
  const projectBodyTemplate = (rowData: string) => {
    rowData = "Filler Project";
    return <InputText value={rowData} readOnly className="w-[100px]  text-xs md:text-sm border rounded  p-2" />;
  };
  const actionBodyTemplate = (rowData: DefaultPricing) => {
    const activity = activities.find(a => a.id === rowData.activity_id);
    const measure = measures.find(m => m.id === rowData.measure_id);
    return (
      <ArtisanAction
        type="edit"
        artisanId={artisanId}
        editProps={{
          artisanId,
          activity: activity?.name || "",
          measure: measure?.name || "",
          price: rowData.price,
          managerPrice: rowData.price,
          defaultPricing: rowData
        }}
      />
    );
  };
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };

  const header = (
    <div className="flex justify-between items-center">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText value={globalFilter} onChange={onGlobalFilterChange} placeholder="Search activity..." className="m-8 p-2" />
      </span>
      <span className="font-semibold">{artisanName}</span>
    </div>
  );

  const filteredData = globalFilter
    ? defaultPricings.filter(pricing => {
        const activity = activities.find(a => a.id === pricing.activity_id);
        return activity?.name.toLowerCase().includes(globalFilter.toLowerCase());
      })
    : defaultPricings;

  return (
    <div className="w-full flex flex-col justify-center items-center w-">
      <DataTable value={filteredData} className="text-sm md:text-base max-w-full " style={{ width: "100%" }} paginator rows={rows} first={first} onPage={e => setFirst(e.first)} header={header} sortMode="multiple" removableSort>
        <Column field="activity" header="Activity" body={activityBodyTemplate} className="text-sm md:text-base" sortable />
        <Column field="project" header="Project" body={projectBodyTemplate} className="text-sm md:text-base" sortable />
        <Column field="measure" header="Measure" body={measureBodyTemplate} className="text-sm md:text-base" sortable />
        <Column field="price" header="Price" body={priceBodyTemplate} className="text-sm md:text-base" sortable />
        <Column field="managerPrice" header="Manager Price" body={managerPriceBodyTemplate} className="text-sm md:text-base text-wrap flex items-center justify-center" sortable />
        <Column field="action" header="Actions" body={actionBodyTemplate} className="text-sm md:text-base" />
      </DataTable>
    </div>
  );
}
