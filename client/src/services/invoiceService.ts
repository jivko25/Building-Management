import axios from "axios";
import { Invoice } from "@/types/invoice.types";

const API_URL = import.meta.env.VITE_API_URL;

export const invoiceService = {
  getAll: async (): Promise<Invoice[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/invoices`);
      console.log("🔄 Full API Response:", response);
      console.log("🔄 Response data:", response.data);
      console.log("🔄 Invoices array:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Error fetching invoices:", error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Invoice> => {
    const response = await axios.get(`${API_URL}/api/invoices/${id}`);
    return response.data.data;
  },

  create: async (data: any): Promise<Invoice> => {
    const response = await axios.post(`${API_URL}/api/invoices`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/api/invoices/${id}`);
  }
};
