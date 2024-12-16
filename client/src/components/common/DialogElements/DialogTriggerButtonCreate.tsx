//client\src\components\common\DialogElements\DialogTriggerButtonCreate.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

type DialogTriggerButtonCreateProps = {
  text: string;
  className?: string;
};

const DialogTriggerButtonCreate = ({ text, className }: DialogTriggerButtonCreateProps) => {
  return (
    <Button className={cn("w-full lg:max-w-[12rem]", className)} variant="outline">
      <Plus className="mr-2 h-4 w-4" />
      <span className="font-bold">{text}</span>
    </Button>
  );
};

export default DialogTriggerButtonCreate;
