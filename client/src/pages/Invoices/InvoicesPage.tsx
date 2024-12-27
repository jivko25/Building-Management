import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { Invoice } from "@/types/invoice.types";
import { useEffect } from "react";

export const InvoicesPage = () => {
  const navigate = useNavigate();

  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await invoiceService.getAll();
      console.log("📄 Processed invoices:", response);
      return response;
    },
    staleTime: 5000
  });

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Фактури</h1>
        <Button onClick={() => navigate("/invoices/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Нова фактура
        </Button>
      </div>

      <DataTable value={invoices} loading={isLoading} paginator rows={10} rowsPerPageOptions={[10, 20, 50]} className="p-datatable-sm" emptyMessage="Няма намерени фактури" stripedRows showGridlines dataKey="id" removableSort>
        <Column field="invoice_number" header="Номер" sortable />
        <Column field="invoice_date" header="Дата" body={dateTemplate} sortable />
        <Column field="due_date" header="Краен срок" body={dueDateTemplate} sortable />
        <Column field="client.client_name" header="Клиент" body={clientTemplate} sortable />
        <Column field="total_amount" header="Сума" body={amountTemplate} sortable />
        <Column field="paid" header="Платена" body={paidTemplate} sortable />
        <Column body={actionTemplate} style={{ width: "10rem" }} />
      </DataTable>
    </div>
  );
};
