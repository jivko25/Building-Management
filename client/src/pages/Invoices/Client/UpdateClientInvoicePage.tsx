// client\src\pages\Invoices\Client\UpdateClientInvoicePage.tsx
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
import { useTranslation } from "react-i18next";

export const UpdateClientInvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      navigate(`/invoices-client/${id}`);
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
          <Button variant="outline" onClick={() => navigate(`/invoices-client/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("Back")}
          </Button>
          <h1 className="text-3xl font-bold">
            {t("Edit Invoice")} {invoice.invoice_number}
          </h1>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Payment Status")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch id="paid-status" checked={invoice.paid} onCheckedChange={handleStatusChange} />
              <Label htmlFor="paid-status">{invoice.paid ? t("Paid") : t("Unpaid")}</Label>
            </div>
          </CardContent>
        </Card>

        {/* Read-only information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Invoice Details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t("Invoice Number")}</Label>
              <div className="mt-1">{invoice.invoice_number}</div>
            </div>
            <div>
              <Label>{t("Issue Date")}</Label>
              <div className="mt-1">{format(new Date(invoice.invoice_date), "dd.MM.yyyy", { locale: bg })}</div>
            </div>
            <div>
              <Label>{t("Due Date")}</Label>
              <div className="mt-1">{format(new Date(invoice.due_date), "dd.MM.yyyy", { locale: bg })}</div>
            </div>
            <div>
              <Label>{t("Total Amount")}</Label>
              <div className="mt-1">{invoice.total_amount} €</div>
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Client Information")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t("Company Name")}</Label>
              <div className="mt-1">{invoice.client.client_company_name}</div>
            </div>
            <div>
              <Label>{t("Contact Person")}</Label>
              <div className="mt-1">{invoice.client.client_company_mol}</div>
            </div>
            <div>
              <Label>{t("Address")}</Label>
              <div className="mt-1">{invoice.client.client_company_address}</div>
            </div>
            <div>
              <Label>{t("IBAN")}</Label>
              <div className="mt-1">{invoice.client.client_company_iban}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
