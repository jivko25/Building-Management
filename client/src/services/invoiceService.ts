import axios from "axios";
import { Invoice } from "@/types/invoice.types";

const API_URL = import.meta.env.VITE_API_URL;

export const invoiceService = {
  getAll: async (): Promise<Invoice[]> => {
    try {
      const response = await axios.get(`${API_URL}/invoices`);
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

  getById: async (id: number): Promise<Invoice> => {
    const response = await axios.get(`${API_URL}/invoices/${id}`);
    return response.data.data;
  },

  create: async (data: any): Promise<Invoice> => {
    console.log("Creating invoice with data:", JSON.stringify(data, null, 2));
    try {
      const response = await axios.post(`${API_URL}/invoices`, data);
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

  updateStatus: async (id: number, paid: boolean): Promise<Invoice> => {
    const response = await axios.patch(`${API_URL}/invoices/${id}/status`, { paid });
    return response.data.data;
  }
};
