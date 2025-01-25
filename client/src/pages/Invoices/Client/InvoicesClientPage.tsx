// client\src\pages\Invoices\Client\InvoicesClientPage.tsx
import { useQuery } from "@tanstack/react-query";
import { invoiceClientService } from "@/services/invoice/invoiceClientService";
import { DataTable, DataTableFilterMeta, DataTableFilterMetaData } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { Invoice } from "@/types/invoice.types";
import { useEffect, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const InvoicesClientPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    invoice_number: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "client.client_name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    total_amount: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const { t } = useTranslation();
  const [invoiceType, setInvoiceType] = useState("client");

  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setInvoiceType(value);
    if (value === "client") {
      navigate("/invoices-client");
    } else {
      navigate("/invoices-artisan");
    }
  };

  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await invoiceClientService.getAll();
      console.log("📄 Processed invoices:", response);
      return response;
    },
    refetchOnWindowFocus: false
  });

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };
    (_filters["global"] as DataTableFilterMetaData).value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        <div>
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search...")} className="search-input" />
          </IconField>
        </div>
        <Button onClick={() => navigate(`/invoices-${invoiceType}/create`)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("New invoice")}
        </Button>
      </div>
    );
  };

  useEffect(() => {
    console.log("📊 DataTable value:", invoices);
  }, [invoices]);

  const dateTemplate = (rowData: Invoice) => {
    try {
      return format(new Date(rowData.invoice_date), "dd.MM.yyyy", { locale: bg });
    } catch (error) {
      console.error("Error formatting date:", error, rowData);
      return "N/A";
    }
  };

  const dueDateTemplate = (rowData: Invoice) => {
    try {
      return format(new Date(rowData.due_date), "dd.MM.yyyy", { locale: bg });
    } catch (error) {
      console.error("Error formatting due date:", error, rowData);
      return "N/A";
    }
  };

  const amountTemplate = (rowData: Invoice) => {
    try {
      return `${Math.round(parseFloat(rowData.total_amount))}€.`;
    } catch (error) {
      console.error("Error formatting amount:", error, rowData);
      return "0€.";
    }
  };

  const clientTemplate = (rowData: Invoice) => {
    try {
      return rowData.client.client_name || "N/A";
    } catch (error) {
      console.error("Error getting client name:", error, rowData);
      return "N/A";
    }
  };

  const paidTemplate = (rowData: Invoice) => {
    return rowData.paid ? "Yes" : "No";
  };

  const actionTemplate = (rowData: Invoice) => {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate(`/invoices-client/${rowData.id}`)}>
          {t("Details")}
        </Button>
      </div>
    );
  };

  return (
    <div className="flex md:gap-60 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <div className="container mx-auto py-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">{t("Invoices")}</h1>
              <Tabs defaultValue="client" onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger value="client">{t("Clients")}</TabsTrigger>
                  <TabsTrigger value="artisan">{t("Artisans")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {/* <Button onClick={() => navigate(`/invoices-${invoiceType}/create`)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("New invoice")}
            </Button> */}
          </div>

          <DataTable value={invoices} paginator rows={10} rowsPerPageOptions={[10, 20, 50]} filters={filters} globalFilterFields={["invoice_number", "client.client_name", "total_amount"]} header={renderHeader} emptyMessage={t("No invoices found")} loading={isLoading} stripedRows showGridlines dataKey="id" sortMode="single" removableSort tableStyle={{ minWidth: "50rem" }} scrollable>
            <Column field="invoice_number" header={t("Number")} sortable filter filterPlaceholder={t("Search by number")} style={{ width: "15%" }} />
            <Column field="invoice_date" header={t("Date")} body={dateTemplate} sortable style={{ width: "15%" }} />
            <Column field="due_date" header={t("Due date")} body={dueDateTemplate} sortable style={{ width: "15%" }} />
            <Column field="client.client_name" header={t("Client")} body={clientTemplate} sortable filter filterPlaceholder={t("Search by client")} style={{ width: "20%" }} />
            <Column field="total_amount" header={t("Amount")} body={amountTemplate} sortable filter filterPlaceholder={t("Search by amount")} style={{ width: "15%" }} />
            <Column field="paid" header={t("Paid")} body={paidTemplate} sortable style={{ width: "10%" }} />
            <Column body={actionTemplate} style={{ width: "10%" }} />
          </DataTable>
        </div>
      </div>
    </div>
  );
};
