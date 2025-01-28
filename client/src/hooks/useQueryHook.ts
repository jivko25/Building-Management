//client\src\hooks\useQueryHook.ts
import { createEntity, editEntity, getEntityData, getInfiniteData } from "@/api/apiCall";
import { CachedDataOptions, FetchDataQueryOptions, FetchQueryOptions, PaginatedDataResponse, UseGetPaginatedDataTypes } from "@/types/query-data-types/paginatedDataTypes";
import { useInfiniteQuery, UseInfiniteQueryResult, useMutation, useQuery, UseQueryResult, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface QueryConfig {
  URL: string;
  queryKey: string[];
}

interface EntityOptions {
  URL: string;
  queryKey?: string[];
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
}

export const useGetPaginatedData = <TData>({ URL, queryKey, limit, page, search }: UseGetPaginatedDataTypes): UseQueryResult<PaginatedDataResponse<TData>> => {
  console.log("Fetching paginated data:", { URL, page, limit, search });

  return useQuery({
    queryKey: [...queryKey, { page, limit, search }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit?.toString() || "12"
      });

      if (search) {
        params.append("q", search);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}${URL}?${params}`, {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Pagination response:", data);
      return data;
    },
    staleTime: 30000
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
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey,
    enabled: queryKey.length > 0,
    select: () => {
      console.log("useCachedData - QueryKey:", queryKey);

      const cachedQueries = queryClient.getQueriesData({ queryKey });
      console.log("All cached queries:", cachedQueries);

      const allData = cachedQueries.reduce((acc: TData[], [_, data]) => {
        if (data && typeof data === "object") {
          if ("data" in data) {
            return [...acc, ...(Array.isArray(data.data) ? data.data : [data.data])];
          } else if (Array.isArray(data)) {
            return [...acc, ...data];
          }
        }
        return acc;
      }, []);

      console.log("Combined cached data:", allData);
      return selectFn(allData);
    },
    staleTime: 30000
  });

  return queryResult.data;
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
