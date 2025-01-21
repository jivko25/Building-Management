// client\src\services\clientService.ts
import apiClient from "@/api/axiosConfig";
import { Client } from "@/types/client-types/clientTypes";

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    try {
      const response = await apiClient.get("/clients");
      console.log("🔄 Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching clients:", error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Client> => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },

  create: async (data: Omit<Client, "id">): Promise<Client> => {
    console.log("Creating client with data:", JSON.stringify(data, null, 2));
    try {
      const response = await apiClient.post("/clients", data);
      console.log("Create client response:", response.data);
      return response.data.client;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Error creating client:", err.response?.data || error);
      throw new Error(err.response?.data?.message || "Failed to create client");
    }
  },

  update: async (id: number, data: Partial<Client>): Promise<Client> => {
    const response = await apiClient.put(`/clients/${id}`, data);
    return response.data.client;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
  }
};
