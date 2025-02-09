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
import { CustomCheckbox } from "@/components/ui/checkbox";
import Pagination from "@/components/common/Pagination/Pagination";
import Sidebar from "@/components/Sidebar/Sidebar";
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data: workItemsResponse } = useQuery({
    queryKey: ["workItems", form.watch("company_id"), form.watch("client_company_id"), form.watch("selected_projects"), currentPage, itemsPerPage],
    queryFn: async () => {
      const company_id = form.watch("company_id");
      const client_id = form.watch("client_company_id");
      const selected_projects = form.watch("selected_projects") || [];

      console.log("🔍 Fetching work items with filters:", {
        company_id,
        client_id,
        selected_projects
      });

      try {
        if (selected_projects && selected_projects.length > 0) {
          const response = await invoiceClientService.getWorkItemsForInvoice(
            company_id,
            client_id,
            selected_projects[0],
            currentPage,
            itemsPerPage
          );
          return response;
        }

        const response = await invoiceClientService.getWorkItemsForInvoice(
          company_id,
          client_id,
          undefined,
          currentPage,
          itemsPerPage
        );

        console.log("📦 Work items response:", response);
        return response;
      } catch (error) {
        console.error("❌ Error fetching work items:", error);
        toast.error("Error fetching work items");
        return { data: [], total: 0, totalPages: 0 };
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
      newErrors.company_id = "Please select a building company";
    }

    if (!data.client_company_id || data.client_company_id === 0) {
      newErrors.client_company_id = "Please select a client company";
    }

    if (!data.due_date_weeks || data.due_date_weeks < 0) {
      newErrors.due_date_weeks = "Please enter a valid due date";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const createClientInvoiceMutation = useMutation({
    mutationFn: invoiceClientService.create,
    onSuccess: () => {
      toast.success("Invoice created successfully!");
      navigate("/invoices-client");
    },
    onError: error => {
      toast.error("Error creating invoice");
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

      // Collect unique project_ids from selected work items
      const allWorkItems = workItemsResponse?.data.reduce((acc: any[], group: any) => {
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
      toast.error("Error creating invoice");
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
      toast.error("Error fetching client details");
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

    // Clear selected work items when changing projects
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

  // Функция за групиране на work items по проект и след това по task
  const groupWorkItemsByProjectAndTask = (data: any) => {
    console.log("🔄 Grouping work items:", data);
    if (!data || !Array.isArray(data)) {
      console.warn("❌ Invalid data structure:", data);
      return {};
    }

    return data.reduce((projectGroups: any, project: any) => {
      if (!project.workItems) return projectGroups;

      projectGroups[project.projectId] = {
        projectId: project.projectId,
        projectName: project.projectName,
        projectLocation: project.projectLocation,
        tasks: project.workItems.reduce((taskGroups: any, item: any) => {
          const taskId = item.task.id;
          
          if (!taskGroups[taskId]) {
            taskGroups[taskId] = {
              taskId,
              task: item.task,
              workItems: []
            };
          }
          taskGroups[taskId].workItems.push(item);
          return taskGroups;
        }, {})
      };
      
      return projectGroups;
    }, {});
  };

  // Функция за селектиране на всички work items в проект
  const handleSelectAllProjectItems = (project: any, isChecked: boolean) => {
    const allProjectWorkItems = Object.values(project.tasks).flatMap((task: any) => 
      task.workItems.map((item: any) => item.id)
    );
    
    const currentSelected = form.watch("selected_work_items") || [];
    
    if (isChecked) {
      const newSelected = [...new Set([...currentSelected, ...allProjectWorkItems])];
      form.setValue("selected_work_items", newSelected);
    } else {
      form.setValue(
        "selected_work_items",
        currentSelected.filter((id: number) => !allProjectWorkItems.includes(id))
      );
    }
  };

  // Функция за селектиране на всички work items в task
  const handleSelectAllTaskItems = (task: any, isChecked: boolean) => {
    const taskWorkItemIds = task.workItems.map((item: any) => item.id);
    const currentSelected = form.watch("selected_work_items") || [];
    
    if (isChecked) {
      const newSelected = [...new Set([...currentSelected, ...taskWorkItemIds])];
      form.setValue("selected_work_items", newSelected);
    } else {
      form.setValue(
        "selected_work_items",
        currentSelected.filter((id: number) => !taskWorkItemIds.includes(id))
      );
    }
  };

  return (
    <div className="flex md:gap-60 min-h-screen">
      <Sidebar />
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("New Client Invoice")}</h1>
        <Button variant="outline" onClick={() => navigate("/invoices-client")}>
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
                  <CustomCheckbox key={project.id} id={`project-${project.id}`} value={project.id} label={project.name} sublabel={project.location} rightText={project.status === "active" ? t("Active") : t("Inactive")} checked={form.watch("selected_projects")?.includes(project.id)} onChange={e => handleProjectChange(project.id, e.target.checked)} containerClassName={`relative ${project.status === "active" ? "border-green-200" : "border-gray-200"}`} />
                ))}
              </div>
            </div>
          )}

          {workItemsResponse && workItemsResponse.data && (
            <div className="mt-8">
              {workItemsResponse.data.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">{t("Select Work Items")}</h2>
                  <div className="space-y-8">
                    {Object.values(groupWorkItemsByProjectAndTask(workItemsResponse.data)).map((project: any) => {
                      const projectWorkItems = Object.values(project.tasks).flatMap((task: any) => 
                        task.workItems.map((item: any) => item.id)
                      );
                      const isProjectFullySelected = projectWorkItems.every(id => 
                        form.watch("selected_work_items")?.includes(id)
                      );

                      return (
                        <div key={project.projectId} className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">
                              {project.projectName} - {project.projectLocation}
                            </h3>
                            <CustomCheckbox
                              id={`project-${project.projectId}`}
                              label="Select all project items"
                              checked={isProjectFullySelected}
                              onChange={e => handleSelectAllProjectItems(project, e.target.checked)}
                            />
                          </div>
                          <div className="space-y-4">
                            {Object.values(project.tasks).map((task: any) => {
                              const isTaskFullySelected = task.workItems.every((item: any) => 
                                form.watch("selected_work_items")?.includes(item.id)
                              );

                              return (
                                <div key={task.taskId} className="border rounded-lg p-4 bg-white shadow-sm">
                                  <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-lg font-medium text-gray-900">
                                      {task.task.name}
                                    </h4>
                                    <CustomCheckbox
                                      id={`task-${task.taskId}`}
                                      label="Select all task items"
                                      checked={isTaskFullySelected}
                                      onChange={e => handleSelectAllTaskItems(task, e.target.checked)}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    {task.workItems.map((workItem: any) => (
                                      <CustomCheckbox
                                        key={workItem.id}
                                        id={`workItem-${workItem.id}`}
                                        value={workItem.id}
                                        label={`${workItem.activity.name || 'No description'}`}
                                        sublabel={`Task ${workItem.task_id}`}
                                        rightText={`${workItem.start_date ? new Date(workItem.start_date).toLocaleDateString() : 'No date'}`}
                                        checked={form.watch("selected_work_items")?.includes(workItem.id)}
                                        onChange={e => handleWorkItemChange(workItem.id, e.target.checked)}
                                      />
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              <Pagination
                totalPages={workItemsResponse?.totalPages || 0}
                page={currentPage}
                setSearchParams={params => {
                  const newPage = parseInt(params.get("page") || "1");
                  setCurrentPage(newPage);
                }}
              />
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={!isFormValid() || createClientInvoiceMutation.isPending} className={!isFormValid() || createClientInvoiceMutation.isPending ? "bg-gray-400" : ""}>
              {createClientInvoiceMutation.isPending ? (
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
    </div>
  );
};
