// client\src\router\index.tsx
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/layouts/Layout";
import { InvoicesClientPage } from "@/pages/Invoices/Client/InvoicesClientPage";
import { CreateClientInvoicePage } from "@/pages/Invoices/Client/CreateClientInvoicePage";
import { InvoiceClientDetailsPage } from "@/pages/Invoices/Client/InvoiceClientDetailsPage";
import { UpdateClientInvoicePage } from "@/pages/Invoices/Client/UpdateClientInvoicePage";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "invoices-client",
        children: [
          {
            path: "",
            element: <InvoicesClientPage />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "create",
            element: <CreateClientInvoicePage />,
            errorElement: <ErrorBoundary />
          },
          {
            path: ":id",
            element: <InvoiceClientDetailsPage />,
            errorElement: <ErrorBoundary />
          },
          {
            path: ":id/edit",
            element: <UpdateClientInvoicePage />,
            errorElement: <ErrorBoundary />
          }
        ]
      }
    ]
  }
]);
