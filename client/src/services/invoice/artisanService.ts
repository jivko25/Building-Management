import axios from "axios";
import { ArtisanInvoice, CreateArtisanInvoiceData } from "@/types/invoice/artisan.types";

const API_URL = import.meta.env.VITE_API_URL;

export const artisanInvoiceService = {
  getAll: async (): Promise<ArtisanInvoice[]> => {
    try {
      console.log("Fetching all artisan invoices");
      const response = await axios.get(`${API_URL}/invoices-artisan`, {
        withCredentials: true
      });
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

  getById: async (id: number): Promise<ArtisanInvoice> => {
    console.log("Fetching artisan invoice by ID:", id);
    const response = await axios.get(`${API_URL}/invoices-artisan/${id}`, {
      withCredentials: true
    });
    return response.data.data;
  },

  create: async (data: CreateArtisanInvoiceData): Promise<ArtisanInvoice> => {
    console.log("Creating artisan invoice with data:", JSON.stringify(data, null, 2));
    try {
      const response = await axios.post(`${API_URL}/invoices-artisan/create`, data, {
        withCredentials: true
      });
      console.log("Create invoice response:", response.data);
      return response.data.data;
    } catch (error: any) {
      console.error("Error creating invoice:", error.response?.data || error);
      throw new Error(error.response?.data?.message || "Failed to create invoice");
    }
  },

  updateStatus: async (id: number, paid: boolean): Promise<ArtisanInvoice> => {
    console.log("Updating artisan invoice status:", id, paid);
    const response = await axios.patch(`${API_URL}/invoices-artisan/${id}/status`, { paid }, { withCredentials: true });
    return response.data.data;
  },

  downloadPDF: async (id: number): Promise<Blob> => {
    console.log("Downloading artisan invoice PDF:", id);
    const response = await axios.get(`${API_URL}/invoices-artisan/${id}/pdf`, {
      responseType: "blob",
      withCredentials: true
    });
    return response.data;
  },

  deleteInvoice: async (id: number): Promise<void> => {
    console.log("Deleting artisan invoice:", id);
    await axios.delete(`${API_URL}/invoices-artisan/${id}`, {
      withCredentials: true
    });
  },

  getWorkItemsForInvoice: async (company_id?: number, artisan_id?: number) => {
    try {
      console.log("🔍 Fetching work items for artisan invoice with filters:", { company_id, artisan_id });

      let url = `${API_URL}/invoices-artisan/work-items`;
      const params = new URLSearchParams();

      if (company_id) params.append("company_id", company_id.toString());
      if (artisan_id) params.append("artisan_id", artisan_id.toString());

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, { withCredentials: true });
      console.log("📦 Work items response:", response.data);

      if (!response.data.data) {
        console.warn("⚠️ No work items found");
        return [];
      }

      return response.data.data;
    } catch (error) {
      console.error("❌ Error fetching work items:", error);
      throw error;
    }
  }
};
