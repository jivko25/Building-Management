import { PaginatedDataResponse } from '@/types/query-data-types/paginatedDataTypes';

const API_URL = import.meta.env.VITE_API_URL;

const apiCall = async (endpoint: string, method: string, data?: unknown) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Something wrong happened');
    }

    const editEndpointPattern: RegExp = /^\/users\/\d+\/edit$/;

    if (editEndpointPattern.test(endpoint)) {
        return;
    }

    return response.json();
};

export const getPaginatedData = async <TData>(
    URL: string,
    page: number,
    limit: number,
    search?: string
): Promise<PaginatedDataResponse<TData>> => {
    const searchParam = search ? `&q=${encodeURIComponent(search)}` : '';
    const pageParam = page ? `?_page=${encodeURIComponent(page)}` : '';
    const data: PaginatedDataResponse<TData> = await apiCall(
        `${URL}${pageParam}&_limit=${limit}${searchParam}`,
        'GET'
    );
    return data;
};

export const getInfiniteData = async <TData>(
    URL: string,
    pageParam: number
): Promise<TData> => {
    const data: TData = await apiCall(
        `${URL}/work-items?_page=${pageParam}&_limit=10`,
        'GET'
    );
    return data;
};

export const getEntityData = async <TData>(URL: string): Promise<TData> => {
    const data: TData = await apiCall(`${URL}`, 'GET');
    return data;
};

export const createEntity = async <TData>(
    URL: string,
    entityData: TData
): Promise<void> => {
    const data = await apiCall(`${URL}`, 'POST', entityData);
    return data;
};

export const editEntity = async <TData>(
    URL: string,
    entityData: TData
): Promise<void> => {
    return await apiCall(`${URL}`, 'PUT', entityData);
};
