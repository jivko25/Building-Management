// client\src\pages\Invoices\Client\InvoiceClientDetailsPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { invoiceClientService } from "@/services/invoice/invoiceClientService";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash2, FileText, X, Download, Edit } from "lucide-react";
import { useState } from "react";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/Sidebar/Sidebar";

export const InvoiceClientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceClientService.getById(Number(id))
  });

  const deleteMutation = useMutation({
    mutationFn: invoiceClientService.delete,
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
    <div className="flex md:gap-60 min-h-screen">
      <Sidebar />
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/invoices-client")}>
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
          <div className="mb-6 bg-white p-6 rounded-lg shadow-lg" style={{ fontFamily: "Calibri, sans-serif" }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t("PDF Preview")}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowPdfPreview(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="border rounded-lg p-8">
              {/* Header Section */}
              <div className="flex justify-between mb-8">
                <div>
                  <div className="text-lg font-bold mb-2">{invoice.client?.client_company_name}</div>
                  <div className="text-sm">{invoice.client?.client_company_address}</div>
                  <div className="text-sm">VAT Number {invoice.client?.client_company_vat_number}</div>
                </div>
                {invoice.company?.logo_url && <img src={invoice.company.logo_url} alt="Company Logo" className="max-w-[226px] max-h-[98px] object-contain" />}
              </div>

              {/* Invoice Details */}
              <div className="flex justify-between mb-8 gap-4">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="font-semibold">{t("Invoice")}:</span>
                    <span>{invoice.invoice_number}</span>
                  </div>
                  <div>
                    <span className="font-semibold">{t("Date of issue")}:</span> {format(new Date(invoice.invoice_date), "dd.MM.yyyy", { locale: bg })}
                  </div>
                  <div>
                    <span className="font-semibold">{t("Due date")}:</span> {format(new Date(invoice.due_date), "dd.MM.yyyy", { locale: bg })}
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div className="font-semibold">{invoice.company?.name}</div>
                  <div>{invoice.company?.address}</div>
                  <div>{invoice.company?.phone}</div>
                  <div>{invoice.company?.registration_number}</div>
                  <div>{invoice.company?.vat_number}</div>
                  <div>{invoice.company?.iban}</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left pb-2">{t("Activity")}</th>
                    <th className="text-right pb-2">{t("Quantity")}</th>
                    <th className="text-right pb-2">{t("Price per unit")}</th>
                    <th className="text-right pb-2">{t("Total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2">
                        {item.project?.location && `${t("Location")}: ${item.project.location}`}
                        <br />
                        {item.activity?.name}
                      </td>
                      <td className="text-right py-2">{parseFloat(item.quantity).toFixed(2)}</td>
                      <td className="text-right py-2">{parseFloat(item.price_per_unit).toFixed(2)} €</td>
                      <td className="text-right py-2">{parseFloat(item.total_price).toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* VAT Table */}
              <table className="w-full mb-4">
                <tbody>
                  <tr>
                    <td className="text-left font-semibold">Total excl. VAT</td>
                    <td className="text-center font-semibold">VAT%</td>
                    <td className="text-center font-semibold">Over</td>
                    <td className="text-right">{parseFloat(invoice.total_amount).toFixed(2)} €</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="text-center">21%</td>
                    <td className="text-center">-</td>
                    <td className="text-right">-</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="text-center">Shifted</td>
                    <td className="text-center">{parseFloat(invoice.total_amount).toFixed(2)} €</td>
                    <td className="text-right">-</td>
                  </tr>
                  <tr className="border-t border-black">
                    <td colSpan={3} className="text-left font-semibold pt-2">
                      Total
                    </td>
                    <td className="text-right font-semibold pt-2">{parseFloat(invoice.total_amount).toFixed(2)} €</td>
                  </tr>
                </tbody>
              </table>

              {/* Payment Instructions */}
              <div className="text-sm space-y-2">
                <p>
                  * {t("Please transfer the amount of")} <span className="font-semibold">{parseFloat(invoice.total_amount).toFixed(2)} €</span> {t("by date")} <span className="font-semibold">{format(new Date(invoice.due_date), "dd.MM.yyyy", { locale: bg })}</span> {t("to IBAN")} <span className="font-semibold">{invoice.company?.iban}</span>
                </p>
                <p className="ml-4">{t("by specifying the invoice number")}.</p>
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
    </div>
  );
};
