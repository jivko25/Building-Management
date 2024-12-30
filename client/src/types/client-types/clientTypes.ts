export type Client = {
  id?: number;
  client_company_name: string;
  client_name: string;
  client_company_address: string;
  client_company_iban: string;
  client_emails: string[];
  status: "active" | "inactive";
  creator_id?: number;
  client_company_vat_number?: string;
  creator?: {
    username: string;
  };
}; 