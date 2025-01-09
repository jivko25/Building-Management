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
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

export const UpdateInvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [translations, setTranslations] = useState({
    loading: "Loading...",
    notFound: "Invoice not found",
    title: "Edit Invoice",
    buttons: {
      back: "Back to Invoice"
    },
    sections: {
      details: "Invoice Details",
      client: "Client Information"
    },
    fields: {
      number: "Invoice Number",
      date: "Issue Date",
      dueDate: "Due Date",
      amount: "Total Amount",
      companyName: "Company Name",
      contactPerson: "Contact Person",
      address: "Address",
      iban: "IBAN"
    },
    toast: {
      success: "Invoice status updated successfully",
      error: "Failed to update invoice status"
    }
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslations({
        loading: await translate("Loading..."),
        notFound: await translate("Invoice not found"),
        title: await translate("Edit Invoice"),
        buttons: {
          back: await translate("Back to Invoice")
        },
        sections: {
          details: await translate("Invoice Details"),
          client: await translate("Client Information")
        },
        fields: {
          number: await translate("Invoice Number"),
          date: await translate("Issue Date"),
          dueDate: await translate("Due Date"),
          amount: await translate("Total Amount"),
          companyName: await translate("Company Name"),
          contactPerson: await translate("Contact Person"),
          address: await translate("Address"),
          iban: await translate("IBAN")
        },
        toast: {
          success: await translate("Invoice status updated successfully"),
          error: await translate("Failed to update invoice status")
        }
      });
    };
    loadTranslations();
  }, [translate]);

  console.log("🔄 UpdateInvoicePage mounted with id:", id);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getById(Number(id))
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; paid: boolean }) => invoiceService.updateStatus(data.id, data.paid),
    onSuccess: () => {
      console.log("✅ Invoice status updated successfully");
      toast.success(translations.toast.success);
      navigate(`/invoices/${id}`);
    },
    onError: error => {
      console.error("❌ Error updating invoice status:", error);
      toast.error(translations.toast.error);
    }
  });

  if (isLoading) {
    console.log("⏳ Loading invoice data...");
    return <div>{translations.loading}</div>;
  }

  if (!invoice) {
    console.log("❌ Invoice not found");
    return <div>{translations.notFound}</div>;
  }

  const handleStatusChange = (checked: boolean) => {
    console.log("🔄 Updating invoice status to:", checked);
    updateMutation.mutate({ id: Number(id), paid: checked });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => navigate(`/invoices/${id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {translations.buttons.back}
        </Button>
        <h1 className="text-3xl font-bold">{translations.title}</h1>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{translations.sections.details}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{translations.fields.number}</Label>
              <div className="mt-1">{invoice.invoice_number}</div>
            </div>
            <div>
              <Label>{translations.fields.date}</Label>
              <div className="mt-1">{format(new Date(invoice.invoice_date), "dd.MM.yyyy", { locale: bg })}</div>
            </div>
            <div>
              <Label>{translations.fields.dueDate}</Label>
              <div className="mt-1">{format(new Date(invoice.due_date), "dd.MM.yyyy", { locale: bg })}</div>
            </div>
            <div>
              <Label>{translations.fields.amount}</Label>
              <div className="mt-1">{invoice.total_amount} лв.</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{translations.sections.client}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{translations.fields.companyName}</Label>
              <div className="mt-1">{invoice.client.client_company_name}</div>
            </div>
            <div>
              <Label>{translations.fields.contactPerson}</Label>
              <div className="mt-1">{invoice.client.client_company_mol}</div>
            </div>
            <div>
              <Label>{translations.fields.address}</Label>
              <div className="mt-1">{invoice.client.client_company_address}</div>
            </div>
            <div>
              <Label>{translations.fields.iban}</Label>
              <div className="mt-1">{invoice.client.client_company_iban}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
