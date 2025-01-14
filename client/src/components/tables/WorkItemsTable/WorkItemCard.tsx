//client\src\components\tables\WorkItemsTable\WorkItemCard.tsx
import EditWorkItem from "@/components/Forms/WorkItems/WorkItemFormEdit/EditWorkItem";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Archive } from "lucide-react";
import { PaginatedWorkItems, WorkItem } from "@/types/work-item-types/workItem";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

type WorkItemCardProps = {
  workItems: PaginatedWorkItems;
};

const WorkItemCard = ({ workItems }: WorkItemCardProps) => {
  return (
    <>
      {workItems &&
        workItems?.pages?.map((page : any) =>
          page.workItems.map((item : WorkItem) => (
            <Card className="w-full sm:w-full md:w-full lg:max-w-[24rem] shadow-md shadow-slate-700/20 transition duration-300 ease-in-out hover:shadow-md dark:hover:shadow-slate-700/40 motion-preset-pop motion-duration-700" key={item.id}>
              <CardHeader className="px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>{item.name}</CardTitle>
                  <Badge className={`${item.status === "done" ? "bg-green-500 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-700"} text-white transition-colors duration-200 rounded-full`}>{item.status === "done" ? "Done" : "In progress"}</Badge>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-2 justify-between text-sm text-muted-foreground">
                  <div className="">
                    <div>Start: {format(new Date(item.start_date!), "PP")}</div>
                    <div>End: {format(new Date(item.end_date!), "PP")}</div>
                  </div>
                  <div className="flex items-end"></div>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="flex flex-1 justify-evenly">
                <EditWorkItem workItemId={item.id as string} />
                <Separator orientation="vertical" className="h-9" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {/* <Button className="gap-2" variant="ghost" size="icon">
                        <Archive className="h-6 w-6" />
                      </Button> */}
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Archive</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          ))
        )}
    </>
  );
};

export default WorkItemCard;
