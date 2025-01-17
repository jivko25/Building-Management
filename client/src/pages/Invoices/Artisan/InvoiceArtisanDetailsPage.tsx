import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { artisanInvoiceService } from "@/services/invoice/artisanService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, FileText, X, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

export const InvoiceArtisanDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation();

  console.log("🔄 Rendering InvoiceArtisanDetailsPage with id:", id);

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
    onError: error => {
      toast.error(t("Error deleting invoice"));
      console.error("Error deleting invoice:", error);
    }
  });

  if (isLoading || !invoice) {
    console.log("⏳ Loading invoice data...");
    return <div>{t("Loading...")}</div>;
  }

  const handleDelete = () => {
    console.log("Opening delete confirmation modal");
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    console.log("Confirming delete for invoice:", id);
    deleteMutation.mutate(Number(id));
    setShowDeleteModal(false);
  };

  const handleDownloadPDF = async () => {
    console.log("📥 Downloading PDF for invoice:", id);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/invoices-artisan/${id}/pdf`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/pdf"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoice.invoice_number.replace(/\//g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("✅ PDF downloaded successfully");
      toast.success(t("PDF downloaded successfully"));
    } catch (error) {
      console.error("❌ Error downloading PDF:", error);
      toast.error(t("Failed to download PDF"));
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/invoices-artisan")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("Back")}
          </Button>
          <h1 className="text-3xl font-bold">Invoice {invoice.invoice_number}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPdfPreview(!showPdfPreview)}>
            <FileText className="mr-2 h-4 w-4" />
            {showPdfPreview ? t("Hide PDF") : t("Show PDF")}
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            {t("Download PDF")}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              console.log("Navigating to edit page for invoice:", id);
              navigate(`/invoices-artisan/${id}/edit`);
            }}>
            <Edit className="mr-2 h-4 w-4" />
            {t("Edit")}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("Delete")}
          </Button>
        </div>
      </div>

      {showPdfPreview && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t("PDF Preview")}</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowPdfPreview(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="border rounded-lg p-8" style={{ fontFamily: "Calibri, sans-serif" }}>
            <div className="flex justify-between mb-8">
              <div className="invoice-info">
                <h1 className="text-xl font-bold mb-2">
                  {t("Invoice")} {invoice.invoice_number}
                </h1>
                <p>
                  {t("Date of issue")}: {format(new Date(invoice.invoice_date), "dd.MM.yyyy", { locale: bg })}
                </p>
                <p>
                  {t("Due date")}: {format(new Date(invoice.due_date), "dd.MM.yyyy", { locale: bg })}
                </p>
              </div>
              <div className="text-right">{invoice.company?.logo_url && <img src={invoice.company.logo_url} alt="Company Logo" className="max-w-[226px] max-h-[98px]" />}</div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-8">
              <div className="border p-5 rounded">
                <h3 className="font-bold mb-2">{t("Recipient")}</h3>
                {invoice.artisan.manager && (
                  <>
                    <p>
                      {t("Manager")}: {invoice.artisan.manager?.full_name}
                    </p>
                    <p>
                      {t("Manager Email")}: {invoice.artisan.manager?.email}
                    </p>
                  </>
                )}
              </div>

              <div className="border p-5 rounded">
                <h3 className="font-bold mb-2">{t("Issuer")}</h3>
                <p>
                  {t("Name")}: {invoice.artisan.name}
                </p>
                <p>
                  {t("Address")}: {invoice.artisan.email}
                </p>
                <p>
                  {t("Email")}: {invoice.artisan.number}
                </p>
              </div>
            </div>

            <table className="w-full mb-8 text-sm">
              <thead>
                <tr className="border">
                  <th className="border p-2 text-left">{t("Activity")}</th>
                  <th className="border p-2 text-right">{t("Quantity")}</th>
                  <th className="border p-2 text-right">{t("Price")}</th>
                  <th className="border p-2 text-right">{t("Total")}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(item => (
                  <tr key={item.id} className="border">
                    <td className="border p-2">{item.activity.name}</td>
                    <td className="border p-2 text-right">
                      {parseFloat(item.quantity).toFixed(2)} {item.measure.name}
                    </td>
                    <td className="border p-2 text-right">{parseFloat(item.price_per_unit).toFixed(2)} €</td>
                    <td className="border p-2 text-right">{parseFloat(item.total_price).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right">
              <h3 className="font-bold">
                {t("Total amount")}: {parseFloat(invoice.total_amount).toFixed(2)} €
              </h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Invoice information")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">{t("Date")} : </span>
              {format(new Date(invoice.invoice_date), "dd.MM.yyyy", { locale: bg })}
            </div>
            <div>
              <span className="font-semibold">{t("Due date")} : </span>
              {format(new Date(invoice.due_date), "dd.MM.yyyy", { locale: bg })}
            </div>
            <div>
              <span className="font-semibold">{t("Status")} : </span>
              {invoice.paid ? t("Paid") : t("Unpaid")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Artisan information")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">{t("Name")} : </span>
              {invoice.artisan.name}
            </div>
            <div>
              <span className="font-semibold">{t("Email")} : </span>
              {invoice.artisan.email}
            </div>
            <div>
              <span className="font-semibold">{t("Phone")} : </span>
              {invoice.artisan.number || "N/A"}
            </div>
            {invoice.artisan.manager && (
              <>
                <div>
                  <span className="font-semibold">{t("Manager")} : </span>
                  {invoice.artisan.manager?.full_name}
                </div>
                <div>
                  <span className="font-semibold">{t("Manager Email")} : </span>
                  {invoice.artisan.manager?.email}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("Items")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">{t("Activity")}</th>
                  <th className="px-6 py-3">{t("Measure")}</th>
                  <th className="px-6 py-3 text-right">{t("Quantity")}</th>
                  <th className="px-6 py-3 text-right">{t("Price per unit")}</th>
                  <th className="px-6 py-3 text-right">{t("Total")}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(item => (
                  <tr key={item.id} className="bg-white border-b">
                    <td className="px-6 py-4">{item.activity.name}</td>
                    <td className="px-6 py-4">{item.measure.name}</td>
                    <td className="px-6 py-4 text-right">{parseFloat(item.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">{parseFloat(item.price_per_unit).toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right">{parseFloat(item.total_price).toFixed(2)} €</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan={4} className="px-6 py-4 text-right">
                    {t("Total amount")}:
                  </td>
                  <td className="px-6 py-4 text-right">{parseFloat(invoice.total_amount).toFixed(2)} €</td>
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
