import {
    getEntityData,
    getInfiniteData,
    getPaginatedData,
} from '@/api/apiCall';
import {
    CachedDataOptions,
    FetchDataQueryOptions,
    FetchQueryOptions,
    PaginatedDataResponse,
    UseGetPaginatedDataTypes,
} from '@/types/query-data-types/paginatedDataTypes';
import { ProjectTask } from '@/types/task-types/taskTypes';
import { PaginatedWorkItems } from '@/types/work-item-types/workItem';
import {
    keepPreviousData,
    useInfiniteQuery,
    UseInfiniteQueryResult,
    useQuery,
    UseQueryResult,
} from '@tanstack/react-query';

export const useGetPaginatedData = <TData>({
    URL,
    queryKey,
    limit,
    page,
    search,
}: UseGetPaginatedDataTypes): UseQueryResult<PaginatedDataResponse<TData>> => {
    return useQuery({
        queryKey: [...queryKey, page, limit, search],
        queryFn: () => getPaginatedData<TData>(URL, page, limit!, search),
        staleTime: 0,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });
};

export const useGetInfiniteData = <TData>({
    URL,
    queryKey,
}: FetchQueryOptions): UseInfiniteQueryResult<TData> => {
    return useInfiniteQuery({
        queryKey: queryKey,
        queryFn: ({ pageParam = 1 }) =>
            getInfiniteData<TData[]>(URL, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length === 0) {
                return undefined;
            }
            return pages.length + 1;
        },
        staleTime: 0,
    });
};

export const useFetchDataQuery = <TData>({
    URL,
    queryKey,
    options,
}: FetchDataQueryOptions<TData>): UseQueryResult<TData> => {
    return useQuery({
        queryKey,
        queryFn: () => getEntityData<TData>(URL),
        ...options,
    });
};

export const useCachedData = <TData>({
    queryKey,
    selectFn,
}: CachedDataOptions<TData>) => {
    const { data } = useQuery({
        queryKey,
        select: (
            data:
                | PaginatedDataResponse<TData>
                | TData[]
                | PaginatedWorkItems
                | ProjectTask
        ) => {
            if (!data) {
                return undefined;
            }
            return selectFn(data);
        },
    });
    return data;
};
