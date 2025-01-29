//client\src\utils\helpers\findItemById.ts
import { PaginatedDataResponse } from "@/types/query-data-types/paginatedDataTypes";
import { ProjectTask } from "@/types/task-types/taskTypes";

export const findItemById = <TData>(data: any, id: string, getId: (item: TData) => string): TData | undefined => {
  console.log("findItemById - Input data:", data);

  if (!data) return undefined;

  // Handle nested paginated data structure
  if (data.data && Array.isArray(data.data)) {
    const found = data.data.find((item: TData) => getId(item) === id);
    console.log("Found in paginated data:", found);
    return found;
  }

  if (Array.isArray(data)) {
    const found = data.find(item => getId(item) === id);
    console.log("Found in array:", found);
    return found;
  }

  console.log("Unsupported data structure");
  return undefined;
};
