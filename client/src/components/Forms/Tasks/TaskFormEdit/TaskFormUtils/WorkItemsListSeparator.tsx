//client\src\components\Forms\Tasks\TaskFormEdit\TaskFormUtils\WorkItemsListSeparator.tsx
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";

const WorkItemsListSeparator = () => {
  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center ">
          <Separator className="flex-grow w-[5rem] md:w-[10rem]" />
          <span className="px-4 text-lg text-muted-foreground flex-shrink-0">Work items list</span>
          <Separator className="flex-grow w-[5rem] md:w-[10rem]" />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <ChevronDown />
      </div>
    </>
  );
};

export default WorkItemsListSeparator;
