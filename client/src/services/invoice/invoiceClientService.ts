import axios from "axios";
import { ClientInvoice } from "@/types/invoice/client.types";
import { CreateClientInvoiceData } from "@/types/invoice/client.types";

const API_URL = import.meta.env.VITE_API_URL;

export const invoiceClientService = {
  getAll: async (): Promise<ClientInvoice[]> => {
    try {
      const response = await axios.get(`${API_URL}/invoices-client`);
      console.log("🔄 Response data:", response.data);
      if (!response.data.data || !Array.isArray(response.data.data)) {
        console.error("❌ Invalid response format:", response.data);
        return [];
      }
      return response.data.data;
    } catch (error) {
      console.error("❌ Error fetching invoices:", error);
      throw error;
    }
  },

  getById: async (id: number): Promise<ClientInvoice> => {
    const response = await axios.get(`${API_URL}/invoices-client/${id}`);
    return response.data.data;
  },

  create: async (data: CreateClientInvoiceData): Promise<ClientInvoice> => {
    console.log("Creating invoice with data:", JSON.stringify(data, null, 2));
    try {
      const response = await axios.post(`${API_URL}/invoices-client/create`, data, {
        withCredentials: true
      });
      console.log("Create invoice response:", response.data);
      return response.data.data;
    } catch (error: any) {
      console.error("Error creating invoice:", error.response?.data || error);
      throw new Error(error.response?.data?.message || "Failed to create invoice");
    }
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/invoices/${id}`);
  },

  updateStatus: async (id: number, paid: boolean): Promise<ClientInvoice> => {
    const response = await axios.patch(`${API_URL}/invoices-client/${id}/status`, { paid });
    return response.data.data;
  },

  getWorkItemsForInvoice: async (company_id?: number, client_id?: number, project_id?: number, page: number = 1, limit: number = 10) => {
    try {
      console.log("🔍 Fetching work items with pagination:", {
        company_id,
        client_id,
        project_id,
        page,
        limit
      });

      let url = `${API_URL}/invoices-client/work-items`;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (company_id) params.append("company_id", company_id.toString());
      if (client_id) params.append("client_id", client_id.toString());
      if (project_id) params.append("project_id", project_id.toString());

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, {
        withCredentials: true,
        params
      });

      console.log("📦 Work items response with pagination:", response.data);
      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1
      };
    } catch (error) {
      console.error("❌ Error fetching work items:", error);
      return {
        data: [],
        total: 0,
        totalPages: 1
      };
    }
  },

  getClientById: async (id: number) => {
    try {
      console.log("Fetching client with ID:", id);
      const response = await axios.get(`${API_URL}/clients/${id}`, {
        withCredentials: true
      });
      console.log("Client data response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching client:", error);
      throw error;
    }
  }
};
