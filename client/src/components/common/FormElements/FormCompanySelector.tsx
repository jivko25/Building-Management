//client\src\components\common\FormElements\FormCompanySelector.tsx
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Company } from "@/types/company-types/companyTypes";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { useFormContext } from "react-hook-form";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { useEffect } from "react";
import { t } from "i18next";

const CompanySelector = ({ label, name, defaultVal }: TableFormSelectType) => {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    setValue(name, defaultVal);
  }, [defaultVal]);

  const { data: companiesResponse, refetch } = useFetchDataQuery<{
    companies: Company[];
    companiesCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    URL: "/companies",
    queryKey: ["companies-select"],
    options: {
      staleTime: Infinity
    }
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  console.log("🏢 Companies response:", companiesResponse);


  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={defaultVal}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={field.value || t('Select company')} >
                  {field.value}
                </SelectValue>  
              </SelectTrigger>

            </FormControl>
            <SelectContent>

              {companiesResponse?.companies
                ?.filter(company => company.status === "active")
                .map(company => (
                  <SelectItem key={company.id} value={company.name}>
                    {company.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default CompanySelector;
