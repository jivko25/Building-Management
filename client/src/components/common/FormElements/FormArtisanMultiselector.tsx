import { Controller, useFormContext } from "react-hook-form";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { Artisan } from "@/types/artisan-types/artisanTypes";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { useEffect } from "react";

const ArtisanSelector = ({ label, name, placeholder, defaultVal }: TableFormSelectType) => {
  const { control } = useFormContext();

  const { data: artisansArray, refetch } = useFetchDataQuery<any>({
    URL: "/artisans",
    queryKey: ["artisans"],
    options: {
      staleTime: Infinity
    }
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const artisans: Artisan[] = artisansArray?.artisans?.filter((a: any) => a.status === "active") || [];

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-semibold">{label}</label>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultVal || []}
        render={({ field }) => (
          <MultiSelect
            value={field.value}
            onChange={(e: MultiSelectChangeEvent) => field.onChange(e.value)}
            options={artisans}
            optionLabel="name"
            placeholder={placeholder || "Select artisans"}
            maxSelectedLabels={3}
            className="w-full md:w-20rem"
            display="chip"
          />
        )}
      />
    </div>
  );
};

export default ArtisanSelector;
