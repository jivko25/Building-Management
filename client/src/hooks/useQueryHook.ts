//client\src\hooks\useQueryHook.ts
import { createEntity, editEntity, getEntityData, getInfiniteData, getPaginatedData } from "@/api/apiCall";
import { CachedDataOptions, FetchDataQueryOptions, FetchQueryOptions, PaginatedDataResponse, UseGetPaginatedDataTypes } from "@/types/query-data-types/paginatedDataTypes";
import { ProjectTask } from "@/types/task-types/taskTypes";
import { PaginatedWorkItems } from "@/types/work-item-types/workItem";
import { keepPreviousData, useInfiniteQuery, UseInfiniteQueryResult, useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

interface QueryConfig {
  URL: string;
  queryKey: string[];
}

interface EntityOptions {
  URL: string;
  successMessage?: string;
  onSuccess?: () => void;
}

export const useGetPaginatedData = <TData>({ URL, queryKey, limit, page, search }: UseGetPaginatedDataTypes): UseQueryResult<PaginatedDataResponse<TData>> => {
  console.log("Fetching paginated data:", { URL, page, limit, search });
  return useQuery({
    queryKey: [...queryKey, page, limit, search],
    queryFn: () => getPaginatedData<TData>(URL, page, limit!, search),
    staleTime: 0,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData
  });
};

export const useGetInfiniteData = <TData>({ URL, queryKey }: FetchQueryOptions): UseInfiniteQueryResult<TData> => {
  console.log("Fetching infinite data from:", URL);
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => getInfiniteData<TData[]>(URL, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => (lastPage.length === 0 ? undefined : pages.length + 1),
    staleTime: 0
  });
};

export const useFetchDataQuery = <TData>({ URL, queryKey, options }: FetchDataQueryOptions<TData>): UseQueryResult<TData> => {
  console.log("Fetching data query from:", URL);
  return useQuery({
    queryKey,
    queryFn: () => getEntityData<TData>(URL),
    ...options
  });
};

export const useCachedData = <TData>({ queryKey, selectFn }: CachedDataOptions<TData>) => {
  return useQuery({
    queryKey,
    select: (data: PaginatedDataResponse<TData> | TData[] | PaginatedWorkItems | ProjectTask) => (data ? selectFn(data) : undefined)
  }).data;
};

export const useGetEntityData = <TData>({ URL, queryKey }: QueryConfig) => {
  console.log("Fetching entity data from:", URL);
  return useQuery({
    queryKey,
    queryFn: () => getEntityData<TData>(URL)
  });
};

export const useEditEntity = <TData>({ URL, successMessage, onSuccess }: EntityOptions) => {
  return useMutation({
    mutationFn: (data: TData) => editEntity<TData>(URL, data),
    onSuccess: () => {
      if (successMessage) toast.success(successMessage);
      onSuccess?.();
    }
  });
};

export const useCreateEntity = <TData>({ URL, successMessage, onSuccess }: EntityOptions) => {
  return useMutation({
    mutationFn: (data: TData) => createEntity<TData>(URL, data),
    onSuccess: () => {
      if (successMessage) toast.success(successMessage);
      onSuccess?.();
    }
  });
};
