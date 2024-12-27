import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const createInvoiceSchema = z.object({
  company_id: z.number(),
  client_company_name: z.string().min(1, "Задължително поле"),
  client_name: z.string().min(1, "Задължително поле"),
  client_company_address: z.string().min(1, "Задължително поле"),
  client_company_iban: z.string().min(1, "Задължително поле"),
  client_emails: z.array(z.string().email("Невалиден имейл")).min(1, "Поне един имейл е задължителен"),
  due_date_weeks: z.number().min(1, "Задължително поле"),
  items: z
    .array(
      z.object({
        activity_id: z.number(),
        measure_id: z.number(),
        project_id: z.number(),
        quantity: z.number().min(0.01, "Количеството трябва да е по-голямо от 0"),
        price_per_unit: z.number().min(0.01, "Цената трябва да е по-голяма от 0")
      })
    )
    .min(1, "Поне един артикул е задължителен")
});

type CreateInvoiceForm = z.infer<typeof createInvoiceSchema>;

export const CreateInvoicePage = () => {
  const navigate = useNavigate();

  const form = useForm<CreateInvoiceForm>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      company_id: 1, // Default company ID
      client_emails: [""],
      items: [{ activity_id: 0, measure_id: 0, project_id: 0, quantity: 0, price_per_unit: 0 }]
    }
  });

  const { data: activities } = useQuery({
    queryKey: ["activities"],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/api/activities`).then(res => res.json())
  });

  const { data: measures } = useQuery({
    queryKey: ["measures"],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/api/measures`).then(res => res.json())
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetch(`${import.meta.env.VITE_API_URL}/api/projects`).then(res => res.json())
  });

  const createInvoiceMutation = useMutation({
    mutationFn: invoiceService.create,
    onSuccess: () => {
      toast.success("Фактурата е създадена успешно");
      navigate("/invoices");
    },
    onError: error => {
      toast.error("Грешка при създаване на фактурата");
      console.error("Error creating invoice:", error);
    }
  });

  const onSubmit = (data: CreateInvoiceForm) => {
    createInvoiceMutation.mutate(data);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Нова фактура</h1>
        <Button variant="outline" onClick={() => navigate("/invoices")}>
          Назад
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="client_company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Име на фирма</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Лице за контакт</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_company_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_company_iban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IBAN</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date_weeks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Срок (седмици)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Артикули</h2>
              <Button
                type="button"
                onClick={() => {
                  const items = form.getValues("items");
                  form.setValue("items", [...items, { activity_id: 0, measure_id: 0, project_id: 0, quantity: 0, price_per_unit: 0 }]);
                }}>
                <Plus className="mr-2 h-4 w-4" />
                Добави артикул
              </Button>
            </div>

            {form.watch("items").map((_, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 items-end border p-4 rounded-lg">
                <FormField
                  control={form.control}
                  name={`items.${index}.activity_id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дейност</FormLabel>
                      <Select onValueChange={value => field.onChange(parseInt(value))} value={field.value.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Избери дейност" />
                        </SelectTrigger>
                        <SelectContent>
                          {activities?.data?.map((activity: any) => (
                            <SelectItem key={activity.id} value={activity.id.toString()}>
                              {activity.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.measure_id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Мярка</FormLabel>
                      <Select onValueChange={value => field.onChange(parseInt(value))} value={field.value.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Избери мярка" />
                        </SelectTrigger>
                        <SelectContent>
                          {measures?.data?.map((measure: any) => (
                            <SelectItem key={measure.id} value={measure.id.toString()}>
                              {measure.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.project_id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Проект</FormLabel>
                      <Select onValueChange={value => field.onChange(parseInt(value))} value={field.value.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Избери проект" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects?.data?.map((project: any) => (
                            <SelectItem key={project.id} value={project.id.toString()}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Количество</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.price_per_unit`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ед. цена</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const items = form.getValues("items");
                    form.setValue(
                      "items",
                      items.filter((_, i) => i !== index)
                    );
                  }}
                  className="mb-2">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={createInvoiceMutation.isPending}>
              {createInvoiceMutation.isPending ? "Създаване..." : "Създай фактура"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
