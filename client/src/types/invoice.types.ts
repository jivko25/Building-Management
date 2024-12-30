export interface Invoice {
  id: number;
  invoice_number: string;
  year: number;
  week_number: number;
  company_id: number;
  client_id: number;
  invoice_date: string;
  due_date: string;
  total_amount: string;
  paid: boolean;
  created_at: string;
  updated_at: string;
  company: {
    name: string;
    address: string;
    location: string;
    registration_number: string;
    vat_number: string;
    iban: string;
    phone: string;
    logo_url: string;
    mol: string;
    email: string;
  };
  client: {
    client_company_name: string;
    client_company_address: string;
    client_company_vat_number: string;
    client_emails: string[];
    client_company_iban: string;
    client_name: string;
    client_company_mol: string;
  };
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  activity_id: number;
  measure_id: number;
  project_id: number;
  task_id: number | null;
  quantity: string;
  price_per_unit: string;
  total_price: string;
  activity: {
    id: number;
    name: string;
    status: string;
  };
  measure: {
    id: number;
    name: string;
  };
  project: {
    id: number;
    name: string;
    address: string;
    location: string;
    email: string;
  };
}

export interface CreateInvoiceDTO {
  company_id: number;
  client_company_name: string;
  client_name: string;
  client_company_address: string;
  client_company_iban: string;
  client_emails: string[];
  due_date_weeks: number;
  items: {
    activity_id: number;
    measure_id: number;
    project_id: number;
    quantity: number;
    price_per_unit: number;
  }[];
}
