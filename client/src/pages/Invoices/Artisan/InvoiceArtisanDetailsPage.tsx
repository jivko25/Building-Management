import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { artisanInvoiceService } from "@/services/invoice/artisanService";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash2, FileText, X, Download, Edit } from "lucide-react";
import { useState } from "react";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useTranslation } from "react-i18next";

export const InvoiceArtisanDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["artisan-invoice", id],
    queryFn: () => artisanInvoiceService.getById(Number(id))
  });

  const deleteMutation = useMutation({
    mutationFn: artisanInvoiceService.deleteInvoice,
    onSuccess: () => {
      toast.success(t("Invoice deleted successfully"));
      navigate("/invoices-artisan");
    },
    onError: () => {
      toast.error(t("Failed to delete invoice"));
    }
  });

  const handleDownloadPDF = async () => {
    try {
      const blob = await artisanInvoiceService.downloadPDF(Number(id));
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invoice?.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(t("Failed to download PDF"));
    }
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(Number(id));
    setShowDeleteModal(false);
  };

  if (isLoading || !invoice) {
    return <div>{t("Loading...")}</div>;
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/invoices-artisan")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            {t("Invoice")} #{invoice.invoice_number}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigate(`/invoices-artisan/${id}/edit`)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Invoice Details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="font-medium">{t("Invoice Number")}</label>
              <div>{invoice.invoice_number}</div>
            </div>
            <div>
              <label className="font-medium">{t("Invoice Date")}</label>
              <div>{format(new Date(invoice.invoice_date), "dd.MM.yyyy", { locale: bg })}</div>
            </div>
            <div>
              <label className="font-medium">{t("Due Date")}</label>
              <div>{format(new Date(invoice.due_date), "dd.MM.yyyy", { locale: bg })}</div>
            </div>
            <div>
              <label className="font-medium">{t("Status")}</label>
              <div>{invoice.paid ? t("Paid") : t("Unpaid")}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Artisan Information")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="font-medium">{t("Name")}</label>
              <div>{invoice.artisan.name}</div>
            </div>
            <div>
              <label className="font-medium">{t("Address")}</label>
              <div>{invoice.artisan.address}</div>
            </div>
            <div>
              <label className="font-medium">{t("Phone")}</label>
              <div>{invoice.artisan.phone || "N/A"}</div>
            </div>
            <div>
              <label className="font-medium">{t("Email")}</label>
              <div>{invoice.artisan.email || "N/A"}</div>
            </div>
            <div>
              <label className="font-medium">{t("IBAN")}</label>
              <div>{invoice.artisan.iban || "N/A"}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("Items")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Activity")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Measure")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Quantity")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Price per unit")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Total")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">{item.activity.name}</td>
                    <td className="px-6 py-4">{item.measure.name}</td>
                    <td className="px-6 py-4 text-right">{Math.round(parseFloat(item.quantity))}</td>
                    <td className="px-6 py-4 text-right">{Math.round(parseFloat(item.price_per_unit))} лв.</td>
                    <td className="px-6 py-4 text-right">{Math.round(parseFloat(item.total_price))} лв.</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan={4} className="px-6 py-4 text-right">
                    {t("Total amount")}:
                  </td>
                  <td className="px-6 py-4 text-right">{invoice.total_amount} лв.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ConfirmationModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} title={t("Delete Invoice")} description={`${t("Are you sure you want to delete invoice")} ${invoice.invoice_number}? ${t("This action cannot be undone")}.`} />
    </div>
  );
};
