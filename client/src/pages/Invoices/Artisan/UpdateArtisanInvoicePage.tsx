import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { artisanInvoiceService } from "@/services/invoice/artisanService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/Sidebar/Sidebar";

export const UpdateArtisanInvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  console.log("🔄 UpdateArtisanInvoicePage mounted with id:", id);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["artisan-invoice", id],
    queryFn: () => artisanInvoiceService.getById(Number(id))
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, paid }: { id: number; paid: boolean }) => artisanInvoiceService.updateStatus(id, paid),
    onSuccess: () => {
      console.log("✅ Invoice status updated successfully");
      toast.success(t("Invoice status updated successfully"));
      queryClient.invalidateQueries({ queryKey: ["artisan-invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["artisan-invoices"] });
    },
    onError: () => {
      console.error("❌ Failed to update invoice status");
      toast.error(t("Failed to update invoice status"));
    }
  });

  const handleStatusChange = (checked: boolean) => {
    console.log("🔄 Updating invoice status to:", checked);
    updateStatusMutation.mutate({ id: Number(id), paid: checked });
  };

  if (isLoading || !invoice) {
    return <div>{t("Loading...")}</div>;
  }

  return (
    <div className="flex md:gap-60 min-h-screen">
      <Sidebar />
      <div className="container mx-auto py-10 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/invoices-artisan")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            {t("Edit Invoice")} #{invoice.invoice_number}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Invoice Status")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="paid-status" checked={invoice.paid} onCheckedChange={handleStatusChange} />
                <Label htmlFor="paid-status">{invoice.paid ? t("Paid") : t("Unpaid")}</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Invoice Details")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t("Invoice Date")}</Label>
                <div className="mt-1">{format(new Date(invoice.invoice_date), "dd.MM.yyyy", { locale: bg })}</div>
              </div>
              <div>
                <Label>{t("Due Date")}</Label>
                <div className="mt-1">{format(new Date(invoice.due_date), "dd.MM.yyyy", { locale: bg })}</div>
              </div>
              <div>
                <Label>{t("Total Amount")}</Label>
                <div className="mt-1">{invoice.total_amount}€.</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Artisan Information")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t("Name")}</Label>
                <div className="mt-1">{invoice.artisan.name}</div>
              </div>
              <div>
                <Label>{t("Phone")}</Label>
                <div className="mt-1">{invoice.artisan.number || "N/A"}</div>
              </div>
              <div>
                <Label>{t("Email")}</Label>
                <div className="mt-1">{invoice.artisan.email || "N/A"}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Artisan's Company Information")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t("Company")}</Label>
                <div className="mt-1">{invoice.company?.name || "N/A"}</div>
              </div>
              <div>
                <Label>{t("Manager")}</Label>
                <div className="mt-1">{invoice.artisan.manager?.full_name || "N/A"}</div>
              </div>
              <div>
                <Label>{t("Manager Email")}</Label>
                <div className="mt-1">{invoice.artisan.manager?.email || "N/A"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
