import { editEntity } from "@/api/apiCall";
import ResponseMessage from "@/components/common/ResponseMessages/ResponseMessage";
import { Button } from "@/components/ui/button";
import { priceBodyTemplate } from "@/components/ui/defaultPricingTableRows";
import { EditDefaultValuesTableProps } from "@/types/defaultPricingType/defaultPricingTypes";
import { ResponseMessageType } from "@/types/response-message/responseMessageTypes";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

export default function EditDefaultValuesTable({ editProps, refetch }: { editProps: EditDefaultValuesTableProps; refetch: () => void }) {
  const [price, setPrice] = useState<number>(editProps.price);
  const [managerPrice, setManagerPrice] = useState<number>(editProps.managerPrice);
  const [responseMessage, setResponseMessage] = useState<ResponseMessageType | null>(null);

  const activityBodyTemplate = () => {
    return <InputText value={editProps.activity} readOnly className="w-[150px]  text-xs md:text-sm  p-2" />;
  };

  const measuresBodyTemplate = () => {
    return <InputText value={editProps.measure} readOnly className="w-[150px]  text-xs md:text-sm border rounded p-2" />;
  };

  //Add default pricing (onSubmit)
  const editDefaultPricing = async () => {
    const newDefaultPricing = { ...editProps.defaultPricing, artisan_price: price, manager_price: managerPrice };

    try {
      await editEntity(`/default-pricing/${editProps.defaultPricing.id}`, newDefaultPricing);
      setResponseMessage({ type: "success", message: "Values changed successfully!" });
      refetch();
    } catch (error) {
      console.error(error);
      setResponseMessage({ type: "error", message: "Something went wrong!" });
    }
  };

  // Create a data object that matches the columns
  const tableData = [
    {
      activity: editProps.activity,
      measure: editProps.measure,
      price: editProps.price,
      managerPrice: editProps.managerPrice
    }
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center overflow-auto ">
      <DataTable value={tableData} className="text-sm md:text-base max-w-full !overflow-hidden  " style={{ width: "100%" }}>
        <Column field="activity" header="Activity" body={activityBodyTemplate} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
        <Column field="measure" header="Measure" body={measuresBodyTemplate} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
        <Column field="price" header="Price" body={() => priceBodyTemplate({ set: setPrice, price })} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
        <Column field="price" header="Manger Price" body={() => priceBodyTemplate({ set: setManagerPrice, price: managerPrice })} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
      </DataTable>
      <ConfirmDialog />
      <div className="flex flex-col justify-center items-center mt-4">
        <Button className="w-[150px] md:w-auto px-4 md:px-8 py-2" onClick={editDefaultPricing}>
          Edit default pricing
        </Button>
        {responseMessage && <ResponseMessage type={responseMessage.type} message={responseMessage.message} duration={2000} onHide={() => setResponseMessage(null)} />}
      </div>
    </div>
  );
}