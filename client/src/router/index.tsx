import { InvoicesPage } from "@/pages/Invoices/InvoicesPage";
import { CreateInvoicePage } from "@/pages/Invoices/CreateInvoicePage";
import { InvoiceDetailsPage } from "@/pages/Invoices/InvoiceDetailsPage";

const routes = [
  {
    path: "/invoices",
    element: <InvoicesPage />
  },
  {
    path: "/invoices/create",
    element: <CreateInvoicePage />
  },
  {
    path: "/invoices/:id",
    element: <InvoiceDetailsPage />
  }
];

export default routes;
