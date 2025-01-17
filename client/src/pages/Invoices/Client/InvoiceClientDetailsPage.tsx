// client\src\pages\Invoices\Client\InvoiceClientDetailsPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash2, FileText, X, Download, Edit } from "lucide-react";
import { useState } from "react";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useTranslation } from "react-i18next";

export const InvoiceClientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getById(Number(id))
  });

  const deleteMutation = useMutation({
    mutationFn: invoiceService.deleteInvoice,
    onSuccess: () => {
      toast.success("Invoice deleted successfully");
      navigate("/invoices-client");
    },
    onError: error => {
      toast.error("Error deleting invoice");
      console.error("Error deleting invoice:", error);
    }
  });

  if (isLoading) {
    return <div>{t("Loading...")}</div>;
  }

  if (!invoice) {
    return <div>{t("Invoice not found")}</div>;
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/invoices-client/${id}/pdf`, {
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
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("❌ Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/invoices")}>
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
              navigate(`/invoices-client/${id}/edit`);
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
                <p>
                  {t("Company")}: {invoice.client?.client_company_name || "No"}
                </p>
                <p>
                  {t("Address")}: {invoice.client?.client_company_address || "No"}
                </p>
                <p>
                  {t("VAT number")}: {invoice.client?.client_company_vat_number || "No"}
                </p>
              </div>

              <div className="border p-5 rounded">
                <p>
                  {t("Company")}: {invoice.company?.name}
                </p>
                <p>
                  {t("Address")}: {invoice.company?.address}
                </p>
                <p>
                  {t("Reg. number")}: {invoice.company?.registration_number || "No"}
                </p>
                <p>
                  {t("VAT number")}: {invoice.company?.vat_number || "No"}
                </p>
                <p>
                  {t("Phone")}: {invoice.company?.phone || "No"}
                </p>
                <p>
                  {t("Email")}: {invoice.company?.email || "No"}
                </p>
                <p>
                  {t("IBAN")}: {invoice.company?.iban || "No"}
                </p>
                <p>
                  {t("For Contact")}: {invoice.client?.client_name || "No"}
                </p>
              </div>
            </div>

            <table className="w-full mb-8 text-sm">
              <thead>
                <tr className="border">
                  <th className="border p-2 text-left">{t("Activity")} </th>
                  <th className="border p-2 text-right">{t("Quantity")}</th>
                  <th className="border p-2 text-right">{t("Price")}</th>
                  <th className="border p-2 text-right">{t("Total")}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(item => (
                  <tr key={item.id} className="border">
                    <td className="border p-2">
                      {t("Location")}: {item.project?.location} <br />
                      {item.activity.name}
                    </td>
                    <td className="border p-2 text-right">{parseFloat(item.quantity).toFixed(2)}</td>
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
              <span className="font-semibold">{t("VAT number")} : </span>
              {invoice.company?.vat_number || "No"}
            </div>
            <div>
              <span className="font-semibold">{t("Status")} : </span>
              {invoice.paid ? "Paid" : "Unpaid"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Client information")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">{t("Company")} : </span>
              {invoice.client.client_company_name}
            </div>
            <div>
              <span className="font-semibold">{t("Address")} : </span>
              {invoice.company?.address || "No"}
            </div>
            <div>
              <span className="font-semibold">{t("Registration Number")} : </span>
              {invoice.company?.registration_number || "No"}
            </div>
            <div>
              <span className="font-semibold">{t("VAT Number")} : </span>
              {invoice.company?.vat_number || "No"}
            </div>
            <div>
              <span className="font-semibold">{t("Phone")} : </span>
              {invoice.company?.phone || "No"}
            </div>
            <div>
              <span className="font-semibold">{t("IBAN")} : </span>
              {invoice.client.client_company_iban || "No"}
            </div>
            <div>
              <span className="font-semibold">{t("For Contact")} : </span>
              {invoice.company?.mol || "No"}
            </div>
            <div>
              {/* add before my current emails the companyMol email */}
              <span className="font-semibold">{t("Emails")} : </span>
              {invoice.company?.email || "No"}, {Array.isArray(invoice.client.client_emails) ? invoice.client.client_emails.join(", ") : invoice.client.client_emails || "No"}
            </div>
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
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3">{t("Activity")}</th>
                  <th className="px-6 py-3">{t("Location")}</th>
                  <th className="px-6 py-3">{t("Object address")}</th>
                  <th className="px-6 py-3">{t("Measure")}</th>
                  <th className="px-6 py-3 text-right">{t("Quantity")}</th>
                  <th className="px-6 py-3 text-right">{t("Unit price")}</th>
                  <th className="px-6 py-3 text-right">{t("Total")}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(item => (
                  <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4">{item.activity.name}</td>
                    <td className="px-6 py-4">{item.project?.location}</td>
                    <td className="px-6 py-4">{item.project.address}</td>
                    <td className="px-6 py-4">{item.measure.name}</td>
                    <td className="px-6 py-4 text-right">{Math.round(parseFloat(item.quantity))}</td>
                    <td className="px-6 py-4 text-right">{Math.round(parseFloat(item.price_per_unit))} €</td>
                    <td className="px-6 py-4 text-right">{Math.round(parseFloat(item.total_price))} €</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan={6} className="px-6 py-4 text-right">
                    {t("Total amount")}:
                  </td>
                  <td className="px-6 py-4 text-right">{invoice.total_amount} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title={t("Delete Invoice")}
        description={`${t("Are you sure you want to delete invoice")} ${invoice.invoice_number}? 
      ${t("This action cannot be undone")}.`}
      />
    </div>
  );
};
