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

const createInvoiceSchema = z.object({
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

export const CreateInvoicePage = () => {
  const navigate = useNavigate();
  console.log("Rendering CreateInvoicePage");

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

  const form = useForm<z.infer<typeof createInvoiceSchema>>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      company_id: 0,
      client_company_id: 0,
      due_date_weeks: 0,
      selected_projects: [],
      selected_work_items: []
    }
  });

  const { data: workItemsData } = useQuery({
    queryKey: ["workItems", form.watch("selected_projects")],
    queryFn: async () => {
      const selectedProjects = form.watch("selected_projects") ?? [];
      if (selectedProjects.length === 0) return [];

      const workItemsByProject = await Promise.all(
        selectedProjects.map(async projectId => {
          // Първо вземаме всички задачи за проекта
          const tasksResponse = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/tasks`, { credentials: "include" });
          const tasksData = await tasksResponse.json();
          console.log(`📋 Tasks for project ${projectId}:`, tasksData);

          // След това вземаме работните елементи за всяка задача
          const workItems = await Promise.all(
            tasksData.map(async (task: any) => {
              const workItemsResponse = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/tasks/${task.id}/work-items?page&limit`, { credentials: "include" });
              const workItemsData = await workItemsResponse.json();
              return workItemsData.workItems || [];
            })
          );

          // Обединяваме всички работни елементи
          const allWorkItems = workItems.flat();
          console.log(`🛠️ All work items for project ${projectId}:`, allWorkItems);

          return {
            projectId,
            projectName: projects.find((p: any) => p.id === projectId)?.name,
            workItems: allWorkItems
          };
        })
      );
      return workItemsByProject;
    },
    enabled: (form.watch("selected_projects") ?? []).length > 0
  });

  const createInvoiceMutation = useMutation({
    mutationFn: invoiceService.create,
    onSuccess: () => {
      toast.success("Invoice created successfully");
      navigate("/invoices");
    },
    onError: error => {
      toast.error("Error creating invoice");
      console.error("Error creating invoice:", error);
    }
  });

  const onSubmit = async (data: z.infer<typeof createInvoiceSchema>) => {
    try {
      console.log("Form data:", data);

      // Трансформираме избраните работни елементи в правилния формат
      const items = (data.selected_work_items ?? []).map(workItemId => {
        const workItem = workItemsData?.flatMap(project => project.workItems).find(wi => wi.id === workItemId);

        if (!workItem || !workItem.task) {
          throw new Error("Work item not found");
        }

        return {
          activity_id: Number(workItem.task.activity_id),
          measure_id: Number(workItem.task.measure_id),
          project_id: Number(workItem.task.project_id),
          quantity: Number(workItem.task.total_work_in_selected_measure),
          price_per_unit: Number(workItem.task.price_per_measure)
        };
      });

      const invoiceData = {
        company_id: Number(data.company_id),
        client_company_id: Number(data.client_company_id),
        due_date_weeks: Number(data.due_date_weeks),
        selected_projects: data.selected_projects?.map(Number) || [],
        selected_work_items: data.selected_work_items?.map(Number) || [],
        items
      };

      console.log("Transformed invoice data:", invoiceData);

      await createInvoiceMutation.mutateAsync(invoiceData);
      toast.success("Фактурата е създадена успешно");
      navigate("/invoices");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Грешка при създаване на фактурата");
    }
  };

  const handleClientCompanyChange = (clientId: number) => {
    console.log("Selected client ID:", clientId);
    const selectedClient = clients.find((client: any) => client.id === clientId);

    if (selectedClient) {
      console.log("Setting client data:", selectedClient);
      form.setValue("client_company_id", selectedClient.id);
    }
  };

  const handleCompanyChange = (company_id: number) => {
    console.log("Selected company ID:", company_id);
    form.setValue("company_id", company_id);
    refetchProjects();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">New invoice</h1>
        <Button variant="outline" onClick={() => navigate("/invoices")}>
          Back
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
                  <FormLabel>Building company</FormLabel>
                  <Select
                    onValueChange={value => {
                      const id = parseInt(value);
                      field.onChange(id);
                      handleCompanyChange(id);
                    }}
                    value={field.value ? field.value.toString() : ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies?.map((company: any) => (
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
              name="client_company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client company</FormLabel>
                  <Select
                    onValueChange={value => {
                      const id = parseInt(value);
                      field.onChange(id);
                      handleClientCompanyChange(id);
                    }}
                    value={field.value ? field.value.toString() : ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client company" />
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
                  <FormLabel>Due date (weeks)</FormLabel>
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
              <h2 className="text-xl font-semibold mb-4">Select Projects</h2>
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
                          onChange={e => {
                            const currentSelected = form.watch("selected_projects") || [];
                            if (e.target.checked) {
                              console.log("Adding project:", project.id);
                              form.setValue("selected_projects", [...currentSelected, project.id]);
                            } else {
                              console.log("Removing project:", project.id);
                              form.setValue(
                                "selected_projects",
                                currentSelected.filter((id: number) => id !== project.id)
                              );
                            }
                            console.log("Selected projects:", form.watch("selected_projects"));
                          }}
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
                  Active
                </span>
                <span className="flex items-center ml-4">
                  <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                  Inactive
                </span>
              </div>
            </div>
          )}

          {workItemsData && workItemsData.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Select Work Items</h2>
              <div className="space-y-6">
                {workItemsData.map(({ projectId, projectName, workItems }) => (
                  <div key={projectId} className="border rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="text-lg font-medium mb-3 text-gray-900">{projectName}</h3>
                    <div className="grid gap-3">
                      {workItems.map((workItem: any) => (
                        <div key={workItem.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex items-center min-w-0">
                            <div className="relative inline-flex items-center">
                              <input
                                type="checkbox"
                                id={`workItem-${workItem.id}`}
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
                                checked={form.watch("selected_work_items")?.includes(workItem.id)}
                                onChange={e => {
                                  const currentSelected = form.watch("selected_work_items") || [];
                                  if (e.target.checked) {
                                    console.log("Adding work item:", workItem.id);
                                    form.setValue("selected_work_items", [...currentSelected, workItem.id]);
                                  } else {
                                    console.log("Removing work item:", workItem.id);
                                    form.setValue(
                                      "selected_work_items",
                                      currentSelected.filter((id: number) => id !== workItem.id)
                                    );
                                  }
                                  console.log("Selected work items:", form.watch("selected_work_items"));
                                }}
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
                            <div className="ml-3">
                              <label htmlFor={`workItem-${workItem.id}`} className="text-sm font-medium text-gray-900 cursor-pointer">
                                {workItem.name}
                              </label>
                              <div className="text-xs text-gray-500">Status: {workItem.status === "done" ? "Done" : "In Progress"}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">{workItem.task?.price_per_measure && <span>Price: ${workItem.task.price_per_measure}</span>}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={createInvoiceMutation.isPending}>
              {createInvoiceMutation.isPending ? "Creating..." : "Create invoice"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
