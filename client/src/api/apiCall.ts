//client\src\api\apiCall.ts
import { PaginatedDataResponse } from "@/types/query-data-types/paginatedDataTypes";
import { Client } from "@/types/client-types/clientTypes";
const API_URL = import.meta.env.VITE_API_URL;

const apiCall = async (endpoint: string, method: string, data?: unknown) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include"
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw {
      message: responseData.message || "Something went wrong",
      status: response.status,
      response: { data: responseData }
    };
  }

  const editEndpointPattern: RegExp = /^\/users\/\d+\/edit$/;

  if (editEndpointPattern.test(endpoint)) {
    return;
  }

  return responseData;
};

export const getPaginatedData = async <TData>(URL: string, page: number, limit: number, search?: string): Promise<PaginatedDataResponse<TData>> => {
  const searchParam = search ? `&q=${encodeURIComponent(search)}` : "";
  const pageParam = page ? `?_page=${encodeURIComponent(page)}` : "";
  const data: PaginatedDataResponse<TData> = await apiCall(`${URL}${pageParam}&_limit=${limit}${searchParam}`, "GET");
  return data;
};

export const getInfiniteData = async <TData>(URL: string, pageParam: number): Promise<TData> => {
  const data: TData = await apiCall(`${URL}/work-items?_page=${pageParam}&_limit=10`, "GET");
  return data;
};

export const getEntityData = async <TData>(URL: string): Promise<TData> => {
  const data: TData = await apiCall(`${URL}`, "GET");
  return data;
};

export const createEntity = async <TData>(URL: string, entityData: TData): Promise<void> => {
  const data = await apiCall(`${URL}`, "POST", entityData);
  return data;
};

export const editEntity = async <TData>(URL: string, entityData: TData): Promise<void> => {
  return await apiCall(`${URL}`, "PUT", entityData);
};

export const deleteEntity = async (URL: string, entityData: { id: string }): Promise<void> => {
  return await apiCall(`${URL}/${entityData.id}`, "DELETE");
};

export const putEntityData = async <TData>(url: string, data: TData): Promise<TData> => {
  console.log("📤 Putting data to:", url, data);
  const response = await apiCall(`${url}`, "PUT", data);
  return response;
};

export const postEntityData = async <TData>(url: string, data: TData): Promise<TData> => {
  console.log("📤 Posting data to:", url, data);
  const response = await apiCall(`${url}`, "POST", data);
  return response;
};

export const fetchClients = async (): Promise<Client[]> => {
  const data: Client[] = await apiCall(`/clients`, "GET");
  return data;
};
