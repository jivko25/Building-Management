import { BaseInvoice, BaseInvoiceItem } from "./base.types";

export interface ClientInvoice extends BaseInvoice {
  client: {
    id: number;
    client_name: string;
    client_company_name: string;
    client_company_address: string;
    client_company_vat_number?: string;
    client_company_mol?: string;
    client_company_iban?: string;
    client_emails: string | string[];
  };
  items: ClientInvoiceItem[];
}

export interface ClientInvoiceItem extends BaseInvoiceItem {
  project: {
    id: number;
    location: string;
    address: string;
  };
  task: {
    id: number;
    activity_id: number;
    measure_id: number;
    project_id: number;
    total_work_in_selected_measure: string;
    price_per_measure: string;
  };
}

export interface CreateClientInvoiceData {
  company_id: number;
  client_company_id: number;
  due_date_weeks: number;
  project_ids: number[];
  work_item_ids: number[];
}
