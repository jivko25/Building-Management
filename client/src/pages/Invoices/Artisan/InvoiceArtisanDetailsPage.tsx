import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { artisanInvoiceService } from "@/services/invoice/artisanService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, FileText, X } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { bg } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";

export const InvoiceArtisanDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const { t } = useTranslation();

  console.log("🔄 Rendering InvoiceArtisanDetailsPage with id:", id);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["artisan-invoice", id],
    queryFn: () => artisanInvoiceService.getById(Number(id))
  });

  if (isLoading) {
    console.log("⏳ Loading invoice data...");
    return <div>{t("Loading...")}</div>;
  }

  if (!invoice) {
    console.log("❌ Invoice not found");
    return <div>{t("Invoice not found")}</div>;
  }

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";

      const date = parseISO(dateString);
      if (!isValid(date)) return "N/A";

      return format(date, "dd.MM.yyyy", { locale: bg });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
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

      if (!response.ok) throw new Error("Failed to download PDF");

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

  const handleShowPDF = () => {
    console.log("📄 Showing PDF preview for invoice:", id);
    setShowPdfPreview(!showPdfPreview);
  };

  const handleClosePDF = () => {
    console.log("❌ Closing PDF preview");
    setShowPdfPreview(false);
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/invoices-artisan")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("Back")}
          </Button>
          <h1 className="text-3xl font-bold">
            {t("Invoice")} {invoice.invoice_number}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShowPDF}>
            <FileText className="mr-2 h-4 w-4" />
            {showPdfPreview ? t("Hide PDF") : t("Show PDF")}
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            {t("Download PDF")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Invoice Details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-semibold">{t("Invoice Number")}</div>
              <div>{invoice.invoice_number}</div>
            </div>
            <div>
              <div className="font-semibold">{t("Due Date")}</div>
              <div>{formatDate(invoice.due_date)}</div>
            </div>
            <div>
              <div className="font-semibold">{t("Total Amount")}</div>
              <div>{invoice.total_amount} €</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Artisan Information")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-semibold">{t("Name")}</div>
              <div>{invoice.artisan.name}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
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
                      {t("Total Amount")}:
                    </td>
                    <td className="px-6 py-4 text-right">{parseFloat(invoice.total_amount).toFixed(2)} €</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PDF Preview Modal */}
      {showPdfPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t("Invoice Preview")}</h2>
              <Button variant="ghost" size="icon" onClick={handleClosePDF}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* PDF Content */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    {t("Invoice")} #{invoice.invoice_number}
                  </h1>
                  <p>
                    {t("Date")}: {formatDate(invoice.invoice_date)}
                  </p>
                  <p>
                    {t("Due Date")}: {formatDate(invoice.due_date)}
                  </p>
                </div>
                {/* Company Logo could be added here */}
              </div>

              {/* Artisan Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-2">{t("Artisan Information")}</h3>
                  <p>
                    {t("Name")}: {invoice.artisan.name}
                  </p>
                  <p>
                    {t("Address")}: {invoice.artisan.address}
                  </p>
                  {invoice.artisan.number && (
                    <p>
                      {t("Phone")}: {invoice.artisan.number}
                    </p>
                  )}
                  {invoice.artisan.email && (
                    <p>
                      {t("Email")}: {invoice.artisan.email}
                    </p>
                  )}
                  {invoice.artisan.iban && <p>IBAN: {invoice.artisan.iban}</p>}
                </div>
                <div>
                  <h3 className="font-bold mb-2">{t("Company Information")}</h3>
                  <p>
                    {t("Name")}: {invoice.company.name}
                  </p>
                  <p>
                    {t("Address")}: {invoice.company.address}
                  </p>
                  {invoice.company.email && (
                    <p>
                      {t("Email")}: {invoice.company.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2 text-left">{t("Activity")}</th>
                      <th className="border p-2 text-left">{t("Measure")}</th>
                      <th className="border p-2 text-right">{t("Quantity")}</th>
                      <th className="border p-2 text-right">{t("Price")}</th>
                      <th className="border p-2 text-right">{t("Total")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.activity.name}</td>
                        <td className="border p-2">{item.measure.name}</td>
                        <td className="border p-2 text-right">{parseFloat(item.quantity).toFixed(2)}</td>
                        <td className="border p-2 text-right">{parseFloat(item.price_per_unit).toFixed(2)} €</td>
                        <td className="border p-2 text-right">{parseFloat(item.total_price).toFixed(2)} €</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td colSpan={4} className="border p-2 text-right">
                        {t("Total Amount")}:
                      </td>
                      <td className="border p-2 text-right">{parseFloat(invoice.total_amount).toFixed(2)} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
