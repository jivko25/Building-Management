import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { fetchClients } from "@/api/apiCall";

type FormClientSelectorProps = {
  label: string;
  name: string;
  defaultVal?: string;
};

const FormClientSelector = ({ label, name, defaultVal }: FormClientSelectorProps) => {
  const { control } = useFormContext();

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchClients()
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={value => field.onChange(Number(value))} defaultValue={defaultVal || field.value?.toString()}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={field.value || "Select client company name"} >
                  {clients?.filter(client => client.id === Number(field.value))[0]?.client_company_name}
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
