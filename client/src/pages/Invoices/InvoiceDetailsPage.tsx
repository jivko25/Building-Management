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

export const InvoiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/invoices/${id}/pdf`, {
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
            Back
          </Button>
          <h1 className="text-3xl font-bold">Invoice {invoice.invoice_number}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPdfPreview(!showPdfPreview)}>
            <FileText className="mr-2 h-4 w-4" />
            {showPdfPreview ? "Hide PDF" : "Show PDF"}
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              console.log("Navigating to edit page for invoice:", id);
              navigate(`/invoices/${id}/edit`);
            }}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {showPdfPreview && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">PDF Preview</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowPdfPreview(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="border rounded-lg p-8" style={{ fontFamily: "Calibri, sans-serif" }}>
            <div className="flex justify-between mb-8">
              <div>
                <h1 className="text-xl font-bold mb-2">Invoice {invoice.invoice_number}</h1>
                <p>Date of issue: {format(new Date(invoice.invoice_date), "dd.MM.yyyy", { locale: bg })}</p>
                <p>Due date: {format(new Date(invoice.due_date), "dd.MM.yyyy", { locale: bg })}</p>
              </div>
              <div className="text-right">{invoice.company?.logo_url && <img src={invoice.company.logo_url} alt="Company Logo" className="max-w-[226px] max-h-[98px]" />}</div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-8">
              <div className="border p-5 rounded">
                <h3 className="font-bold mb-2">Construction company:</h3>
                <p>{invoice.company?.name}</p>
                <p>{invoice.company?.address}</p>
                <p>Reg. number: {invoice.company?.registration_number || "No"}</p>
                <p>VAT number: {invoice.company?.vat_number || "No"}</p>
                <p>IBAN: {invoice.company?.iban || "No"}</p>
                <p>Phone: {invoice.company?.phone || "No"}</p>
                <p>For Contact: Счетоводител Счетоводителов</p>
              </div>

              <div className="border p-5 rounded">
                <h3 className="font-bold mb-2">Client:</h3>
                <p>Company: {invoice.client?.client_company_name || "No"}</p>
                <p>Contact person: {invoice.client?.client_name}</p>
                <p>Address: {invoice.client?.client_company_address || "No"}</p>
                <p>IBAN: {invoice.client?.client_company_iban || "No"}</p>
                <p>Emails: {Array.isArray(invoice.client?.client_emails) ? invoice.client.client_emails.join(", ") : invoice.client?.client_emails || "No"}</p>
              </div>
            </div>

            <table className="w-full mb-8 text-sm">
              <thead>
                <tr className="border">
                  <th className="border p-2 text-left">Activity</th>
                  <th className="border p-2 text-left">Location</th>
                  <th className="border p-2 text-left">Project address</th>
                  <th className="border p-2 text-left">Measure</th>
                  <th className="border p-2 text-right">Quantity</th>
                  <th className="border p-2 text-right">Unit price</th>
                  <th className="border p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(item => (
                  <tr key={item.id} className="border">
                    <td className="border p-2">{item.activity.name}</td>
                    <td className="border p-2">{item.project?.location || "No"}</td>
                    <td className="border p-2">{item.project.address || "No"}</td>
                    <td className="border p-2">{item.measure.name}</td>
                    <td className="border p-2 text-right">{item.quantity}</td>
                    <td className="border p-2 text-right">{item.price_per_unit} €</td>
                    <td className="border p-2 text-right">{item.total_price} €</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right">
              <h3 className="font-bold">Total amount: {invoice.total_amount} €</h3>
            </div>
          </div>
        </div>
      )}

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
                  <th className="px-6 py-3">Location</th>
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
                    Total amount:
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
        title="Delete Invoice"
        description={`Are you sure you want to delete invoice ${invoice.invoice_number}? 
      This action cannot be undone.`}
      />
    </div>
  );
};
