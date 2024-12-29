//client\src\hooks\useQueryHook.ts
import { createEntity, editEntity, getEntityData, getInfiniteData, getPaginatedData } from "@/api/apiCall";
import { CachedDataOptions, FetchDataQueryOptions, FetchQueryOptions, PaginatedDataResponse, UseGetPaginatedDataTypes } from "@/types/query-data-types/paginatedDataTypes";
import { ProjectTask } from "@/types/task-types/taskTypes";
import { PaginatedWorkItems } from "@/types/work-item-types/workItem";
import { keepPreviousData, useInfiniteQuery, UseInfiniteQueryResult, useMutation, useQuery, UseQueryResult, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface QueryConfig {
  URL: string;
  queryKey: string[];
}

interface EditEntityOptions<TData> extends QueryConfig {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
}

interface CreateEntityOptions<TData> extends QueryConfig {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
}

export const useGetPaginatedData = <TData>({ URL, queryKey, limit, page, search }: UseGetPaginatedDataTypes): UseQueryResult<PaginatedDataResponse<TData>> => {
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
  return useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam = 1 }) => getInfiniteData<TData[]>(URL, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return pages.length + 1;
    },
    staleTime: 0
  });
};

export const useFetchDataQuery = <TData>({ URL, queryKey, options }: FetchDataQueryOptions<TData>): UseQueryResult<TData> => {
  return useQuery({
    queryKey,
    queryFn: () => getEntityData<TData>(URL),
    ...options
  });
};

export const useCachedData = <TData>({ queryKey, selectFn }: CachedDataOptions<TData>) => {
  const { data } = useQuery({
    queryKey,
    select: (data: PaginatedDataResponse<TData> | TData[] | PaginatedWorkItems | ProjectTask) => {
      if (!data) {
        return undefined;
      }
      return selectFn(data);
    }
  });
  return data;
};

export const useGetEntityData = <TData>({ URL, queryKey }: QueryConfig) => {
  console.log("🔄 Fetching entity data from:", URL);

  return useQuery({
    queryKey: queryKey,
    queryFn: () => getEntityData<TData>(URL)
  });
};

export const useEditEntity = <TData>({ URL, queryKey, successMessage, errorMessage, onSuccess }: EditEntityOptions<TData>) => {
  return useMutation({
    mutationFn: (data: TData) => editEntity<TData>(URL, data),
    onSuccess: () => {
      toast.success(successMessage);
      onSuccess?.();
    }
  });
};

export const useCreateEntity = <TData>({ URL, queryKey, successMessage, errorMessage, onSuccess }: CreateEntityOptions<TData>) => {
  return useMutation({
    mutationFn: (data: TData) => createEntity<TData>(URL, data),
    onSuccess: () => {
      toast.success(successMessage);
      onSuccess?.();
    }
  });
};

