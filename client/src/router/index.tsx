import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/layouts/Layout";
import { InvoicesPage } from "@/pages/Invoices/InvoicesPage";
import { CreateInvoicePage } from "@/pages/Invoices/CreateInvoicePage";
import { InvoiceDetailsPage } from "@/pages/Invoices/InvoiceDetailsPage";
import { UpdateInvoicePage } from "@/pages/Invoices/UpdateInvoicePage";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "invoices",
        children: [
          {
            path: "",
            element: <InvoicesPage />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "create",
            element: <CreateInvoicePage />,
            errorElement: <ErrorBoundary />
          },
          {
            path: ":id",
            element: <InvoiceDetailsPage />,
            errorElement: <ErrorBoundary />
          },
          {
            path: ":id/edit",
            element: <UpdateInvoicePage />,
            errorElement: <ErrorBoundary />
          }
        ]
      }
    ]
  }
]);
