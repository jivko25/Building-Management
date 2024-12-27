import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";
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

export const InvoicesPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    invoice_number: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "client.client_name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    total_amount: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await invoiceService.getAll();
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
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Търсене..." className="search-input" />
          </IconField>
        </div>
        <Button onClick={() => navigate("/invoices/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Нова фактура
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
      return `${parseFloat(rowData.total_amount).toFixed(2)} лв.`;
    } catch (error) {
      console.error("Error formatting amount:", error, rowData);
      return "0.00 лв.";
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
    return rowData.paid ? "Да" : "Не";
  };

  const actionTemplate = (rowData: Invoice) => {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate(`/invoices/${rowData.id}`)}>
          Детайли
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Фактури</h1>

      <DataTable value={invoices} paginator rows={10} rowsPerPageOptions={[10, 20, 50]} filters={filters} globalFilterFields={["invoice_number", "client.client_name", "total_amount"]} header={renderHeader} emptyMessage="Няма намерени фактури" loading={isLoading} stripedRows showGridlines dataKey="id" sortMode="single" removableSort tableStyle={{ minWidth: "50rem" }} scrollable>
        <Column field="invoice_number" header="Номер" sortable filter filterPlaceholder="Търси по номер" style={{ width: "15%" }} />
        <Column field="invoice_date" header="Дата" body={dateTemplate} sortable style={{ width: "15%" }} />
        <Column field="due_date" header="Краен срок" body={dueDateTemplate} sortable style={{ width: "15%" }} />
        <Column field="client.client_name" header="Клиент" body={clientTemplate} sortable filter filterPlaceholder="Търси по клиент" style={{ width: "20%" }} />
        <Column field="total_amount" header="Сума" body={amountTemplate} sortable filter filterPlaceholder="Търси по сума" style={{ width: "15%" }} />
        <Column field="paid" header="Платена" body={paidTemplate} sortable style={{ width: "10%" }} />
        <Column body={actionTemplate} style={{ width: "10%" }} />
      </DataTable>
    </div>
  );
};
