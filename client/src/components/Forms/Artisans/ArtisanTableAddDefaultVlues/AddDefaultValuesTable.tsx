import { Button } from "@/components/ui/button";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { Measure, MeasureResponse } from "@/types/measure-types/measureTypes";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";
const proffesions = ["Electrician", "Plumber", "Carpenter", "Painter", "Mason", "Roofer", "Welder", "Tiler"];
const data = [
  { name: "Stefan Stefanov", specialty: "Electrician", price: 100 },
  { name: "Petar", specialty: "Plumber", price: 100 },
  { name: "Ivan", specialty: "Carpenter", price: 100 },
  { name: "Todor", specialty: "Painter", price: 100 }
];
const unitsInitialData: string[] = ["lv", "leva", "chas"];

export default function AddDefaultValuesTable() {
  const [proffesion, setProffesion] = useState(data[0].specialty);
  const [price, setPrice] = useState<number>(0);
  const [measure, setMeasure] = useState<Measure>();
  const { data: measures } = useFetchDataQuery<MeasureResponse>({ URL: "/measures", queryKey: ["measures"] }) as { data: MeasureResponse; isPending: boolean; isError: boolean };
  console.log("🔥 measures:", measures);
  console.log("🔥 measure:", measure);
  const proffesionsBodyTemplate = () => {
    return (
      <Dropdown
        options={proffesions}
        value={proffesion}
        onChange={e => {
          setProffesion(e.value);
        }}
        panelClassName="z-50 pointer-events-auto"
        scrollHeight="200px"
        className="w-full text-xs " // Ensures dropdown fits in column width
      />
    );
  };
  const unitsBodyTemplate = () => {
    return <Dropdown options={measures?.data.map(m => ({ label: m.name, value: m }))} value={measure} panelClassName="z-50 pointer-events-auto" scrollHeight="200px" onChange={e => setMeasure(e.value)} className="w-full text-xs" />;
  };

  const priceBodyTemplate = () => {
    return (
      <InputNumber
        className="w-full text-l" // Ensures input width fits in column
        value={price}
        inputId="currency-germany"
        currency="EUR"
        onChange={e => setPrice(e.value ?? 0)}
      />
    );
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <DataTable
        value={[data[0]]}
        size="large" // Adjust table size for compact layout
        className="w-[800px]    " // Shrink the table size and font
      >
        <Column
          field="name"
          header="Name"
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

//forma na obekta
const primernaData: any = {
  name: "aasdasd",
  proffesion: { traktorist: { metar: "1lv", decimetar: "5 leva", chas: "3 leva" }, helikoptorist: { metar: "1lv", decimetar: "5 leva", chas: "3 leva" } }
};
