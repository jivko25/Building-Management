//client\src\components\common\DialogElements\DialogTriggerButtonEdit.tsx
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";

const DialogTriggerButtonEdit = () => {
  return (
    <DialogTrigger asChild>
      <Button variant="ghost" size="icon">
        <Edit />
      </Button>
    </DialogTrigger>
  );
};

export default DialogTriggerButtonEdit;
