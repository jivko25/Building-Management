import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { invoiceClientService } from "@/services/invoice/invoiceClientService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CreateClientInvoiceData } from "@/types/invoice/client.types";
import { Loader2 } from "lucide-react";
import axios from "axios";

const createClientInvoiceSchema = z.object({
  company_id: z.number({
    required_error: "Please select a company"
  }),
  client_company_id: z.number({
    required_error: "Please select a client company"
  }),
  due_date_weeks: z.number().min(1, "Due date weeks is required"),
  selected_projects: z.array(z.number()).optional(),
  selected_work_items: z.array(z.number()).optional()
});

export const CreateClientInvoicePage = () => {
  const navigate = useNavigate();
  console.log("Rendering CreateClientInvoicePage");

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

  const { data: clientsData } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/clients`, {
        credentials: "include"
      });
      const data = await response.json();
      console.log("👥 Clients data:", data);
      return data;
    }
  });

  const clients = clientsData || [];

  const { data: projectsData, refetch: refetchProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const company_id = form.getValues("company_id");
      if (!company_id) return [];

      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
        credentials: "include"
      });
      const data = await response.json();
      console.log("🏗️ All projects data:", data);

      const filteredProjects = data.filter((project: any) => project.company_id === company_id);
      console.log("🏗️ Filtered projects for company:", filteredProjects);

      return filteredProjects;
    },
    enabled: false
  });

  const projects = projectsData || [];

  const form = useForm<z.infer<typeof createClientInvoiceSchema>>({
    resolver: zodResolver(createClientInvoiceSchema),
    defaultValues: {
      company_id: 0,
      client_company_id: 0,
      due_date_weeks: 2,
      selected_projects: [],
      selected_work_items: []
    }
  });

  const { data: workItemsData = [] } = useQuery({
    queryKey: ["workItems", form.watch("company_id"), form.watch("client_company_id"), form.watch("selected_projects")],
    queryFn: async () => {
      const company_id = form.watch("company_id");
      const client_id = form.watch("client_company_id");
      const selected_projects = form.watch("selected_projects");

      console.log("🔍 Fetching work items with filters:", {
        company_id,
        client_id,
        selected_projects
      });

      try {
        // Ако има избрани проекти, правим отделни заявки за всеки проект
        if (selected_projects && selected_projects.length > 0) {
          const projectPromises = selected_projects.map(project_id => invoiceClientService.getWorkItemsForInvoice(company_id || undefined, client_id || undefined, project_id));

          const projectResults = await Promise.all(projectPromises);
          // Обединяваме резултатите
          const combinedResults = projectResults.flat();
          console.log("📦 Combined work items for selected projects:", combinedResults);
          return combinedResults;
        }

        // Ако няма избрани проекти, взимаме всички работни елементи за компанията/клиента
        const data = await invoiceClientService.getWorkItemsForInvoice(company_id || undefined, client_id || undefined);
        console.log("📦 Received work items:", data);
        return data;
      } catch (error) {
        console.error("❌ Error fetching work items:", error);
        toast.error("Error fetching work items");
        return [];
      }
    }
  });

  // Add error states
  const [errors, setErrors] = useState({
    company_id: "",
    client_company_id: "",
    due_date_weeks: ""
  });

  // Add validation function
  const validateForm = (data: z.infer<typeof createClientInvoiceSchema>) => {
    const newErrors = {
      company_id: "",
      client_company_id: "",
      due_date_weeks: ""
    };

    if (!data.company_id || data.company_id === 0) {
      newErrors.company_id = "Моля, изберете строителна фирма";
    }

    if (!data.client_company_id || data.client_company_id === 0) {
      newErrors.client_company_id = "Моля, изберете клиентска фирма";
    }

    if (!data.due_date_weeks || data.due_date_weeks < 0) {
      newErrors.due_date_weeks = "Моля, въведете валиден срок за плащане";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const createClientInvoiceMutation = useMutation({
    mutationFn: invoiceClientService.create,
    onSuccess: () => {
      toast.success("Фактурата е създадена успешно");
      navigate("/invoices");
    },
    onError: error => {
      toast.error("Грешка при създаване на фактура");
      console.error("Error creating invoice:", error);
    }
  });

  const onSubmit = async (data: z.infer<typeof createClientInvoiceSchema>) => {
    try {
      console.log("Form data:", data);

      // Validate form
      if (!validateForm(data)) {
        return;
      }

      // Събираме уникалните project_ids от избраните work items
      const allWorkItems = workItemsData.reduce((acc: any[], group: any) => {
        return acc.concat(group.workItems || []);
      }, []);

      const selectedWorkItems = allWorkItems.filter((wi: any) => data.selected_work_items?.includes(wi.id));

      const uniqueProjectIds = [...new Set(selectedWorkItems.map((wi: any) => wi.project_id))];

      const invoiceData: CreateClientInvoiceData = {
        company_id: Number(data.company_id),
        client_company_id: Number(data.client_company_id),
        due_date_weeks: Number(data.due_date_weeks),
        project_ids: uniqueProjectIds as number[],
        work_item_ids: data.selected_work_items || []
      };

      console.log("Sending invoice data:", invoiceData);

      const result = await createClientInvoiceMutation.mutateAsync(invoiceData);
      console.log("Create invoice result:", result);

      if (result) {
        toast.success("Invoice created successfully!");
        navigate("/invoices-client");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Възникна грешка при създаване на фактурата");
    }
  };

  const handleClientCompanyChange = async (clientCompanyId: number) => {
    console.log("Selected client company ID:", clientCompanyId);
    form.setValue("client_company_id", clientCompanyId);

    try {
      const clientData = await invoiceClientService.getClientById(clientCompanyId);
      console.log("Client data:", clientData);

      // Update the due_date_weeks field with the client's due_date
      form.setValue("due_date_weeks", clientData.due_date);
      console.log("Updated due_date_weeks to:", clientData.due_date);
    } catch (error) {
      console.error("Error fetching client details:", error);
      toast.error("Грешка при зареждане на данните на клиента");
      // Set a default value if there's an error
      form.setValue("due_date_weeks", 1);
    }
  };

  const handleCompanyChange = (company_id: number) => {
    console.log("Selected company ID:", company_id);
    form.setValue("company_id", company_id);
    refetchProjects();
  };

  const handleProjectChange = (projectId: number, isChecked: boolean) => {
    const currentSelected = form.watch("selected_projects") || [];

    if (isChecked) {
      console.log("Adding project:", projectId);
      form.setValue("selected_projects", [...currentSelected, projectId]);
    } else {
      console.log("Removing project:", projectId);
      form.setValue(
        "selected_projects",
        currentSelected.filter((id: number) => id !== projectId)
      );
    }

    // Изчистваме избраните работни елементи при промяна на проектите
    form.setValue("selected_work_items", []);
  };

  const handleWorkItemChange = (workItemId: number, isChecked: boolean) => {
    const currentSelected = form.watch("selected_work_items") || [];

    if (isChecked) {
      console.log("Adding work item:", workItemId);
      form.setValue("selected_work_items", [...currentSelected, workItemId]);
    } else {
      console.log("Removing work item:", workItemId);
      form.setValue(
        "selected_work_items",
        currentSelected.filter((id: number) => id !== workItemId)
      );
    }
  };

  // Add isFormValid function
  const isFormValid = () => {
    const formData = {
      company_id: form.watch("company_id"),
      client_company_id: form.watch("client_company_id"),
      due_date_weeks: form.watch("due_date_weeks"),
      selected_work_items: form.watch("selected_work_items")
    };

    return formData.company_id > 0 && formData.client_company_id > 0 && formData.due_date_weeks >= 0 && (formData.selected_work_items?.length || 0) > 0;
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("New invoice")}</h1>
        <Button variant="outline" onClick={() => navigate("/invoices")}>
          {t("Back")}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Building company")}</FormLabel>
                  <Select
                    onValueChange={value => {
                      const id = parseInt(value.toString());
                      field.onChange(id);
                      handleCompanyChange(id);
                    }}
                    value={field.value ? field.value.toString() : ""}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select company")} />
                    </SelectTrigger>
                    <SelectContent>
                      {companies?.map((company: any) => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.company_id && <span className="text-red-500">{errors.company_id}</span>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Client company")}</FormLabel>
                  <Select
                    onValueChange={value => {
                      const id = parseInt(value.toString());
                      field.onChange(id);
                      handleClientCompanyChange(id);
                    }}
                    value={field.value ? field.value.toString() : ""}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select client company")} />
                    </SelectTrigger>
                    <SelectContent>
                      {clients?.map((client: any) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.client_company_name}
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
                  <FormLabel>{t("Due date (weeks)")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.watch("company_id") !== 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">{t("Select Projects")}</h2>
              <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-white shadow-sm">
                {projects.map((project: any) => (
                  <div key={project.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 transition-colors duration-200 group relative">
                    <div className="flex items-center min-w-0">
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          id={`project-${project.id}`}
                          className="
                            peer
                            appearance-none
                            w-5 
                            h-5 
                            border-2 
                            border-gray-300 
                            rounded-md 
                            bg-white
                            checked:bg-blue-500 
                            checked:border-blue-500
                            transition-colors 
                            duration-200
                            cursor-pointer
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-blue-500/30
                          "
                          checked={form.watch("selected_projects")?.includes(project.id)}
                          onChange={e => handleProjectChange(project.id, e.target.checked)}
                        />
                        <svg
                          className="
                            absolute 
                            w-4 
                            h-4 
                            text-white 
                            left-0.5 
                            top-0.5
                            pointer-events-none 
                            opacity-0 
                            peer-checked:opacity-100 
                            transition-opacity 
                            duration-200
                          "
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-3 min-w-0">
                        <label htmlFor={`project-${project.id}`} className="text-sm font-medium text-gray-900 cursor-pointer truncate block">
                          {project.name}
                        </label>
                        <span className="text-xs text-gray-500 truncate block">{project.location}</span>
                      </div>
                    </div>
                    <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${project.status === "active" ? "bg-green-500" : "bg-gray-300"}`} />
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-500 flex items-center justify-end space-x-2">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  {t("Active")}
                </span>
                <span className="flex items-center ml-4">
                  <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                  {t("Inactive")}
                </span>
              </div>
            </div>
          )}

          {workItemsData && workItemsData.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">{t("Select Work Items")}</h2>
              <div className="space-y-6">
                {workItemsData.map((group: any) => (
                  <div key={group.projectId} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{group.projectName}</h3>
                      <span className="text-sm text-gray-500">{group.projectLocation}</span>
                    </div>
                    <div className="grid gap-3">
                      {group.workItems.map((workItem: any) => (
                        <div key={workItem.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                          <div className="flex items-center min-w-0">
                            <div className="relative inline-flex items-center">
                              <input
                                type="checkbox"
                                id={`workItem-${workItem.id}`}
                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md bg-white
                                         checked:bg-blue-500 checked:border-blue-500 transition-colors duration-200
                                         cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                checked={form.watch("selected_work_items")?.includes(workItem.id)}
                                onChange={e => handleWorkItemChange(workItem.id, e.target.checked)}
                              />
                              {/* Checkmark icon */}
                            </div>
                            <div className="ml-3">
                              <label htmlFor={`workItem-${workItem.id}`} className="text-sm font-medium text-gray-900">
                                {workItem.name}
                              </label>
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
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button type="submit" disabled={!isFormValid() || createClientInvoiceMutation.isPending} className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${isFormValid() && !createClientInvoiceMutation.isPending ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}>
              {createClientInvoiceMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("Creating...")}
                </>
              ) : (
                t("Create invoice")
              )}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};
