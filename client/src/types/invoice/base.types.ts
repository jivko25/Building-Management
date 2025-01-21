export interface BaseInvoice {
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
}

export interface BaseInvoiceItem {
  id: number;
  activity: {
    id: number;
    name: string;
  };
  measure: {
    id: number;
    name: string;
  };
  quantity: string;
  price_per_unit: string;
  total_price: string;
}
