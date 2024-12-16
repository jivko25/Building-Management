//client\src\utils\helpers\findItemById.ts
import { PaginatedDataResponse } from "@/types/query-data-types/paginatedDataTypes";
import { ProjectTask } from "@/types/task-types/taskTypes";

export const findItemById = <TData>(data: PaginatedDataResponse<TData> | TData[] | ProjectTask, id: string, getId: (item: TData) => string): TData | undefined => {
  if (Array.isArray(data)) {
    return data.find(item => getId(item) === id) || undefined;
  }

  if ("workItemsData" in data && Array.isArray(data.workItemsData)) {
    return (data.workItemsData.find(item => getId(item as TData) === id) as TData) || undefined;
  }

  return (data as PaginatedDataResponse<TData>).data?.find(item => getId(item) === id) || undefined;
};
