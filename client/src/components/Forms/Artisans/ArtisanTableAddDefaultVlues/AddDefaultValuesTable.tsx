import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";
const proffesions = ["Electrician", "Plumber", "Carpenter", "Painter", "Mason", "Roofer", "Welder", "Tiler", "Electrician", "Plumber", "Carpenter", "Painter", "Mason", "Roofer", "Welder", "Tiler"];
const data = [
  { name: "Stefan", specialty: "Electrician", price: 100 },
  { name: "Petar", specialty: "Plumber", price: 100 },
  { name: "Ivan", specialty: "Carpenter", price: 100 },
  { name: "Todor", specialty: "Painter", price: 100 }
];

export default function AddDefaultValuesTable() {
  const [proffesion, setProffesion] = useState(data[0].specialty);
  const [price, setPrice] = useState(data[0].price);
  const proffesionsBodyTemplate = (rowData: string) => {
    return (
      <Dropdown
        options={proffesions}
        value={proffesion}
        onChange={e => {
          setProffesion(e.value);
        }}
      />
    );
  };
  const priceBodyTemplate = (rowData: number) => {
    return <InputNumber value={price} style={{ width: "10rem", fitContent: true }} />;
  };
  return (
    <DataTable value={[data[0]]} tableStyle={{ minWidth: "10rem", maxWidth: "100rem" }} size="large">
      <Column field="name" header="Name" style={{ width: "65rem" }} />
      <Column field="specialty" header="Specialty" body={proffesionsBodyTemplate} style={{ width: "65rem" }} valu />
      <Column field="price" header="Price" body={priceBodyTemplate} style={{ width: "65rem" }} />
    </DataTable>
  );
}
