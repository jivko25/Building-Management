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
import { useGetPaginatedData } from "@/hooks/useQueryHook";

const createInvoiceSchema = z.object({
  company_id: z.number({
    required_error: "Please select a company"
  }),
  client_company_name: z.string().min(1, "Company name is required"),
  client_name: z.string().min(1, "Contact person is required"),
  client_company_address: z.string().min(1, "Company address is required"),
  client_company_iban: z.string().min(1, "Company IBAN is required"),
  client_emails: z.array(z.string().email("Invalid email")).min(1, "At least one email is required"),
  due_date_weeks: z.number().min(1, "Due date weeks is required"),
  items: z
    .array(
      z.object({
        activity_id: z.number(),
        measure_id: z.number(),
        project_id: z.number(),
        quantity: z.number().int().min(1, "Quantity must be a whole number greater than 0"),
        price_per_unit: z.number().int().min(1, "Price per unit must be a whole number greater than 0")
      })
    )
    .min(1, "At least one item is required")
});

type CreateInvoiceForm = z.infer<typeof createInvoiceSchema>;

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

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
        credentials: "include"
      });
      const data = await response.json();
      console.log("🏗️ Projects data:", data);
      return data;
    }
  });

  const { data: activities } = useGetPaginatedData({
    URL: "/activities",
    queryKey: ["activities"],
    limit: 100,
    page: 1
  });

  const { data: measures } = useGetPaginatedData({
    URL: "/measures",
    queryKey: ["measures"],
    limit: 100,
    page: 1
  });

  const form = useForm<z.infer<typeof createInvoiceSchema>>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      company_id: 0,
      client_company_name: "",
      client_emails: [""],
      items: [{ activity_id: 0, measure_id: 0, project_id: 0, quantity: 0, price_per_unit: 0 }]
    }
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

  const onSubmit = (data: CreateInvoiceForm) => {
    createInvoiceMutation.mutate(data);
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
                  <Select onValueChange={value => field.onChange(parseInt(value))} value={field.value ? field.value.toString() : ""}>
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
              name="client_company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client company name</FormLabel>
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
                  <FormLabel>Client contact person</FormLabel>
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
                  <FormLabel>Client company address</FormLabel>
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
                  <FormLabel>Client company IBAN</FormLabel>
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
                  <FormLabel>Due date (weeks)</FormLabel>
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
              <h2 className="text-xl font-semibold">Client Emails</h2>
              <Button
                type="button"
                onClick={() => {
                  const emails = form.getValues("client_emails");
                  form.setValue("client_emails", [...emails, ""]);
                }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Email
              </Button>
            </div>

            {form.watch("client_emails").map((_, index) => (
              <div key={index} className="flex gap-4 items-end">
                <FormField
                  control={form.control}
                  name={`client_emails.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email {index + 1}</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const emails = form.getValues("client_emails");
                    form.setValue(
                      "client_emails",
                      emails.filter((_, i) => i !== index)
                    );
                  }}
                  className="mb-2">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Items</h2>
              <Button
                type="button"
                onClick={() => {
                  const items = form.getValues("items");
                  form.setValue("items", [...items, { activity_id: 0, measure_id: 0, project_id: 0, quantity: 0, price_per_unit: 0 }]);
                }}>
                <Plus className="mr-2 h-4 w-4" />
                Add item
              </Button>
            </div>

            {form.watch("items").map((_, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 items-end border p-4 rounded-lg">
                <FormField
                  control={form.control}
                  name={`items.${index}.activity_id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity</FormLabel>
                      <Select onValueChange={value => field.onChange(parseInt(value))} value={field.value.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose activity" />
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
                      <FormLabel>Measure</FormLabel>
                      <Select onValueChange={value => field.onChange(parseInt(value))} value={field.value.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose measure" />
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
                      <FormLabel>Project</FormLabel>
                      <Select onValueChange={value => field.onChange(parseInt(value))} value={field.value ? field.value.toString() : ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects?.map((project: any) => (
                            <SelectItem key={project.id} value={project.id.toString()}>
                              {project.name} - {project.address}
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
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="1" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                      <FormLabel>Price per unit</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="1" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
              {createInvoiceMutation.isPending ? "Creating..." : "Create invoice"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
