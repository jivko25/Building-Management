// client\src\router\index.tsx
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/layouts/Layout";
import { InvoicesClientPage } from "@/pages/Invoices/Client/InvoicesClientPage";
import { CreateClientInvoicePage } from "@/pages/Invoices/Client/CreateClientInvoicePage";
import { InvoiceClientDetailsPage } from "@/pages/Invoices/Client/InvoiceClientDetailsPage";
import { UpdateClientInvoicePage } from "@/pages/Invoices/Client/UpdateClientInvoicePage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { InvoicesArtisanPage } from "@/pages/Invoices/Artisan/InvoicesArtisanPage";
import { CreateArtisanInvoicePage } from "@/pages/Invoices/Artisan/CreateArtisanInvoicePage";
import { InvoiceArtisanDetailsPage } from "@/pages/Invoices/Artisan/InvoiceArtisanDetailsPage";
import { UpdateArtisanInvoicePage } from "@/pages/Invoices/Artisan/UpdateArtisanInvoicePage";

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
      },
      {
        path: "invoices-artisan",
        children: [
          {
            path: "",
            element: <InvoicesArtisanPage />,
            errorElement: <ErrorBoundary />
          },
          {
            path: "create",
            element: <CreateArtisanInvoicePage />,
            errorElement: <ErrorBoundary />
          },
          {
            path: ":id",
            element: <InvoiceArtisanDetailsPage />,
            errorElement: <ErrorBoundary />
          },
          {
            path: ":id/edit",
            element: <UpdateArtisanInvoicePage />,
            errorElement: <ErrorBoundary />
          }
        ]
      }
    ]
  }
]);
