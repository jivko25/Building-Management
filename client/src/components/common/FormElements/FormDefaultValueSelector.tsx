import React, { useEffect, useState, useRef } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { DefaultPricingResponse } from "@/types/defaultPricingType/defaultPricingTypes";

const DefaultPricingSelector = ({ label, name, placeholder, defaultVal, artisan_id }: TableFormSelectType) => {
  const { control, setValue } = useFormContext();

  const { data: defaultPricingsResponse, refetch } = useFetchDataQuery<DefaultPricingResponse>({
    URL: artisan_id ? `/default-pricing/${artisan_id}` : `/default-pricing`,
    queryKey: ["default-pricing"]
  });

  useEffect(() => {
    refetch();
  }, [artisan_id]);

  useEffect(() => {
    if (defaultVal) {
      setValue(name, defaultVal);
    }
  }, [defaultVal]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Дебаунсната стойност
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchQuery(value);

    // Дебаунсинг
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setDebouncedQuery(value);
    }, 500); // Забавяне с 300ms
  };

  // Филтриране на данните
  const defaultPricings = defaultPricingsResponse?.data || [];
  const filteredPricings = defaultPricings.filter((item: any) => `${item?.activity?.name || ""}/${item?.measure?.name || ""}`.toLowerCase().includes(debouncedQuery));

  const formulateDefaultPricingLabel = (pricing: any) => {
    if (pricing?.activity.name === undefined || pricing?.measure?.name === undefined) {
      return "";
    }
    return `${pricing?.activity.name}/${pricing?.measure.name}`;
  };

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
                <SelectValue placeholder={placeholder}>
                  {formulateDefaultPricingLabel(
                    defaultPricings?.find(pricing => {
                      console.log(pricing.id == field.value);

                      return pricing.id == field.value;
                    })
                  ) || placeholder}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {/* Search Input Field */}
              <Input type="text" placeholder="Search..." value={searchQuery} onChange={handleSearchChange} className="p-2 border border-gray-300 rounded mb-2" />
              {/* Филтрирани опции */}
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
