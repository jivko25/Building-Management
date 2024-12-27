import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";

export const InvoiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getById(Number(id))
  });

  const deleteMutation = useMutation({
    mutationFn: invoiceService.delete,
    onSuccess: () => {
      toast.success("Фактурата е изтрита успешно");
      navigate("/invoices");
    },
    onError: error => {
      toast.error("Грешка при изтриване на фактурата");
      console.error("Error deleting invoice:", error);
    }
  });

  if (isLoading) {
    return <div>Зареждане...</div>;
  }

  if (!invoice) {
    return <div>Фактурата не е намерена</div>;
  }

  const handleDelete = () => {
    console.log("Deleting invoice:", id);
    deleteMutation.mutate(Number(id));
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/invoices")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">Фактура {invoice.invoice_number}</h1>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Изтрий
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Информация за фактурата</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">Дата: </span>
              {format(new Date(invoice.invoice_date), "dd.MM.yyyy", { locale: bg })}
            </div>
            <div>
              <span className="font-semibold">Краен срок: </span>
              {format(new Date(invoice.due_date), "dd.MM.yyyy", { locale: bg })}
            </div>
            <div>
              <span className="font-semibold">Статус: </span>
              {invoice.paid ? "Платена" : "Неплатена"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Информация за клиента</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">Фирма: </span>
              {invoice.client.client_company_name}
            </div>
            <div>
              <span className="font-semibold">Лице за контакт: </span>
              {invoice.client.client_name}
            </div>
            <div>
              <span className="font-semibold">Адрес: </span>
              {invoice.client.client_company_address}
            </div>
            <div>
              <span className="font-semibold">IBAN: </span>
              {invoice.client.client_company_iban}
            </div>
            <div>
              <span className="font-semibold">Имейли: </span>
              {Array.isArray(invoice.client.client_emails) ? invoice.client.client_emails.join(", ") : invoice.client.client_emails}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Артикули</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3">Дейност</th>
                  <th className="px-6 py-3">Адрес на обект</th>
                  <th className="px-6 py-3">Мярка</th>
                  <th className="px-6 py-3 text-right">Количество</th>
                  <th className="px-6 py-3 text-right">Ед. цена</th>
                  <th className="px-6 py-3 text-right">Общо</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(item => (
                  <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4">{item.activity.name}</td>
                    <td className="px-6 py-4">{item.project.address}</td>
                    <td className="px-6 py-4">{item.measure.name}</td>
                    <td className="px-6 py-4 text-right">{item.quantity}</td>
                    <td className="px-6 py-4 text-right">{item.price_per_unit} лв.</td>
                    <td className="px-6 py-4 text-right">{item.total_price} лв.</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan={5} className="px-6 py-4 text-right">
                    Обща сума:
                  </td>
                  <td className="px-6 py-4 text-right">{invoice.total_amount} лв.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
