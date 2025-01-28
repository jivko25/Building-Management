//client\src\utils\helpers\findItemById.ts
import { PaginatedDataResponse } from "@/types/query-data-types/paginatedDataTypes";
import { ProjectTask } from "@/types/task-types/taskTypes";

export const findItemById = <TData>(data: PaginatedDataResponse<TData> | TData[] | ProjectTask, id: string, getId: (item: TData) => string): TData | undefined => {
  console.log("findItemById - Input data:", data);
  console.log("findItemById - Looking for ID:", id);

  if (Array.isArray(data)) {
    const found = data.find(item => getId(item) === id);
    console.log("findItemById - Found in array:", found);
    return found;
  }

  if ("data" in data && Array.isArray(data.data)) {
    const found = data.data.find(item => getId(item) === id);
    console.log("findItemById - Found in paginated data:", found);
    return found;
  }

  console.log("findItemById - No matching data structure found");
  return undefined;
};
