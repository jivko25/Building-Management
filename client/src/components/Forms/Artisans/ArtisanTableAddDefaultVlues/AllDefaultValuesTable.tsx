import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { ActivityResponse } from "@/types/activity-types/activityTypes";
import { DefaultPricing, DefaultPricingResponse } from "@/types/defaultPricingType/defaultPricingTypes";
import { MeasureResponse } from "@/types/measure-types/measureTypes";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import ArtisanAction from "./ArtisanAction";
import { Button } from "@/components/ui/button";
import { Trash2 as Trash } from "lucide-react";
import { deleteEntity } from "@/api/apiCall";
import { ResponseMessageType } from "@/types/response-message/responseMessageTypes";
import ResponseMessage from "@/components/common/ResponseMessages/ResponseMessage";
import { Project } from "@/types/project-types/projectTypes";
import { useTranslation } from "react-i18next";

export default function AllDefaultValuesTable({ artisanId, artisanName }: { artisanId: string; artisanName: string }) {
  const { t } = useTranslation();
  const [responseMessage, setResponseMessage] = useState<ResponseMessageType | null>(null);
  console.log(artisanId);

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
    URL: `/default-pricing/${artisanId}`,
    queryKey: ["default-pricing", artisanId]
  });

  const defaultPricings = defaultPricingsResponse?.data || [];
  const activities = activitiesResponse?.data || [];
  const measures = measuresResponse?.data || [];

  useEffect(() => {
    console.log("DefaultPricings Response:", defaultPricingsResponse);
    console.log("Processed DefaultPricings:", defaultPricings);
  }, [defaultPricingsResponse]);

  const activityBodyTemplate = (rowData: DefaultPricing) => {
    const activity = activities.find(a => a.id === rowData.activity_id);
    return <InputText value={activity?.name || ""} readOnly className="w-[150px]  text-xs md:text-sm  p-2" />;
  };

  const measureBodyTemplate = (rowData: DefaultPricing) => {
    const measure = measures.find(m => m.id === rowData.measure_id);
    return <InputText value={measure?.name || ""} readOnly className="w-[150px]  text-xs md:text-sm border rounded p-2" />;
  };

  const priceBodyTemplate = (rowData: DefaultPricing) => {
    return <InputText value={`${rowData.artisan_price}`} readOnly className="w-[65px] text-xs md:text-sm border rounded  p-2" />;
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
        <ArtisanAction
          type="edit"
          artisanId={artisanId}
          artisanName={artisanName}
          editProps={{
            artisanId: artisanId,
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

  //Delete default pricing
  const deleteDefaultPricing = async (defaultPriceId: string) => {
    console.log(defaultPriceId);
    try {
      await deleteEntity(`/default-pricing/${defaultPriceId}`, { id: defaultPriceId });
      setResponseMessage({ type: "success", message: t("Values deleted successfully!") });
      refetch();
    } catch (error) {
      console.error(error);
      setResponseMessage({ type: "error", message: t("Something went wrong!") });
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center overflow-auto">
      <DataTable value={defaultPricings} showGridlines stripedRows paginator rows={10} tableStyle={{ minWidth: "50rem" }} emptyMessage="No default prices found">
        <Column field="activity" header={t("Activity")} body={activityBodyTemplate} className="text-sm md:text-base" sortable />
        <Column field="project" header={t("Project")} body={projectBodyTemplate} className="text-sm md:text-base" sortable />
        <Column field="measure" header={t("Measure")} body={measureBodyTemplate} className="text-sm md:text-base" sortable />
        <Column field="price" header={t("Price")} body={priceBodyTemplate} className="text-sm md:text-base" sortable />
        <Column field="managerPrice" header={t("Manager Price")} body={managerPriceBodyTemplate} className="text-sm md:text-base text-wrap flex items-center justify-center" sortable />
        <Column field="action" header={t("Actions")} body={actionBodyTemplate} className="text-sm md:text-base" />
      </DataTable>
      {responseMessage && <ResponseMessage type={responseMessage.type} message={responseMessage.message} duration={2000} onHide={() => setResponseMessage(null)} />}
    </div>
  );
}
