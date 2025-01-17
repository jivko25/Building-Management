import { createEntity } from "@/api/apiCall";
import ResponseMessage from "@/components/common/ResponseMessages/ResponseMessage";
import { Button } from "@/components/ui/button";
import { priceBodyTemplate } from "@/components/ui/defaultPricingTableRows";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { Activity, ActivityResponse } from "@/types/activity-types/activityTypes";
import { Artisan } from "@/types/artisan-types/artisanTypes";
import { DefaultPricing } from "@/types/defaultPricingType/defaultPricingTypes";
import { Measure, MeasureResponse } from "@/types/measure-types/measureTypes";
import { Project } from "@/types/project-types/projectTypes";
import { ResponseMessageType } from "@/types/response-message/responseMessageTypes";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

export default function CreateDefaultValuesTable({ artisanId, refetch }: { artisanId: string; refetch: () => void }) {
  const [price, setPrice] = useState<number>(0);
  const [mangerPrice, setManagerPrice] = useState<number>(0);
  const [measure, setMeasure] = useState<Measure>();
  const [activity, setActivity] = useState<Activity>();
  const [artisan, setArtisan] = useState<Artisan>();
  const [project, setProject] = useState<Project>();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<ResponseMessageType | null>(null);
  // Fetch all data
  const { data: artisanResponse } = useFetchDataQuery<Artisan>({ URL: `/artisans/${artisanId}`, queryKey: ["artisan"] }) as { data: Artisan; isPending: boolean; isError: boolean };
  const { data: measures } = useFetchDataQuery<MeasureResponse>({ URL: "/measures", queryKey: ["measures"] }) as { data: MeasureResponse; isPending: boolean; isError: boolean };
  const { data: activitiesResponse } = useFetchDataQuery<ActivityResponse>({
    URL: "/activities",
    queryKey: ["activities"]
  });
  const { data: projects } = useFetchDataQuery<Project[]>({
    URL: `/projects-for-manager`,
    queryKey: ["projects"]
  });
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
        className="w-[180px]  text-xs md:text-sm"
      />
    );
  };

  const measuresBodyTemplate = () => {
    return (
      <Dropdown
        options={measures?.data?.map(m => ({ label: m.name, value: m }))}
        value={measure}
        panelClassName="z-50 pointer-events-auto"
        scrollHeight="200px"
        onChange={e => {
          handleUnsavedChanges(() => setMeasure(e.value));
        }}
        className="w-[180px] text-xs md:text-sm "
      />
    );
  };

  const projectBodyTemplate = () => {
    return (
      <Dropdown
        options={projects?.map(m => ({ label: m.name, value: m }))}
        value={project}
        panelClassName="z-50 pointer-events-auto"
        scrollHeight="200px"
        onChange={e => {
          handleUnsavedChanges(() => setProject(e.value));
        }}
        className="w-[180px] text-xs md:text-sm "
      />
    );
  };
  //Add default pricing (onSubmit)
  const addDefaultPricing = async () => {
    if (!activity?.id || !measure?.id) {
      setResponseMessage({ type: "error", message: "Please select both activity and measure" });
      return;
    }
    if (!price || !mangerPrice) {
      setResponseMessage({ type: "error", message: "Please enter both artisan and manager prices" });
      return;
    }
    if (!project || !project.id) {
      setResponseMessage({ type: "error", message: "Please select a project" });
      return;
    }

    const defaultPricing: DefaultPricing = {
      artisan_id: artisanId,
      activity_id: activity.id,
      measure_id: measure.id,
      artisan_price: price,
      manager_price: mangerPrice,
      project_id: project.id
    };
    try {
      await createEntity(`/default-pricing/${artisanId}`, defaultPricing);
      setIsAdding(false);
      setResponseMessage({ type: "success", message: "Values added successfully!" });
      //this  is losing the dp Id
      //refetch(previous => [...previous, defaultPricing]);
      refetch();
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

  return (
    <div className="w-full flex flex-col justify-center items-center overflow-auto ">
      <DataTable value={artisan ? [artisan] : []} className="text-sm md:text-base max-w-full !overflow-hidden " style={{ width: "100%" }}>
        <Column field="project" header="Project" body={projectBodyTemplate} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
        <Column field="activity" header="Activity" body={activityBodyTemplate} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
        <Column field="measure" header="Measure" body={measuresBodyTemplate} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
        <Column field="price" header="Price" body={() => priceBodyTemplate({ set: setPrice, price, setIsAdding })} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
        <Column field="price" header="Manger Price" body={() => priceBodyTemplate({ set: setManagerPrice, price: mangerPrice, setIsAdding })} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
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
