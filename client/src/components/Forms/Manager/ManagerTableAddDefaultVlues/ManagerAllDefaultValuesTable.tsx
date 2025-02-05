import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { ActivityResponse } from "@/types/activity-types/activityTypes";
import { DefaultPricing, DefaultPricingResponse } from "@/types/defaultPricingType/defaultPricingTypes";
import { MeasureResponse } from "@/types/measure-types/measureTypes";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import ManagerAction from "./ManagerAction";
import { Button } from "@/components/ui/button";
import { Trash2 as Trash } from "lucide-react";
import { deleteEntity } from "@/api/apiCall";
import { ResponseMessageType } from "@/types/response-message/responseMessageTypes";
import ResponseMessage from "@/components/common/ResponseMessages/ResponseMessage";
import { Project } from "@/types/project-types/projectTypes";
import { useTranslation } from "react-i18next";
export default function ManagerAllDefaultValuesTable() {
  const { t } = useTranslation();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [first, setFirst] = useState(0);
  const [rows] = useState(10);
  const [responseMessage, setResponseMessage] = useState<ResponseMessageType | null>(null);

  const { data: activitiesResponse } = useFetchDataQuery<ActivityResponse>({
    URL: "/activities",
    queryKey: ["activities"]
  });

  const { data: measuresResponse } = useFetchDataQuery<MeasureResponse>({
    URL: "/measures",
    queryKey: ["measures"]
  });
  const { data: projects } = useFetchDataQuery<Project[]>({
    URL: `/projects-for-manager`,
    queryKey: ["projects"]
  });
  const { data: defaultPricingsResponse, refetch } = useFetchDataQuery<DefaultPricingResponse>({
    URL: "/default-pricing",
    queryKey: ["default-pricing"]
  });

  const defaultPricings = defaultPricingsResponse?.data || [];
  const activities = activitiesResponse?.data || [];
  const measures = measuresResponse?.data || [];

  useEffect(() => {
    console.log("DefaultPricings Response:", defaultPricingsResponse);
    console.log("Processed DefaultPricings:", defaultPricings);
    console.log("Activities:", activities);
    console.log("Measures:", measures);
  }, [defaultPricingsResponse, activities, measures]);

  const activityBodyTemplate = (rowData: DefaultPricing) => {
    const activity = activities.find(a => a.id === rowData.activity_id);
    return <InputText value={activity?.name || ""} readOnly className="w-[150px]  text-xs md:text-sm  p-2" />;
  };

  const measureBodyTemplate = (rowData: DefaultPricing) => {
    const measure = measures.find(m => m.id === rowData.measure_id);
    return <InputText value={measure?.name || ""} readOnly className="w-[150px]  text-xs md:text-sm border rounded p-2" />;
  };

  const managerPriceBodyTemplate = (rowData: DefaultPricing) => {
    return <InputText value={`${rowData.manager_price}`} readOnly className="w-[65px] text-xs md:text-sm border rounded  p-2" />;
  };

  const projectBodyTemplate = (rowData: DefaultPricing) => {
    const project = projects?.find(p => p.id === rowData.project_id);
    return <InputText value={project?.name} readOnly className="w-[100px]  text-xs md:text-sm border rounded  p-2" />;
  };

  const actionBodyTemplate = (rowData: DefaultPricing) => {
    const activity = activities.find(a => a.id === rowData.activity_id);
    const measure = measures.find(m => m.id === rowData.measure_id);
    return (
      <div className="flex">
        <ManagerAction
          type="edit"
          artisanId={"1"}
          artisanName={"test"}
          editProps={{
            artisanId: "1",
            activity: activity?.name || "",
            measure: measure?.name || "",
            price: rowData.artisan_price,
            managerPrice: rowData.manager_price,
            defaultPricing: rowData
          }}
          refetch={refetch}
        />
        <Button variant="ghost" size="icon" onClick={() => deleteDefaultPricing(rowData.id!)}>
          {<Trash />}
        </Button>
      </div>
    );
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };

  const filteredData = globalFilter
    ? defaultPricings.filter(pricing => {
        const activity = activities.find(a => a.id === pricing.activity_id);
        const project = projects?.find(p => p.id === pricing.project_id);
        
        return (
          activity?.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
          project?.name.toLowerCase().includes(globalFilter.toLowerCase())
        );
      })
    : defaultPricings;

  const header = (
    <div className="flex justify-between items-center">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText 
          value={globalFilter} 
          onChange={onGlobalFilterChange} 
          placeholder={t("Search by activity or project...")} 
          className="m-8 p-2" 
        />
      </span>
      <div className="flex flex-col items-center justify-center gap-5">
        <ManagerAction type="create" artisanName={"test"} artisanId={"1"} refetch={refetch} />
      </div>
    </div>
  );
  //Delete default pricing
  const deleteDefaultPricing = async (defaultPriceId: string) => {
    try {
      await deleteEntity("/default-pricing", { id: defaultPriceId });
      setResponseMessage({ type: "success", message: t("Values deleted successfully!") });
      refetch();
    } catch (error) {
      console.error(error);
      setResponseMessage({ type: "error", message: t("Something went wrong!") });
    }
  };

  return (
    <div className="w-full flex flex-col items-center overflow-auto">
      <DataTable value={filteredData} className="text-sm md:text-base max-w-full !overflow-hidden" style={{ width: "100%" }} paginator rows={rows} first={first} onPage={e => setFirst(e.first)} header={header} sortMode="multiple" removableSort emptyMessage={t("No default prices found")}>
        <Column field="activity" header={t("Activity")} body={activityBodyTemplate} className="text-sm md:text-base" />
        <Column field="project" header={t("Project")} body={projectBodyTemplate} className="text-sm md:text-base" />
        <Column field="measure" header={t("Measure")} body={measureBodyTemplate} className="text-sm md:text-base" />
        <Column field="managerPrice" header={t("Price")} body={managerPriceBodyTemplate} className="text-sm md:text-base text-wrap flex items-center justify-center" />
        <Column field="action" header={t("Actions")} body={actionBodyTemplate} className="text-sm md:text-base" />
      </DataTable>
      {responseMessage && <ResponseMessage type={responseMessage.type} message={responseMessage.message} duration={2000} onHide={() => setResponseMessage(null)} />}
    </div>
  );
}
