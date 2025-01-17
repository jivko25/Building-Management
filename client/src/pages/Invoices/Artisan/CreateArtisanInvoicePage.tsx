import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { artisanInvoiceService } from "@/services/invoice/artisanService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { createArtisanInvoiceSchema } from "@/schemas/invoice/artisan.schema";
import { Input } from "@/components/ui/input";
import { CreateArtisanInvoiceSchema } from "@/schemas/invoice/artisan.schema";

export const CreateArtisanInvoicePage = () => {
  const navigate = useNavigate();
  console.log("Rendering CreateArtisanInvoicePage");

  const { data: companiesResponse } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/companies`, {
        credentials: "include"
      });
      const data = await response.json();
      console.log("📊 Companies data:", data);
      return data;
    }
  });

  const companies = companiesResponse?.companies || [];

  const { t } = useTranslation();

  const { data: artisansData } = useQuery({
    queryKey: ["artisans"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/artisans`, {
        credentials: "include"
      });
      const data = await response.json();
      console.log("👷 Artisans data:", data);
      return data;
    }
  });

  const artisans = artisansData?.artisans || [];

  const form = useForm<CreateArtisanInvoiceSchema>({
    resolver: zodResolver(createArtisanInvoiceSchema),
    defaultValues: {
      company_id: 0,
      artisan_id: 0,
      due_date_weeks: 2,
      selected_work_items: [],
      items: []
    }
  });

  const createInvoiceMutation = useMutation({
    mutationFn: artisanInvoiceService.create,
    onSuccess: () => {
      console.log("✅ Invoice created successfully");
      toast.success(t("Invoice created successfully"));
      navigate("/invoices-artisan");
    },
    onError: error => {
      console.error("❌ Error creating invoice:", error);
      toast.error(t("Failed to create invoice"));
    }
  });

  const onSubmit = (data: CreateArtisanInvoiceSchema) => {
    console.log("📝 Form submitted with data:", data);
    createInvoiceMutation.mutate({
      ...data,
      selected_work_items: data.selected_work_items || [],
      items: data.items || []
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("Create Artisan Invoice")}</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="company_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Company")}</FormLabel>
                <Select onValueChange={value => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select company")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companies.map((company: any) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
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
            name="artisan_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Artisan")}</FormLabel>
                <Select onValueChange={value => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select artisan")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {artisans.map((artisan: any) => (
                      <SelectItem key={artisan.id} value={artisan.id.toString()}>
                        {artisan.name}
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
            name="due_date_weeks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Due Date (weeks)")}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={createInvoiceMutation.isPending}>
              {createInvoiceMutation.isPending ? t("Creating...") : t("Create invoice")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
