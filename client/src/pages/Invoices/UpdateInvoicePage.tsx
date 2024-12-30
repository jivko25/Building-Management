import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { bg } from "date-fns/locale";

export const UpdateInvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log("🔄 UpdateInvoicePage mounted with id:", id);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getById(Number(id))
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; paid: boolean }) => invoiceService.updateStatus(data.id, data.paid),
    onSuccess: () => {
      console.log("✅ Invoice status updated successfully");
      toast.success("Invoice status updated successfully");
      navigate(`/invoices/${id}`);
    },
    onError: error => {
      console.error("❌ Error updating invoice status:", error);
      toast.error("Failed to update invoice status");
    }
  });

  if (isLoading) {
    console.log("⏳ Loading invoice data...");
    return <div>Loading...</div>;
  }

  if (!invoice) {
    console.log("❌ Invoice not found");
    return <div>Invoice not found</div>;
  }

  const handleStatusChange = (checked: boolean) => {
    console.log("🔄 Updating invoice status to:", checked);
    updateMutation.mutate({ id: Number(id), paid: checked });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(`/invoices/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Invoice {invoice.invoice_number}</h1>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch id="paid-status" checked={invoice.paid} onCheckedChange={handleStatusChange} />
              <Label htmlFor="paid-status">{invoice.paid ? "Paid" : "Unpaid"}</Label>
            </div>
          </CardContent>
        </Card>

        {/* Read-only information */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Invoice Number</Label>
              <div className="mt-1">{invoice.invoice_number}</div>
            </div>
            <div>
              <Label>Issue Date</Label>
              <div className="mt-1">{format(new Date(invoice.invoice_date), "dd.MM.yyyy", { locale: bg })}</div>
            </div>
            <div>
              <Label>Due Date</Label>
              <div className="mt-1">{format(new Date(invoice.due_date), "dd.MM.yyyy", { locale: bg })}</div>
            </div>
            <div>
              <Label>Total Amount</Label>
              <div className="mt-1">{invoice.total_amount} €</div>
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Company Name</Label>
              <div className="mt-1">{invoice.client.client_company_name}</div>
            </div>
            <div>
              <Label>Contact Person</Label>
              <div className="mt-1">{invoice.client.client_company_mol}</div>
            </div>
            <div>
              <Label>Address</Label>
              <div className="mt-1">{invoice.client.client_company_address}</div>
            </div>
            <div>
              <Label>IBAN</Label>
              <div className="mt-1">{invoice.client.client_company_iban}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
