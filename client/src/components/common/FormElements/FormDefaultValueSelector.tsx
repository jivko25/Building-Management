import React, { useEffect, useState, useRef } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { DefaultPricingResponse } from "@/types/defaultPricingType/defaultPricingTypes";

const DefaultPricingSelector = ({
  label,
  name,
  placeholder,
  defaultVal,
  artisan_id,
  project_id,
}: TableFormSelectType) => {
  const { control, setValue } = useFormContext();

  const { data: defaultPricingsResponse } = useFetchDataQuery<DefaultPricingResponse>({
    URL: artisan_id ? `/default-pricing/${artisan_id}${project_id ? `?project_id=${project_id}` : ""}` : null as any,
    queryKey: ["default-pricing", artisan_id, project_id],
    enabled: !!artisan_id,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchQuery(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      setDebouncedQuery(value);
    }, 1500);
  };

  const defaultPricings = defaultPricingsResponse?.data || [];

  const filteredPricings = Array.from(
    new Map(
      defaultPricings
        .filter((item: any) =>
          `${item?.activity?.name || ""}/${item?.measure?.name || ""}`
            .toLowerCase()
            .includes(debouncedQuery)
        )
        .map((item) => [`${item.activity_id}-${item.measure_id}`, item])
    ).values()
  );

  console.error(  {label,
    name,
    placeholder,
    defaultVal,
    artisan_id,
    project_id, defaultPricings}, 'props');
  

  // ⚠️ Само ако:
  // - имаме defaultVal
  // - имаме данни
  // - полето е празно (не е избрано нищо още)
  useEffect(() => {
    setValue(name, defaultVal);
  }, [defaultVal, defaultPricings, name, setValue, ]);

  console.log(defaultPricings.find((item) => item.id == defaultVal)?.activity?.name +
    "/" +
    defaultPricings.find((item) => item.id == defaultVal)?.measure?.name, defaultVal);


  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder}>
                  {
                    defaultPricings.find((item) => {
                      console.log(field.value, 'fieldValue')
                      return item.id == field.value})?.activity?.name +
                    "/" +
                    defaultPricings.find((item) => item.id == field.value)?.measure?.name
                  }
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <Input
                type="text"
                placeholder="Търси..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="p-2 border border-gray-300 rounded mb-2"
              />
              {filteredPricings.map((item: any) => (
                <SelectItem key={item.id} value={item.id}>
                  {item?.activity?.name}/{item?.measure?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default DefaultPricingSelector;
