export type Client = {
  id?: number;
  client_company_name: string;
  client_name: string;
  postal_code: string;
  client_company_address: string;
  client_company_iban: string;
  client_emails: string[];
  status: "active" | "inactive";
  creator_id?: number;
  client_company_vat_number?: string;
  invoice_language_id: number;
  due_date: number;
  creator?: {
    username: string;
  };
  invoiceLanguage?: {
    id: number;
    code: string;
    name: string;
  };
};

export type Language = {
  id: number;
  code: string;
  name: string;
  created_at?: string;
  updated_at?: string;
};
