export interface Invoice {
  id: number;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total_amount: string;
  paid: boolean;
  company: {
    id: number;
    name: string;
    address: string;
    registration_number?: string;
    vat_number?: string;
    phone?: string;
    email?: string;
    iban?: string;
    mol?: string;
    logo_url?: string;
  };
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
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  activity: {
    id: number;
    name: string;
  };
  measure: {
    id: number;
    name: string;
  };
  project: {
    id: number;
    location: string;
    address: string;
  };
  quantity: string;
  price_per_unit: string;
  total_price: string;
  task: {
    id: number;
    activity_id: number;
    measure_id: number;
    project_id: number;
    total_work_in_selected_measure: string;
    price_per_measure: string;
  };
}

export interface CreateInvoiceData {
  company_id: number;
  client_company_id: number;
  due_date_weeks: number;
  selected_projects: number[];
  selected_work_items: number[];
  items: {
    activity_id: number;
    measure_id: number;
    project_id: number;
    quantity: number;
    price_per_unit: number;
  }[];
}
