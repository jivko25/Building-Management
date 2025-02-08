import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { fetchClients } from "@/api/apiCall";
import { useState, useEffect } from "react";
import { t } from "i18next";

type FormClientSelectorProps = {
  label: string;
  name: string;
  defaultVal?: string;
};

const FormClientSelector = ({ label, name, defaultVal }: FormClientSelectorProps) => {
  const { control } = useFormContext();
  const [selectedValue, setSelectedValue] = useState(defaultVal || "");
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients()
  });

  useEffect(() => {
    if (defaultVal) {
      setSelectedValue(defaultVal);
    }
  }, [defaultVal]);

  useEffect(() => {
    if (clients) {
      setSelectedClient(clients.find(client => client.id === +selectedValue)?.client_company_name);
    }
  }, [selectedValue, clients]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={value => {
            setSelectedValue(value as any);
            field.onChange(+value);
          }} defaultValue={selectedValue}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={selectedClient || t("Select client")} >
                  {selectedClient?.client_company_name}
                </SelectValue>
              </SelectTrigger>

            </FormControl>

            <SelectContent>
              {clients?.map(client => (
                <SelectItem key={client.id} value={client.id?.toString() || ""}>
                  {client.client_company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormClientSelector;
