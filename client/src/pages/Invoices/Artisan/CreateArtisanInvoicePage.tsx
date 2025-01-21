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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
      project_ids: [],
      work_item_ids: [],
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

    // Извличаме уникалните project_ids от избраните работни елементи
    const selectedWorkItems = workItemsData?.flatMap((artisanData: any) => artisanData.projects.flatMap((project: any) => project.workItems.filter((item: any) => data.work_item_ids?.includes(item.id)))) || [];

    const uniqueProjectIds = [...new Set(selectedWorkItems.map((item: any) => item.project_id))];

    createInvoiceMutation.mutate({
      company_id: data.company_id,
      artisan_id: data.artisan_id,
      due_date_weeks: data.due_date_weeks,
      project_ids: uniqueProjectIds as number[],
      work_item_ids: data.work_item_ids || [],
      items: [] // Ако е нужно, можете да добавите items тук
    });
  };

  const [selectedCompanyId, setSelectedCompanyId] = useState<number>(0);
  const [selectedArtisanId, setSelectedArtisanId] = useState<number>(0);

  const { data: workItemsData, isLoading: isLoadingWorkItems } = useQuery({
    queryKey: ["workItems", selectedCompanyId, selectedArtisanId],
    queryFn: () => artisanInvoiceService.getWorkItemsForInvoice()
  });

  useEffect(() => {
    if (selectedCompanyId || selectedArtisanId) {
      artisanInvoiceService.getWorkItemsForInvoice(selectedCompanyId, selectedArtisanId);
    }
  }, [selectedCompanyId, selectedArtisanId]);

  const handleCompanyChange = (value: string) => {
    const companyId = parseInt(value);
    setSelectedCompanyId(companyId);
    form.setValue("company_id", companyId);
  };

  const handleArtisanChange = (value: string) => {
    const artisanId = parseInt(value);
    setSelectedArtisanId(artisanId);
    form.setValue("artisan_id", artisanId);
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
                <Select onValueChange={handleCompanyChange} defaultValue={field.value.toString()}>
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
                <Select onValueChange={handleArtisanChange} defaultValue={field.value.toString()}>
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

          {/* Work Items Section */}
          {isLoadingWorkItems ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : workItemsData?.length > 0 ? (
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">{t("Work Items")}</h2>
              {workItemsData.map((artisanData: any) => (
                <div key={artisanData.artisanId} className="mb-6">
                  <h3 className="font-medium mb-2">{artisanData.artisanName}</h3>
                  {artisanData.projects.map((project: any) => (
                    <div key={project.projectId} className="ml-4 mb-4">
                      <h4 className="text-sm font-medium mb-2">
                        {project.projectName} - {project.projectLocation}
                      </h4>
                      <div className="space-y-2">
                        {project.workItems.map((workItem: any) => (
                          <div key={workItem.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`workItem-${workItem.id}`}
                                value={workItem.id}
                                onChange={e => {
                                  const workItemId = parseInt(e.target.value);
                                  const currentItems = form.getValues("work_item_ids") || [];
                                  if (e.target.checked) {
                                    form.setValue("work_item_ids", [...currentItems, workItemId]);
                                  } else {
                                    form.setValue(
                                      "work_item_ids",
                                      currentItems.filter(id => id !== workItemId)
                                    );
                                  }
                                }}
                                className="mr-2"
                              />
                              <div>
                                <div className="text-sm font-medium">{workItem.name}</div>
                                <div className="text-xs text-gray-500">
                                  {workItem.activity?.name} - {workItem.measure?.name}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {workItem.quantity} {workItem.measure?.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={createInvoiceMutation.isPending}>
              {createInvoiceMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t("Creating...")}
                </>
              ) : (
                t("Create invoice")
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
