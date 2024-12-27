import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";

export const InvoiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getById(Number(id))
  });

  const deleteMutation = useMutation({
    mutationFn: invoiceService.delete,
    onSuccess: () => {
      toast.success("Invoice deleted successfully");
      navigate("/invoices");
    },
    onError: error => {
      toast.error("Error deleting invoice");
      console.error("Error deleting invoice:", error);
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  const handleDelete = () => {
    console.log("Deleting invoice:", id);
    deleteMutation.mutate(Number(id));
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/invoices")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Invoice {invoice.invoice_number}</h1>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">Date: </span>
              {format(new Date(invoice.invoice_date), "dd.MM.yyyy", { locale: bg })}
            </div>
            <div>
              <span className="font-semibold">Due date: </span>
              {format(new Date(invoice.due_date), "dd.MM.yyyy", { locale: bg })}
            </div>
            <div>
              <span className="font-semibold">Status: </span>
              {invoice.paid ? "Paid" : "Unpaid"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">Company: </span>
              {invoice.client.client_company_name}
            </div>
            <div>
              <span className="font-semibold">Contact person: </span>
              {invoice.client.client_name}
            </div>
            <div>
              <span className="font-semibold">Address: </span>
              {invoice.client.client_company_address}
            </div>
            <div>
              <span className="font-semibold">IBAN: </span>
              {invoice.client.client_company_iban}
            </div>
            <div>
              <span className="font-semibold">Emails: </span>
              {Array.isArray(invoice.client.client_emails) ? invoice.client.client_emails.join(", ") : invoice.client.client_emails}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3">Activity</th>
                  <th className="px-6 py-3">Object address</th>
                  <th className="px-6 py-3">Measure</th>
                  <th className="px-6 py-3 text-right">Quantity</th>
                  <th className="px-6 py-3 text-right">Unit price</th>
                  <th className="px-6 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(item => (
                  <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4">{item.activity.name}</td>
                    <td className="px-6 py-4">{item.project.address}</td>
                    <td className="px-6 py-4">{item.measure.name}</td>
                    <td className="px-6 py-4 text-right">{item.quantity}</td>
                    <td className="px-6 py-4 text-right">{item.price_per_unit} €</td>
                    <td className="px-6 py-4 text-right">{item.total_price} €</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan={5} className="px-6 py-4 text-right">
                    Total amount:
                  </td>
                  <td className="px-6 py-4 text-right">{invoice.total_amount} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
