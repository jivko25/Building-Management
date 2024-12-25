import { useState } from "react";
import { Dialog } from "primereact/dialog";
import AddDefaultValuesTable from "@/components/Forms/Artisans/ArtisanTableAddDefaultVlues/AddDefaultValuesTable";
import { Button } from "@/components/ui/button";
import { CircleDollarSign } from "lucide-react";
export default function AddDefaultValuesDialog() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="">
      <Button variant="ghost" size="icon">
        {CircleDollarSign}
      </Button>
      <Dialog
        className="flex justify-center items-center content-center m-5"
        visible={visible}
        closable={true}
        modal
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        content={({ hide }) => (
          <div className=" w-[500px] h-[400px]" style={{ borderRadius: "12px", backgroundColor: "hsl(222.2 84% 4.9%)" }}>
            <AddDefaultValuesTable />
          </div>
        )}></Dialog>
    </div>
  );
}
