import { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { PaginatedWorkItems } from '../work-item-types/workItem';
import { ProjectTask } from '../task-types/taskTypes';

export type UseFetchQueryOptions<TData> = Omit<
    UseQueryOptions<TData>,
    'queryKey' | 'queryFn'
>;

export type CachedDataOptions<TData> = {
    queryKey: QueryKey;
    selectFn: (
        data:
            | PaginatedDataResponse<TData>
            | TData[]
            | PaginatedWorkItems
            | ProjectTask
    ) => TData | undefined;
};

export interface FetchQueryOptions {
    URL: string;
    queryKey: QueryKey;
}

export interface FetchDataQueryOptions<TData> extends FetchQueryOptions {
    options?: UseFetchQueryOptions<TData>;
}

export interface UseGetPaginatedDataTypes extends FetchQueryOptions {
    page: number;
    limit?: number;
    search?: string;
}

export type PaginatedDataResponse<TData> = {
    data: TData[];
    limit?: number;
    total?: number;
    page?: number;
    totalPages?: number;
};
