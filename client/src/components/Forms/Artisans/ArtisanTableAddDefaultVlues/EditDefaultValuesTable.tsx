import { createEntity } from "@/api/apiCall";
import ResponseMessage from "@/components/common/ResponseMessages/ResponseMessage";
import { Button } from "@/components/ui/button";
import { Artisan } from "@/types/artisan-types/artisanTypes";
import { EditDefaultValuesTableProps } from "@/types/defaultPricingType/defaultPricingTypes";
import { ResponseMessageType } from "@/types/response-message/responseMessageTypes";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

export default function EditDefaultValuesTable({ editProps }: { editProps: EditDefaultValuesTableProps }) {
  const [newPrice, setNewPrice] = useState<number>(editProps.price);
  const [newManagerPrice, setNewManagerPrice] = useState<number>(editProps.managerPrice);
  const [artisan, setArtisan] = useState<Artisan>();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<ResponseMessageType | null>(null);

  const activityBodyTemplate = () => {
    return <InputText value={editProps.activity} readOnly className="w-[150px]  text-xs md:text-sm  p-2" />;
  };

  const measuresBodyTemplate = () => {
    return <InputText value={editProps.measure} readOnly className="w-[150px]  text-xs md:text-sm border rounded p-2" />;
  };

  const priceBodyTemplate = () => {
    return (
      <InputNumber
        className="w-[150px] md:w-[200px] text-sm md:text-base"
        value={editProps.price}
        inputId="currency-germany"
        currency="EUR"
        onChange={e => {
          setNewPrice(e.value ?? 0);
          setIsAdding(true);
        }}
      />
    );
  };
  const managerPriceBodyTemplate = () => {
    return (
      <InputNumber
        className="w-[150px] h-6"
        value={editProps.managerPrice}
        inputId="currency-germany"
        currency="EUR"
        onChange={e => {
          setNewManagerPrice(e.value ?? 0);
          setIsAdding(true);
        }}
      />
    );
  };

  //Add default pricing (onSubmit)
  const addDefaultPricing = async () => {
    const newDefaultPricing = { ...editProps.defaultPricing, price: newPrice, manager_price: newManagerPrice };

    try {
      await createEntity(`/default-pricing/${editProps.artisanId}`, newDefaultPricing);
      setIsAdding(false);
      setResponseMessage({ type: "success", message: "Values added successfully!" });
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
    <div className="w-full flex flex-col justify-center items-center ">
      <DataTable value={tableData} responsiveLayout="stack" breakpoint="960px" className="text-sm md:text-base max-w-full !overflow-x-hidden " style={{ width: "100%" }}>
        <Column field="activity" header="Activity" body={activityBodyTemplate} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
        <Column field="measure" header="Measure" body={measuresBodyTemplate} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
        <Column field="price" header="Price" body={priceBodyTemplate} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
        <Column field="managerPrice" header="Manager Price" body={managerPriceBodyTemplate} className="text-sm md:text-base [&>td]:!max-w-[400px]" />
      </DataTable>
      <ConfirmDialog />
      <div className="flex flex-col justify-center items-center mt-4">
        <Button className="w-[150px] md:w-auto px-4 md:px-8 py-2" onClick={addDefaultPricing}>
          Edit default pricing
        </Button>
        {responseMessage && <ResponseMessage type={responseMessage.type} message={responseMessage.message} duration={2000} onHide={() => setResponseMessage(null)} />}
      </div>
    </div>
  );
}
