import { BaseInvoice, BaseInvoiceItem } from "./base.types";

export interface ArtisanInvoice extends BaseInvoice {
  artisan: {
    id: number;
    name: string;
    email: string;
    number?: string;
    note?: string;
    manager?: {
      id: number;
      full_name: string;
      email: string;
    };
  };
  items: ArtisanInvoiceItem[];
  invoice_date: string;
}

export interface ArtisanInvoiceItem extends BaseInvoiceItem {
  work_item: {
    id: number;
    activity_id: number;
    measure_id: number;
    completed_work: string;
    rate_per_measure: string;
  };
}

export interface CreateArtisanInvoiceData {
  company_id: number;
  artisan_id: number;
  due_date_weeks: number;
  selected_work_items: number[];
  items: {
    activity_id: number;
    measure_id: number;
    quantity: number;
    price_per_unit: number;
  }[];
}
