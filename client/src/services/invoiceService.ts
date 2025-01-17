// client\src\services\invoiceService.ts
import axios from "axios";
import { Invoice, CreateInvoiceData } from "@/types/invoice.types";

const API_URL = import.meta.env.VITE_API_URL;

export const invoiceService = {
  getAll: async (): Promise<Invoice[]> => {
    try {
      console.log("Fetching all client invoices");
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

  getById: async (id: number): Promise<Invoice> => {
    console.log("Fetching client invoice by ID:", id);
    const response = await axios.get(`${API_URL}/invoices-client/${id}`);
    return response.data.data;
  },

  create: async (data: CreateInvoiceData): Promise<Invoice> => {
    console.log("Creating client invoice with data:", JSON.stringify(data, null, 2));
    try {
      const response = await axios.post(`${API_URL}/invoices-client/create`, data);
      console.log("Create invoice response:", response.data);
      return response.data.data;
    } catch (error: any) {
      console.error("Error creating invoice:", error.response?.data || error);
      throw new Error(error.response?.data?.message || "Failed to create invoice");
    }
  },

  updateStatus: async (id: number, paid: boolean): Promise<Invoice> => {
    console.log("Updating client invoice status:", id, paid);
    const response = await axios.put(`${API_URL}/invoices-client/${id}/update-status`, { paid });
    return response.data.data;
  },

  downloadPDF: async (id: number): Promise<Blob> => {
    console.log("Downloading client invoice PDF:", id);
    const response = await axios.get(`${API_URL}/invoices-client/${id}/pdf`, {
      responseType: "blob"
    });
    return response.data;
  },

  deleteInvoice: async (id: number): Promise<void> => {
    console.log("Deleting client invoice:", id);
    await axios.delete(`${API_URL}/invoices/${id}`);
  }
};
