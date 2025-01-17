import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { artisanInvoiceService } from "@/services/invoice/artisanService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, FileText, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { bg } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useState } from "react";

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

  if (isLoading || !invoice) {
    console.log("⏳ Loading invoice data...");
    return <div>{t("Loading...")}</div>;
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy", { locale: bg });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/invoices-artisan")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {t("Invoice")} #{invoice.invoice_number}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Recipient")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">{t("Name")}:</p>
              <p>{invoice.artisan.name}</p>
            </div>
            <div>
              <p className="font-semibold">{t("Email")}:</p>
              <p>{invoice.artisan.email}</p>
            </div>
            <div>
              <p className="font-semibold">{t("Phone")}:</p>
              <p>{invoice.artisan.number || "N/A"}</p>
            </div>
            {invoice.artisan.user && (
              <div>
                <p className="font-semibold">{t("Manager")}:</p>
                <p>{invoice.artisan.user.full_name}</p>
                <p>{invoice.artisan.user.email}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Invoice Details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">{t("Invoice Date")}:</p>
              <p>{formatDate(invoice.invoice_date)}</p>
            </div>
            <div>
              <p className="font-semibold">{t("Due Date")}:</p>
              <p>{formatDate(invoice.due_date)}</p>
            </div>
            <div>
              <p className="font-semibold">{t("Status")}:</p>
              <p>{invoice.paid ? t("Paid") : t("Unpaid")}</p>
            </div>
            <div>
              <p className="font-semibold">{t("Total Amount")}:</p>
              <p>{parseFloat(invoice.total_amount).toFixed(2)} €</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Company Information")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">{t("Name")}:</p>
              <p>{invoice.company.name}</p>
            </div>
            <div>
              <p className="font-semibold">{t("Address")}:</p>
              <p>{invoice.company.address}</p>
            </div>
            <div>
              <p className="font-semibold">{t("Email")}:</p>
              <p>{invoice.company.email}</p>
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
    </div>
  );
};
